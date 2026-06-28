"use strict";
/**
 * seedAdmin.js
 *
 * Idempotent seed script — creates a local-auth admin account if it doesn't
 * already exist. Safe to run multiple times.
 *
 * Usage:  node scripts/seedAdmin.js
 *    or:  npm run seed:admin   (from project root)
 */

require("dotenv").config();
const pgp = require("pg-promise")();
const bcrypt = require("bcryptjs");

const ADMIN_EMAIL = "admin@emrs.local";
const ADMIN_PASS  = "Admin@EMRS2026";
const ADMIN_ROLE  = "admin";
const BCRYPT_COST = 10;

const conn = {
  host:     process.env.DB_HOST     || "localhost",
  port:     parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_DATABASE || "emrs_db",
  user:     process.env.DB_USER     || "postgres",
  password: process.env.DB_PASS     || "postgres",
};

const db = pgp(conn);

async function seed() {
  // Ensure credentials table exists (authController creates it on server start,
  // but the seed script may run before the server has ever started).
  await db.none(`
    CREATE TABLE IF NOT EXISTS credentials (
      id            SERIAL PRIMARY KEY,
      login_id      INTEGER REFERENCES login(id) ON DELETE CASCADE,
      password_hash VARCHAR(255) NOT NULL
    );
  `);

  // 1. Check if the login row already exists.
  let loginRow = await db.oneOrNone(
    "SELECT * FROM login WHERE email = $1",
    [ADMIN_EMAIL]
  );

  if (!loginRow) {
    console.log(`Creating login row for ${ADMIN_EMAIL} …`);
    loginRow = await db.one(
      "INSERT INTO login (email, user_role) VALUES ($1, $2) RETURNING *",
      [ADMIN_EMAIL, ADMIN_ROLE]
    );
    console.log(`  ✓ login row created (id = ${loginRow.id})`);
  } else {
    console.log(`Login row already exists (id = ${loginRow.id}, role = ${loginRow.user_role})`);
  }

  // 2. Check if credentials already exist for this login.
  const existing = await db.oneOrNone(
    "SELECT id FROM credentials WHERE login_id = $1",
    [loginRow.id]
  );

  if (existing) {
    console.log("  ✓ Credentials row already present — nothing to do.");
  } else {
    console.log("  Hashing password …");
    const hash = await bcrypt.hash(ADMIN_PASS, BCRYPT_COST);
    await db.none(
      "INSERT INTO credentials (login_id, password_hash) VALUES ($1, $2)",
      [loginRow.id, hash]
    );
    console.log("  ✓ Credentials row created.");
  }

  console.log("\n✅  Admin account ready.");
  console.log(`   Email : ${ADMIN_EMAIL}`);
  console.log("   Password : (see task description — not logged here)");
  console.log("   Role  :", loginRow.user_role);
}

seed()
  .then(() => {
    pgp.end();
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌  Seed failed:", err.message);
    pgp.end();
    process.exit(1);
  });

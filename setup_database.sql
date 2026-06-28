-- Create login table
CREATE TABLE login (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_role VARCHAR(50) NOT NULL
);

-- Create doctor table
CREATE TABLE doctor (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    cnic VARCHAR(20),
    f_name VARCHAR(100),
    l_name VARCHAR(100),
    phone_num VARCHAR(20)
);

-- Create patient table
CREATE TABLE patient (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    cnic VARCHAR(20),
    f_name VARCHAR(100),
    l_name VARCHAR(100),
    dob DATE,
    blood VARCHAR(5),
    gender VARCHAR(20),
    phone_num VARCHAR(20)
);

-- Create disease table
CREATE TABLE disease (
    id SERIAL PRIMARY KEY,
    disease_name VARCHAR(255) UNIQUE NOT NULL
);

-- Create record table
CREATE TABLE record (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    observation TEXT,
    prescription TEXT,
    private_note TEXT,
    doc_id INTEGER REFERENCES doctor(id) ON DELETE CASCADE,
    pat_id INTEGER REFERENCES patient(id) ON DELETE CASCADE
);

-- Create record_to_disease table (junction table)
CREATE TABLE record_to_disease (
    id SERIAL PRIMARY KEY,
    record_id INTEGER REFERENCES record(id) ON DELETE CASCADE,
    disease VARCHAR(255),
    date DATE
);

-- Create indexes for better performance
CREATE INDEX idx_login_email ON login(email);
CREATE INDEX idx_doctor_email ON doctor(email);
CREATE INDEX idx_patient_email ON patient(email);
CREATE INDEX idx_record_doc_id ON record(doc_id);
CREATE INDEX idx_record_pat_id ON record(pat_id);
CREATE INDEX idx_record_to_disease_record_id ON record_to_disease(record_id);

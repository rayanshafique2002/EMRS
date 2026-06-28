-- Create login table
CREATE TABLE login (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_role VARCHAR(50) NOT NULL CHECK (user_role IN ('admin', 'doctor', 'patient')),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE credentials (
    id SERIAL PRIMARY KEY,
    login_id INTEGER UNIQUE REFERENCES login(id) ON DELETE CASCADE,
    password_hash VARCHAR(255) NOT NULL,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    updated_at TIMESTAMP DEFAULT now()
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

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE appointment (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patient(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES doctor(id) ON DELETE CASCADE,
    appointment_at TIMESTAMP NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'scheduled'
        CHECK (status IN ('scheduled', 'cancelled', 'completed', 'rescheduled', 'no_show')),
    reason TEXT,
    video_ready BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE emergency_case (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patient(id) ON DELETE SET NULL,
    assigned_doctor_id INTEGER REFERENCES doctor(id) ON DELETE SET NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    status VARCHAR(30) NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'triage', 'in_treatment', 'stabilized', 'closed')),
    contact_name VARCHAR(150),
    contact_phone VARCHAR(30),
    blood_group VARCHAR(5),
    allergies TEXT,
    current_medications TEXT,
    chronic_diseases TEXT,
    ambulance_info TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    login_id INTEGER REFERENCES login(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    body TEXT,
    notification_type VARCHAR(50),
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE medical_file (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patient(id) ON DELETE CASCADE,
    uploaded_by INTEGER REFERENCES login(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    storage_key VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    login_id INTEGER REFERENCES login(id) ON DELETE SET NULL,
    action VARCHAR(120) NOT NULL,
    entity_type VARCHAR(80),
    entity_id INTEGER,
    ip_address VARCHAR(80),
    created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_login_email ON login(email);
CREATE INDEX idx_doctor_email ON doctor(email);
CREATE INDEX idx_patient_email ON patient(email);
CREATE INDEX idx_record_doc_id ON record(doc_id);
CREATE INDEX idx_record_pat_id ON record(pat_id);
CREATE INDEX idx_record_to_disease_record_id ON record_to_disease(record_id);
CREATE INDEX idx_credentials_login_id ON credentials(login_id);
CREATE INDEX idx_appointment_patient_id ON appointment(patient_id);
CREATE INDEX idx_appointment_doctor_id ON appointment(doctor_id);
CREATE INDEX idx_appointment_at ON appointment(appointment_at);
CREATE INDEX idx_emergency_case_status ON emergency_case(status);
CREATE INDEX idx_notification_login_id ON notification(login_id);
CREATE INDEX idx_medical_file_patient_id ON medical_file(patient_id);
CREATE INDEX idx_audit_log_login_id ON audit_log(login_id);

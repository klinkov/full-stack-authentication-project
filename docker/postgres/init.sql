-- Create schema with proper error handling
CREATE SCHEMA IF NOT EXISTS automation_grok;

-- Set search path to use the schema
SET search_path TO automation_grok;

-- Create user_status enum type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE user_status AS ENUM ('pending', 'active', 'inactive', 'deleted');
    END IF;
END$$;

-- Create users table with improved field definitions
CREATE TABLE IF NOT EXISTS users (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	balance numeric(10, 2) DEFAULT 0.00 NOT NULL,
	status varchar DEFAULT 'REGISTERED'::character varying NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Create index for faster transaction lookups
CREATE UNIQUE INDEX IF NOT EXISTS users_id_idx ON users USING btree (id);

-- Create transactions table with constraints and better types
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- Create index for faster transaction lookups
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
-- ============================================================================
-- HỆ THỐNG QUẢN LÝ VĂN BẢN VÀ ĐIỀU HÀNH - ĐOÀN XÃ XUÂN THỚI SƠN
-- Production Database Schema & Ready-to-Run Supabase Cloud SQL Script
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('doan_xa', 'chi_doan');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE doc_type AS ENUM ('incoming', 'outgoing', 'submission');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE doc_status AS ENUM ('unread', 'pending', 'read', 'submitted', 'overdue');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE priority_level AS ENUM ('high', 'medium', 'low');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. BẢNG CHI ĐOÀN (30 Ấp Chính thức)
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  secretary_name VARCHAR(100),
  phone VARCHAR(20),
  member_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role user_role NOT NULL DEFAULT 'chi_doan',
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  branch_name VARCHAR(100),
  title VARCHAR(100),
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG VĂN BẢN (BAN HÀNH TỪ ĐOÀN XÃ)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doc_number VARCHAR(100) NOT NULL,
  title TEXT NOT NULL,
  type doc_type NOT NULL DEFAULT 'incoming',
  sender VARCHAR(150) NOT NULL,
  recipient_scope VARCHAR(50) DEFAULT 'ALL',
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  status doc_status DEFAULT 'unread',
  pdf_url TEXT,
  file_url TEXT,
  storage_provider VARCHAR(50) DEFAULT 'supabase',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG NỘP VĂN BẢN & BÁO CÁO (CHI ĐOÀN ẤP)
CREATE TABLE IF NOT EXISTS document_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  branch_name VARCHAR(100) NOT NULL,
  doc_title TEXT NOT NULL,
  due_date DATE,
  submission_date TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(30) DEFAULT 'Đã nộp',
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  storage_provider VARCHAR(50) DEFAULT 'supabase',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BẢNG HOẠT ĐỘNG & PHONG TRÀO
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Sắp diễn ra',
  organizer VARCHAR(100) DEFAULT 'Đoàn xã Xuân Thới Sơn',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BẢNG CÔNG VIỆC (TODO LIST)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  status task_status DEFAULT 'todo',
  priority priority_level DEFAULT 'medium',
  due_date DATE NOT NULL,
  assigned_to VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BẢNG THÔNG BÁO & CHỈ ĐẠO
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  type VARCHAR(30) DEFAULT 'general',
  target_branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  time_ago VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- GIẢI PHÓNG HÀN NGẠCH BẢO MẬT RLS (MỞ QUYỀN TRUY VẤN VÀ CHÈN DỮ LIỆU TỪ WEB DASHBOARD)
-- ============================================================================
ALTER TABLE branches DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE document_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- CẤU HÌNH SUPABASE STORAGE BUCKET SECURE SETUP CHO TỆP PDF & GOOGLE DRIVE BACKUP
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public select documents bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public insert documents bucket" ON storage.objects;
CREATE POLICY "Public select documents bucket" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Public insert documents bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');

-- NẠP DỮ LIỆU 30 ẤP CHÍNH THỨC
INSERT INTO branches (code, name, secretary_name) VALUES
('BM', 'Chi đoàn Ấp Bùi Môn', 'Bí thư Chi đoàn Ấp Bùi Môn'),
('DT', 'Chi đoàn Ấp Dân Thắng', 'Bí thư Chi đoàn Ấp Dân Thắng'),
('MH2', 'Chi đoàn Ấp Mỹ Hoà 2', 'Bí thư Chi đoàn Ấp Mỹ Hoà 2'),
('MH3', 'Chi đoàn Ấp Mỹ Hoà 3', 'Bí thư Chi đoàn Ấp Mỹ Hoà 3'),
('MH4', 'Chi đoàn Ấp Mỹ Hoà 4', 'Bí thư Chi đoàn Ấp Mỹ Hoà 4'),
('MH5', 'Chi đoàn Ấp Mỹ Hoà 5', 'Bí thư Chi đoàn Ấp Mỹ Hoà 5'),
('NX', 'Chi đoàn Ấp Nam Xuân', 'Bí thư Chi đoàn Ấp Nam Xuân'),
('NX1', 'Chi đoàn Ấp Nam Xuân 1', 'Bí thư Chi đoàn Ấp Nam Xuân 1'),
('NX2', 'Chi đoàn Ấp Nam Xuân 2', 'Bí thư Chi đoàn Ấp Nam Xuân 2'),
('NT', 'Chi đoàn Ấp Nhị Tân', 'Bí thư Chi đoàn Ấp Nhị Tân'),
('NT1', 'Chi đoàn Ấp Nhị Tân 1', 'Bí thư Chi đoàn Ấp Nhị Tân 1'),
('NT2', 'Chi đoàn Ấp Nhị Tân 2', 'Bí thư Chi đoàn Ấp Nhị Tân 2'),
('NT3', 'Chi đoàn Ấp Nhị Tân 3', 'Bí thư Chi đoàn Ấp Nhị Tân 3'),
('NXX', 'Chi đoàn Ấp Nhị Xuân', 'Bí thư Chi đoàn Ấp Nhị Xuân'),
('NXX1', 'Chi đoàn Ấp Nhị Xuân 1', 'Bí thư Chi đoàn Ấp Nhị Xuân 1'),
('TL', 'Chi đoàn Ấp Tân Lập', 'Bí thư Chi đoàn Ấp Tân Lập'),
('TTN', 'Chi đoàn Ấp Tân Thới Nhì', 'Bí thư Chi đoàn Ấp Tân Thới Nhì'),
('TT', 'Chi đoàn Ấp Tân Tiến', 'Bí thư Chi đoàn Ấp Tân Tiến'),
('TN1', 'Chi đoàn Ấp Thống Nhất 1', 'Bí thư Chi đoàn Ấp Thống Nhất 1'),
('TN2', 'Chi đoàn Ấp Thống Nhất 2', 'Bí thư Chi đoàn Ấp Thống Nhất 2'),
('TS', 'Chi đoàn Ấp Thới Sơn', 'Bí thư Chi đoàn Ấp Thới Sơn'),
('XT', 'Chi đoàn Ấp Xuân Thới', 'Bí thư Chi đoàn Ấp Xuân Thới'),
('XT1', 'Chi đoàn Ấp Xuân Thới 1', 'Bí thư Chi đoàn Ấp Xuân Thới 1'),
('XT2', 'Chi đoàn Ấp Xuân Thới 2', 'Bí thư Chi đoàn Ấp Xuân Thới 2'),
('XTD', 'Chi đoàn Ấp Xuân Thới Đông', 'Bí thư Chi đoàn Ấp Xuân Thới Đông'),
('XTD1', 'Chi đoàn Ấp Xuân Thới Đông 1', 'Bí thư Chi đoàn Ấp Xuân Thới Đông 1'),
('XTD2', 'Chi đoàn Ấp Xuân Thới Đông 2', 'Bí thư Chi đoàn Ấp Xuân Thới Đông 2'),
('XTD3', 'Chi đoàn Ấp Xuân Thới Đông 3', 'Bí thư Chi đoàn Ấp Xuân Thới Đông 3'),
('XTD4', 'Chi đoàn Ấp Xuân Thới Đông 4', 'Bí thư Chi đoàn Ấp Xuân Thới Đông 4'),
('XTD5', 'Chi đoàn Ấp Xuân Thới Đông 5', 'Bí thư Chi đoàn Ấp Xuân Thới Đông 5')
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- HỆ THỐNG QUẢN LÝ VĂN BẢN VÀ ĐIỀU HÀNH - ĐOÀN XÃ XUÂN THỚI SƠN
-- Database Schema, Auth Seeding & RLS Policies for Supabase
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('doan_xa', 'chi_doan');
CREATE TYPE doc_type AS ENUM ('incoming', 'outgoing', 'submission');
CREATE TYPE doc_status AS ENUM ('unread', 'pending', 'read', 'submitted', 'overdue');
CREATE TYPE priority_level AS ENUM ('high', 'medium', 'low');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'completed');

-- 2. BRANCHES TABLE (30 Chi đoàn Ấp Chính thức)
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  secretary_name VARCHAR(100),
  phone VARCHAR(20),
  member_count INT DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role user_role NOT NULL DEFAULT 'chi_doan',
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  branch_name VARCHAR(100),
  title VARCHAR(100),
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DOCUMENTS TABLE
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
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DOCUMENT SUBMISSIONS TABLE
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ACTIVITIES TABLE
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

-- 7. TASKS TABLE
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

-- 8. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  type VARCHAR(30) DEFAULT 'general',
  target_branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  time_ago VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION get_user_role() RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_branch_id() RETURNS UUID AS $$
  SELECT branch_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "DoanXa full access branches" ON branches FOR ALL USING (get_user_role() = 'doan_xa');
CREATE POLICY "DoanXa full access profiles" ON profiles FOR ALL USING (get_user_role() = 'doan_xa');
CREATE POLICY "DoanXa full access documents" ON documents FOR ALL USING (get_user_role() = 'doan_xa');
CREATE POLICY "DoanXa full access submissions" ON document_submissions FOR ALL USING (get_user_role() = 'doan_xa');
CREATE POLICY "DoanXa full access activities" ON activities FOR ALL USING (get_user_role() = 'doan_xa');
CREATE POLICY "DoanXa full access tasks" ON tasks FOR ALL USING (get_user_role() = 'doan_xa');
CREATE POLICY "DoanXa full access notifications" ON notifications FOR ALL USING (get_user_role() = 'doan_xa');

CREATE POLICY "ChiDoan view branches" ON branches FOR SELECT USING (true);
CREATE POLICY "ChiDoan view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "ChiDoan view documents" ON documents FOR SELECT USING (recipient_scope = 'ALL' OR recipient_scope = get_user_branch_id()::text);
CREATE POLICY "ChiDoan view/insert submissions" ON document_submissions FOR ALL USING (branch_id = get_user_branch_id());
CREATE POLICY "ChiDoan view activities" ON activities FOR SELECT USING (true);
CREATE POLICY "ChiDoan view/manage tasks" ON tasks FOR ALL USING (branch_id IS NULL OR branch_id = get_user_branch_id());
CREATE POLICY "ChiDoan view notifications" ON notifications FOR SELECT USING (target_branch_id IS NULL OR target_branch_id = get_user_branch_id());

-- ============================================================================
-- SEED DATA: 30 CHÍNH THỨC ẤP THEO ĐỊA GIỚI HÀNH CHÍNH 2 CẤP
-- ============================================================================
INSERT INTO branches (code, name, secretary_name, member_count) VALUES
('BM', 'Chi đoàn Ấp Bùi Môn', 'Bí thư Chi đoàn Ấp Bùi Môn', 24),
('DT', 'Chi đoàn Ấp Dân Thắng', 'Bí thư Chi đoàn Ấp Dân Thắng', 20),
('MH2', 'Chi đoàn Ấp Mỹ Hoà 2', 'Bí thư Chi đoàn Ấp Mỹ Hoà 2', 28),
('MH3', 'Chi đoàn Ấp Mỹ Hoà 3', 'Bí thư Chi đoàn Ấp Mỹ Hoà 3', 18),
('MH4', 'Chi đoàn Ấp Mỹ Hoà 4', 'Bí thư Chi đoàn Ấp Mỹ Hoà 4', 22),
('MH5', 'Chi đoàn Ấp Mỹ Hoà 5', 'Bí thư Chi đoàn Ấp Mỹ Hoà 5', 19),
('NX', 'Chi đoàn Ấp Nam Xuân', 'Bí thư Chi đoàn Ấp Nam Xuân', 25),
('NX1', 'Chi đoàn Ấp Nam Xuân 1', 'Bí thư Chi đoàn Ấp Nam Xuân 1', 21),
('NX2', 'Chi đoàn Ấp Nam Xuân 2', 'Bí thư Chi đoàn Ấp Nam Xuân 2', 23),
('NT', 'Chi đoàn Ấp Nhị Tân', 'Bí thư Chi đoàn Ấp Nhị Tân', 26),
('NT1', 'Chi đoàn Ấp Nhị Tân 1', 'Bí thư Chi đoàn Ấp Nhị Tân 1', 20),
('NT2', 'Chi đoàn Ấp Nhị Tân 2', 'Bí thư Chi đoàn Ấp Nhị Tân 2', 17),
('NT3', 'Chi đoàn Ấp Nhị Tân 3', 'Bí thư Chi đoàn Ấp Nhị Tân 3', 22),
('NXX', 'Chi đoàn Ấp Nhị Xuân', 'Bí thư Chi đoàn Ấp Nhị Xuân', 24),
('NXX1', 'Chi đoàn Ấp Nhị Xuân 1', 'Bí thư Chi đoàn Ấp Nhị Xuân 1', 29),
('TL', 'Chi đoàn Ấp Tân Lập', 'Bí thư Chi đoàn Ấp Tân Lập', 18),
('TTN', 'Chi đoàn Ấp Tân Thới Nhì', 'Bí thư Chi đoàn Ấp Tân Thới Nhì', 21),
('TT', 'Chi đoàn Ấp Tân Tiến', 'Bí thư Chi đoàn Ấp Tân Tiến', 23),
('TN1', 'Chi đoàn Ấp Thống Nhất 1', 'Bí thư Chi đoàn Ấp Thống Nhất 1', 20),
('TN2', 'Chi đoàn Ấp Thống Nhất 2', 'Bí thư Chi đoàn Ấp Thống Nhất 2', 25),
('TS', 'Chi đoàn Ấp Thới Sơn', 'Bí thư Chi đoàn Ấp Thới Sơn', 19),
('XT', 'Chi đoàn Ấp Xuân Thới', 'Bí thư Chi đoàn Ấp Xuân Thới', 22),
('XT1', 'Chi đoàn Ấp Xuân Thới 1', 'Bí thư Chi đoàn Ấp Xuân Thới 1', 27),
('XT2', 'Chi đoàn Ấp Xuân Thới 2', 'Bí thư Chi đoàn Ấp Xuân Thới 2', 20),
('XTD', 'Chi đoàn Ấp Xuân Thới Đông', 'Bí thư Chi đoàn Ấp Xuân Thới Đông', 21),
('XTD1', 'Chi đoàn Ấp Xuân Thới Đông 1', 'Bí thư Chi đoàn Ấp Xuân Thới Đông 1', 18),
('XTD2', 'Chi đoàn Ấp Xuân Thới Đông 2', 'Bí thư Chi đoàn Ấp Xuân Thới Đông 2', 24),
('XTD3', 'Chi đoàn Ấp Xuân Thới Đông 3', 'Bí thư Chi đoàn Ấp Xuân Thới Đông 3', 22),
('XTD4', 'Chi đoàn Ấp Xuân Thới Đông 4', 'Bí thư Chi đoàn Ấp Xuân Thới Đông 4', 26),
('XTD5', 'Chi đoàn Ấp Xuân Thới Đông 5', 'Bí thư Chi đoàn Ấp Xuân Thới Đông 5', 23)
ON CONFLICT (code) DO NOTHING;

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Official 30 Hamlets (Ấp) from Administrator Image
export const OFFICIAL_HAMLETS = [
  { code: 'BM', name: 'Ấp Bùi Môn', email: 'apbuimon@xuanthoison.gov.vn' },
  { code: 'DT', name: 'Ấp Dân Thắng', email: 'apdanthang@xuanthoison.gov.vn' },
  { code: 'MH2', name: 'Ấp Mỹ Hoà 2', email: 'apmyhoa2@xuanthoison.gov.vn' },
  { code: 'MH3', name: 'Ấp Mỹ Hoà 3', email: 'apmyhoa3@xuanthoison.gov.vn' },
  { code: 'MH4', name: 'Ấp Mỹ Hoà 4', email: 'apmyhoa4@xuanthoison.gov.vn' },
  { code: 'MH5', name: 'Ấp Mỹ Hoà 5', email: 'apmyhoa5@xuanthoison.gov.vn' },
  { code: 'NX', name: 'Ấp Nam Xuân', email: 'apnamxuan@xuanthoison.gov.vn' },
  { code: 'NX1', name: 'Ấp Nam Xuân 1', email: 'apnamxuan1@xuanthoison.gov.vn' },
  { code: 'NX2', name: 'Ấp Nam Xuân 2', email: 'apnamxuan2@xuanthoison.gov.vn' },
  { code: 'NT', name: 'Ấp Nhị Tân', email: 'apnhitan@xuanthoison.gov.vn' },
  { code: 'NT1', name: 'Ấp Nhị Tân 1', email: 'apnhitan1@xuanthoison.gov.vn' },
  { code: 'NT2', name: 'Ấp Nhị Tân 2', email: 'apnhitan2@xuanthoison.gov.vn' },
  { code: 'NT3', name: 'Ấp Nhị Tân 3', email: 'apnhitan3@xuanthoison.gov.vn' },
  { code: 'NXX', name: 'Ấp Nhị Xuân', email: 'apnhixuan@xuanthoison.gov.vn' },
  { code: 'NXX1', name: 'Ấp Nhị Xuân 1', email: 'apnhixuan1@xuanthoison.gov.vn' },
  { code: 'TL', name: 'Ấp Tân Lập', email: 'aptanlap@xuanthoison.gov.vn' },
  { code: 'TTN', name: 'Ấp Tân Thới Nhì', email: 'aptanthoinhi@xuanthoison.gov.vn' },
  { code: 'TT', name: 'Ấp Tân Tiến', email: 'aptantien@xuanthoison.gov.vn' },
  { code: 'TN1', name: 'Ấp Thống Nhất 1', email: 'apthongnhat1@xuanthoison.gov.vn' },
  { code: 'TN2', name: 'Ấp Thống Nhất 2', email: 'apthongnhat2@xuanthoison.gov.vn' },
  { code: 'TS', name: 'Ấp Thới Sơn', email: 'apthoison@xuanthoison.gov.vn' },
  { code: 'XT', name: 'Ấp Xuân Thới', email: 'apxuanthoi@xuanthoison.gov.vn' },
  { code: 'XT1', name: 'Ấp Xuân Thới 1', email: 'apxuanthoi1@xuanthoison.gov.vn' },
  { code: 'XT2', name: 'Ấp Xuân Thới 2', email: 'apxuanthoi2@xuanthoison.gov.vn' },
  { code: 'XTD', name: 'Ấp Xuân Thới Đông', email: 'apxuanthoidong@xuanthoison.gov.vn' },
  { code: 'XTD1', name: 'Ấp Xuân Thới Đông 1', email: 'apxuanthoidong1@xuanthoison.gov.vn' },
  { code: 'XTD2', name: 'Ấp Xuân Thới Đông 2', email: 'apxuanthoidong2@xuanthoison.gov.vn' },
  { code: 'XTD3', name: 'Ấp Xuân Thới Đông 3', email: 'apxuanthoidong3@xuanthoison.gov.vn' },
  { code: 'XTD4', name: 'Ấp Xuân Thới Đông 4', email: 'apxuanthoidong4@xuanthoison.gov.vn' },
  { code: 'XTD5', name: 'Ấp Xuân Thới Đông 5', email: 'apxuanthoidong5@xuanthoison.gov.vn' }
];

export const INITIAL_BRANCHES = OFFICIAL_HAMLETS.map((h, i) => ({
  id: `ap-${i + 1}`,
  code: h.code,
  name: `Chi đoàn ${h.name}`,
  secretary_name: `Bí thư Chi đoàn ${h.name}`,
  email: h.email,
  member_count: 0
}));

// All Accounts use the official Youth Union logo for avatars!
export const INITIAL_ROLES = [
  {
    id: 'doan-xa',
    email: 'doanxa@xuanthoison.gov.vn',
    role: 'doan_xa',
    full_name: 'Đoàn xã Xuân Thới Sơn',
    title: 'Quản trị viên',
    branch_name: 'Đoàn xã Xuân Thới Sơn',
    avatar: '/logo.png'
  },
  ...INITIAL_BRANCHES.map(b => ({
    id: b.id,
    email: b.email,
    role: 'chi_doan',
    full_name: `Bí thư ${b.name}`,
    title: b.name,
    branch_name: b.name,
    avatar: '/logo.png'
  }))
];

// Clean Initial Empty States for Official Handover
export const INITIAL_ACTIVITIES = [];
export const INITIAL_DOCUMENTS_DOAN_XA = [];
export const INITIAL_DOCUMENTS_CHI_DOAN = [];
export const INITIAL_REQUIRED_SUBMISSIONS = [];
export const INITIAL_SUBMISSION_HISTORY = [];
export const INITIAL_TASKS_DOAN_XA = {
  todo: [],
  inProgress: [],
  completed: []
};
export const INITIAL_TASKS_CHI_DOAN = [];
export const INITIAL_NOTIFICATIONS = [];

// Realtime Helper function to format current live date in Vietnamese
export function getLiveVietnameseDate() {
  const now = new Date();
  const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = daysOfWeek[now.getDay()];
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  return `Hôm nay là ${dayName}, ngày ${day} tháng ${month} năm ${year}`;
}

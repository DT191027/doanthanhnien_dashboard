import { createClient } from '@supabase/supabase-js';

// Official Supabase credentials for project ofroeyoghgenboavoaiu
const DEFAULT_SUPABASE_URL = 'https://ofroeyoghgenboavoaiu.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mcm9leW9naGdlbmJvYXZvYWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5Nzg5OTksImV4cCI6MjAzMTU1NDk5OX0.dummy_key';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseAnonKey.includes('dummy_key'));

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient(DEFAULT_SUPABASE_URL, supabaseAnonKey);

export const OFFICIAL_ADDRESS = 'Trụ sở Đảng ủy xã Xuân Thới Sơn: 2/2 Nguyễn Thị Nuôi, Ấp 54, Xã Xuân Thới Sơn, TP Hồ Chí Minh, Việt Nam';

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

// Additional School & Unit Branches (Cụm 7 - Cụm 11)
export const SCHOOL_BRANCHES = [
  // Cụm 7: Mầm non
  { id: 'truong-1', name: 'Chi đoàn MN Hướng Dương', email: 'mnhuongduong@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn MN Hướng Dương', member_count: 0 },
  { id: 'truong-2', name: 'Chi đoàn MN Cúc Họa Mi', email: 'mncuchoami@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn MN Cúc Họa Mi', member_count: 0 },
  { id: 'truong-3', name: 'Chi đoàn MN Xuân Thới Đông', email: 'mnxuanthoidong@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn MN Xuân Thới Đông', member_count: 0 },
  { id: 'truong-4', name: 'Chi đoàn MN Nhị Xuân', email: 'mnnhixuan@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn MN Nhị Xuân', member_count: 0 },
  { id: 'truong-5', name: 'Chi đoàn MN 19/8', email: 'mn198@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn MN 19/8', member_count: 0 },

  // Cụm 8: Tiểu học
  { id: 'truong-6', name: 'Chi đoàn TH Lý Chính Thắng 2', email: 'thlychinhthang2@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn TH Lý Chính Thắng 2', member_count: 0 },
  { id: 'truong-7', name: 'Chi đoàn TH Lê Văn Phiên', email: 'thlevanphien@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn TH Lê Văn Phiên', member_count: 0 },
  { id: 'truong-8', name: 'Chi đoàn TH Nhị Tân', email: 'thnhitan@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn TH Nhị Tân', member_count: 0 },
  { id: 'truong-9', name: 'Chi đoàn TH Nhị Xuân', email: 'thnhixuan@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn TH Nhị Xuân', member_count: 0 },
  { id: 'truong-10', name: 'Chi đoàn TH Dương Công Khi', email: 'thduongcongkhi@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn TH Dương Công Khi', member_count: 0 },
  { id: 'truong-11', name: 'Chi đoàn TH Trần Văn Mười', email: 'thtranvanmuoi@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn TH Trần Văn Mười', member_count: 0 },
  { id: 'truong-12', name: 'Chi đoàn TH Tân Xuân', email: 'thtanxuan@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn TH Tân Xuân', member_count: 0 },

  // Cụm 9: THCS & Chi đoàn Giáo viên
  { id: 'truong-13', name: 'Chi đoàn THCS Võ Văn Tần', email: 'thcsvovantan@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn THCS Võ Văn Tần', member_count: 0 },
  { id: 'truong-14', name: 'Chi đoàn THCS Tân Xuân', email: 'thcstanxuan@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn THCS Tân Xuân', member_count: 0 },
  { id: 'truong-15', name: 'Chi đoàn THCS Nguyễn Hồng Đào', email: 'thcsnguyenhongdao@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn THCS Nguyễn Hồng Đào', member_count: 0 },
  { id: 'truong-16', name: 'Chi đoàn TiH - THCS Tạ Uyên', email: 'tihthcstauyen@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn TiH - THCS Tạ Uyên', member_count: 0 },
  { id: 'truong-17', name: 'Chi đoàn GV THPT Phạm Văn Sáng', email: 'cdgvthptphamvansang@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn GV THPT Phạm Văn Sáng', member_count: 0 },
  { id: 'truong-18', name: 'Chi đoàn GV Trung tâm GDNN - GDTX Hóc Môn', email: 'cdgvgdnngdtxhocmon@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn GV Trung tâm GDNN - GDTX Hóc Môn', member_count: 0 },

  // Cụm 10: Đoàn trường
  { id: 'truong-19', name: 'Đoàn trường THPT Phạm Văn Sáng', email: 'thptphamvansang@xuanthoison.gov.vn', secretary_name: 'Bí thư Đoàn trường THPT Phạm Văn Sáng', member_count: 0 },
  { id: 'truong-20', name: 'Đoàn trường Trung tâm GDNN - GDTX Hóc Môn', email: 'gdnngdtxhocmon@xuanthoison.gov.vn', secretary_name: 'Bí thư Đoàn trường Trung tâm GDNN - GDTX Hóc Môn', member_count: 0 },
  { id: 'truong-21', name: 'Đoàn trường Tre Việt', email: 'treviet@xuanthoison.gov.vn', secretary_name: 'Bí thư Đoàn trường Tre Việt', member_count: 0 },

  // Cụm 11: Doanh nghiệp, Khối cơ quan, Tư thục
  { id: 'truong-22', name: 'Chi đoàn Mẫu giáo Bút chì Màu', email: 'mgbutchimau@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn Mẫu giáo Bút chì Màu', member_count: 0 },
  { id: 'truong-23', name: 'Chi đoàn lớp MN Độc lập Hoa Lài', email: 'mnhoalai@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn MN Độc lập Hoa Lài', member_count: 0 },
  { id: 'truong-24', name: 'Chi đoàn Cty Sambu Vina Sports', email: 'sambuvinasports@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn Cty Sambu Vina Sports', member_count: 0 },
  { id: 'truong-25', name: 'Chi đoàn UBND xã', email: 'ubndxa@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn UBND xã', member_count: 0 },
  { id: 'truong-26', name: 'Chi đoàn Trạm Y tế xã', email: 'tramytexa@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn Trạm Y tế xã', member_count: 0 }
];

export const ALL_BRANCHES = [...INITIAL_BRANCHES, ...SCHOOL_BRANCHES];

// Official 11 Competition Clusters (Cụm thi đua số 1 - số 11)
export const COMPETITION_CLUSTERS = [
  {
    id: 'cum-1',
    name: 'Cụm thi đua số 1',
    label: 'Cụm thi đua số 1 (Mỹ Hoà 2, Mỹ Hoà 4, Mỹ Hoà 3, Mỹ Hoà 5, Tân Tiến)',
    branches: ['Chi đoàn Ấp Mỹ Hoà 2', 'Chi đoàn Ấp Mỹ Hoà 4', 'Chi đoàn Ấp Mỹ Hoà 3', 'Chi đoàn Ấp Mỹ Hoà 5', 'Chi đoàn Ấp Tân Tiến']
  },
  {
    id: 'cum-2',
    name: 'Cụm thi đua số 2',
    label: 'Cụm thi đua số 2 (Xuân Thới Đông, Xuân Thới Đông 1, Xuân Thới Đông 2, Xuân Thới Đông 3, Bùi Môn)',
    branches: ['Chi đoàn Ấp Xuân Thới Đông', 'Chi đoàn Ấp Xuân Thới Đông 1', 'Chi đoàn Ấp Xuân Thới Đông 2', 'Chi đoàn Ấp Xuân Thới Đông 3', 'Chi đoàn Ấp Bùi Môn']
  },
  {
    id: 'cum-3',
    name: 'Cụm thi đua số 3',
    label: 'Cụm thi đua số 3 (Nam Xuân, Nam Xuân 1, Nam Xuân 2, Xuân Thới Đông 4, Xuân Thới Đông 5)',
    branches: ['Chi đoàn Ấp Nam Xuân', 'Chi đoàn Ấp Nam Xuân 1', 'Chi đoàn Ấp Nam Xuân 2', 'Chi đoàn Ấp Xuân Thới Đông 4', 'Chi đoàn Ấp Xuân Thới Đông 5']
  },
  {
    id: 'cum-4',
    name: 'Cụm thi đua số 4',
    label: 'Cụm thi đua số 4 (Xuân Thới, Thới Sơn, Xuân Thới 2, Xuân Thới 1, Nhị Tân 3)',
    branches: ['Chi đoàn Ấp Xuân Thới', 'Chi đoàn Ấp Thới Sơn', 'Chi đoàn Ấp Xuân Thới 2', 'Chi đoàn Ấp Xuân Thới 1', 'Chi đoàn Ấp Nhị Tân 3']
  },
  {
    id: 'cum-5',
    name: 'Cụm thi đua số 5',
    label: 'Cụm thi đua số 5 (Dân Thắng, Tân Thới Nhì, Thống Nhất 1, Thống Nhất 2, Nhị Tân 1)',
    branches: ['Chi đoàn Ấp Dân Thắng', 'Chi đoàn Ấp Tân Thới Nhì', 'Chi đoàn Ấp Thống Nhất 1', 'Chi đoàn Ấp Thống Nhất 2', 'Chi đoàn Ấp Nhị Tân 1']
  },
  {
    id: 'cum-6',
    name: 'Cụm thi đua số 6',
    label: 'Cụm thi đua số 6 (Nhị Tân 2, Tân Lập, Nhị Xuân 1, Nhị Xuân, Nhị Tân)',
    branches: ['Chi đoàn Ấp Nhị Tân 2', 'Chi đoàn Ấp Tân Lập', 'Chi đoàn Ấp Nhị Xuân 1', 'Chi đoàn Ấp Nhị Xuân', 'Chi đoàn Ấp Nhị Tân']
  },
  {
    id: 'cum-7',
    name: 'Cụm thi đua số 7',
    label: 'Cụm thi đua số 7 (MN Hướng Dương, MN Cúc Họa Mi, MN Xuân Thới Đông, MN Nhị Xuân, MN 19/8)',
    branches: ['Chi đoàn MN Hướng Dương', 'Chi đoàn MN Cúc Họa Mi', 'Chi đoàn MN Xuân Thới Đông', 'Chi đoàn MN Nhị Xuân', 'Chi đoàn MN 19/8']
  },
  {
    id: 'cum-8',
    name: 'Cụm thi đua số 8',
    label: 'Cụm thi đua số 8 (TH Lý Chính Thắng 2, TH Lê Văn Phiên, TH Nhị Tân, TH Nhị Xuân, TH Dương Công Khi, TH Trần Văn Mười, TH Tân Xuân)',
    branches: ['Chi đoàn TH Lý Chính Thắng 2', 'Chi đoàn TH Lê Văn Phiên', 'Chi đoàn TH Nhị Tân', 'Chi đoàn TH Nhị Xuân', 'Chi đoàn TH Dương Công Khi', 'Chi đoàn TH Trần Văn Mười', 'Chi đoàn TH Tân Xuân']
  },
  {
    id: 'cum-9',
    name: 'Cụm thi đua số 9',
    label: 'Cụm thi đua số 9 (THCS Võ Văn Tần, THCS Tân Xuân, THCS Nguyễn Hồng Đào, TiH - THCS Tạ Uyên, THPT Phạm Văn Sáng, GDNN - GDTX Hóc Môn)',
    branches: ['Chi đoàn THCS Võ Văn Tần', 'Chi đoàn THCS Tân Xuân', 'Chi đoàn THCS Nguyễn Hồng Đào', 'Chi đoàn TiH - THCS Tạ Uyên', 'Chi đoàn GV THPT Phạm Văn Sáng', 'Chi đoàn GV Trung tâm GDNN - GDTX Hóc Môn']
  },
  {
    id: 'cum-10',
    name: 'Cụm thi đua số 10',
    label: 'Cụm thi đua số 10 (THPT Phạm Văn Sáng, Trung tâm GDNN - GDTX Hóc Môn, Tre Việt)',
    branches: ['Đoàn trường THPT Phạm Văn Sáng', 'Đoàn trường Trung tâm GDNN - GDTX Hóc Môn', 'Đoàn trường Tre Việt']
  },
  {
    id: 'cum-11',
    name: 'Cụm thi đua số 11',
    label: 'Cụm thi đua số 11 (MG Bút chì Màu, MN Độc lập Hoa Lài, Cty Sambu Vina Sports, UBND xã, Trạm Y tế xã)',
    branches: ['Chi đoàn Mẫu giáo Bút chì Màu', 'Chi đoàn lớp MN Độc lập Hoa Lài', 'Chi đoàn Cty Sambu Vina Sports', 'Chi đoàn UBND xã', 'Chi đoàn Trạm Y tế xã']
  }
];

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
  ...ALL_BRANCHES.map(b => ({
    id: b.id,
    email: b.email,
    role: 'chi_doan',
    full_name: b.secretary_name || `Bí thư ${b.name}`,
    title: b.name,
    branch_name: b.name,
    avatar: '/logo.png'
  }))
];

// Initial Empty Constant Exports
// Seed Activities Dataset for 30 Hamlets & Competition Clusters
export const INITIAL_ACTIVITIES = [
  {
    id: 'act-seed-1',
    title: 'Hội nghị Học tập & Quán triệt Nghị quyết Đại hội Đoàn TNCS Hồ Chí Minh Xã Xuân Thới Sơn',
    priority: 'Khẩn cấp',
    assigned_to: 'Tất cả 30 Chi đoàn Ấp',
    day: '15',
    month: '09',
    year: 2026,
    dateIso: '2026-09-15',
    time: '08:00 - 11:30',
    location: 'Hội trường lớn UBND Xã Xuân Thới Sơn',
    status: 'Đang diễn ra',
    description: 'Tập trung quán triệt các chỉ tiêu thi đua năm 2026 và triển khai kế hoạch thực hiện công trình thanh niên 30 Ấp.',
    confirmedBy: [
      { branch: 'Chi đoàn Ấp Mỹ Hoà 2', time: '14/09/2026 08:30' },
      { branch: 'Chi đoàn Ấp Mỹ Hoà 4', time: '14/09/2026 09:15' },
      { branch: 'Chi đoàn Ấp Mỹ Hoà 3', time: '14/09/2026 09:40' },
      { branch: 'Chi đoàn Ấp Bùi Môn', time: '14/09/2026 10:00' },
      { branch: 'Chi đoàn Ấp Dân Thắng', time: '14/09/2026 10:20' },
      { branch: 'Chi đoàn Ấp Xuân Thới Đông 1', time: '14/09/2026 11:00' },
      { branch: 'Chi đoàn Ấp Xuân Thới Đông 2', time: '14/09/2026 11:30' },
      { branch: 'Chi đoàn Ấp Nam Xuân', time: '14/09/2026 13:10' },
      { branch: 'Chi đoàn Ấp Nhị Tân', time: '14/09/2026 14:00' },
      { branch: 'Chi đoàn Ấp Nhị Tân 1', time: '14/09/2026 14:30' },
      { branch: 'Chi đoàn Ấp Nhị Tân 2', time: '14/09/2026 15:00' },
      { branch: 'Chi đoàn Ấp Nhị Tân 3', time: '14/09/2026 15:20' },
      { branch: 'Chi đoàn Ấp Nhị Xuân', time: '14/09/2026 15:45' },
      { branch: 'Chi đoàn Ấp Tân Lập', time: '14/09/2026 16:00' },
      { branch: 'Chi đoàn Ấp Tân Thới Nhì', time: '14/09/2026 16:15' },
      { branch: 'Chi đoàn Ấp Tân Tiến', time: '14/09/2026 16:30' },
      { branch: 'Chi đoàn Ấp Thống Nhất 1', time: '14/09/2026 16:45' },
      { branch: 'Chi đoàn Ấp Thống Nhất 2', time: '14/09/2026 17:00' },
      { branch: 'Chi đoàn Ấp Xuân Thới', time: '14/09/2026 17:15' },
      { branch: 'Chi đoàn Ấp Xuân Thới 1', time: '14/09/2026 17:30' },
      { branch: 'Chi đoàn Ấp Xuân Thới 2', time: '14/09/2026 17:45' },
      { branch: 'Chi đoàn Ấp Xuân Thới Đông', time: '14/09/2026 18:00' },
      { branch: 'Chi đoàn Ấp Xuân Thới Đông 3', time: '14/09/2026 18:15' },
      { branch: 'Chi đoàn Ấp Xuân Thới Đông 4', time: '14/09/2026 18:30' },
      { branch: 'Chi đoàn Ấp Xuân Thới Đông 5', time: '14/09/2026 18:45' },
      { branch: 'Chi đoàn Ấp Nam Xuân 1', time: '14/09/2026 19:00' },
      { branch: 'Chi đoàn Ấp Nam Xuân 2', time: '14/09/2026 19:15' },
      { branch: 'Chi đoàn Ấp Mỹ Hoà 5', time: '14/09/2026 19:30' }
    ],
    absentBy: [
      { branch: 'Chi đoàn Ấp Nhị Xuân 1', reason: 'Bí thư bận công tác đột xuất cấp ủy chỉ đạo tuần tra địa bàn', time: '14/09/2026 14:15' },
      { branch: 'Chi đoàn Ấp Thới Sơn', reason: 'Bí thư & Phó bí thư tham dự lớp tập huấn lý luận chính trị', time: '14/09/2026 15:30' }
    ]
  },
  {
    id: 'act-seed-2',
    title: 'Ngày đồng loạt ra quân "Ngày Chủ nhật Xanh" dọn dẹp vệ sinh môi trường 30 Ấp',
    priority: 'Bình thường',
    assigned_to: 'Tất cả 30 Chi đoàn Ấp',
    day: '20',
    month: '09',
    year: 2026,
    dateIso: '2026-09-20',
    time: '07:00 - 10:30',
    location: 'Tuyến đường thanh niên tự quản 30 Ấp',
    status: 'Sắp diễn ra',
    description: 'Chi đoàn 30 Ấp huy động 100% đoàn viên tham gia dọn dẹp rác thải, bóc xóa quảng cáo bẩn và trồng cây xanh.',
    confirmedBy: [
      { branch: 'Chi đoàn Ấp Mỹ Hoà 2', time: '14/09/2026 09:00' },
      { branch: 'Chi đoàn Ấp Bùi Môn', time: '14/09/2026 10:15' },
      { branch: 'Chi đoàn Ấp Dân Thắng', time: '14/09/2026 11:20' }
    ],
    absentBy: []
  },
  {
    id: 'act-seed-3',
    title: 'Lễ Thắp nến Tri ân các Anh hùng Liệt sĩ nhân kỷ niệm Ngày Thương binh Liệt sĩ 27/7',
    priority: 'Quan trọng',
    assigned_to: 'Tất cả 30 Chi đoàn Ấp',
    day: '27',
    month: '07',
    year: 2026,
    dateIso: '2026-07-27',
    time: '18:30 - 21:00',
    location: 'Nghĩa trang Liệt sĩ Huyện',
    status: 'Đã kết thúc',
    description: 'Dâng hoa, thắp nến tri ân và trao quà hỗ trợ các gia đình chính sách, Bà mẹ Việt Nam Anh hùng.',
    confirmedBy: [
      { branch: 'Chi đoàn Ấp Mỹ Hoà 2', time: '26/07/2026 08:00' },
      { branch: 'Chi đoàn Ấp Mỹ Hoà 4', time: '26/07/2026 08:30' },
      { branch: 'Chi đoàn Ấp Mỹ Hoà 3', time: '26/07/2026 09:00' },
      { branch: 'Chi đoàn Ấp Bùi Môn', time: '26/07/2026 09:30' },
      { branch: 'Chi đoàn Ấp Dân Thắng', time: '26/07/2026 10:00' },
      { branch: 'Chi đoàn Ấp Xuân Thới Đông 1', time: '26/07/2026 10:30' },
      { branch: 'Chi đoàn Ấp Xuân Thới Đông 2', time: '26/07/2026 11:00' },
      { branch: 'Chi đoàn Ấp Nam Xuân', time: '26/07/2026 11:30' },
      { branch: 'Chi đoàn Ấp Nhị Tân', time: '26/07/2026 13:00' },
      { branch: 'Chi đoàn Ấp Nhị Tân 1', time: '26/07/2026 13:30' },
      { branch: 'Chi đoàn Ấp Nhị Tân 2', time: '26/07/2026 14:00' },
      { branch: 'Chi đoàn Ấp Nhị Tân 3', time: '26/07/2026 14:30' },
      { branch: 'Chi đoàn Ấp Nhị Xuân', time: '26/07/2026 15:00' },
      { branch: 'Chi đoàn Ấp Tân Lập', time: '26/07/2026 15:30' },
      { branch: 'Chi đoàn Ấp Tân Thới Nhì', time: '26/07/2026 16:00' },
      { branch: 'Chi đoàn Ấp Tân Tiến', time: '26/07/2026 16:30' },
      { branch: 'Chi đoàn Ấp Thống Nhất 1', time: '26/07/2026 17:00' },
      { branch: 'Chi đoàn Ấp Thống Nhất 2', time: '26/07/2026 17:30' },
      { branch: 'Chi đoàn Ấp Thới Sơn', time: '26/07/2026 18:00' },
      { branch: 'Chi đoàn Ấp Xuân Thới', time: '26/07/2026 18:30' },
      { branch: 'Chi đoàn Ấp Xuân Thới 1', time: '26/07/2026 19:00' },
      { branch: 'Chi đoàn Ấp Xuân Thới 2', time: '26/07/2026 19:30' },
      { branch: 'Chi đoàn Ấp Xuân Thới Đông', time: '26/07/2026 20:00' },
      { branch: 'Chi đoàn Ấp Xuân Thới Đông 3', time: '26/07/2026 20:30' },
      { branch: 'Chi đoàn Ấp Xuân Thới Đông 4', time: '26/07/2026 21:00' },
      { branch: 'Chi đoàn Ấp Xuân Thới Đông 5', time: '26/07/2026 21:30' },
      { branch: 'Chi đoàn Ấp Nam Xuân 1', time: '26/07/2026 22:00' },
      { branch: 'Chi đoàn Ấp Nam Xuân 2', time: '26/07/2026 22:30' },
      { branch: 'Chi đoàn Ấp Mỹ Hoà 5', time: '26/07/2026 23:00' }
    ],
    absentBy: [
      { branch: 'Chi đoàn Ấp Nhị Xuân 1', reason: 'Đơn vị thực hiện nhiệm vụ bảo đảm an ninh trật tự địa bàn', time: '26/07/2026 14:00' }
    ]
  }
];

// Seed Youth Members Dataset for 30 Hamlets
export const INITIAL_MEMBERS = [
  { id: 'dv-1', full_name: 'Nguyễn Văn An', branch_name: 'Chi đoàn Ấp Mỹ Hoà 2', position: 'Bí thư Chi đoàn', gender: 'Nam', birth_date: '1998-05-12', join_date: '2014-03-26', phone: '0903123456', email: 'nguyenvanan@gmail.com', status: 'Đoàn viên ưu tú', education: 'Đại học' },
  { id: 'dv-2', full_name: 'Trần Thị Bích', branch_name: 'Chi đoàn Ấp Mỹ Hoà 2', position: 'Phó Bí thư Chi đoàn', gender: 'Nữ', birth_date: '2000-08-20', join_date: '2016-03-26', phone: '0912345678', email: 'tranthibich@gmail.com', status: 'Đang sinh hoạt', education: 'Đại học' },
  { id: 'dv-3', full_name: 'Lê Hoài Nam', branch_name: 'Chi đoàn Ấp Mỹ Hoà 2', position: 'Ủy viên BCH', gender: 'Nam', birth_date: '2002-03-15', join_date: '2018-03-26', phone: '0987654321', email: 'lehoainam@gmail.com', status: 'Đang sinh hoạt', education: 'Cao đẳng' },
  { id: 'dv-4', full_name: 'Phạm Minh Tâm', branch_name: 'Chi đoàn Ấp Bùi Môn', position: 'Bí thư Chi đoàn', gender: 'Nam', birth_date: '1997-11-04', join_date: '2013-03-26', phone: '0934567890', email: 'phamminhtam@gmail.com', status: 'Đoàn viên ưu tú', education: 'Đại học' },
  { id: 'dv-5', full_name: 'Ngô Thanh Hương', branch_name: 'Chi đoàn Ấp Bùi Môn', position: 'Đoàn viên', gender: 'Nữ', birth_date: '2001-02-18', join_date: '2017-03-26', phone: '0945678901', email: 'ngothanhhuong@gmail.com', status: 'Đang sinh hoạt', education: '12/12' },
  { id: 'dv-6', full_name: 'Vũ Quốc Khánh', branch_name: 'Chi đoàn Ấp Dân Thắng', position: 'Bí thư Chi đoàn', gender: 'Nam', birth_date: '1999-09-30', join_date: '2015-03-26', phone: '0956789012', email: 'vuquockhanh@gmail.com', status: 'Đoàn viên ưu tú', education: 'Đại học' },
  { id: 'dv-7', full_name: 'Hoàng Bích Ngọc', branch_name: 'Chi đoàn Ấp Dân Thắng', position: 'Đoàn viên', gender: 'Nữ', birth_date: '2003-07-25', join_date: '2019-03-26', phone: '0967890123', email: 'hoangbichngoc@gmail.com', status: 'Đang sinh hoạt', education: 'Đại học' },
  { id: 'dv-8', full_name: 'Đặng Tuấn Anh', branch_name: 'Chi đoàn Ấp Xuân Thới Đông 1', position: 'Bí thư Chi đoàn', gender: 'Nam', birth_date: '1998-01-10', join_date: '2014-03-26', phone: '0978901234', email: 'dangtuananh@gmail.com', status: 'Đoàn viên ưu tú', education: 'Đại học' },
  { id: 'dv-9', full_name: 'Nguyễn Thị Thu Hà', branch_name: 'Chi đoàn Ấp Xuân Thới Đông 1', position: 'Phó Bí thư Chi đoàn', gender: 'Nữ', birth_date: '2001-12-05', join_date: '2017-03-26', phone: '0989012345', email: 'nguyenthithuha@gmail.com', status: 'Đang sinh hoạt', education: 'Cao đẳng' },
  { id: 'dv-10', full_name: 'Bùi Đức Trọng', branch_name: 'Chi đoàn Ấp Nam Xuân', position: 'Bí thư Chi đoàn', gender: 'Nam', birth_date: '1996-04-14', join_date: '2012-03-26', phone: '0990123456', email: 'buiductrong@gmail.com', status: 'Đoàn viên ưu tú', education: 'Đại học' },
  { id: 'dv-11', full_name: 'Trịnh Mai Anh', branch_name: 'Chi đoàn Ấp Nhị Tân 1', position: 'Bí thư Chi đoàn', gender: 'Nữ', birth_date: '1999-06-22', join_date: '2015-03-26', phone: '0901234567', email: 'trinhmaianh@gmail.com', status: 'Đang sinh hoạt', education: 'Đại học' },
  { id: 'dv-12', full_name: 'Đỗ Hữu Phước', branch_name: 'Chi đoàn Ấp Tân Lập', position: 'Bí thư Chi đoàn', gender: 'Nam', birth_date: '2000-10-08', join_date: '2016-03-26', phone: '0912345670', email: 'dohuuphuoc@gmail.com', status: 'Đang sinh hoạt', education: '12/12' },
  { id: 'dv-13', full_name: 'Lương Mỹ Duyên', branch_name: 'Chi đoàn Ấp Thống Nhất 1', position: 'Bí thư Chi đoàn', gender: 'Nữ', birth_date: '2002-09-17', join_date: '2018-03-26', phone: '0923456781', email: 'luongmyduyen@gmail.com', status: 'Đang sinh hoạt', education: 'Đại học' },
  { id: 'dv-14', full_name: 'Cao Văn Khiêm', branch_name: 'Chi đoàn Ấp Xuân Thới', position: 'Bí thư Chi đoàn', gender: 'Nam', birth_date: '1997-03-03', join_date: '2013-03-26', phone: '0934567892', email: 'caovankhiem@gmail.com', status: 'Đoàn viên ưu tú', education: 'Đại học' },
  { id: 'dv-15', full_name: 'Phan Bảo Ngọc', branch_name: 'Chi đoàn Ấp Thới Sơn', position: 'Bí thư Chi đoàn', gender: 'Nữ', birth_date: '2001-05-19', join_date: '2017-03-26', phone: '0945678903', email: 'phanbaongoc@gmail.com', status: 'Đang sinh hoạt', education: 'Cao đẳng' }
];

export const INITIAL_DOCUMENTS = [
  {
    id: 'doc-seed-1',
    doc_number: '15-KH/ĐX-XTS',
    title: 'Kế hoạch Tổ chức Chiến dịch Thanh niên Tình nguyện Mùa Hè Xanh năm 2026',
    summary: 'Ban hành ngày 10/08/2026 - Kế hoạch triển khai công trình thanh niên tại 30 Chi đoàn Ấp',
    sender: 'Đoàn xã Xuân Thới Sơn',
    recipient_scope: 'Tất cả 30 Chi đoàn Ấp',
    status: 'Đã đọc',
    type: 'outgoing',
    date: '10/08/2026',
    file_name: 'Ke_hoach_15_KH_DX_Mua_He_Xanh_2026.pdf',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    storage_provider: 'supabase'
  },
  {
    id: 'doc-seed-2',
    doc_number: '28-TB/ĐX-XTS',
    title: 'Thông báo Triệu tập Đại biểu tham dự Hội nghị Học tập & Quán triệt Nghị quyết Đoàn xã',
    summary: 'Ban hành ngày 01/09/2026 - Triệu tập Bí thư, Phó Bí thư và Đoàn viên ưu tú 30 Ấp',
    sender: 'Đoàn xã Xuân Thới Sơn',
    recipient_scope: 'Tất cả 30 Chi đoàn Ấp',
    status: 'Chưa đọc',
    type: 'incoming',
    date: '01/09/2026',
    file_name: 'Thong_bao_28_TB_Trieu_tap_Hoi_nghi.pdf',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    storage_provider: 'supabase'
  },
  {
    id: 'doc-seed-3',
    doc_number: '42-QĐ/ĐX-XTS',
    title: 'Quyết định Phê duyệt Kế hoạch Ra quân Đồng loạt "Ngày Chủ nhật Xanh" Quý III/2026',
    summary: 'Ban hành ngày 05/09/2026 - Quy định nội dung và chỉ tiêu triển khai cho 6 Cụm thi đua',
    sender: 'Đoàn xã Xuân Thới Sơn',
    recipient_scope: 'Tất cả 30 Chi đoàn Ấp',
    status: 'Chưa đọc',
    type: 'incoming',
    date: '05/09/2026',
    file_name: 'Quyet_dinh_42_QD_Ngay_Chu_Nhat_Xanh.pdf',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    storage_provider: 'supabase'
  },
  {
    id: 'doc-seed-4',
    doc_number: '09-HD/ĐX-XTS',
    title: 'Hướng dẫn Công tác Quản lý Đoàn viên và Thu nộp Đoàn phí năm 2026',
    summary: 'Ban hành ngày 15/05/2026 - Quy trình cập nhật sổ đoàn viên và báo cáo đoàn phí 30 Ấp',
    sender: 'Đoàn xã Xuân Thới Sơn',
    recipient_scope: 'Tất cả 30 Chi đoàn Ấp',
    status: 'Đã đọc',
    type: 'outgoing',
    date: '15/05/2026',
    file_name: 'Huong_dan_09_HD_Quan_ly_Doan_vien.pdf',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    storage_provider: 'supabase'
  }
];

export const INITIAL_DOCUMENTS_DOAN_XA = INITIAL_DOCUMENTS;
export const INITIAL_DOCUMENTS_CHI_DOAN = INITIAL_DOCUMENTS;

export const INITIAL_SUBMISSION_HISTORY = [
  {
    id: 'sub-seed-1',
    doc_title: 'Báo cáo Kết quả Hoạt động Tháng 8/2026 và Phương hướng Nhiệm vụ Tháng 9/2026',
    branch_name: 'Chi đoàn Ấp Mỹ Hoà 2',
    sender: 'Bí thư Chi đoàn Ấp Mỹ Hoà 2',
    submitted_at: '28/08/2026 15:30',
    status: 'Đã tiếp nhận',
    file_name: 'Bao_cao_Thang_8_Chi_doan_Ap_My_Hoa_2.pdf',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    notes: 'Đã gửi kèm danh sách đoàn viên tham gia Chiến dịch Mùa Hè Xanh.'
  },
  {
    id: 'sub-seed-2',
    doc_title: 'Danh sách Rà soát Đoàn viên Ưu tú và Cảm tình Đảng Quý III/2026',
    branch_name: 'Chi đoàn Ấp Bùi Môn',
    sender: 'Bí thư Chi đoàn Ấp Bùi Môn',
    submitted_at: '30/08/2026 09:15',
    status: 'Đã tiếp nhận',
    file_name: 'Danh_sach_Doan_vien_uu_tu_Ap_Bui_Mon.pdf',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    notes: 'Trình 03 hồ sơ đoàn viên ưu tú xuất sắc.'
  },
  {
    id: 'sub-seed-3',
    doc_title: 'Báo cáo Thu nộp Đoàn phí Quý II/2026 và Danh sách Đoàn viên Sinh hoạt',
    branch_name: 'Chi đoàn Ấp Dân Thắng',
    sender: 'Bí thư Chi đoàn Ấp Dân Thắng',
    submitted_at: '02/09/2026 14:20',
    status: 'Đang xử lý',
    file_name: 'Bao_cao_Doan_phi_Ap_Dan_Thang.pdf',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    notes: 'Số tiền đoàn phí đã chuyển qua tài khoản Đoàn xã.'
  }
];

export const INITIAL_REQUIRED_SUBMISSIONS = [
  {
    id: 'req-seed-1',
    title: 'Nộp Báo cáo Kết quả Ra quân "Ngày Chủ nhật Xanh" và Hình ảnh Tư liệu 30 Ấp',
    deadline: '22/09/2026',
    status: 'Chưa nộp',
    assigned_to: 'Tất cả 30 Chi đoàn Ấp'
  },
  {
    id: 'req-seed-2',
    title: 'Nộp Danh sách Rà soát Cập nhật Số lượng Đoàn viên Tháng 9/2026',
    deadline: '15/09/2026',
    status: 'Chưa nộp',
    assigned_to: 'Tất cả 30 Chi đoàn Ấp'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'noti-seed-1',
    title: '🚨 KHẨN: Triệu tập Bán Thường vụ & Bí thư 30 Chi đoàn Ấp họp đột xuất sáng mai',
    content: 'Ban Thường vụ Đoàn xã triệu tập đồng chí Bí thư (hoặc Phó Bí thư) 30 Chi đoàn Ấp tham dự buổi họp rà soát công tác chuẩn bị Ngày Chủ nhật Xanh vào lúc 08h00 ngày 10/09/2026 tại Phòng họp số 2 UBND Xã.',
    priority: 'Khẩn cấp',
    target_scope: 'Tất cả 30 Chi đoàn Ấp',
    created_at: '2026-09-08 16:00',
    date: '08/09/2026',
    sender: 'Ban Thường vụ Đoàn xã Xuân Thới Sơn'
  },
  {
    id: 'noti-seed-2',
    title: '📢 V/v Nhắc nhở nộp Báo cáo Kết quả Hoạt động Tháng 8/2026 đúng thời hạn',
    content: 'Yêu cầu các Chi đoàn Ấp chưa nộp báo cáo hoạt động tháng 8 khẩn trương hoàn thiện văn bản và nộp trên Hệ thống Quản lý trước 17h00 ngày 12/09/2026.',
    priority: 'Quan trọng',
    target_scope: 'Tất cả 30 Chi đoàn Ấp',
    created_at: '2026-09-07 09:30',
    date: '07/09/2026',
    sender: 'Văn phòng Đoàn xã Xuân Thới Sơn'
  },
  {
    id: 'noti-seed-3',
    title: '🌟 Thông báo Khen thưởng Tập thể & Cá nhân xuất sắc trong Chiến dịch Mùa Hè Xanh',
    content: 'Chúc mừng 6 Chi đoàn Ấp thuộc Cụm thi đua số 1 đã hoàn thành xuất sắc chỉ tiêu công trình thanh niên Mùa Hè Xanh năm 2026.',
    priority: 'Bình thường',
    target_scope: 'Tất cả 30 Chi đoàn Ấp',
    created_at: '2026-09-05 14:15',
    date: '05/09/2026',
    sender: 'Ban Thường vụ Đoàn xã Xuân Thới Sơn'
  }
];

export const INITIAL_TASKS = [
  {
    id: 'task-seed-1',
    title: 'Rà soát và cập nhật danh sách 100% đoàn viên 30 Chi đoàn Ấp trên hệ thống',
    assigned_to: 'Tất cả 30 Chi đoàn Ấp',
    deadline: '2026-09-15',
    status: 'in_progress',
    priority: 'Khẩn cấp',
    description: 'Kiểm tra thông tin cá nhân, ngày vào Đoàn và trình độ học vấn từng đoàn viên.'
  },
  {
    id: 'task-seed-2',
    title: 'Thu nộp Đoàn phí Quý III/2026 và quyết toán tài chính Chi đoàn',
    assigned_to: 'Tất cả 30 Chi đoàn Ấp',
    deadline: '2026-09-25',
    status: 'todo',
    priority: 'Bình thường',
    description: 'Thực hiện việc thu nộp đoàn phí theo đúng quy định và trích nộp Đoàn xã đúng hạn.'
  },
  {
    id: 'task-seed-3',
    title: 'Chuẩn bị địa điểm & công cụ ra quân "Ngày Chủ nhật Xanh" dọn dẹp cảnh quan',
    assigned_to: 'Tất cả 30 Chi đoàn Ấp',
    deadline: '2026-09-19',
    status: 'completed',
    priority: 'Quan trọng',
    description: 'Chuẩn bị chổi, bao chứa rác, cuốc xẻng và sơn để dọn dẹp và xóa quảng cáo bẩn.'
  }
];

export const INITIAL_TASKS_DOAN_XA = {
  todo: INITIAL_TASKS.filter(t => t.status === 'todo'),
  inProgress: INITIAL_TASKS.filter(t => t.status === 'in_progress'),
  completed: INITIAL_TASKS.filter(t => t.status === 'completed')
};

export const INITIAL_TASKS_CHI_DOAN = INITIAL_TASKS;

// Helper function to format current live date in Vietnamese
export function getLiveVietnameseDate() {
  const now = new Date();
  const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = daysOfWeek[now.getDay()];
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  return `Hôm nay là ${dayName}, ngày ${day} tháng ${month} năm ${year}`;
}

// Helper to strictly deduplicate activities by ID or Title+Date
export function deduplicateActivities(activities) {
  if (!Array.isArray(activities)) return [];
  const seenIds = new Set();
  const seenKeys = new Set();
  return activities.filter(act => {
    if (!act) return false;
    if (act.id && seenIds.has(act.id)) return false;

    const dateKey = act.dateIso || `${act.year || ''}-${act.month || ''}-${act.day || ''}`;
    const comboKey = `${(act.title || '').trim().toLowerCase()}_${dateKey}`;
    if (seenKeys.has(comboKey)) return false;

    if (act.id) seenIds.add(act.id);
    seenKeys.add(comboKey);
    return true;
  });
}

// Universal Date Formatter to dd/mm/yyyy
export function formatDateDDMMYYYY(dayOrObj, month, year) {
  if (!dayOrObj && !month) return 'Chưa chọn ngày';

  if (typeof dayOrObj === 'object' && dayOrObj !== null) {
    const obj = dayOrObj;
    if (obj.formattedDate) return formatDateDDMMYYYY(obj.formattedDate);
    if (obj.date && typeof obj.date === 'string') {
      return formatDateDDMMYYYY(obj.date);
    }
    if (obj.dateIso) {
      const [y, m, d] = obj.dateIso.split('-');
      if (y && m && d) return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
    }
    return formatDateDDMMYYYY(obj.day, obj.month, obj.year);
  }

  if (typeof dayOrObj === 'string') {
    const str = dayOrObj.trim();
    if (!str) return 'Chưa chọn ngày';
    if (str === 'Hôm nay') return 'Hôm nay';

    // Handle ISO or YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
    if (str.includes('-')) {
      const datePart = str.split('T')[0].split(' ')[0];
      const parts = datePart.split('-');
      if (parts.length === 3) {
        const [y, m, d] = parts;
        if (y.length === 4) {
          return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
        }
        if (d.length === 4) {
          return `${y.padStart(2, '0')}/${m.padStart(2, '0')}/${d}`;
        }
      }
    }

    // Handle DD/MM/YYYY or YYYY/MM/DD or MM/DD/YYYY
    if (str.includes('/')) {
      const datePart = str.split('T')[0].split(' ')[0];
      const parts = datePart.split('/');
      if (parts.length === 3) {
        let [p1, p2, p3] = parts;
        if (p1.length === 4) { // YYYY/MM/DD
          return `${p3.padStart(2, '0')}/${p2.padStart(2, '0')}/${p1}`;
        }
        return `${p1.padStart(2, '0')}/${p2.padStart(2, '0')}/${p3}`;
      }
      if (parts.length === 2 && month) {
        const dPart = parts[0].padStart(2, '0');
        const mPart = parts[1].padStart(2, '0');
        return `${dPart}/${mPart}/${year || new Date().getFullYear()}`;
      }
    }
  }

  const day = dayOrObj;
  if (!day && !month) return 'Chưa chọn ngày';

  const d = String(day || '01').padStart(2, '0');
  let mNum = month;
  if (typeof month === 'string') {
    const match = month.match(/\d+/);
    if (match) {
      mNum = match[0];
    }
  }
  const m = String(mNum || '01').padStart(2, '0');
  const y = year || new Date().getFullYear();
  return `${d}/${m}/${y}`;
}

// Persistent Storage Helpers (LocalStorage Backup)
// Universal Realtime Broadcast Channel for Zero-Delay Atomic Synchronization
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('xts_youth_sync_channel')
  : null;

export function notifySyncEvent(type, payload) {
  try {
    if (syncChannel) {
      syncChannel.postMessage({ type, payload, timestamp: Date.now() });
    }
    window.dispatchEvent(new CustomEvent('doanthanhnien_sync', { detail: { type, payload } }));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Sync broadcast error:', e);
  }
}

// Precise Target Unit Filtering Helper for 30 Chi đoàn Ấp and Cụm thi đua
export function isItemTargetedToUser(targetScope, currentUser) {
  if (!currentUser) return true;
  if (currentUser.role === 'doan_xa' || currentUser.role === 'admin') return true;

  if (!targetScope) return true;

  const userBranch = String(currentUser?.branch_name || currentUser?.full_name || currentUser?.title || '');
  if (!userBranch) return true;

  const cleanUserBranch = userBranch.replace(/^Bí thư\s*/i, '').replace(/^Chi đoàn\s*/i, '').replace(/^Ấp\s*/i, '').trim();

  // Handle Array of target scopes (when multiple units are selected)
  if (Array.isArray(targetScope)) {
    if (targetScope.length === 0 || targetScope.includes('ALL') || targetScope.includes('Tất cả 30 Chi đoàn Ấp') || targetScope.includes('Tất cả')) {
      return true;
    }
    return targetScope.some(scope => {
      if (typeof scope !== 'string') return false;
      const cleanScope = scope.replace(/^Bí thư\s*/i, '').replace(/^Chi đoàn\s*/i, '').replace(/^Ấp\s*/i, '').trim();
      return scope === userBranch ||
        scope.includes(userBranch) ||
        userBranch.includes(scope) ||
        (cleanUserBranch && scope.includes(cleanUserBranch)) ||
        (cleanUserBranch && cleanScope && (cleanScope.includes(cleanUserBranch) || cleanUserBranch.includes(cleanScope)));
    });
  }

  // Ensure targetScope is string
  const scopeStr = String(targetScope);

  if (scopeStr === 'ALL' || scopeStr === 'Tất cả 30 Chi đoàn Ấp' || scopeStr.includes('30 Chi đoàn') || scopeStr === 'Tất cả') {
    return true;
  }

  const cleanScopeStr = scopeStr.replace(/^Bí thư\s*/i, '').replace(/^Chi đoàn\s*/i, '').replace(/^Ấp\s*/i, '').trim();

  // 1. Direct match with branch name or code
  if (
    scopeStr === userBranch ||
    scopeStr.includes(userBranch) ||
    userBranch.includes(scopeStr) ||
    (cleanUserBranch && scopeStr.includes(cleanUserBranch)) ||
    (cleanUserBranch && cleanScopeStr && (cleanScopeStr.includes(cleanUserBranch) || cleanUserBranch.includes(cleanScopeStr)))
  ) {
    return true;
  }

  // 2. Check if targetScope is a Competition Cluster (Cụm thi đua số 1 - 6)
  if (scopeStr.startsWith('Cụm thi đua') || scopeStr.startsWith('cum-')) {
    const cluster = COMPETITION_CLUSTERS.find(c =>
      c.name === scopeStr ||
      c.id === scopeStr ||
      (c.label && c.label.includes(scopeStr)) ||
      scopeStr.includes(c.name)
    );
    if (cluster) {
      const isInCluster = cluster.branches.some(b => {
        const cleanB = b.replace(/^Chi đoàn\s*/i, '').replace(/^Ấp\s*/i, '').trim();
        return b === userBranch ||
          b.includes(userBranch) ||
          userBranch.includes(b) ||
          (cleanUserBranch && b.includes(cleanUserBranch)) ||
          (cleanUserBranch && cleanB && cleanB === cleanUserBranch);
      });
      if (isInCluster) return true;
    }
  }

  return false;
}

export function getPersistedData(key, fallback = []) {
  try {
    const raw = localStorage.getItem(`xts_youth_${key}`);
    if (raw === null) {
      if (Array.isArray(fallback) && fallback.length > 0) {
        setPersistedData(key, fallback);
      }
      return fallback;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const seen = new Set();
      return parsed.filter(item => {
        if (item && item.id) {
          if (seen.has(item.id)) return false;
          seen.add(item.id);
        }
        return true;
      });
    }
    return parsed !== null ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
}

export function setPersistedData(key, data) {
  try {
    localStorage.setItem(`xts_youth_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function getDeletedItems(key) {
  try {
    const raw = localStorage.getItem(`xts_deleted_${key}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function addDeletedItem(key, id, title = '') {
  try {
    const current = getDeletedItems(key);
    const updated = [...new Set([...current, String(id), ...(title ? [title] : [])])];
    localStorage.setItem(`xts_deleted_${key}`, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to add deleted item:', e);
  }
}

// ============================================================================
// Real-time Dynamic Activity Time & Status Calculation Helper
export function getActivityTimeStatus(act) {
  if (!act) return { statusText: 'Chưa xác định', badgeClass: 'bg-secondary text-white', code: 'UNKNOWN' };

  if (act.status === 'Đã hoàn thành') {
    return {
      statusText: 'Đã kết thúc',
      badgeClass: 'bg-secondary-subtle text-secondary border-secondary-subtle',
      code: 'FINISHED'
    };
  }

  const now = new Date();

  let year = parseInt(act.year, 10);
  let month = parseInt(act.month, 10);
  let day = parseInt(act.day, 10);

  if (act.dateIso && (!year || !month || !day)) {
    const parts = String(act.dateIso).split('T')[0].split('-');
    if (parts.length === 3) {
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    }
  }

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  if (!year) year = currentYear;
  if (!month) month = currentMonth;
  if (!day) day = currentDay;

  let startHour = 8, startMin = 0;
  let endHour = 11, endMin = 30;

  if (act.time && typeof act.time === 'string' && act.time.includes('-')) {
    const timeParts = act.time.split('-').map(s => s.trim());
    if (timeParts[0]) {
      const [h, m] = timeParts[0].split(':').map(Number);
      if (!isNaN(h)) startHour = h;
      if (!isNaN(m)) startMin = m;
    }
    if (timeParts[1]) {
      const [h, m] = timeParts[1].split(':').map(Number);
      if (!isNaN(h)) endHour = h;
      if (!isNaN(m)) endMin = m;
    }
  }

  const startDate = new Date(year, month - 1, day, startHour, startMin, 0);
  const endDate = new Date(year, month - 1, day, endHour, endMin, 0);

  const tomorrowStart = new Date(currentYear, currentMonth - 1, currentDay + 1, 0, 0, 0);
  const actDayStart = new Date(year, month - 1, day, 0, 0, 0);

  // 1. Past date or past time today
  if (now > endDate) {
    return {
      statusText: 'Đã kết thúc',
      badgeClass: 'bg-secondary-subtle text-secondary border-secondary-subtle',
      code: 'FINISHED'
    };
  }

  // 2. Currently ongoing
  if (now >= startDate && now <= endDate) {
    return {
      statusText: 'Đang diễn ra',
      badgeClass: 'bg-success text-white border-success shadow-xs',
      code: 'ONGOING'
    };
  }

  // 3. Tomorrow or future days
  if (actDayStart >= tomorrowStart) {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month).padStart(2, '0');
    return {
      statusText: `Ngày ${dayStr}/${monthStr}`,
      badgeClass: 'bg-primary-subtle text-primary border-primary-subtle',
      code: 'FUTURE_DATE'
    };
  }

  // 4. Later today (same day, start time in future)
  if (now < startDate) {
    const diffMs = startDate.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    let timeUntilStr = '';
    if (hours > 0 && mins > 0) {
      timeUntilStr = `Sắp diễn ra trong ${hours} tiếng ${mins} phút nữa`;
    } else if (hours > 0) {
      timeUntilStr = `Sắp diễn ra trong ${hours} tiếng nữa`;
    } else if (mins > 0) {
      timeUntilStr = `Sắp diễn ra trong ${mins} phút nữa`;
    } else {
      timeUntilStr = 'Sắp diễn ra';
    }

    return {
      statusText: timeUntilStr,
      badgeClass: 'bg-primary-subtle text-primary border-primary-subtle',
      code: 'UPCOMING'
    };
  }

  return {
    statusText: 'Sắp diễn ra',
    badgeClass: 'bg-primary-subtle text-primary border-primary-subtle',
    code: 'UPCOMING'
  };
}

// ============================================================================
// 1. ACTIVITIES SYNC (BẢNG HOẠT ĐỘNG)
// ============================================================================
export async function syncFetchActivities() {
  const deleted = getDeletedItems('activities');
  let localList = getPersistedData('activities', null);
  if (localList === null) {
    localList = INITIAL_ACTIVITIES;
  }
  localList = (localList || []).filter(a => a && !deleted.includes(String(a.id)) && (!a.title || !deleted.includes(a.title)));
  setPersistedData('activities', localList);

  if (supabase) {
    try {
      const { data, error } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map(item => {
          const d = item.start_date ? new Date(item.start_date) : null;
          const day = item.day || (d ? String(d.getDate()).padStart(2, '0') : '01');
          const month = item.month || (d ? String(d.getMonth() + 1).padStart(2, '0') : '01');
          const year = item.year || (d ? d.getFullYear() : 2026);
          const matchedLocal = localList.find(l => String(l.id) === String(item.id)) || {};

          return {
            ...matchedLocal,
            ...item,
            id: item.id,
            title: item.title,
            priority: item.priority || matchedLocal.priority || 'Bình thường',
            day: day,
            month: month,
            year: year,
            dateIso: item.start_date || `${year}-${month}-${day}`,
            time: item.time || `${item.start_time ? item.start_time.slice(0, 5) : '08:00'} - ${item.end_time ? item.end_time.slice(0, 5) : '11:30'}`,
            location: item.location || OFFICIAL_ADDRESS,
            status: item.status || 'Sắp diễn ra',
            description: item.description || matchedLocal.description || '',
            assigned_to: item.assigned_to || matchedLocal.assigned_to || 'Tất cả 30 Chi đoàn Ấp',
            hasSubTasks: item.hasSubTasks !== undefined ? item.hasSubTasks : (matchedLocal.hasSubTasks || false),
            subTasks: item.subTasks || matchedLocal.subTasks || [],
            file_name: item.file_name || matchedLocal.file_name || '',
            file_url: item.file_url || matchedLocal.file_url || '',
            notes: item.notes || matchedLocal.notes || '',
            confirmedBy: item.confirmedBy || matchedLocal.confirmedBy || [],
            absentBy: item.absentBy || matchedLocal.absentBy || []
          };
        });
        const cleanMapped = deduplicateActivities(mapped).filter(a => a && !deleted.includes(String(a.id)) && (!a.title || !deleted.includes(a.title)));
        setPersistedData('activities', cleanMapped);
        return cleanMapped;
      }
    } catch (e) {
      console.warn('Supabase fetch activities error, using local storage fallback:', e);
    }
  }
  return deduplicateActivities(localList);
}

export async function syncSaveActivity(activityItem) {
  const current = getPersistedData('activities', []);
  const exists = current.some(item => item.id === activityItem.id);
  const updatedRaw = exists
    ? current.map(item => item.id === activityItem.id ? { ...item, ...activityItem } : item)
    : [activityItem, ...current];

  const cleanList = deduplicateActivities(updatedRaw);
  setPersistedData('activities', cleanList);
  notifySyncEvent('SAVE_ACTIVITY', activityItem);

  if (supabase) {
    try {
      let startTime = '08:00:00';
      let endTime = '11:30:00';
      if (activityItem.time && activityItem.time.includes(' - ')) {
        const parts = activityItem.time.split(' - ');
        startTime = parts[0].length === 5 ? `${parts[0]}:00` : parts[0];
        endTime = parts[1].length === 5 ? `${parts[1]}:00` : parts[1];
      }

      const { data, error } = await supabase.from('activities').insert([{
        title: activityItem.title,
        priority: activityItem.priority || 'Bình thường',
        description: activityItem.description || '',
        start_date: activityItem.dateIso || new Date().toISOString().split('T')[0],
        start_time: startTime,
        end_time: endTime,
        location: activityItem.location || OFFICIAL_ADDRESS,
        status: activityItem.status || 'Sắp diễn ra',
        organizer: 'Đoàn xã Xuân Thới Sơn'
      }]).select();

      if (error) {
        console.error('Supabase error inserting activity:', error);
      } else {
        console.log('Supabase activity inserted successfully:', data);
      }
    } catch (e) {
      console.error('Supabase save activity exception:', e);
    }
  }
  return cleanList;
}

export async function syncToggleActivityStatus(activityId, newStatus) {
  const current = getPersistedData('activities', []);
  const updatedLocal = current.map(a => a.id === activityId ? { ...a, status: newStatus } : a);
  setPersistedData('activities', updatedLocal);
  notifySyncEvent('TOGGLE_ACTIVITY', { activityId, newStatus });

  if (supabase) {
    try {
      await supabase.from('activities').update({ status: newStatus }).eq('id', activityId);
    } catch (e) {
      console.error('Supabase toggle activity status error:', e);
    }
    return await syncFetchActivities();
  }
  return updatedLocal;
}

export async function syncDeleteActivity(activityId, targetTitle = '') {
  addDeletedItem('activities', activityId, targetTitle);
  const deleted = getDeletedItems('activities');

  const current = getPersistedData('activities', []);
  const updatedLocal = current.filter(a => a && !deleted.includes(String(a.id)) && (!targetTitle || a.title !== targetTitle));
  setPersistedData('activities', updatedLocal);

  if (supabase) {
    try {
      await supabase.from('activities').delete().eq('id', activityId);
      if (targetTitle) {
        await supabase.from('activities').delete().eq('title', targetTitle);
      }
    } catch (e) {
      console.error('Supabase delete activity error:', e);
    }
  }

  notifySyncEvent('DELETE_ACTIVITY', { activityId, targetTitle });

  if (supabase) {
    const fetched = await syncFetchActivities();
    return fetched.filter(a => a && !deleted.includes(String(a.id)) && (!targetTitle || a.title !== targetTitle));
  }
  return updatedLocal;
}

export function getDocViewsMap() {
  return getPersistedData('doc_views_map', {});
}

export function recordDocView(docIdentifier, branchName) {
  if (!docIdentifier || !branchName) return [];
  const map = getDocViewsMap();
  const current = map[docIdentifier] || [];

  // Match canonical branch name if branchName matches one in INITIAL_BRANCHES
  const matchedBranch = INITIAL_BRANCHES.find(b =>
    b.name === branchName ||
    b.name.includes(branchName) ||
    branchName.includes(b.name)
  );
  const canonicalName = matchedBranch ? matchedBranch.name : branchName;

  // If this branch already recorded view/receipt, preserve existing timestamp and return current list
  const existing = current.find(v =>
    v.branch_name === canonicalName ||
    v.branch_name === branchName ||
    v.branch_name?.includes(branchName) ||
    branchName.includes(v.branch_name)
  );
  if (existing) {
    return current;
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('vi-VN');

  const updatedList = [
    ...current.filter(v => v.branch_name !== canonicalName && v.branch_name !== branchName),
    {
      branch_name: canonicalName,
      viewed_at: `${timeStr} ngày ${dateStr}`,
      timestamp: now.toISOString()
    }
  ];

  const newMap = {
    ...map,
    [docIdentifier]: updatedList
  };
  setPersistedData('doc_views_map', newMap);
  notifySyncEvent('DOC_VIEWED', { docIdentifier, branchName: canonicalName, list: updatedList });
  return updatedList;
}

export function removeDocView(docIdentifier, branchName) {
  if (!docIdentifier || !branchName) return [];
  const map = getDocViewsMap();
  const current = map[docIdentifier] || [];

  const matchedBranch = INITIAL_BRANCHES.find(b =>
    b.name === branchName ||
    b.name.includes(branchName) ||
    branchName.includes(b.name)
  );
  const canonicalName = matchedBranch ? matchedBranch.name : branchName;

  const updatedList = current.filter(v =>
    v &&
    v.branch_name !== canonicalName &&
    v.branch_name !== branchName &&
    !v.branch_name?.includes(canonicalName) &&
    !canonicalName.includes(v.branch_name)
  );

  const newMap = {
    ...map,
    [docIdentifier]: updatedList
  };
  setPersistedData('doc_views_map', newMap);
  notifySyncEvent('DOC_VIEWED', { docIdentifier, branchName: canonicalName, list: updatedList });
  return updatedList;
}

export function setDocViews(docIdentifier, viewsArray) {
  if (!docIdentifier) return [];
  const map = getDocViewsMap();
  const newMap = {
    ...map,
    [docIdentifier]: viewsArray || []
  };
  setPersistedData('doc_views_map', newMap);
  notifySyncEvent('DOC_VIEWED', { docIdentifier, list: viewsArray });
  return viewsArray || [];
}

export function getDocCategoriesMap() {
  return getPersistedData('doc_categories_map', {});
}

export function recordDocCategory(docIdentifier, categoryKey, categoryLabel) {
  if (!docIdentifier || !categoryKey) return;
  const map = getDocCategoriesMap();
  const updatedMap = {
    ...map,
    [docIdentifier]: {
      category: categoryKey,
      category_label: categoryLabel
    }
  };
  setPersistedData('doc_categories_map', updatedMap);
  notifySyncEvent('DOC_CATEGORY_UPDATED', { docIdentifier, categoryKey, categoryLabel });
  return updatedMap;
}

// ============================================================================
// 2. DOCUMENTS SYNC (BẢNG VĂN BẢN BAN HÀNH)
// ============================================================================
export async function syncFetchDocuments() {
  const deleted = getDeletedItems('documents');
  const viewsMap = getDocViewsMap();
  const categoriesMap = getDocCategoriesMap();

  const categoryMap = {
    decision_docs: 'Văn bản quyết định',
    act_docs: 'Ban hành hoạt động',
    implementation_docs: 'Văn bản triển khai',
    meeting_docs: 'Văn bản cuộc họp'
  };

  let localList = getPersistedData('documents', null);
  if (localList === null) {
    localList = INITIAL_DOCUMENTS;
  }
  const seenLocal = new Set();
  localList = (localList || []).filter(d => {
    if (!d) return false;
    if (deleted.includes(String(d.id)) || (d.title && deleted.includes(d.title))) return false;
    const key = (d.title && d.title.trim()) ? d.title.trim() : String(d.id);
    if (seenLocal.has(key)) return false;
    seenLocal.add(key);
    return true;
  }).map(d => {
    const savedCat = categoriesMap[d.id] || categoriesMap[d.title];
    const cat = savedCat?.category || d.category || (
      d.category_label === 'Văn bản quyết định' ? 'decision_docs' :
        d.category_label === 'Ban hành hoạt động' || d.category_label === 'Văn bản thuộc ban hành hoạt động' ? 'act_docs' :
          d.category_label === 'Văn bản triển khai' ? 'implementation_docs' :
            d.category_label === 'Văn bản cuộc họp' ? 'meeting_docs' : 'decision_docs'
    );
    const catLabel = savedCat?.category_label || d.category_label || categoryMap[cat] || 'Văn bản quyết định';

    return {
      ...d,
      category: cat,
      category_label: catLabel,
      viewed_by: d.viewed_by || viewsMap[d.id] || viewsMap[d.title] || []
    };
  });
  setPersistedData('documents', localList);

  if (supabase) {
    try {
      const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map(item => {
          const savedCat = categoriesMap[item.id] || categoriesMap[item.title];
          const cat = savedCat?.category || item.category || (
            item.category_label === 'Văn bản quyết định' ? 'decision_docs' :
              item.category_label === 'Ban hành hoạt động' || item.category_label === 'Văn bản thuộc ban hành hoạt động' ? 'act_docs' :
                item.category_label === 'Văn bản triển khai' ? 'implementation_docs' :
                  item.category_label === 'Văn bản cuộc họp' ? 'meeting_docs' : 'decision_docs'
          );
          const catLabel = savedCat?.category_label || item.category_label || categoryMap[cat] || 'Văn bản quyết định';

          return {
            id: item.id,
            doc_number: item.doc_number,
            title: item.title,
            summary: `Ban hành ngày ${item.issue_date || new Date().toLocaleDateString('vi-VN')}`,
            sender: item.sender || 'Đoàn xã Xuân Thới Sơn',
            recipient_scope: item.recipient_scope || 'ALL',
            status: item.status === 'unread' ? 'Chưa đọc' : item.status === 'read' ? 'Đã đọc' : (item.status || 'Chưa đọc'),
            type: item.type || 'outgoing',
            date: item.issue_date || new Date().toLocaleDateString('vi-VN'),
            file_name: item.pdf_url || '',
            file_url: item.file_url || item.pdf_url || '',
            storage_provider: item.storage_provider || 'supabase',
            category: cat,
            category_label: catLabel,
            viewed_by: item.viewed_by || viewsMap[item.id] || viewsMap[item.title] || []
          };
        });
        const seen = new Set();
        const clean = mapped.filter(d => {
          if (!d) return false;
          const key = (d.title && d.title.trim()) ? d.title.trim() : String(d.id);
          if (seen.has(key)) return false;
          if (deleted.includes(String(d.id)) || (d.title && deleted.includes(d.title))) return false;
          seen.add(key);
          return true;
        });
        setPersistedData('documents', clean);
        return clean;
      }
    } catch (e) {
      console.warn('Supabase fetch documents error, using local storage fallback:', e);
    }
  }
  return localList;
}

export async function syncSaveDocument(docItem) {
  const current = getPersistedData('documents', INITIAL_DOCUMENTS);

  const categoryMap = {
    decision_docs: 'Văn bản quyết định',
    act_docs: 'Ban hành hoạt động',
    implementation_docs: 'Văn bản triển khai',
    meeting_docs: 'Văn bản cuộc họp'
  };

  const finalCat = docItem.category || (
    docItem.category_label === 'Văn bản quyết định' ? 'decision_docs' :
      docItem.category_label === 'Ban hành hoạt động' || docItem.category_label === 'Văn bản thuộc ban hành hoạt động' ? 'act_docs' :
        docItem.category_label === 'Văn bản triển khai' ? 'implementation_docs' :
          docItem.category_label === 'Văn bản cuộc họp' ? 'meeting_docs' : 'decision_docs'
  );
  const finalCatLabel = docItem.category_label || categoryMap[finalCat] || 'Văn bản quyết định';

  if (docItem.id) recordDocCategory(docItem.id, finalCat, finalCatLabel);
  if (docItem.title) recordDocCategory(docItem.title, finalCat, finalCatLabel);

  const normalizedDocItem = {
    ...docItem,
    category: finalCat,
    category_label: finalCatLabel
  };

  const existsIndex = (current || []).findIndex(d =>
    d && ((docItem.id && String(d.id) === String(docItem.id)) || (d.title && docItem.title && d.title.trim() === docItem.title.trim()))
  );

  let updatedLocal;
  if (existsIndex >= 0) {
    updatedLocal = [...current];
    updatedLocal[existsIndex] = { ...updatedLocal[existsIndex], ...normalizedDocItem };
  } else {
    updatedLocal = [normalizedDocItem, ...current];
  }

  const seen = new Set();
  updatedLocal = updatedLocal.filter(d => {
    if (!d) return false;
    const key = (d.title && d.title.trim()) ? d.title.trim() : String(d.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (Array.isArray(normalizedDocItem.viewed_by) && normalizedDocItem.viewed_by.length > 0) {
    const map = getDocViewsMap();
    const docKey = normalizedDocItem.id || normalizedDocItem.title;
    setPersistedData('doc_views_map', { ...map, [docKey]: normalizedDocItem.viewed_by });
  }

  setPersistedData('documents', updatedLocal);
  notifySyncEvent('SAVE_DOCUMENT', normalizedDocItem);

  if (supabase) {
    try {
      let validDocStatus = 'unread';
      if (normalizedDocItem.status === 'Đã đọc' || normalizedDocItem.status === 'read') validDocStatus = 'read';
      else if (normalizedDocItem.status === 'Đang xử lý' || normalizedDocItem.status === 'pending') validDocStatus = 'pending';

      let validDocType = 'outgoing';
      if (normalizedDocItem.type === 'incoming') validDocType = 'incoming';
      else if (normalizedDocItem.type === 'submission') validDocType = 'submission';

      const payload = {
        doc_number: normalizedDocItem.doc_number,
        title: normalizedDocItem.title,
        type: validDocType,
        sender: normalizedDocItem.sender || 'Đoàn xã Xuân Thới Sơn',
        recipient_scope: normalizedDocItem.recipient_scope || 'ALL',
        issue_date: normalizedDocItem.date || normalizedDocItem.issue_date || new Date().toISOString().split('T')[0],
        status: validDocStatus,
        pdf_url: normalizedDocItem.file_url || normalizedDocItem.file_name || '',
        file_url: normalizedDocItem.file_url || '',
        storage_provider: normalizedDocItem.storage_provider || 'supabase'
      };

      if (normalizedDocItem.id && !String(normalizedDocItem.id).startsWith('doc-')) {
        await supabase.from('documents').upsert([{ id: normalizedDocItem.id, ...payload }]);
      } else {
        const { data: existing } = await supabase.from('documents').select('id').eq('title', normalizedDocItem.title);
        if (existing && existing.length > 0) {
          await supabase.from('documents').update(payload).eq('id', existing[0].id);
        } else {
          await supabase.from('documents').insert([payload]);
        }
      }
    } catch (e) {
      console.error('Supabase save document exception:', e);
    }
    return await syncFetchDocuments();
  }
  return updatedLocal;
}

export async function syncDeleteDocument(docId, docTitle = '') {
  addDeletedItem('documents', docId, docTitle);
  const deleted = getDeletedItems('documents');

  const current = getPersistedData('documents', []);
  const updatedLocal = current.filter(d => d && !deleted.includes(String(d.id)) && (!docTitle || d.title !== docTitle));
  setPersistedData('documents', updatedLocal);

  if (supabase) {
    try {
      await supabase.from('documents').delete().eq('id', docId);
      if (docTitle) {
        await supabase.from('documents').delete().eq('title', docTitle);
      }
    } catch (e) {
      console.error('Supabase delete document error:', e);
    }
  }

  notifySyncEvent('DELETE_DOCUMENT', { docId, docTitle });

  if (supabase) {
    const fetched = await syncFetchDocuments();
    return fetched.filter(d => d && !deleted.includes(String(d.id)) && (!docTitle || d.title !== docTitle));
  }
  return updatedLocal;
}

// ============================================================================
// 3. DOCUMENT SUBMISSIONS SYNC (BẢNG NỘP BÁO CÁO CHI ĐOÀN)
// ============================================================================
export async function syncFetchSubmissions() {
  const deleted = getDeletedItems('submissions');
  let localList = getPersistedData('submissions', INITIAL_SUBMISSION_HISTORY);
  if (!localList || localList.length === 0) {
    localList = INITIAL_SUBMISSION_HISTORY;
    setPersistedData('submissions', INITIAL_SUBMISSION_HISTORY);
  }

  localList = (localList || []).filter(s => s && !deleted.includes(String(s.id)) && (!s.title || !deleted.includes(s.title)) && (!s.doc_title || !deleted.includes(s.doc_title)));

  if (supabase) {
    try {
      const { data, error } = await supabase.from('document_submissions').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map(item => ({
          id: item.id,
          title: item.doc_title || item.title || 'Báo cáo Chi đoàn',
          doc_title: item.doc_title || item.title || 'Báo cáo Chi đoàn',
          notes: item.notes || item.summary || item.content || item.description || '',
          branch_name: item.branch_name || 'Chi đoàn Ấp',
          sender: item.sender || item.branch_name || 'Chi đoàn Ấp',
          due_date: new Date().toLocaleDateString('vi-VN'),
          sub_date: item.submitted_at || (item.submission_date ? new Date(item.submission_date).toLocaleDateString('vi-VN') + ' ' + new Date(item.submission_date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'Hôm nay'),
          submitted_at: item.submitted_at || (item.submission_date ? new Date(item.submission_date).toLocaleDateString('vi-VN') + ' ' + new Date(item.submission_date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'Hôm nay'),
          status: item.status || 'Đã nộp',
          file_name: item.file_name || 'Bao_cao.pdf',
          file_url: item.file_url || item.file_name || '',
          storage_provider: item.storage_provider || 'supabase'
        }));
        const seen = new Set();
        const clean = mapped.filter(s => {
          if (!s || !s.id || seen.has(s.id)) return false;
          if (deleted.includes(String(s.id)) || (s.title && deleted.includes(s.title)) || (s.doc_title && deleted.includes(s.doc_title))) return false;
          seen.add(s.id);
          return true;
        });
        setPersistedData('submissions', clean);
        return clean;
      }
    } catch (e) {
      console.warn('Supabase fetch submissions error, using local storage fallback:', e);
    }
  }
  return localList;
}

export async function syncSaveSubmission(subItem) {
  const current = getPersistedData('submissions', INITIAL_SUBMISSION_HISTORY);
  const updatedLocal = [subItem, ...current];
  setPersistedData('submissions', updatedLocal);
  notifySyncEvent('SAVE_SUBMISSION', subItem);

  if (supabase) {
    try {
      const { data, error } = await supabase.from('document_submissions').insert([{
        branch_name: subItem.branch_name || 'Chi đoàn Ấp',
        doc_title: subItem.title || subItem.doc_title || 'Báo cáo Chi đoàn',
        submission_date: new Date().toISOString(),
        status: subItem.status || 'Đã nộp',
        file_name: subItem.file_name || 'Bao_cao.pdf',
        file_url: subItem.file_url || subItem.file_name || '',
        storage_provider: subItem.storage_provider || 'supabase'
      }]).select();

      if (error) {
        console.error('Supabase error inserting submission:', error);
      } else {
        console.log('Supabase submission inserted successfully:', data);
      }
    } catch (e) {
      console.error('Supabase save submission exception:', e);
    }
    return await syncFetchSubmissions();
  }
  return updatedLocal;
}

export async function syncDeleteSubmission(subId, subTitle = '') {
  addDeletedItem('submissions', subId, subTitle);
  const deleted = getDeletedItems('submissions');

  const current = getPersistedData('submissions', INITIAL_SUBMISSION_HISTORY);
  const updatedLocal = current.filter(s => s && !deleted.includes(String(s.id)) && (!subTitle || (s.title !== subTitle && s.doc_title !== subTitle)));
  setPersistedData('submissions', updatedLocal);

  if (supabase) {
    try {
      await supabase.from('document_submissions').delete().eq('id', subId);
      if (subTitle) {
        await supabase.from('document_submissions').delete().eq('doc_title', subTitle);
      }
    } catch (e) {
      console.error('Supabase delete submission error:', e);
    }
  }

  notifySyncEvent('DELETE_SUBMISSION', { subId, subTitle });

  if (supabase) {
    const fetched = await syncFetchSubmissions();
    return fetched.filter(s => s && !deleted.includes(String(s.id)) && (!subTitle || (s.title !== subTitle && s.doc_title !== subTitle)));
  }
  return updatedLocal;
}

// Helper to format priority badge style, icons, and color coding
export function getPriorityBadgeStyle(priority) {
  const p = String(priority || '').toLowerCase();
  if (p.includes('khẩn') || p.includes('cao')) {
    return {
      bg: 'bg-danger-subtle text-danger border-danger-subtle',
      badgeSolid: 'bg-danger text-white',
      badgeDot: 'bg-danger',
      label: '🔥 Khẩn cấp',
      fullLabel: '🔥 Khẩn cấp (Cao)',
      color: '#DC2626',
      borderColor: '#EF4444'
    };
  }
  if (p.includes('trung bình')) {
    return {
      bg: 'bg-warning-subtle text-warning-emphasis border-warning-subtle',
      badgeSolid: 'bg-warning text-dark',
      badgeDot: 'bg-warning',
      label: '⚡ Trung bình',
      fullLabel: '⚡ Trung bình',
      color: '#D97706',
      borderColor: '#EAB308'
    };
  }
  return {
    bg: 'bg-success-subtle text-success border-success-subtle',
    badgeSolid: 'bg-success text-white',
    badgeDot: 'bg-success',
    label: '🟢 Bình thường',
    fullLabel: '🟢 Bình thường',
    color: '#16A34A',
    borderColor: '#22C55E'
  };
}

// Helper to sort activities by Priority descending: Khẩn cấp (3) -> Trung bình (2) -> Bình thường (1)
export function sortActivitiesByPriority(activities = []) {
  const getWeight = (p) => {
    if (!p) return 1;
    const str = String(p).toLowerCase();
    if (str.includes('khẩn') || str.includes('cao') || str.includes('urgent') || str.includes('high')) return 3;
    if (str.includes('trung bình') || str.includes('medium')) return 2;
    return 1; // Bình thường
  };

  return [...activities].sort((a, b) => {
    const wA = getWeight(a.priority);
    const wB = getWeight(b.priority);
    if (wA !== wB) return wB - wA;
    const timeA = a.createdAt || (typeof a.id === 'string' && a.id.startsWith('act-') ? parseInt(a.id.replace('act-', '')) : 0);
    const timeB = b.createdAt || (typeof b.id === 'string' && b.id.startsWith('act-') ? parseInt(b.id.replace('act-', '')) : 0);
    return timeB - timeA;
  });
}

// Helper to sort notifications by Priority descending: Khẩn cấp (3) -> Trung bình (2) -> Bình thường (1)
export function sortNotificationsByPriority(notis = []) {
  const getWeight = (p) => {
    if (!p) return 1;
    const str = String(p).toLowerCase();
    if (str.includes('khẩn') || str.includes('cao') || str.includes('urgent') || str.includes('high')) return 3;
    if (str.includes('trung bình') || str.includes('medium')) return 2;
    return 1; // Bình thường
  };

  return [...notis].sort((a, b) => {
    const wA = getWeight(a.priority);
    const wB = getWeight(b.priority);
    if (wA !== wB) return wB - wA;
    const timeA = a.createdAt || (typeof a.id === 'string' && a.id.startsWith('noti-') ? parseInt(a.id.replace('noti-', '')) : 0);
    const timeB = b.createdAt || (typeof b.id === 'string' && b.id.startsWith('noti-') ? parseInt(b.id.replace('noti-', '')) : 0);
    return timeB - timeA;
  });
}

// ============================================================================
// 4. NOTIFICATIONS SYNC (BẢNG THÔNG BÁO & CHỈ ĐẠO)
// ============================================================================
export async function syncFetchNotifications() {
  const deleted = getDeletedItems('notifications');
  let localList = getPersistedData('notifications', null);
  if (localList === null) {
    localList = INITIAL_NOTIFICATIONS;
  }
  localList = (localList || []).filter(n => n && !deleted.includes(String(n.id)) && (!n.title || !deleted.includes(n.title)));
  setPersistedData('notifications', localList);

  if (supabase) {
    try {
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map(item => {
          const matchedLocal = (localList || []).find(l => String(l.id) === String(item.id)) || {};
          return {
            ...matchedLocal,
            ...item,
            id: item.id,
            title: item.title,
            content: item.content || matchedLocal.content || '',
            target_scope: item.target_scope || matchedLocal.target_scope || 'Tất cả 30 Chi đoàn Ấp',
            priority: item.priority || matchedLocal.priority || item.type || 'Bình thường',
            type: item.type || matchedLocal.type || 'general',
            time_ago: item.time_ago || matchedLocal.time_ago || 'Vừa xong',
            createdAt: item.created_at ? new Date(item.created_at).getTime() : (matchedLocal.createdAt || Date.now()),
            confirmedBy: item.confirmedBy || matchedLocal.confirmedBy || [],
            activity_details: item.activity_details || matchedLocal.activity_details || null,
            sender: item.sender || matchedLocal.sender || 'Ban Thường vụ Đoàn xã Xuân Thới Sơn'
          };
        });
        const cleanCombined = mapped.filter(n => n && !deleted.includes(String(n.id)) && (!n.title || !deleted.includes(n.title)));
        const sorted = sortNotificationsByPriority(cleanCombined);
        setPersistedData('notifications', sorted);
        return sorted;
      }
    } catch (e) {
      console.warn('Supabase fetch notifications error, using local storage fallback:', e);
    }
  }
  return sortNotificationsByPriority(localList);
}

export async function syncSaveNotification(notiItem) {
  const current = getPersistedData('notifications', INITIAL_NOTIFICATIONS);
  const newItem = {
    ...notiItem,
    priority: notiItem.priority || 'Bình thường',
    createdAt: notiItem.createdAt || Date.now()
  };
  const exists = current.some(item => item.id === newItem.id);
  const updatedRaw = exists
    ? current.map(item => item.id === newItem.id ? { ...item, ...newItem } : item)
    : [newItem, ...current];

  const seen = new Set();
  const cleanList = updatedRaw.filter(item => {
    if (item && item.id) {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
    }
    return true;
  });

  const updatedLocal = sortNotificationsByPriority(cleanList);
  setPersistedData('notifications', updatedLocal);
  notifySyncEvent('SAVE_NOTIFICATION', newItem);

  if (supabase) {
    try {
      const { data, error } = await supabase.from('notifications').insert([{
        title: newItem.title,
        content: newItem.content || '',
        type: newItem.type || 'general',
        time_ago: newItem.time_ago || 'Vừa xong',
        priority: newItem.priority || 'Bình thường',
        target_scope: newItem.target_scope || 'Tất cả 30 Chi đoàn Ấp'
      }]).select();

      if (error) {
        console.error('Supabase error inserting notification:', error);
      } else {
        console.log('Supabase notification inserted successfully:', data);
      }
    } catch (e) {
      console.error('Supabase save notification exception:', e);
    }
    return await syncFetchNotifications();
  }
  return updatedLocal;
}

export async function syncUpdateNotification(updatedNoti) {
  const current = getPersistedData('notifications', INITIAL_NOTIFICATIONS);
  const updatedLocal = sortNotificationsByPriority(
    current.map(n => n.id === updatedNoti.id ? { ...n, ...updatedNoti } : n)
  );
  setPersistedData('notifications', updatedLocal);
  notifySyncEvent('UPDATE_NOTIFICATION', updatedNoti);

  if (supabase) {
    try {
      await supabase.from('notifications').update({
        title: updatedNoti.title,
        content: updatedNoti.content || '',
        priority: updatedNoti.priority || 'Bình thường',
        target_scope: updatedNoti.target_scope || 'Tất cả 30 Chi đoàn Ấp'
      }).eq('id', updatedNoti.id);
    } catch (e) {
      console.error('Supabase update notification exception:', e);
    }
    return await syncFetchNotifications();
  }
  return updatedLocal;
}

export async function syncDeleteNotification(notificationId, notificationTitle = '') {
  addDeletedItem('notifications', notificationId, notificationTitle);
  const deleted = getDeletedItems('notifications');

  const current = getPersistedData('notifications', []);
  const updatedLocal = current.filter(n => n && !deleted.includes(String(n.id)) && (!notificationTitle || n.title !== notificationTitle));
  setPersistedData('notifications', updatedLocal);
  notifySyncEvent('DELETE_NOTIFICATION', { notificationId, notificationTitle });

  if (supabase) {
    try {
      await supabase.from('notifications').delete().eq('id', notificationId);
      if (notificationTitle) {
        await supabase.from('notifications').delete().eq('title', notificationTitle);
      }
    } catch (e) {
      console.error('Supabase delete notification exception:', e);
    }
    const fetched = await syncFetchNotifications();
    return fetched.filter(n => n && !deleted.includes(String(n.id)) && (!notificationTitle || n.title !== notificationTitle));
  }
  return updatedLocal;
}

// ============================================================================
// 5. TASKS SYNC (BẢNG CÔNG VIỆC / TODO LIST)
// ============================================================================
export async function syncFetchTasks() {
  const deleted = getDeletedItems('tasks');
  let localList = getPersistedData('tasks', null);
  if (localList === null) {
    localList = INITIAL_TASKS;
  }
  localList = (localList || []).filter(t => t && !deleted.includes(String(t.id)) && (!t.title || !deleted.includes(t.title)));
  setPersistedData('tasks', localList);

  if (supabase) {
    try {
      const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map(item => {
          const matchedLocal = (localList || []).find(l => String(l.id) === String(item.id)) || {};
          return {
            ...matchedLocal,
            ...item,
            id: item.id,
            title: item.title,
            status: item.status === 'in_progress' ? 'inProgress' : item.status || 'todo',
            priority: item.priority === 'high' ? 'Cao' : item.priority === 'medium' ? 'Trung bình' : (item.priority || 'Bình thường'),
            dueDate: item.due_date || matchedLocal.dueDate || 'Hôm nay',
            assigned_to: item.assigned_to || matchedLocal.assigned_to || 'Đoàn xã',
            confirmedBy: item.confirmedBy || matchedLocal.confirmedBy || []
          };
        });
        const seen = new Set();
        const clean = mapped.filter(t => {
          if (!t || !t.id || seen.has(t.id)) return false;
          if (deleted.includes(String(t.id)) || (t.title && deleted.includes(t.title))) return false;
          seen.add(t.id);
          return true;
        });
        setPersistedData('tasks', clean);
        return clean;
      }
    } catch (e) {
      console.warn('Supabase fetch tasks error, using local storage fallback:', e);
    }
  }
  return localList;
}

export async function syncSaveTask(taskItem) {
  const current = getPersistedData('tasks', []);
  const exists = current.some(item => String(item.id) === String(taskItem.id));
  const updatedLocal = exists
    ? current.map(item => String(item.id) === String(taskItem.id) ? { ...item, ...taskItem } : item)
    : [taskItem, ...current];

  setPersistedData('tasks', updatedLocal);
  notifySyncEvent('SAVE_TASK', taskItem);

  if (supabase) {
    try {
      let validTaskStatus = 'todo';
      if (taskItem.status === 'inProgress' || taskItem.status === 'in_progress') validTaskStatus = 'in_progress';
      else if (taskItem.status === 'completed') validTaskStatus = 'completed';

      let validPriority = 'medium';
      if (taskItem.priority === 'Cao' || taskItem.priority === 'high') validPriority = 'high';
      else if (taskItem.priority === 'Thấp' || taskItem.priority === 'low') validPriority = 'low';

      const payload = {
        title: taskItem.title,
        status: validTaskStatus,
        priority: validPriority,
        due_date: new Date().toISOString().split('T')[0],
        assigned_to: taskItem.assigned_to || 'Đoàn xã'
      };

      if (exists) {
        await supabase.from('tasks').update(payload).eq('id', taskItem.id);
      } else {
        await supabase.from('tasks').insert([payload]);
      }
    } catch (e) {
      console.error('Supabase save task exception:', e);
    }
    return await syncFetchTasks();
  }
  return updatedLocal;
}

export async function syncToggleTaskStatus(taskId, newStatus) {
  const current = getPersistedData('tasks', []);
  const updatedLocal = current.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
  setPersistedData('tasks', updatedLocal);
  notifySyncEvent('TOGGLE_TASK', { taskId, newStatus });

  if (supabase) {
    try {
      let validTaskStatus = 'todo';
      if (newStatus === 'inProgress' || newStatus === 'in_progress') validTaskStatus = 'in_progress';
      else if (newStatus === 'completed') validTaskStatus = 'completed';

      await supabase.from('tasks').update({ status: validTaskStatus }).eq('id', taskId);
    } catch (e) {
      console.error('Supabase toggle task exception:', e);
    }
    return await syncFetchTasks();
  }
  return updatedLocal;
}

export async function syncDeleteTask(taskId) {
  const current = getPersistedData('tasks', []);
  const updatedLocal = current.filter(t => t.id !== taskId);
  setPersistedData('tasks', updatedLocal);
  notifySyncEvent('DELETE_TASK', { taskId });

  if (supabase) {
    try {
      await supabase.from('tasks').delete().eq('id', taskId);
    } catch (e) {
      console.error('Supabase delete task error:', e);
    }
    return await syncFetchTasks();
  }
  return updatedLocal;
}

// ============================================================================
// 6. ATTENDANCE & EVALUATION RATING HELPERS FOR 30 HAMLET BRANCHES
// ============================================================================

export function getBranchClusterName(branchName) {
  if (!branchName || typeof branchName !== 'string') return 'Chưa phân cụm';
  const cleanName = branchName.replace('Chi đoàn Ấp ', '');
  const cluster = COMPETITION_CLUSTERS.find(c =>
    c.branches && c.branches.some(b => typeof b === 'string' && (b === branchName || b.includes(cleanName)))
  );
  return cluster ? cluster.name : 'Chưa phân cụm';
}

export function calculateBranchRating(percentage) {
  if (percentage >= 90) {
    return {
      label: 'Hoàn thành xuất sắc nhiệm vụ',
      badgeClass: 'bg-success text-white',
      borderClass: 'border-success',
      bgSubtle: 'bg-success-subtle text-success',
      icon: '🌟',
      color: '#16A34A'
    };
  }
  if (percentage >= 80) {
    return {
      label: 'Hoàn thành tốt nhiệm vụ',
      badgeClass: 'bg-primary text-white',
      borderClass: 'border-primary',
      bgSubtle: 'bg-primary-subtle text-primary',
      icon: '💙',
      color: '#2563EB'
    };
  }
  if (percentage >= 50) {
    return {
      label: 'Hoàn thành nhiệm vụ',
      badgeClass: 'bg-warning text-dark',
      borderClass: 'border-warning',
      bgSubtle: 'bg-warning-subtle text-warning-emphasis',
      icon: '🟡',
      color: '#D97706'
    };
  }
  return {
    label: 'Không hoàn thành nhiệm vụ',
    badgeClass: 'bg-danger text-white',
    borderClass: 'border-danger',
    bgSubtle: 'bg-danger-subtle text-danger',
    icon: '🔴',
    color: '#DC2626'
  };
}

export async function syncFetchAttendance() {
  return getPersistedData('attendance_records', {});
}

export async function syncSaveAttendance(activityId, recordData) {
  const current = getPersistedData('attendance_records', {});
  const updated = {
    ...current,
    [activityId]: recordData
  };
  setPersistedData('attendance_records', updated);
  return updated;
}

// ============================================================================
// MEMBERS SYNC (BẢNG QUẢN LÝ ĐOÀN VIÊN 30 CHI ĐOÀN ẤP)
// ============================================================================
export async function syncFetchMembers() {
  const deletedItems = getDeletedItems('members');
  let localList = getPersistedData('members', null);
  if (localList === null) {
    localList = INITIAL_MEMBERS;
  }

  let filteredLocal = (localList || []).filter(item =>
    !deletedItems.includes(String(item.id)) &&
    !deletedItems.includes(String(item.full_name)) &&
    !deletedItems.includes(String(item.name))
  );

  if (supabase) {
    try {
      const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const filteredSupabase = data.filter(item =>
          !deletedItems.includes(String(item.id)) &&
          !deletedItems.includes(String(item.full_name)) &&
          !deletedItems.includes(String(item.name))
        );
        setPersistedData('members', filteredSupabase);
        return filteredSupabase;
      }
    } catch (e) {
      console.warn('Supabase fetch members error, using local fallback:', e);
    }
  }

  setPersistedData('members', filteredLocal);
  return filteredLocal;
}

export async function syncSaveMember(memberItem) {
  const current = getPersistedData('members', INITIAL_MEMBERS);
  const deletedItems = getDeletedItems('members');
  const updatedDeleted = deletedItems.filter(d =>
    d !== String(memberItem.id) &&
    d !== String(memberItem.full_name) &&
    d !== String(memberItem.name)
  );
  try {
    localStorage.setItem('xts_deleted_members', JSON.stringify(updatedDeleted));
  } catch (e) { }

  const exists = current.some(item => String(item.id) === String(memberItem.id));
  const updated = exists
    ? current.map(item => String(item.id) === String(memberItem.id) ? { ...item, ...memberItem } : item)
    : [memberItem, ...current];

  setPersistedData('members', updated);
  notifySyncEvent('SAVE_MEMBER', memberItem);

  if (supabase) {
    try {
      await supabase.from('members').upsert([memberItem]);
    } catch (e) {
      console.warn('Supabase save member error:', e);
    }
  }
  return updated;
}

export async function syncDeleteMember(memberId, memberName = '') {
  addDeletedItem('members', memberId, memberName);
  const current = getPersistedData('members', INITIAL_MEMBERS);
  const updated = current.filter(item =>
    String(item.id) !== String(memberId) &&
    (memberName ? item.full_name !== memberName && item.name !== memberName : true)
  );
  setPersistedData('members', updated);
  notifySyncEvent('DELETE_MEMBER', { id: memberId, name: memberName });

  if (supabase) {
    try {
      await supabase.from('members').delete().eq('id', memberId);
    } catch (e) {
      console.warn('Supabase delete member error:', e);
    }
  }
  return updated;
}

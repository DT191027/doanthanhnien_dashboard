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

// Official 30 Hamlets (Ấp) sorted by Official 2026 Competition Clusters (Cụm 1 - Cụm 6)
export const OFFICIAL_HAMLETS = [
  // Cụm thi đua số 1
  { code: 'MH4', name: 'Ấp Mỹ Hoà 4', email: 'apmyhoa4@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 1', role: 'Cụm trưởng' },
  { code: 'MH2', name: 'Ấp Mỹ Hoà 2', email: 'apmyhoa2@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 1', role: 'Cụm phó' },
  { code: 'MH3', name: 'Ấp Mỹ Hoà 3', email: 'apmyhoa3@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 1', role: 'Thành viên' },
  { code: 'MH5', name: 'Ấp Mỹ Hoà 5', email: 'apmyhoa5@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 1', role: 'Thành viên' },
  { code: 'TT', name: 'Ấp Tân Tiến', email: 'aptantien@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 1', role: 'Thành viên' },

  // Cụm thi đua số 2
  { code: 'XTD2', name: 'Ấp Xuân Thới Đông 2', email: 'apxuanthoidong2@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 2', role: 'Cụm trưởng' },
  { code: 'XTD', name: 'Ấp Xuân Thới Đông', email: 'apxuanthoidong@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 2', role: 'Cụm phó' },
  { code: 'XTD1', name: 'Ấp Xuân Thới Đông 1', email: 'apxuanthoidong1@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 2', role: 'Thành viên' },
  { code: 'XTD3', name: 'Ấp Xuân Thới Đông 3', email: 'apxuanthoidong3@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 2', role: 'Thành viên' },
  { code: 'BM', name: 'Ấp Bùi Môn', email: 'apbuimon@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 2', role: 'Thành viên' },

  // Cụm thi đua số 3
  { code: 'NX1', name: 'Ấp Nam Xuân 1', email: 'apnamxuan1@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 3', role: 'Cụm trưởng' },
  { code: 'XTD5', name: 'Ấp Xuân Thới Đông 5', email: 'apxuanthoidong5@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 3', role: 'Cụm phó' },
  { code: 'NX', name: 'Ấp Nam Xuân', email: 'apnamxuan@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 3', role: 'Thành viên' },
  { code: 'NX2', name: 'Ấp Nam Xuân 2', email: 'apnamxuan2@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 3', role: 'Thành viên' },
  { code: 'XTD4', name: 'Ấp Xuân Thới Đông 4', email: 'apxuanthoidong4@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 3', role: 'Thành viên' },

  // Cụm thi đua số 4
  { code: 'XT1', name: 'Ấp Xuân Thới 1', email: 'apxuanthoi1@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 4', role: 'Cụm trưởng' },
  { code: 'TS', name: 'Ấp Thới Sơn', email: 'apthoison@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 4', role: 'Cụm phó' },
  { code: 'XT', name: 'Ấp Xuân Thới', email: 'apxuanthoi@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 4', role: 'Thành viên' },
  { code: 'XT2', name: 'Ấp Xuân Thới 2', email: 'apxuanthoi2@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 4', role: 'Thành viên' },
  { code: 'NT3', name: 'Ấp Nhị Tân 3', email: 'apnhitan3@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 4', role: 'Thành viên' },

  // Cụm thi đua số 5
  { code: 'NT1', name: 'Ấp Nhị Tân 1', email: 'apnhitan1@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 5', role: 'Cụm trưởng' },
  { code: 'DT', name: 'Ấp Dân Thắng', email: 'apdanthang@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 5', role: 'Cụm phó' },
  { code: 'TTN', name: 'Ấp Tân Thới Nhì', email: 'aptanthoinhi@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 5', role: 'Thành viên' },
  { code: 'TN1', name: 'Ấp Thống Nhất 1', email: 'apthongnhat1@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 5', role: 'Thành viên' },
  { code: 'TN2', name: 'Ấp Thống Nhất 2', email: 'apthongnhat2@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 5', role: 'Thành viên' },

  // Cụm thi đua số 6
  { code: 'TL', name: 'Ấp Tân Lập', email: 'aptanlap@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 6', role: 'Cụm trưởng' },
  { code: 'NXX', name: 'Ấp Nhị Xuân', email: 'apnhixuan@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 6', role: 'Cụm phó' },
  { code: 'NT2', name: 'Ấp Nhị Tân 2', email: 'apnhitan2@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 6', role: 'Thành viên' },
  { code: 'NXX1', name: 'Ấp Nhị Xuân 1', email: 'apnhixuan1@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 6', role: 'Thành viên' },
  { code: 'NT', name: 'Ấp Nhị Tân', email: 'apnhitan@xuanthoison.gov.vn', cluster: 'Cụm thi đua số 6', role: 'Thành viên' }
];

export const INITIAL_BRANCHES = OFFICIAL_HAMLETS.map((h, i) => ({
  id: `ap-${i + 1}`,
  code: h.code,
  name: `Chi đoàn ${h.name}`,
  secretary_name: `Bí thư Chi đoàn ${h.name}`,
  email: h.email,
  member_count: 0,
  cluster_name: h.cluster,
  cluster_role: h.role
}));

// Additional School & Unit Branches (Cụm 7 - Cụm 12) - 26 đơn vị
export const SCHOOL_BRANCHES = [
  // Cụm 7: Mầm non (5 đơn vị)
  { id: 'truong-1', name: 'Chi đoàn MN Cúc Họa Mi', email: 'mncuchoami@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn MN Cúc Họa Mi', member_count: 0, cluster_name: 'Cụm thi đua số 7', cluster_role: 'Cụm trưởng' },
  { id: 'truong-2', name: 'Chi đoàn MN Xuân Thới Đông', email: 'mnxuanthoidong@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn MN Xuân Thới Đông', member_count: 0, cluster_name: 'Cụm thi đua số 7', cluster_role: 'Cụm phó' },
  { id: 'truong-3', name: 'Chi đoàn MN Hướng Dương', email: 'mnhuongduong@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn MN Hướng Dương', member_count: 0, cluster_name: 'Cụm thi đua số 7', cluster_role: 'Thành viên' },
  { id: 'truong-4', name: 'Chi đoàn MN Nhị Xuân', email: 'mnnhixuan@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn MN Nhị Xuân', member_count: 0, cluster_name: 'Cụm thi đua số 7', cluster_role: 'Thành viên' },
  { id: 'truong-5', name: 'Chi đoàn MN 19/8', email: 'mn198@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn MN 19/8', member_count: 0, cluster_name: 'Cụm thi đua số 7', cluster_role: 'Thành viên' },

  // Cụm 8: Tiểu học & Giáo viên (8 đơn vị)
  { id: 'truong-6', name: 'Chi đoàn TH Nhị Tân', email: 'thnhitan@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn TH Nhị Tân', member_count: 0, cluster_name: 'Cụm thi đua số 8', cluster_role: 'Cụm trưởng' },
  { id: 'truong-7', name: 'Chi đoàn GV THPT Phạm Văn Sáng', email: 'cdgvthptphamvansang@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn GV THPT Phạm Văn Sáng', member_count: 0, cluster_name: 'Cụm thi đua số 8', cluster_role: 'Cụm phó' },
  { id: 'truong-8', name: 'Chi đoàn TH Nhị Xuân', email: 'thnhixuan@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn TH Nhị Xuân', member_count: 0, cluster_name: 'Cụm thi đua số 8', cluster_role: 'Thành viên' },
  { id: 'truong-9', name: 'Chi đoàn TH Trần Văn Mười', email: 'thtranvanmuoi@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn TH Trần Văn Mười', member_count: 0, cluster_name: 'Cụm thi đua số 8', cluster_role: 'Thành viên' },
  { id: 'truong-10', name: 'Chi đoàn GV Trung tâm GDNN - GDTX Hóc Môn', email: 'cdgvgdnngdtxhocmon@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn GV TT GDNN - GDTX Hóc Môn', member_count: 0, cluster_name: 'Cụm thi đua số 8', cluster_role: 'Thành viên' },
  { id: 'truong-11', name: 'Chi đoàn TH Lý Chính Thắng 2', email: 'thlychinhthang2@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn TH Lý Chính Thắng 2', member_count: 0, cluster_name: 'Cụm thi đua số 8', cluster_role: 'Thành viên' },
  { id: 'truong-12', name: 'Chi đoàn TH Lê Văn Phiên', email: 'thlevanphien@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn TH Lê Văn Phiên', member_count: 0, cluster_name: 'Cụm thi đua số 8', cluster_role: 'Thành viên' },
  { id: 'truong-13', name: 'Chi đoàn TH Dương Công Khi', email: 'thduongcongkhi@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn TH Dương Công Khi', member_count: 0, cluster_name: 'Cụm thi đua số 8', cluster_role: 'Thành viên' },

  // Cụm 9: THCS (4 đơn vị)
  { id: 'truong-14', name: 'Chi đoàn THCS Nguyễn Hồng Đào', email: 'thcsnguyenhongdao@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn THCS Nguyễn Hồng Đào', member_count: 0, cluster_name: 'Cụm thi đua số 9', cluster_role: 'Cụm trưởng' },
  { id: 'truong-15', name: 'Chi đoàn THCS Võ Văn Tần', email: 'thcsvovantan@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn THCS Võ Văn Tần', member_count: 0, cluster_name: 'Cụm thi đua số 9', cluster_role: 'Thành viên' },
  { id: 'truong-16', name: 'Chi đoàn THCS Tân Xuân', email: 'thcstanxuan@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn THCS Tân Xuân', member_count: 0, cluster_name: 'Cụm thi đua số 9', cluster_role: 'Thành viên' },
  { id: 'truong-17', name: 'Chi đoàn TiH - THCS Tạ Uyên', email: 'tihthcstauyen@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn TiH - THCS Tạ Uyên', member_count: 0, cluster_name: 'Cụm thi đua số 9', cluster_role: 'Thành viên' },

  // Cụm 10: Đoàn trường (3 đơn vị)
  { id: 'truong-18', name: 'Đoàn trường Trung tâm GDNN - GDTX Hóc Môn', email: 'gdnngdtxhocmon@xuanthoison.gov.vn', secretary_name: 'Bí thư Đoàn trường TT GDNN - GDTX', member_count: 0, cluster_name: 'Cụm thi đua số 10', cluster_role: 'Cụm trưởng' },
  { id: 'truong-19', name: 'Đoàn trường THPT Phạm Văn Sáng', email: 'thptphamvansang@xuanthoison.gov.vn', secretary_name: 'Bí thư Đoàn trường THPT Phạm Văn Sáng', member_count: 0, cluster_name: 'Cụm thi đua số 10', cluster_role: 'Thành viên' },
  { id: 'truong-20', name: 'Đoàn trường Tre Việt', email: 'treviet@xuanthoison.gov.vn', secretary_name: 'Bí thư Đoàn trường Tre Việt', member_count: 0, cluster_name: 'Cụm thi đua số 10', cluster_role: 'Thành viên' },

  // Cụm 11: Doanh nghiệp, Ngoài công lập (4 đơn vị)
  { id: 'truong-21', name: 'Chi đoàn Thép Việt', email: 'thepviet@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn Thép Việt', member_count: 0, cluster_name: 'Cụm thi đua số 11', cluster_role: 'Cụm trưởng' },
  { id: 'truong-22', name: 'Chi đoàn Mẫu giáo Bút chì Màu', email: 'mgbutchimau@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn MG Bút chì Màu', member_count: 0, cluster_name: 'Cụm thi đua số 11', cluster_role: 'Thành viên' },
  { id: 'truong-23', name: 'Chi đoàn lớp MN Độc lập Hoa Lài', email: 'mnhoalai@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn MN Độc lập Hoa Lài', member_count: 0, cluster_name: 'Cụm thi đua số 11', cluster_role: 'Thành viên' },
  { id: 'truong-24', name: 'Chi đoàn Cty Sambu Vina Sports', email: 'sambuvinasports@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn Sambu Vina Sports', member_count: 0, cluster_name: 'Cụm thi đua số 11', cluster_role: 'Thành viên' },

  // Cụm 12: Lực lượng vũ trang & Cơ quan (2 đơn vị - tổng đúng 56 chi đoàn)
  { id: 'truong-25', name: 'Chi đoàn Công an', email: 'congan@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn Công an', member_count: 0, cluster_name: 'Cụm thi đua số 12', cluster_role: 'Cụm trưởng' },
  { id: 'truong-26', name: 'Chi đoàn Trạm Y tế xã', email: 'tramytexa@xuanthoison.gov.vn', secretary_name: 'Bí thư Chi đoàn Trạm Y tế xã', member_count: 0, cluster_name: 'Cụm thi đua số 12', cluster_role: 'Thành viên' }
];

export const ALL_BRANCHES = [...INITIAL_BRANCHES, ...SCHOOL_BRANCHES];

// Official 12 Competition Clusters (Cụm thi đua số 1 - số 12) theo Quyết định phân công năm 2026
export const COMPETITION_CLUSTERS = [
  {
    id: 'cum-1',
    name: 'Cụm thi đua số 1',
    label: 'Cụm thi đua số 1 (Mỹ Hoà 4, Mỹ Hoà 2, Mỹ Hoà 3, Mỹ Hoà 5, Tân Tiến)',
    lead: 'Chi đoàn Ấp Mỹ Hoà 4',
    deputy: 'Chi đoàn Ấp Mỹ Hoà 2',
    branches: ['Chi đoàn Ấp Mỹ Hoà 4', 'Chi đoàn Ấp Mỹ Hoà 2', 'Chi đoàn Ấp Mỹ Hoà 3', 'Chi đoàn Ấp Mỹ Hoà 5', 'Chi đoàn Ấp Tân Tiến']
  },
  {
    id: 'cum-2',
    name: 'Cụm thi đua số 2',
    label: 'Cụm thi đua số 2 (Xuân Thới Đông 2, Xuân Thới Đông, Xuân Thới Đông 1, Xuân Thới Đông 3, Bàu Môn)',
    lead: 'Chi đoàn Ấp Xuân Thới Đông 2',
    deputy: 'Chi đoàn Ấp Xuân Thới Đông',
    branches: ['Chi đoàn Ấp Xuân Thới Đông 2', 'Chi đoàn Ấp Xuân Thới Đông', 'Chi đoàn Ấp Xuân Thới Đông 1', 'Chi đoàn Ấp Xuân Thới Đông 3', 'Chi đoàn Ấp Bùi Môn']
  },
  {
    id: 'cum-3',
    name: 'Cụm thi đua số 3',
    label: 'Cụm thi đua số 3 (Nam Xuân 1, Xuân Thới Đông 5, Nam Xuân, Nam Xuân 2, Xuân Thới Đông 4)',
    lead: 'Chi đoàn Ấp Nam Xuân 1',
    deputy: 'Chi đoàn Ấp Xuân Thới Đông 5',
    branches: ['Chi đoàn Ấp Nam Xuân 1', 'Chi đoàn Ấp Xuân Thới Đông 5', 'Chi đoàn Ấp Nam Xuân', 'Chi đoàn Ấp Nam Xuân 2', 'Chi đoàn Ấp Xuân Thới Đông 4']
  },
  {
    id: 'cum-4',
    name: 'Cụm thi đua số 4',
    label: 'Cụm thi đua số 4 (Xuân Thới 1, Thới Sơn, Xuân Thới, Xuân Thới 2, Nhị Tân 3)',
    lead: 'Chi đoàn Ấp Xuân Thới 1',
    deputy: 'Chi đoàn Ấp Thới Sơn',
    branches: ['Chi đoàn Ấp Xuân Thới 1', 'Chi đoàn Ấp Thới Sơn', 'Chi đoàn Ấp Xuân Thới', 'Chi đoàn Ấp Xuân Thới 2', 'Chi đoàn Ấp Nhị Tân 3']
  },
  {
    id: 'cum-5',
    name: 'Cụm thi đua số 5',
    label: 'Cụm thi đua số 5 (Nhị Tân 1, Dân Thắng, Tân Thới Nhì, Thống Nhất 1, Thống Nhất 2)',
    lead: 'Chi đoàn Ấp Nhị Tân 1',
    deputy: 'Chi đoàn Ấp Dân Thắng',
    branches: ['Chi đoàn Ấp Nhị Tân 1', 'Chi đoàn Ấp Dân Thắng', 'Chi đoàn Ấp Tân Thới Nhì', 'Chi đoàn Ấp Thống Nhất 1', 'Chi đoàn Ấp Thống Nhất 2']
  },
  {
    id: 'cum-6',
    name: 'Cụm thi đua số 6',
    label: 'Cụm thi đua số 6 (Tân Lập, Nhị Xuân, Nhị Tân 2, Nhị Xuân 1, Nhị Tân)',
    lead: 'Chi đoàn Ấp Tân Lập',
    deputy: 'Chi đoàn Ấp Nhị Xuân',
    branches: ['Chi đoàn Ấp Tân Lập', 'Chi đoàn Ấp Nhị Xuân', 'Chi đoàn Ấp Nhị Tân 2', 'Chi đoàn Ấp Nhị Xuân 1', 'Chi đoàn Ấp Nhị Tân']
  },
  {
    id: 'cum-7',
    name: 'Cụm thi đua số 7',
    label: 'Cụm thi đua số 7 (MN Cúc Họa Mi, MN Xuân Thới Đông, MN Hướng Dương, MN Nhị Xuân, MN 19/8)',
    lead: 'Chi đoàn MN Cúc Họa Mi',
    deputy: 'Chi đoàn MN Xuân Thới Đông',
    branches: ['Chi đoàn MN Cúc Họa Mi', 'Chi đoàn MN Xuân Thới Đông', 'Chi đoàn MN Hướng Dương', 'Chi đoàn MN Nhị Xuân', 'Chi đoàn MN 19/8']
  },
  {
    id: 'cum-8',
    name: 'Cụm thi đua số 8',
    label: 'Cụm thi đua số 8 (TH Nhị Tân, GV THPT Phạm Văn Sáng, TH Nhị Xuân, TH Trần Văn Mười, GV GDNN-GDTX...)',
    lead: 'Chi đoàn TH Nhị Tân',
    deputy: 'Chi đoàn GV THPT Phạm Văn Sáng',
    branches: [
      'Chi đoàn TH Nhị Tân',
      'Chi đoàn GV THPT Phạm Văn Sáng',
      'Chi đoàn TH Nhị Xuân',
      'Chi đoàn TH Trần Văn Mười',
      'Chi đoàn GV Trung tâm GDNN - GDTX Hóc Môn',
      'Chi đoàn TH Lý Chính Thắng 2',
      'Chi đoàn TH Lê Văn Phiên',
      'Chi đoàn TH Dương Công Khi'
    ]
  },
  {
    id: 'cum-9',
    name: 'Cụm thi đua số 9',
    label: 'Cụm thi đua số 9 (THCS Nguyễn Hồng Đào, THCS Võ Văn Tần, THCS Tân Xuân, TiH - THCS Tạ Uyên)',
    lead: 'Chi đoàn THCS Nguyễn Hồng Đào',
    deputy: '',
    branches: [
      'Chi đoàn THCS Nguyễn Hồng Đào',
      'Chi đoàn THCS Võ Văn Tần',
      'Chi đoàn THCS Tân Xuân',
      'Chi đoàn TiH - THCS Tạ Uyên'
    ]
  },
  {
    id: 'cum-10',
    name: 'Cụm thi đua số 10',
    label: 'Cụm thi đua số 10 (Đoàn trường TT GDNN - GDTX Hóc Môn, THPT Phạm Văn Sáng, Tre Việt)',
    lead: 'Đoàn trường Trung tâm GDNN - GDTX Hóc Môn',
    deputy: '',
    branches: [
      'Đoàn trường Trung tâm GDNN - GDTX Hóc Môn',
      'Đoàn trường THPT Phạm Văn Sáng',
      'Đoàn trường Tre Việt'
    ]
  },
  {
    id: 'cum-11',
    name: 'Cụm thi đua số 11',
    label: 'Cụm thi đua số 11 (Chi đoàn Thép Việt, MG Bút chì Màu, MN Hoa Lài, Sambu Vina Sports)',
    lead: 'Chi đoàn Thép Việt',
    deputy: '',
    branches: [
      'Chi đoàn Thép Việt',
      'Chi đoàn Mẫu giáo Bút chì Màu',
      'Chi đoàn lớp MN Độc lập Hoa Lài',
      'Chi đoàn Cty Sambu Vina Sports'
    ]
  },
  {
    id: 'cum-12',
    name: 'Cụm thi đua số 12',
    label: 'Cụm thi đua số 12 (Chi đoàn Công an, Trạm Y tế xã, Quân sự xã Xuân Thới Sơn)',
    lead: 'Chi đoàn Công an',
    deputy: '',
    branches: [
      'Chi đoàn Công an',
      'Chi đoàn Trạm Y tế xã',
      'Chi đoàn cơ sở Quân sự xã Xuân Thới Sơn',
      'Chi đoàn UBND xã'
    ]
  }
];

// All Accounts use the official Youth Union logo for avatars!

// 4 Target Scope Blocks for dispatching documents & notifications
export const TARGET_BLOCKS = [
  {
    id: 'BLOCK_RESIDENTIAL',
    name: 'Khối Địa bàn Dân cư (30 Chi đoàn Ấp)',
    shortName: 'Khối Địa bàn Dân cư',
    scopeValue: 'Khối Địa bàn Dân cư (30 Chi đoàn Ấp)',
    icon: '🏘️',
    badge: '30 Chi đoàn Ấp',
    desc: '30 Chi đoàn Ấp trên địa bàn dân cư (Cụm thi đua số 1 đến Cụm thi đua số 6)',
    clusterIds: ['cum-1', 'cum-2', 'cum-3', 'cum-4', 'cum-5', 'cum-6']
  },
  {
    id: 'BLOCK_SCHOOL',
    name: 'Khối Trường học (Cấp 3, Cấp 2, Tiểu học, Mầm non)',
    shortName: 'Khối Trường học',
    scopeValue: 'Khối Trường học (Cấp 3, Cấp 2, Tiểu học, Mầm non)',
    icon: '🏫',
    badge: 'Trường học & GDNN',
    desc: 'Các trường THPT, TT GDNN - GDTX, THCS, Tiểu học và Mầm non (Cụm thi đua 7, 8, 9, 10)',
    clusterIds: ['cum-7', 'cum-8', 'cum-9', 'cum-10']
  },
  {
    id: 'BLOCK_ENTERPRISE',
    name: 'Khối Ngoài nhà nước (Doanh nghiệp, Công ty)',
    shortName: 'Khối Ngoài nhà nước',
    scopeValue: 'Khối Ngoài nhà nước (Doanh nghiệp, Công ty)',
    icon: '🏢',
    badge: 'DN & Ngoài NN',
    desc: 'Các công ty, doanh nghiệp ngoài nhà nước và cơ sở MN ngoài công lập (Cụm thi đua 11)',
    clusterIds: ['cum-11']
  },
  {
    id: 'BLOCK_ARMED_FORCES',
    name: 'Khối Lực lượng vũ trang & Cơ quan',
    shortName: 'Khối LLVT & Cơ quan',
    scopeValue: 'Khối Lực lượng vũ trang & Cơ quan',
    icon: '🛡️',
    badge: 'LLVT & Cơ quan',
    desc: 'Chi đoàn Công an, Quân sự, Trạm Y tế, Chi đoàn UBND xã (Cụm thi đua 12)',
    clusterIds: ['cum-12']
  },
  {
    id: 'BLOCK_ALL',
    name: 'Tất cả 56 Chi đoàn / Đơn vị',
    shortName: 'Tất cả 56 Chi đoàn',
    scopeValue: 'Tất cả 56 Chi đoàn / Đơn vị',
    icon: '📢',
    badge: 'Toàn xã (56 đơn vị)',
    desc: 'Toàn bộ 56 Chi đoàn, Đoàn trường & Đơn vị trực thuộc Đoàn xã Xuân Thới Sơn',
    clusterIds: ['cum-1', 'cum-2', 'cum-3', 'cum-4', 'cum-5', 'cum-6', 'cum-7', 'cum-8', 'cum-9', 'cum-10', 'cum-11', 'cum-12']
  }
];

export function getBranchesForBlock(blockKey) {
  const block = TARGET_BLOCKS.find(b => b.id === blockKey || b.name === blockKey || b.scopeValue === blockKey || b.shortName === blockKey);
  if (!block) return [];
  if (block.id === 'BLOCK_ALL') return ALL_BRANCHES.map(b => b.name);
  const matchedClusters = COMPETITION_CLUSTERS.filter(c => block.clusterIds.includes(c.id));
  const result = [];
  matchedClusters.forEach(c => {
    (c.branches || []).forEach(b => {
      if (!result.includes(b)) result.push(b);
    });
  });
  return result;
}

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
export const INITIAL_ACTIVITIES = [];

// Seed Youth Members Dataset (Đã làm sạch toàn bộ dữ liệu ảo theo yêu cầu)
export const INITIAL_MEMBERS = [];

export const INITIAL_DOCUMENTS = [];
export const INITIAL_DOCUMENTS_DOAN_XA = [];
export const INITIAL_DOCUMENTS_CHI_DOAN = [];
export const INITIAL_SUBMISSION_HISTORY = [];
export const INITIAL_REQUIRED_SUBMISSIONS = [];
export const INITIAL_NOTIFICATIONS = [];

export const INITIAL_TASKS = [];

export const INITIAL_TASKS_DOAN_XA = {
  todo: [],
  inProgress: [],
  completed: []
};

export const INITIAL_TASKS_CHI_DOAN = [];

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
  if (dayOrObj instanceof Date) {
    const d = String(dayOrObj.getDate()).padStart(2, '0');
    const m = String(dayOrObj.getMonth() + 1).padStart(2, '0');
    const y = dayOrObj.getFullYear();
    return `${d}/${m}/${y}`;
  }

  if (!dayOrObj && !month) {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    return `${d}/${m}/${y}`;
  }

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
    if (obj.day && obj.month) {
      return formatDateDDMMYYYY(obj.day, obj.month, obj.year);
    }
  }

  if (typeof dayOrObj === 'string') {
    const str = dayOrObj.trim();
    if (!str || str === 'Chưa chọn ngày') {
      const today = new Date();
      const d = String(today.getDate()).padStart(2, '0');
      const m = String(today.getMonth() + 1).padStart(2, '0');
      const y = today.getFullYear();
      return `${d}/${m}/${y}`;
    }
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

  // Helper function to test single scope string
  const matchesSingleScope = (scope) => {
    if (!scope) return true;
    const s = String(scope).trim();
    if (
      s === 'ALL' || 
      s === 'Tất cả 30 Chi đoàn Ấp' || 
      s === 'Tất cả 56 Chi đoàn / Đơn vị' || 
      s.includes('56 Chi đoàn') || 
      s === 'Tất cả'
    ) {
      return true;
    }

    // 1. Khối Dân cư (30 Chi đoàn Ấp)
    if (s.includes('Dân cư') || s.includes('30 Ấp') || s.includes('30 Chi đoàn')) {
      const residentialClusters = ['cum-1', 'cum-2', 'cum-3', 'cum-4', 'cum-5', 'cum-6'];
      const matched = COMPETITION_CLUSTERS.filter(c => residentialClusters.includes(c.id)).some(c => 
        (c.branches || []).some(b => b === userBranch || b.includes(userBranch) || userBranch.includes(b) || (cleanUserBranch && b.includes(cleanUserBranch)))
      );
      return matched || userBranch.includes('Ấp');
    }

    // 2. Khối Trường học (Cấp 3, Cấp 2, Tiểu học, Mầm non)
    if (s.includes('Trường học') || s.includes('Cấp 3') || s.includes('Cấp 2') || s.includes('Mầm non') || s.includes('Tiểu học')) {
      const schoolClusters = ['cum-7', 'cum-8', 'cum-9', 'cum-10'];
      const matched = COMPETITION_CLUSTERS.filter(c => schoolClusters.includes(c.id)).some(c => 
        (c.branches || []).some(b => b === userBranch || b.includes(userBranch) || userBranch.includes(b) || (cleanUserBranch && b.includes(cleanUserBranch)))
      );
      return matched || /MN |Mầm non|TH |Tiểu học|THCS|THPT|Tre Việt|GDNN|GDTX|Tạ Uyên|Trường/i.test(userBranch);
    }

    // 3. Khối Ngoài nhà nước (Doanh nghiệp, Công ty)
    if (s.includes('Ngoài nhà nước') || s.includes('Công ty') || s.includes('Doanh nghiệp')) {
      const enterpriseClusters = ['cum-11'];
      const matched = COMPETITION_CLUSTERS.filter(c => enterpriseClusters.includes(c.id)).some(c => 
        (c.branches || []).some(b => b === userBranch || b.includes(userBranch) || userBranch.includes(b) || (cleanUserBranch && b.includes(cleanUserBranch)))
      );
      return matched || /Sambu|Thép Việt|Bút chì Màu|Hoa Lài|Cty|Công ty|Doanh nghiệp/i.test(userBranch);
    }

    // 4. Khối Lực lượng vũ trang & Cơ quan
    if (s.includes('Lực lượng vũ trang') || s.includes('Vũ trang') || s.includes('Cơ quan')) {
      const armedClusters = ['cum-12'];
      const matched = COMPETITION_CLUSTERS.filter(c => armedClusters.includes(c.id)).some(c => 
        (c.branches || []).some(b => b === userBranch || b.includes(userBranch) || userBranch.includes(b) || (cleanUserBranch && b.includes(cleanUserBranch)))
      );
      return matched || /Công an|Quân sự|Trạm Y tế|UBND/i.test(userBranch);
    }

    // 5. Direct match with branch name
    const cleanScope = s.replace(/^Bí thư\s*/i, '').replace(/^Chi đoàn\s*/i, '').replace(/^Ấp\s*/i, '').trim();
    if (
      s === userBranch ||
      s.includes(userBranch) ||
      userBranch.includes(s) ||
      (cleanUserBranch && s.includes(cleanUserBranch)) ||
      (cleanUserBranch && cleanScope && (cleanScope.includes(cleanUserBranch) || cleanUserBranch.includes(cleanScope)))
    ) {
      return true;
    }

    // 6. Check Cụm thi đua
    if (s.startsWith('Cụm thi đua') || s.startsWith('cum-')) {
      const cluster = COMPETITION_CLUSTERS.find(c =>
        c.name === s ||
        c.id === s ||
        (c.label && c.label.includes(s)) ||
        s.includes(c.name)
      );
      if (cluster) {
        return (cluster.branches || []).some(b => {
          const cleanB = b.replace(/^Chi đoàn\s*/i, '').replace(/^Ấp\s*/i, '').trim();
          return b === userBranch ||
            b.includes(userBranch) ||
            userBranch.includes(b) ||
            (cleanUserBranch && b.includes(cleanUserBranch)) ||
            (cleanUserBranch && cleanB && cleanB === cleanUserBranch);
        });
      }
    }

    return false;
  };

  // Handle Array of target scopes
  if (Array.isArray(targetScope)) {
    if (targetScope.length === 0) return true;
    return targetScope.some(scope => matchesSingleScope(scope));
  }

  return matchesSingleScope(targetScope);
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
        if (!item) return false;
        const strId = String(item.id || '');
        // Xoa sach 100% du lieu ao seed mau
        if (strId.startsWith('act-seed-') || strId.startsWith('task-seed-') || strId.startsWith('dv-')) return false;
        if (item.title && (
          item.title.includes('Hội nghị Học tập & Quán triệt') ||
          item.title.includes('Ngày đồng loạt ra quân') ||
          item.title.includes('Lễ Thắp nến Tri ân') ||
          item.title.includes('Rà soát và cập nhật danh sách') ||
          item.title.includes('Thu nộp Đoàn phí Quý III') ||
          item.title.includes('Chuẩn bị địa điểm & công cụ ra quân')
        )) return false;
        if (item && item.id) {
          if (seen.has(item.id)) return false;
          seen.add(item.id);
        }
        return true;
      });
    }
    return parsed;
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
  let localList = getPersistedData('activities', []);
  // Loc sach 100% hoat dong ao
  localList = (localList || []).filter(a => {
    if (!a) return false;
    const strId = String(a.id || '');
    if (strId.startsWith('act-seed-')) return false;
    if (deleted.includes(strId) || (a.title && deleted.includes(a.title))) return false;
    if (a.title && (
      a.title.includes('Hội nghị Học tập & Quán triệt') ||
      a.title.includes('Ngày đồng loạt ra quân') ||
      a.title.includes('Lễ Thắp nến Tri ân')
    )) return false;
    return true;
  });
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
          const matchedLocal = (localList || []).find(l => String(l.id) === String(item.id)) || {};
          return {
            ...matchedLocal,
            ...item,
            id: item.id,
            title: item.title,
            priority: item.priority === 'urgent' ? 'Khẩn cấp' : item.priority === 'important' ? 'Quan trọng' : (item.priority || 'Bình thường'),
            assigned_to: item.assigned_to || matchedLocal.assigned_to || 'Tất cả 56 Chi đoàn',
            day,
            month,
            year,
            dateIso: item.start_date ? item.start_date.slice(0, 10) : `${year}-${month}-${day}`,
            time: item.time || matchedLocal.time || '08:00 - 11:30',
            location: item.location || matchedLocal.location || 'Hội trường UBND Xã Xuân Thới Sơn',
            status: item.status || matchedLocal.status || 'Đang diễn ra',
            description: item.description || matchedLocal.description || '',
            confirmedBy: Array.isArray(matchedLocal.confirmedBy) ? matchedLocal.confirmedBy : [],
            absentBy: Array.isArray(matchedLocal.absentBy) ? matchedLocal.absentBy : []
          };
        }).filter(a => a && !String(a.id || '').startsWith('act-seed-') && !deleted.includes(String(a.id)));
        setPersistedData('activities', mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase activities fetch exception:', e);
    }
  }
  return localList;
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

  // Match canonical branch name if branchName matches one in ALL_BRANCHES
  const matchedBranch = ALL_BRANCHES.find(b =>
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

  const matchedBranch = ALL_BRANCHES.find(b =>
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

  let localList = getPersistedData('documents', []);
  const seenLocal = new Set();
  localList = (localList || []).filter(d => {
    if (!d) return false;
    const strId = String(d.id || '');
    if (strId.startsWith('doc-seed-') || (d.file_url && d.file_url.includes('w3.org/WAI')) || (d.summary && d.summary.includes('30 Chi đoàn Ấp'))) return false;
    if (deleted.includes(strId) || (d.title && deleted.includes(d.title))) return false;
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
  let localList = getPersistedData('submissions', []);
  localList = (localList || []).filter(s => {
    if (!s) return false;
    const strId = String(s.id || '');
    if (strId.startsWith('sub-seed-') || (s.file_url && s.file_url.includes('w3.org/WAI'))) return false;
    if (deleted.includes(strId) || (s.title && deleted.includes(s.title)) || (s.doc_title && deleted.includes(s.doc_title))) return false;
    return true;
  });
  setPersistedData('submissions', localList);

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
  const targetTitle = subItem.title || subItem.doc_title || 'Báo cáo Chi đoàn';
  const targetBranch = subItem.branch_name || subItem.sender || 'Chi đoàn Ấp';

  const existsIndex = (current || []).findIndex(s =>
    s && ((subItem.id && String(s.id) === String(subItem.id)) || ((s.doc_title === targetTitle || s.title === targetTitle) && s.branch_name === targetBranch))
  );

  let updatedLocal;
  if (existsIndex >= 0) {
    updatedLocal = [...current];
    updatedLocal[existsIndex] = { ...updatedLocal[existsIndex], ...subItem, doc_title: targetTitle, title: targetTitle };
  } else {
    updatedLocal = [{ ...subItem, doc_title: targetTitle, title: targetTitle }, ...current];
  }

  setPersistedData('submissions', updatedLocal);
  notifySyncEvent('SAVE_SUBMISSION', subItem);

  if (supabase) {
    try {
      const payload = {
        branch_name: targetBranch,
        doc_title: targetTitle,
        submission_date: subItem.submission_date || new Date().toISOString(),
        submitted_at: subItem.submitted_at || subItem.sub_date || 'Hôm nay',
        admin_receipt_time: subItem.admin_receipt_time || null,
        status: subItem.status || 'Đã nộp',
        file_name: subItem.file_name || 'Bao_cao.pdf',
        file_url: subItem.file_url || subItem.file_name || '',
        storage_provider: subItem.storage_provider || 'supabase'
      };

      if (subItem.id && typeof subItem.id === 'number') {
        await supabase.from('document_submissions').upsert([{ id: subItem.id, ...payload }]);
      } else {
        const { data: existing } = await supabase.from('document_submissions')
          .select('id')
          .eq('doc_title', targetTitle)
          .eq('branch_name', targetBranch);
        if (existing && existing.length > 0) {
          await supabase.from('document_submissions').update(payload).eq('id', existing[0].id);
        } else {
          await supabase.from('document_submissions').insert([payload]);
        }
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
  let localList = getPersistedData('notifications', []);
  localList = (localList || []).filter(n => {
    if (!n) return false;
    const strId = String(n.id || '');
    if (strId.startsWith('noti-seed-') || (n.title && n.title.includes('30 Chi đoàn Ấp'))) return false;
    if (deleted.includes(strId) || (n.title && deleted.includes(n.title))) return false;
    return true;
  });
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
            target_scope: item.target_scope || matchedLocal.target_scope || 'Tất cả 56 Chi đoàn',
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
        target_scope: newItem.target_scope || 'Tất cả 56 Chi đoàn'
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
        target_scope: updatedNoti.target_scope || 'Tất cả 56 Chi đoàn'
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
  let localList = getPersistedData('tasks', []);
  // Loc sach 100% cong viec ao
  localList = (localList || []).filter(t => {
    if (!t) return false;
    const strId = String(t.id || '');
    if (strId.startsWith('task-seed-')) return false;
    if (deleted.includes(strId) || (t.title && deleted.includes(t.title))) return false;
    if (t.title && (
      t.title.includes('Rà soát và cập nhật danh sách') ||
      t.title.includes('Thu nộp Đoàn phí Quý III') ||
      t.title.includes('Chuẩn bị địa điểm & công cụ ra quân')
    )) return false;
    return true;
  });
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
            assigned_to: item.assigned_to || matchedLocal.assigned_to || 'Tất cả 56 Chi đoàn',
            description: item.description || matchedLocal.description || '',
            confirmedBy: Array.isArray(matchedLocal.confirmedBy) ? matchedLocal.confirmedBy : [],
            completedBy: Array.isArray(matchedLocal.completedBy) ? matchedLocal.completedBy : []
          };
        }).filter(t => t && !String(t.id || '').startsWith('task-seed-') && !deleted.includes(String(t.id)));
        setPersistedData('tasks', mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase tasks fetch exception:', e);
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
  const cleanName = branchName.replace(/^Chi đoàn\s*(Ấp\s*)?/i, '').replace(/^Đoàn trường\s*/i, '').trim();
  const cluster = COMPETITION_CLUSTERS.find(c =>
    c.branches && c.branches.some(b => typeof b === 'string' && (b === branchName || b.includes(cleanName) || cleanName.includes(b.replace(/^Chi đoàn\s*(Ấp\s*)?/i, '').replace(/^Đoàn trường\s*/i, '').trim())))
  );
  return cluster ? cluster.name : 'Chưa phân cụm';
}

export function calculateBranchRating(percentage, totalAssigned = 1) {
  if (totalAssigned === 0 || percentage === null || percentage === undefined) {
    return {
      label: 'Chưa có hoạt động',
      badgeClass: 'bg-secondary text-white',
      borderClass: 'border-secondary',
      bgSubtle: 'bg-secondary-subtle text-secondary',
      icon: '⏳',
      color: '#6B7280'
    };
  }
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
  let localList = getPersistedData('members', []);

  // Lọc sạch 100% dữ liệu đoàn viên ảo (dv-1 -> dv-15 và các tên mẫu)
  const DUMMY_NAMES = [
    'Nguyễn Văn An', 'Trần Thị Bích', 'Lê Hoài Nam', 'Phạm Minh Tâm', 
    'Ngô Thanh Hương', 'Vũ Quốc Khánh', 'Hoàng Bích Ngọc', 'Đặng Tuấn Anh', 
    'Nguyễn Thị Thu Hà', 'Bùi Đức Trọng', 'Trịnh Mai Anh', 'Đỗ Hữu Phước', 
    'Lương Mỹ Duyên', 'Cao Văn Khiêm', 'Phan Bảo Ngọc'
  ];

  let filteredLocal = (localList || []).filter(item =>
    item &&
    !item.id?.match(/^dv-\d+$/) &&
    !DUMMY_NAMES.includes(item.full_name) &&
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
  const current = getPersistedData('members', []);
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
  const current = getPersistedData('members', []);
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


// ============================================================================
// GPS & QR CODE ATTENDANCE SYSTEM
// Only Admin (doanxa) can create QR & Code; branches scan and return Real-time GPS
// ============================================================================

export function generateRandomXtsCode() {
  // Sinh số nguyên ngẫu nhiên gồm 6 chữ số: 100000 - 999999
  const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
  return `XTS-${randomSixDigits}`;
}

// Kiểm tra xem hoạt động đã kết thúc hay chưa để tự động hết hiệu lực mã QR & Code
export function isActivityExpired(activity) {
  if (!activity) return false;
  if (activity.status === 'Đã hoàn thành' || activity.status === 'Đã kết thúc') return true;
  if (activity.is_closed === true) return true;

  const now = new Date();
  let year = parseInt(activity.year, 10);
  let month = parseInt(activity.month, 10);
  let day = parseInt(activity.day, 10);

  if (activity.dateIso && (!year || !month || !day)) {
    const parts = String(activity.dateIso).split('T')[0].split('-');
    if (parts.length === 3) {
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    }
  }

  // Hoạt động chỉ tự động hết hiệu lực khi ngày diễn ra đã kết thúc trong quá khứ (trước hôm nay)
  if (year && month && day) {
    const actEndOfDay = new Date(year, month - 1, day, 23, 59, 59);
    if (now > actEndOfDay) {
      return true;
    }
  }

  return false;
}

export function getOrCreateActivityQrCode(activityId) {
  const allCodes = getPersistedData('activity_qr_codes', {});
  // Chỉ tái sử dụng nếu đã đúng chuẩn XTS-XXXXXX (6 chữ số)
  if (allCodes[activityId] && allCodes[activityId].code && /^XTS-\d{6}$/.test(allCodes[activityId].code)) {
    return allCodes[activityId];
  }
  const newCode = generateRandomXtsCode();
  const qrData = {
    code: newCode,
    activityId: activityId,
    createdAt: new Date().toISOString(),
    // Dữ liệu mã QR đồng nhất 100% với mã Code: quét ra đúng chuỗi XTS-XXXXXX
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(newCode)}`
  };
  const updated = { ...allCodes, [activityId]: qrData };
  setPersistedData('activity_qr_codes', updated);
  return qrData;
}

export function refreshActivityQrCode(activityId) {
  const allCodes = getPersistedData('activity_qr_codes', {});
  const newCode = generateRandomXtsCode();
  const qrData = {
    code: newCode,
    activityId: activityId,
    createdAt: new Date().toISOString(),
    // Dữ liệu mã QR đồng nhất 100% với mã Code: quét ra đúng chuỗi XTS-XXXXXX
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(newCode)}`
  };
  const updated = { ...allCodes, [activityId]: qrData };
  setPersistedData('activity_qr_codes', updated);
  return qrData;
}

export function getActivityGpsAuditLogs(activityId) {
  const allLogs = getPersistedData('activity_gps_audit_logs', {});
  return allLogs[activityId] || [];
}

export function saveActivityGpsAttendanceLog(activityId, logEntry) {
  const allLogs = getPersistedData('activity_gps_audit_logs', {});
  const currentActivityLogs = allLogs[activityId] || [];
  
  // Quy định: Mỗi Chi đoàn chỉ điểm danh đúng 1 lần duy nhất cho mỗi hoạt động
  const alreadyExists = currentActivityLogs.find(l => l.branch_name === logEntry.branch_name);
  if (alreadyExists) {
    console.warn(`Chi đoàn ${logEntry.branch_name} đã điểm danh cho hoạt động ${activityId} rồi (chỉ được điểm danh 1 lần duy nhất).`);
    return currentActivityLogs;
  }

  const updatedList = [logEntry, ...currentActivityLogs];
  const updatedAll = {
    ...allLogs,
    [activityId]: updatedList
  };
  setPersistedData('activity_gps_audit_logs', updatedAll);

  // Sync with main attendance_records
  const attendanceRecords = getPersistedData('attendance_records', {});
  const currentRecord = attendanceRecords[activityId] || {};
  const updatedRecord = {
    ...currentRecord,
    [logEntry.branch_name]: {
      attended: true,
      time: logEntry.time_str,
      photo_url: logEntry.photo_url || null,
      gps: {
        lat: logEntry.latitude,
        lng: logEntry.longitude,
        accuracy: logEntry.accuracy,
        maps_url: logEntry.maps_url
      }
    }
  };
  setPersistedData('attendance_records', {
    ...attendanceRecords,
    [activityId]: updatedRecord
  });

  return updatedList;
}

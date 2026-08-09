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

// Initial Empty Constant Exports
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

// Persistent Storage Helpers (LocalStorage Backup)
export function getPersistedData(key, fallback = []) {
  try {
    const raw = localStorage.getItem(`xts_youth_${key}`);
    return raw ? JSON.parse(raw) : fallback;
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

// Async API helpers for Supabase Sync
export async function syncFetchActivities() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map(item => {
          const d = item.start_date ? new Date(item.start_date) : new Date();
          const months = ['THÁNG 1','THÁNG 2','THÁNG 3','THÁNG 4','THÁNG 5','THÁNG 6','THÁNG 7','THÁNG 8','THÁNG 9','THÁNG 10','THÁNG 11','THÁNG 12'];
          return {
            id: item.id,
            title: item.title,
            day: String(d.getDate()).padStart(2, '0'),
            month: months[d.getMonth()] || 'THÁNG 5',
            time: `${item.start_time || '08:00'} - ${item.end_time || '11:30'}`,
            location: item.location || 'Hội trường UBND xã Xuân Thới Sơn',
            status: item.status || 'Sắp diễn ra',
            description: item.description || ''
          };
        });
        setPersistedData('activities', mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase fetch activities error, using local storage fallback:', e);
    }
  }
  return getPersistedData('activities', []);
}

export async function syncSaveActivity(activityItem) {
  const current = getPersistedData('activities', []);
  const updatedLocal = [activityItem, ...current];
  setPersistedData('activities', updatedLocal);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('activities').insert([{
        title: activityItem.title,
        description: activityItem.description || '',
        start_date: activityItem.dateIso || new Date().toISOString().split('T')[0],
        start_time: activityItem.time ? activityItem.time.split(' - ')[0] : '08:00',
        end_time: activityItem.time ? activityItem.time.split(' - ')[1] || '11:30' : '11:30',
        location: activityItem.location,
        status: activityItem.status || 'Sắp diễn ra',
        organizer: 'Đoàn xã Xuân Thới Sơn'
      }]);
      if (error) console.error('Supabase error inserting activity:', error);
    } catch (e) {
      console.error('Supabase save activity error:', e);
    }
    return await syncFetchActivities();
  }
  return updatedLocal;
}

export async function syncFetchDocuments() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map(item => ({
          id: item.id,
          doc_number: item.doc_number,
          title: item.title,
          summary: `Ban hành ngày ${item.issue_date || new Date().toLocaleDateString('vi-VN')}`,
          sender: item.sender || 'Đoàn xã Xuân Thới Sơn',
          recipient_scope: item.recipient_scope || 'ALL',
          status: item.status || 'Chưa đọc',
          type: item.type || 'outgoing',
          date: item.issue_date || new Date().toLocaleDateString('vi-VN'),
          file_name: item.pdf_url || ''
        }));
        setPersistedData('documents', mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase fetch documents error, using local storage fallback:', e);
    }
  }
  return getPersistedData('documents', []);
}

export async function syncSaveDocument(docItem) {
  const current = getPersistedData('documents', []);
  const updatedLocal = [docItem, ...current];
  setPersistedData('documents', updatedLocal);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('documents').insert([{
        doc_number: docItem.doc_number,
        title: docItem.title,
        type: docItem.type || 'outgoing',
        sender: docItem.sender || 'Đoàn xã Xuân Thới Sơn',
        recipient_scope: docItem.recipient_scope || 'ALL',
        issue_date: new Date().toISOString().split('T')[0],
        status: docItem.status || 'unread',
        pdf_url: docItem.file_name || ''
      }]);
      if (error) console.error('Supabase error inserting document:', error);
    } catch (e) {
      console.error('Supabase save document error:', e);
    }
    return await syncFetchDocuments();
  }
  return updatedLocal;
}

export async function syncFetchSubmissions() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('document_submissions').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map(item => ({
          id: item.id,
          title: item.doc_title,
          branch_name: item.branch_name || 'Chi đoàn Ấp',
          due_date: new Date().toLocaleDateString('vi-VN'),
          sub_date: new Date(item.submission_date || Date.now()).toLocaleDateString('vi-VN'),
          status: item.status || 'Đã nộp',
          file_name: item.file_name || 'Bao_cao.pdf'
        }));
        setPersistedData('submissions', mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase fetch submissions error, using local storage fallback:', e);
    }
  }
  return getPersistedData('submissions', []);
}

export async function syncSaveSubmission(subItem) {
  const current = getPersistedData('submissions', []);
  const updatedLocal = [subItem, ...current];
  setPersistedData('submissions', updatedLocal);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('document_submissions').insert([{
        branch_name: subItem.branch_name || 'Chi đoàn Ấp',
        doc_title: subItem.title,
        submission_date: new Date().toISOString(),
        status: subItem.status || 'Đã nộp',
        file_name: subItem.file_name || 'Bao_cao.pdf',
        file_url: subItem.file_name || ''
      }]);
      if (error) console.error('Supabase error inserting submission:', error);
    } catch (e) {
      console.error('Supabase save submission error:', e);
    }
    return await syncFetchSubmissions();
  }
  return updatedLocal;
}

export async function syncFetchNotifications() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map(item => ({
          id: item.id,
          title: item.title,
          content: item.content || '',
          type: item.type || 'general',
          time_ago: item.time_ago || 'Vừa xong'
        }));
        setPersistedData('notifications', mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase fetch notifications error, using local storage fallback:', e);
    }
  }
  return getPersistedData('notifications', []);
}

export async function syncSaveNotification(notiItem) {
  const current = getPersistedData('notifications', []);
  const updatedLocal = [notiItem, ...current];
  setPersistedData('notifications', updatedLocal);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('notifications').insert([{
        title: notiItem.title,
        content: notiItem.content || '',
        type: notiItem.type || 'general',
        time_ago: notiItem.time_ago || 'Vừa xong'
      }]);
      if (error) console.error('Supabase error inserting notification:', error);
    } catch (e) {
      console.error('Supabase save notification error:', e);
    }
    return await syncFetchNotifications();
  }
  return updatedLocal;
}

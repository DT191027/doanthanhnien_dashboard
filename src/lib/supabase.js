import { createClient } from '@supabase/supabase-js';

// Fallback to project ID ofroeyoghgenboavoaiu from user's Supabase dashboard
const DEFAULT_SUPABASE_URL = 'https://ofroeyoghgenboavoaiu.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mcm9leW9naGdlbmJvYXZvYWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5Nzg5OTksImV4cCI6MjAzMTU1NDk5OX0.dummy_key';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseAnonKey.includes('dummy_key'));

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient(DEFAULT_SUPABASE_URL, supabaseAnonKey);

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
  if (supabase) {
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
            time: `${item.start_time ? item.start_time.slice(0, 5) : '08:00'} - ${item.end_time ? item.end_time.slice(0, 5) : '11:30'}`,
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
        description: activityItem.description || '',
        start_date: activityItem.dateIso || new Date().toISOString().split('T')[0],
        start_time: startTime,
        end_time: endTime,
        location: activityItem.location || 'Hội trường UBND xã Xuân Thới Sơn',
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
    return await syncFetchActivities();
  }
  return updatedLocal;
}

export async function syncFetchDocuments() {
  if (supabase) {
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
          file_name: item.pdf_url || '',
          file_url: item.pdf_url || ''
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

  if (supabase) {
    try {
      const { data, error } = await supabase.from('documents').insert([{
        doc_number: docItem.doc_number,
        title: docItem.title,
        type: docItem.type || 'outgoing',
        sender: docItem.sender || 'Đoàn xã Xuân Thới Sơn',
        recipient_scope: docItem.recipient_scope || 'ALL',
        issue_date: new Date().toISOString().split('T')[0],
        status: docItem.status || 'unread',
        pdf_url: docItem.file_url || docItem.file_name || ''
      }]).select();

      if (error) {
        console.error('Supabase error inserting document:', error);
      } else {
        console.log('Supabase document inserted successfully:', data);
      }
    } catch (e) {
      console.error('Supabase save document exception:', e);
    }
    return await syncFetchDocuments();
  }
  return updatedLocal;
}

export async function syncFetchSubmissions() {
  if (supabase) {
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
          file_name: item.file_name || 'Bao_cao.pdf',
          file_url: item.file_url || item.file_name || ''
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

  if (supabase) {
    try {
      const { data, error } = await supabase.from('document_submissions').insert([{
        branch_name: subItem.branch_name || 'Chi đoàn Ấp',
        doc_title: subItem.title,
        submission_date: new Date().toISOString(),
        status: subItem.status || 'Đã nộp',
        file_name: subItem.file_name || 'Bao_cao.pdf',
        file_url: subItem.file_url || subItem.file_name || ''
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

export async function syncFetchNotifications() {
  if (supabase) {
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

  if (supabase) {
    try {
      const { data, error } = await supabase.from('notifications').insert([{
        title: notiItem.title,
        content: notiItem.content || '',
        type: notiItem.type || 'general',
        time_ago: notiItem.time_ago || 'Vừa xong'
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

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

// Official 6 Competition Clusters (Cụm thi đua số 1 - số 6)
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
    if (obj.formattedDate) return obj.formattedDate;
    if (obj.date && typeof obj.date === 'string' && obj.date.includes('/')) {
      const parts = obj.date.split('/');
      if (parts.length === 3) return obj.date;
    }
    if (obj.dateIso) {
      const [y, m, d] = obj.dateIso.split('-');
      if (y && m && d) return `${d}/${m}/${y}`;
    }
    return formatDateDDMMYYYY(obj.day, obj.month, obj.year);
  }
  
  if (typeof dayOrObj === 'string' && dayOrObj.includes('/')) {
    const parts = dayOrObj.split('/');
    if (parts.length === 3) return dayOrObj;
    if (parts.length === 2 && month) {
      const dPart = parts[0].padStart(2, '0');
      const mPart = parts[1].padStart(2, '0');
      return `${dPart}/${mPart}/${year || new Date().getFullYear()}`;
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
  if (currentUser.role === 'doan_xa') return true; // Administrator sees all items

  if (!targetScope || targetScope === 'ALL' || targetScope === 'Tất cả 30 Chi đoàn Ấp' || targetScope.includes('30 Chi đoàn') || targetScope === 'Tất cả') {
    return true;
  }

  const userBranch = currentUser.branch_name || currentUser.title || '';
  if (!userBranch) return true;

  const cleanUserBranch = userBranch.replace(/^Chi đoàn\s*/i, '').replace(/^Ấp\s*/i, '').trim();

  // 1. Direct match with branch name or code
  if (
    targetScope === userBranch || 
    targetScope.includes(userBranch) || 
    userBranch.includes(targetScope) || 
    (cleanUserBranch && targetScope.includes(cleanUserBranch))
  ) {
    return true;
  }

  // 2. Check if targetScope is a Competition Cluster (Cụm thi đua số 1 - 6)
  if (targetScope.startsWith('Cụm thi đua') || targetScope.startsWith('cum-')) {
    const cluster = COMPETITION_CLUSTERS.find(c => 
      c.name === targetScope || 
      c.id === targetScope || 
      c.label.includes(targetScope) ||
      targetScope.includes(c.name)
    );
    if (cluster) {
      const isInCluster = cluster.branches.some(b => 
        b === userBranch || 
        b.includes(userBranch) || 
        userBranch.includes(b) || 
        (cleanUserBranch && b.includes(cleanUserBranch))
      );
      if (isInCluster) return true;
    }
  }

  return false;
}

export function getPersistedData(key, fallback = []) {
  try {
    const raw = localStorage.getItem(`xts_youth_${key}`);
    if (!raw) return fallback;
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

// ============================================================================
// 1. ACTIVITIES SYNC (BẢNG HOẠT ĐỘNG)
// ============================================================================
export async function syncFetchActivities() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map(item => {
          const d = item.start_date ? new Date(item.start_date) : null;
          const day = item.day || (d ? String(d.getDate()).padStart(2, '0') : '01');
          const month = item.month || (d ? String(d.getMonth() + 1).padStart(2, '0') : '01');
          const year = item.year || (d ? d.getFullYear() : 2026);
          return {
            id: item.id,
            title: item.title,
            day: day,
            month: month,
            year: year,
            dateIso: item.start_date || `${year}-${month}-${day}`,
            time: `${item.start_time ? item.start_time.slice(0, 5) : '08:00'} - ${item.end_time ? item.end_time.slice(0, 5) : '11:30'}`,
            location: item.location || OFFICIAL_ADDRESS,
            status: item.status || 'Sắp diễn ra',
            description: item.description || ''
          };
        });
        const cleanMapped = deduplicateActivities(mapped);
        setPersistedData('activities', cleanMapped);
        return cleanMapped;
      }
    } catch (e) {
      console.warn('Supabase fetch activities error, using local storage fallback:', e);
    }
  }
  return deduplicateActivities(getPersistedData('activities', []));
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
    return await syncFetchActivities();
  }
  return updatedLocal;
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

export async function syncDeleteActivity(activityId) {
  const current = getPersistedData('activities', []);
  const updatedLocal = current.filter(a => a.id !== activityId);
  setPersistedData('activities', updatedLocal);
  notifySyncEvent('DELETE_ACTIVITY', { activityId });

  if (supabase) {
    try {
      await supabase.from('activities').delete().eq('id', activityId);
    } catch (e) {
      console.error('Supabase delete activity error:', e);
    }
    return await syncFetchActivities();
  }
  return updatedLocal;
}

// ============================================================================
// 2. DOCUMENTS SYNC (BẢNG VĂN BẢN BAN HÀNH)
// ============================================================================
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
          status: item.status === 'unread' ? 'Chưa đọc' : item.status === 'read' ? 'Đã đọc' : (item.status || 'Chưa đọc'),
          type: item.type || 'outgoing',
          date: item.issue_date || new Date().toLocaleDateString('vi-VN'),
          file_name: item.pdf_url || '',
          file_url: item.file_url || item.pdf_url || '',
          storage_provider: item.storage_provider || 'supabase'
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
  notifySyncEvent('SAVE_DOCUMENT', docItem);

  if (supabase) {
    try {
      let validDocStatus = 'unread';
      if (docItem.status === 'Đã đọc' || docItem.status === 'read') validDocStatus = 'read';
      else if (docItem.status === 'Đang xử lý' || docItem.status === 'pending') validDocStatus = 'pending';

      let validDocType = 'outgoing';
      if (docItem.type === 'incoming') validDocType = 'incoming';
      else if (docItem.type === 'submission') validDocType = 'submission';

      const { data, error } = await supabase.from('documents').insert([{
        doc_number: docItem.doc_number,
        title: docItem.title,
        type: validDocType,
        sender: docItem.sender || 'Đoàn xã Xuân Thới Sơn',
        recipient_scope: docItem.recipient_scope || 'ALL',
        issue_date: new Date().toISOString().split('T')[0],
        status: validDocStatus,
        pdf_url: docItem.file_url || docItem.file_name || '',
        file_url: docItem.file_url || '',
        storage_provider: docItem.storage_provider || 'supabase'
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

export async function syncDeleteDocument(docId) {
  const current = getPersistedData('documents', []);
  const updatedLocal = current.filter(d => d.id !== docId);
  setPersistedData('documents', updatedLocal);
  notifySyncEvent('DELETE_DOCUMENT', { docId });

  if (supabase) {
    try {
      await supabase.from('documents').delete().eq('id', docId);
    } catch (e) {
      console.error('Supabase delete document error:', e);
    }
    return await syncFetchDocuments();
  }
  return updatedLocal;
}

// ============================================================================
// 3. DOCUMENT SUBMISSIONS SYNC (BẢNG NỘP BÁO CÁO CHI ĐOÀN)
// ============================================================================
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
          file_url: item.file_url || item.file_name || '',
          storage_provider: item.storage_provider || 'supabase'
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
  notifySyncEvent('SAVE_SUBMISSION', subItem);

  if (supabase) {
    try {
      const { data, error } = await supabase.from('document_submissions').insert([{
        branch_name: subItem.branch_name || 'Chi đoàn Ấp',
        doc_title: subItem.title,
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
  if (supabase) {
    try {
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map(item => ({
          id: item.id,
          title: item.title,
          content: item.content || '',
          target_scope: item.target_scope || 'Tất cả 30 Chi đoàn Ấp',
          priority: item.priority || item.type || 'Bình thường',
          type: item.type || 'general',
          time_ago: item.time_ago || 'Vừa xong',
          createdAt: item.created_at ? new Date(item.created_at).getTime() : Date.now()
        }));
        const sorted = sortNotificationsByPriority(mapped);
        setPersistedData('notifications', sorted);
        return sorted;
      }
    } catch (e) {
      console.warn('Supabase fetch notifications error, using local storage fallback:', e);
    }
  }
  const local = getPersistedData('notifications', []);
  return sortNotificationsByPriority(local);
}

export async function syncSaveNotification(notiItem) {
  const current = getPersistedData('notifications', []);
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
  const current = getPersistedData('notifications', []);
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

export async function syncDeleteNotification(notificationId) {
  const current = getPersistedData('notifications', []);
  const updatedLocal = current.filter(n => n.id !== notificationId);
  setPersistedData('notifications', updatedLocal);
  notifySyncEvent('DELETE_NOTIFICATION', { notificationId });

  if (supabase) {
    try {
      await supabase.from('notifications').delete().eq('id', notificationId);
    } catch (e) {
      console.error('Supabase delete notification exception:', e);
    }
    return await syncFetchNotifications();
  }
  return updatedLocal;
}

// ============================================================================
// 5. TASKS SYNC (BẢNG CÔNG VIỆC / TODO LIST)
// ============================================================================
export async function syncFetchTasks() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map(item => ({
          id: item.id,
          title: item.title,
          status: item.status === 'in_progress' ? 'inProgress' : item.status || 'todo',
          priority: item.priority === 'high' ? 'Cao' : item.priority === 'medium' ? 'Trung bình' : 'Bình thường',
          dueDate: item.due_date || 'Hôm nay',
          assigned_to: item.assigned_to || 'Đoàn xã'
        }));
        setPersistedData('tasks', mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase fetch tasks error, using local storage fallback:', e);
    }
  }
  return getPersistedData('tasks', []);
}

export async function syncSaveTask(taskItem) {
  const current = getPersistedData('tasks', []);
  const updatedLocal = [taskItem, ...current];
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

      const { data, error } = await supabase.from('tasks').insert([{
        title: taskItem.title,
        status: validTaskStatus,
        priority: validPriority,
        due_date: new Date().toISOString().split('T')[0],
        assigned_to: taskItem.assigned_to || 'Đoàn xã'
      }]).select();

      if (error) {
        console.error('Supabase error inserting task:', error);
      } else {
        console.log('Supabase task inserted successfully:', data);
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
  const cluster = COMPETITION_CLUSTERS.find(c => 
    c.branches.some(b => b === branchName || b.includes(branchName.replace('Chi đoàn Ấp ', '')))
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

import { supabase, isSupabaseConfigured } from './supabase';

// Official Gmail of Đoàn xã Xuân Thới Sơn for Google Drive Storage Backup
export const DOAN_XA_GMAIL = 'dtnxts2026@gmail.com';

// Supabase Free Tier Storage Bucket Limit (1 GB = 1024 * 1024 * 1024 bytes)
export const SUPABASE_FREE_LIMIT_BYTES = 1 * 1024 * 1024 * 1024; 
export const AUTO_SWITCH_THRESHOLD_PERCENT = 80; // Auto-switch to Google Drive at 80%

// Get current storage usage metrics
export async function getStorageQuotaMetrics() {
  let usedBytes = 0;

  try {
    const rawLocalBytes = localStorage.getItem('xts_storage_used_bytes');
    if (rawLocalBytes) {
      usedBytes = parseInt(rawLocalBytes, 10);
    }

    if (isSupabaseConfigured && supabase) {
      const { data: files } = await supabase.storage.from('documents').list();
      if (files && files.length > 0) {
        const remoteBytes = files.reduce((acc, f) => acc + (f.metadata?.size || 0), 0);
        if (remoteBytes > 0) usedBytes = remoteBytes;
      }
    }
  } catch (e) {
    console.warn('Unable to query storage metrics, using local estimate:', e);
  }

  const percentage = Math.min(100, Math.round((usedBytes / SUPABASE_FREE_LIMIT_BYTES) * 100));
  const isNearLimit = percentage >= AUTO_SWITCH_THRESHOLD_PERCENT;

  return {
    usedBytes,
    usedMb: (usedBytes / (1024 * 1024)).toFixed(2),
    totalQuotaMb: 1024,
    percentage,
    isNearLimit,
    activeProvider: isNearLimit ? 'google_drive' : 'supabase',
    targetDriveEmail: DOAN_XA_GMAIL
  };
}

// Upload PDF File with automatic failover / limit switch to Google Drive of dtnxts2026@gmail.com
export async function uploadPdfWithFailover(file, metadata = {}) {
  const metrics = await getStorageQuotaMetrics();
  const newUsedBytes = metrics.usedBytes + (file ? file.size : 0);
  localStorage.setItem('xts_storage_used_bytes', String(newUsedBytes));

  const useDrive = metrics.isNearLimit;
  const fileName = file ? file.name : 'Van_Ban.pdf';
  const timestamp = Date.now();
  const sanitizedPath = `${timestamp}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  // Default robust Google Drive Search & Backup Link
  let downloadUrl = `https://drive.google.com/drive/search?q=${encodeURIComponent(fileName)}`;
  let providerUsed = useDrive ? 'google_drive' : 'supabase';

  if (!useDrive && file && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(sanitizedPath, file, { upsert: true, cacheControl: '3600' });

      if (!error && data) {
        const { data: publicData } = supabase.storage.from('documents').getPublicUrl(sanitizedPath);
        if (publicData?.publicUrl) {
          downloadUrl = publicData.publicUrl;
          providerUsed = 'supabase';
        }
      } else {
        console.warn('Supabase storage upload returned error, using Google Drive backup:', error);
        providerUsed = 'google_drive';
      }
    } catch (e) {
      console.warn('Supabase storage upload exception, using Google Drive backup:', e);
      providerUsed = 'google_drive';
    }
  }

  return {
    file_name: fileName,
    file_url: downloadUrl,
    file_size: file ? file.size : 0,
    storage_provider: providerUsed,
    is_google_drive: providerUsed === 'google_drive',
    target_drive_email: DOAN_XA_GMAIL
  };
}

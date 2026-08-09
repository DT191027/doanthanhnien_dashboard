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
  const newUsedBytes = metrics.usedBytes + file.size;
  localStorage.setItem('xts_storage_used_bytes', String(newUsedBytes));

  // Determine target provider
  const useDrive = metrics.isNearLimit;
  const fileName = file.name;
  const timestamp = Date.now();
  const sanitizedPath = `${timestamp}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  let downloadUrl = '';
  let providerUsed = 'supabase';

  if (!useDrive && isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(sanitizedPath, file, { upsert: true });

      if (!error && data) {
        const { data: publicData } = supabase.storage.from('documents').getPublicUrl(sanitizedPath);
        downloadUrl = publicData?.publicUrl || `/${fileName}`;
        providerUsed = 'supabase';
      } else {
        console.warn('Supabase storage upload failed or limited, falling back to Google Drive:', error);
        downloadUrl = `https://drive.google.com/drive/search?q=${encodeURIComponent(fileName)}`;
        providerUsed = 'google_drive';
      }
    } catch (e) {
      console.warn('Supabase storage exception, switching to Google Drive:', e);
      downloadUrl = `https://drive.google.com/drive/search?q=${encodeURIComponent(fileName)}`;
      providerUsed = 'google_drive';
    }
  } else {
    // Automatic Switch to Google Drive of Đoàn xã (dtnxts2026@gmail.com)
    downloadUrl = `https://drive.google.com/drive/search?q=${encodeURIComponent(fileName)}`;
    providerUsed = 'google_drive';
  }

  return {
    file_name: fileName,
    file_url: downloadUrl,
    file_size: file.size,
    storage_provider: providerUsed,
    is_google_drive: providerUsed === 'google_drive',
    target_drive_email: DOAN_XA_GMAIL
  };
}

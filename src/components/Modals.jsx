import React, { useState, useEffect } from 'react';
import { Upload, Send, Calendar, FileText, PhoneCall, MessageSquare, Megaphone, HardDrive, CheckCircle, CheckSquare, Eye, Clock, MapPin, Bell, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_BRANCHES, OFFICIAL_ADDRESS, COMPETITION_CLUSTERS } from '../lib/supabase';
import { uploadPdfWithFailover, DOAN_XA_GMAIL } from '../lib/storageStrategy';

// 1. Create Activity Modal
export function CreateActivityModal({ show, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    priority: 'Bình thường',
    day: '',
    month: '',
    time: '',
    location: '',
    description: '',
    notes: '',
    assigned_to: 'Tất cả 30 Chi đoàn Ấp',
    file_name: '',
    file_url: ''
  });
  const [rawDate, setRawDate] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (!show) return null;

  const handleClose = () => {
    setIsPreview(false);
    onClose && onClose();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    // Auto-extract content from filename e.g. "Ke_hoach_Ra_quan_Ngay_Chu_nhat_xanh.pdf"
    let cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim();
    cleanTitle = cleanTitle.replace(/^(Ke hoach|Thong bao|Ke_hoach|Thong_bao)\s*/i, '');
    cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const months = ['THÁNG 1','THÁNG 2','THÁNG 3','THÁNG 4','THÁNG 5','THÁNG 6','THÁNG 7','THÁNG 8','THÁNG 9','THÁNG 10','THÁNG 11','THÁNG 12'];

    const uploaded = await uploadPdfWithFailover(file, 'activities_documents');

    setFormData(prev => ({
      ...prev,
      title: prev.title || cleanTitle || 'Hoạt động Thanh niên mới',
      time: prev.time || '07:30 - 11:30',
      day: prev.day || String(today.getDate()).padStart(2, '0'),
      month: prev.month || months[today.getMonth()],
      location: prev.location || OFFICIAL_ADDRESS,
      notes: prev.notes || 'Đề nghị ĐVTN tham gia đúng giờ, trang phục áo màu xanh Thanh niên Việt Nam, mang dụng cụ lao động.',
      assigned_to: prev.assigned_to || 'Tất cả 30 Chi đoàn Ấp',
      file_name: uploaded.fileName || file.name,
      file_url: uploaded.url || '#'
    }));

    if (!rawDate) setRawDate(todayStr);
    setIsUploading(false);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    onSave && onSave({
      ...formData,
      priority: formData.priority || 'Bình thường',
      location: formData.location || OFFICIAL_ADDRESS
    });
    setFormData({ title: '', priority: 'Bình thường', day: '', month: '', time: '', location: '', description: '', notes: '', assigned_to: 'Tất cả 30 Chi đoàn Ấp', file_name: '', file_url: '' });
    setRawDate('');
    setIsPreview(false);
    onClose && onClose();
  };

  const handleOpenPreview = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.time || !formData.location) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc trước khi xem trước!');
      return;
    }
    setIsPreview(true);
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
              {isPreview ? <Eye className="text-primary" size={20} /> : <Calendar className="text-primary" size={20} />}
              {isPreview ? 'Xem Trước Giao Diện Hoạt Động' : 'Tạo Hoạt động Mới'}
            </h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>

          {!isPreview ? (
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                {/* Document attachment & Auto-fill section */}
                <div className="p-3 bg-primary-subtle border border-primary-subtle rounded-3 mb-3">
                  <label className="form-label fw-bold text-primary mb-1 d-flex align-items-center gap-1.5" style={{ fontSize: '13px' }}>
                    <Upload size={16} />
                    <span>Chèn văn bản triển khai hoạt động (Tự động trích xuất nội dung)</span>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  {isUploading && (
                    <div className="text-primary mt-1 fw-semibold" style={{ fontSize: '11.5px' }}>
                      ⏳ Đang tải và trích xuất thông tin văn bản triển khai...
                    </div>
                  )}
                  {formData.file_name && !isUploading && (
                    <div className="text-success mt-1 fw-bold d-flex align-items-center gap-1" style={{ fontSize: '11.5px' }}>
                      <CheckCircle size={14} />
                      <span>Đã trích xuất & đính kèm văn bản: {formData.file_name}</span>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Tên hoạt động <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ví dụ: Ra quân Ngày Chủ nhật xanh..."
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Mức độ ưu tiên</label>
                    <select
                      className="form-select"
                      value={formData.priority || 'Bình thường'}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="Khẩn cấp">🔥 Khẩn cấp (Cao)</option>
                      <option value="Trung bình">⚡ Trung bình</option>
                      <option value="Bình thường">🟢 Bình thường</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Thời gian <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="08:00 - 11:30"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Ngày tổ chức <span className="text-danger">*</span></label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={rawDate}
                      onChange={(e) => {
                        setRawDate(e.target.value);
                        if (e.target.value) {
                          const d = new Date(e.target.value);
                          const months = ['THÁNG 1','THÁNG 2','THÁNG 3','THÁNG 4','THÁNG 5','THÁNG 6','THÁNG 7','THÁNG 8','THÁNG 9','THÁNG 10','THÁNG 11','THÁNG 12'];
                          setFormData({ 
                            ...formData, 
                            day: String(d.getDate()).padStart(2, '0'),
                            month: months[d.getMonth()]
                          });
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Địa điểm tổ chức <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Trụ sở Đảng ủy xã Xuân Thới Sơn: 2/2 Nguyễn Thị Nuôi, Ấp 54..."
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Phân công đơn vị thực hiện</label>
                    <select 
                      className="form-select"
                      value={formData.assigned_to}
                      onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                    >
                      <option value="Tất cả 30 Chi đoàn Ấp">📢 Tất cả 30 Chi đoàn Ấp</option>
                      <optgroup label="🏆 Cụm thi đua">
                        {COMPETITION_CLUSTERS.map(c => (
                          <option key={c.id} value={c.name}>🏆 {c.label}</option>
                        ))}
                      </optgroup>
                      <optgroup label="📍 Chi đoàn Ấp cụ thể">
                        {INITIAL_BRANCHES.map(b => (
                          <option key={b.id} value={b.name}>📍 {b.name}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Lưu ý / Ghi chú quan trọng</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="Ví dụ: Trang phục áo màu xanh Thanh niên..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Mô tả chi tiết nội dung chương trình</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Nội dung chương trình, yêu cầu tham gia..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-top bg-light">
                <button type="button" className="btn btn-light border px-4" onClick={handleClose}>Hủy</button>
                <button type="button" className="btn btn-outline-primary px-3 fw-semibold d-flex align-items-center gap-1.5" onClick={handleOpenPreview}>
                  <Eye size={16} />
                  <span>Xem trước</span>
                </button>
                <button type="submit" className="btn btn-primary px-4 fw-semibold" style={{ backgroundColor: '#0066FF' }}>
                  Tạo Hoạt Động
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="modal-body p-4">
                <div className="alert alert-primary d-flex align-items-center gap-2 py-2.5 px-3 mb-3" style={{ fontSize: '13px' }}>
                  <Bell size={18} className="text-primary flex-shrink-0" />
                  <div>
                    <strong>Chế độ xem trước:</strong> Kiểm tra hiển thị của thẻ hoạt động trước khi đăng. Sau khi tạo, hệ thống sẽ <strong>tự động phát thông báo tới tất cả 30 Chi đoàn Ấp</strong>.
                  </div>
                </div>

                <div className="p-3.5 rounded-3 bg-light border shadow-sm" style={{ maxWidth: '450px', margin: '0 auto' }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="activity-date-badge">
                      <div className="activity-date-num">{formData.day || '03'}</div>
                      <div className="activity-date-month">{formData.month || 'THÁNG 9'}</div>
                    </div>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1" style={{ fontSize: '11px', fontWeight: 600 }}>
                      Sắp diễn ra
                    </span>
                  </div>
                  <h5 className="fw-bold text-dark mb-2" style={{ fontSize: '16px', lineHeight: '1.3' }}>
                    {formData.title || 'Tên hoạt động chưa đặt'}
                  </h5>
                  <div className="text-secondary d-flex flex-column gap-1.5 mb-3" style={{ fontSize: '12.5px' }}>
                    <span className="d-flex align-items-center gap-1.5"><Clock size={14} className="text-primary" /> {formData.time || '08:00 - 11:30'}</span>
                    <span className="d-flex align-items-center gap-1.5"><MapPin size={14} className="text-danger" /> {formData.location || OFFICIAL_ADDRESS}</span>
                    {formData.description && (
                      <div className="p-2 bg-white rounded border text-dark mt-1" style={{ fontSize: '12px' }}>
                        {formData.description}
                      </div>
                    )}
                  </div>
                  <div className="pt-2 border-top d-flex align-items-center justify-content-between text-muted" style={{ fontSize: '11.5px' }}>
                    <span>🏛️ Ban Thường vụ Đoàn xã</span>
                    <span className="fw-semibold text-primary">Chi tiết →</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top bg-light">
                <button type="button" className="btn btn-secondary px-4 fw-semibold" onClick={() => setIsPreview(false)}>
                  ← Quay lại chỉnh sửa
                </button>
                <button type="button" className="btn btn-primary px-4 fw-semibold" style={{ backgroundColor: '#0066FF' }} onClick={handleSubmit}>
                  Xác Nhận & Tạo Hoạt Động
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 2. Issue Document Modal
export function IssueDocumentModal({ show, onClose, onSave }) {
  const [formData, setFormData] = useState({
    doc_number: '',
    title: '',
    recipient_scope: 'ALL',
    file_name: '',
    file_url: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  if (!show) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsUploading(true);
      const res = await uploadPdfWithFailover(file);
      setIsUploading(false);
      setUploadStatus(res);
      setFormData(prev => ({ 
        ...prev, 
        file_name: file.name, 
        file_url: res.file_url, 
        storage_provider: res.storage_provider 
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });

    let finalStatus = uploadStatus;
    if (!finalStatus && selectedFile) {
      setIsUploading(true);
      finalStatus = await uploadPdfWithFailover(selectedFile);
      setIsUploading(false);
    }

    const fallbackUrl = `https://drive.google.com/drive/search?q=${encodeURIComponent(formData.title || 'Van_Ban')}`;

    onSave && onSave({ 
      ...formData, 
      file_name: selectedFile ? selectedFile.name : formData.file_name || 'Van_Ban.pdf',
      file_url: finalStatus ? finalStatus.file_url : formData.file_url || fallbackUrl,
      storage_provider: finalStatus ? finalStatus.storage_provider : 'supabase'
    });
    
    setFormData({ doc_number: '', title: '', recipient_scope: 'ALL', file_name: '', file_url: '' });
    setSelectedFile(null);
    setUploadStatus(null);
    onClose();
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
              <Send className="text-primary" size={20} />
              Ban Hành Văn Bản Mới
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Số / Ký hiệu văn bản <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="92-CV/ĐTN"
                    required
                    value={formData.doc_number}
                    onChange={(e) => setFormData({ ...formData, doc_number: e.target.value })}
                  />
                </div>
                <div className="col-md-8">
                  <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Tên / Trích yếu văn bản <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Công văn v/v triển khai công tác phong trào..."
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Đơn vị nhận văn bản</label>
                <select
                  className="form-select"
                  value={formData.recipient_scope}
                  onChange={(e) => setFormData({ ...formData, recipient_scope: e.target.value })}
                >
                  <option value="ALL">📢 Gửi tất cả 30 Chi đoàn Ấp trực thuộc</option>
                  <optgroup label="🏆 Cụm Thi Đua">
                    {COMPETITION_CLUSTERS.map(c => (
                      <option key={c.id} value={c.name}>🏆 {c.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="📍 Chi đoàn Ấp cụ thể">
                    {INITIAL_BRANCHES.map(b => (
                      <option key={b.id} value={b.name}>📍 {b.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Đính kèm tệp văn bản PDF</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <div className="mt-2 p-2 bg-success-subtle rounded-2 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <FileText size={16} className="text-success" />
                      <span className="text-success fw-semibold" style={{ fontSize: '12.5px' }}>
                        Đã chọn: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    {uploadStatus && (
                      <span className={`badge ${uploadStatus.storage_provider === 'google_drive' ? 'bg-warning text-dark' : 'bg-success text-white'}`}>
                        {uploadStatus.storage_provider === 'google_drive' ? '☁️ Google Drive Backup' : '⚡ Supabase Storage'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light border px-4" onClick={onClose}>Hủy</button>
              <button type="submit" className="btn btn-primary px-4 fw-semibold" style={{ backgroundColor: '#0066FF' }} disabled={isUploading}>
                {isUploading ? 'Đang tải tệp...' : 'Ban Hành Văn Bản Ngay'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// 3. Submit Document Modal
export function SubmitDocumentModal({ show, onClose, onSave, currentRole }) {
  const [formData, setFormData] = useState({ title: '', file_name: '', file_url: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  if (!show) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsUploading(true);
      const res = await uploadPdfWithFailover(file);
      setIsUploading(false);
      setUploadStatus(res);
      setFormData(prev => ({ 
        ...prev, 
        file_name: file.name, 
        file_url: res.file_url, 
        storage_provider: res.storage_provider 
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    confetti({ particleCount: 90, spread: 90, origin: { y: 0.6 } });

    let finalStatus = uploadStatus;
    if (!finalStatus && selectedFile) {
      setIsUploading(true);
      finalStatus = await uploadPdfWithFailover(selectedFile);
      setIsUploading(false);
    }

    const fallbackUrl = `https://drive.google.com/drive/search?q=${encodeURIComponent(formData.title || 'Bao_Cao')}`;

    onSave && onSave({ 
      ...formData, 
      file_name: selectedFile ? selectedFile.name : formData.file_name || 'Bao_Cao.pdf',
      file_url: finalStatus ? finalStatus.file_url : formData.file_url || fallbackUrl,
      storage_provider: finalStatus ? finalStatus.storage_provider : 'supabase'
    });
    
    setFormData({ title: '', file_name: '', file_url: '' });
    setSelectedFile(null);
    setUploadStatus(null);
    onClose();
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
              <Upload className="text-primary" size={20} />
              Nộp Báo Cáo / Văn Bản lên Đoàn xã
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Đơn vị nộp</label>
                <input type="text" className="form-control bg-light" value={currentRole?.full_name || ''} readOnly />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Tên báo cáo / văn bản <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Báo cáo công tác Tháng 5/2026..."
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Đính kèm tệp PDF báo cáo <span className="text-danger">*</span></label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf,.doc,.docx"
                  required
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <div className="mt-2 p-2 bg-success-subtle rounded-2 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <FileText size={16} className="text-success" />
                      <span className="text-success fw-semibold" style={{ fontSize: '12.5px' }}>
                        Đã chọn: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    {uploadStatus && (
                      <span className={`badge ${uploadStatus.storage_provider === 'google_drive' ? 'bg-warning text-dark' : 'bg-success text-white'}`}>
                        {uploadStatus.storage_provider === 'google_drive' ? '☁️ Google Drive Backup' : '⚡ Supabase Storage'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light border px-4" onClick={onClose}>Hủy</button>
              <button type="submit" className="btn btn-success px-4 fw-semibold" disabled={isUploading}>
                {isUploading ? 'Đang tải báo cáo...' : 'Nộp Báo Cáo Ngay'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// 4. Send Message / Notification Modal (Supports Create & Edit)
export function SendMessageModal({ show, onClose, onSave, currentRole, editData = null }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetScope, setTargetScope] = useState('ALL');
  const [priority, setPriority] = useState('Bình thường');
  const [time, setTime] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (editData) {
      setTitle(editData.title || '');
      setContent(editData.content || '');
      setTargetScope(editData.target_scope === 'Tất cả 30 Chi đoàn Ấp' ? 'ALL' : editData.target_scope || 'ALL');
      setPriority(editData.priority || 'Bình thường');
      setTime(editData.activity_details?.time || editData.time || '');
      setDateStr(editData.activity_details?.date || (editData.activity_details?.day ? `${editData.activity_details.day} ${editData.activity_details.month}` : false) || editData.date || '');
      setLocation(editData.activity_details?.location || editData.location || '');
    } else {
      setTitle('');
      setContent('');
      setTargetScope('ALL');
      setPriority('Bình thường');
      setTime('');
      setDateStr('');
      setLocation('');
    }
  }, [editData, show]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    confetti({ particleCount: 85, spread: 85, origin: { y: 0.6 } });
    
    const scopeText = targetScope === 'ALL' ? 'Tất cả 30 Chi đoàn Ấp' : targetScope;
    const finalTime = time.trim() || '23:24 - 23:25';
    const finalDate = dateStr.trim() || '04 THÁNG 9';
    const finalLocation = location.trim() || 'tai here';

    onSave && onSave({
      id: editData ? editData.id : `noti-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      target_scope: scopeText,
      priority: priority,
      time: finalTime,
      date: finalDate,
      location: finalLocation,
      activity_details: {
        time: finalTime,
        date: finalDate,
        location: finalLocation,
        notes: 'Đề nghị 30 Chi đoàn Ấp triển khai tham gia đầy đủ và đúng thời gian quy định.'
      },
      time_ago: editData ? (editData.time_ago || 'Vừa xong') : 'Vừa xong',
      createdAt: editData ? (editData.createdAt || Date.now()) : Date.now()
    });
    setTitle('');
    setContent('');
    setTargetScope('ALL');
    setPriority('Bình thường');
    setTime('');
    setDateStr('');
    setLocation('');
    onClose();
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
          <div className="modal-header border-bottom-0 pb-0">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
              <Megaphone className="text-primary" size={22} />
              {editData ? 'Chỉnh Sửa / Cập Nhật Thông Báo' : 'Gửi Thông Báo / Chỉ Đạo Điều Hành'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="row g-2 mb-3">
                <div className="col-md-7">
                  <label className="form-label fw-semibold text-dark" style={{ fontSize: '13px' }}>Đơn vị nhận thông báo</label>
                  <select 
                    className="form-select"
                    value={targetScope}
                    onChange={(e) => setTargetScope(e.target.value)}
                  >
                    <option value="ALL">📢 Gửi tất cả 30 Chi đoàn Ấp trực thuộc</option>
                    <optgroup label="🏆 Cụm Thi Đua">
                      {COMPETITION_CLUSTERS.map(c => (
                        <option key={c.id} value={c.name}>🏆 {c.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="📍 Các Chi đoàn Ấp trực thuộc">
                      {INITIAL_BRANCHES.map(b => (
                        <option key={b.id} value={b.name}>📍 {b.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div className="col-md-5">
                  <label className="form-label fw-semibold text-dark" style={{ fontSize: '13px' }}>Mức độ ưu tiên</label>
                  <select
                    className="form-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Khẩn cấp">🔥 Khẩn cấp (Cao)</option>
                    <option value="Trung bình">⚡ Trung bình</option>
                    <option value="Bình thường">🟢 Bình thường</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-dark" style={{ fontSize: '13px' }}>Tiêu đề thông báo <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: Thông báo khẩn v/v lịch họp Ban chấp hành..."
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Time, Date, Location fields requested by user */}
              <div className="row g-2 mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-dark d-flex align-items-center gap-1" style={{ fontSize: '13px' }}>
                    <Clock size={14} className="text-primary" />
                    <span>Thời gian</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ví dụ: 23:24 - 23:25"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-dark d-flex align-items-center gap-1" style={{ fontSize: '13px' }}>
                    <Calendar size={14} className="text-primary" />
                    <span>Ngày tháng</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ví dụ: 04 THÁNG 9"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-dark d-flex align-items-center gap-1" style={{ fontSize: '13px' }}>
                    <MapPin size={14} className="text-danger" />
                    <span>Địa điểm</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ví dụ: tai here..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-dark" style={{ fontSize: '13px' }}>Nội dung thông báo <span className="text-danger">*</span></label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Nhập chi tiết thông tin truyền tải tới các Chi đoàn Ấp..."
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer border-top-0 pt-0">
              <button type="button" className="btn btn-light border px-4 rounded-3" onClick={onClose}>Hủy</button>
              <button type="submit" className="btn btn-primary px-4 fw-semibold rounded-3 d-flex align-items-center gap-2" style={{ backgroundColor: '#0066FF' }}>
                <Send size={15} />
                <span>{editData ? 'Lưu Thay Đổi' : 'Gửi Thông Báo Ngay'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// 5. Support Contact Modal
export function SupportModal({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
              <PhoneCall className="text-primary" size={20} />
              Hỗ Trợ Sử Dụng Hệ Thống
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4 text-center">
            <div className="p-3 rounded-circle bg-primary-subtle text-primary d-inline-block mb-3">
              <PhoneCall size={36} />
            </div>
            <h6 className="fw-bold text-dark">Đoàn xã Xuân Thới Sơn</h6>
            <p className="text-secondary" style={{ fontSize: '13px' }}>
              Bộ phận hỗ trợ kỹ thuật và văn thư Đoàn xã luôn sẵn sàng hỗ trợ.
            </p>
            <div className="bg-light p-3 rounded-3 text-start mb-3" style={{ fontSize: '13px' }}>
              <div className="mb-2"><strong>Hotline Kỹ Thuật:</strong> 0908.123.456</div>
              <div className="mb-2"><strong>Email tiếp nhận:</strong> {DOAN_XA_GMAIL}</div>
              <div><strong>Văn phòng:</strong> {OFFICIAL_ADDRESS}</div>
            </div>
          </div>
          <div className="modal-footer justify-content-center">
            <button type="button" className="btn-primary btn px-4 fw-semibold" onClick={onClose}>Đóng Cửa Sổ</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. Create Task / Todo Modal
export function CreateTaskModal({ show, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    assigned_to: 'Đoàn xã Xuân Thới Sơn',
    priority: 'Bình thường',
    dueDate: 'Hôm nay'
  });

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    confetti({ particleCount: 75, spread: 75, origin: { y: 0.6 } });
    onSave && onSave(formData);
    setFormData({ title: '', assigned_to: 'Đoàn xã Xuân Thới Sơn', priority: 'Bình thường', dueDate: 'Hôm nay' });
    onClose();
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
              <CheckSquare className="text-primary" size={20} />
              Giao Nhiệm vụ / Thêm Công việc Mới
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Tên nhiệm vụ / công việc <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: Rà soát danh sách đoàn viên ưu tú 30 Ấp..."
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Phân công thực hiện</label>
                  <select
                    className="form-select"
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  >
                    <option value="Đoàn xã Xuân Thới Sơn">🏛️ Đoàn xã Xuân Thới Sơn</option>
                    <option value="Tất cả 30 Chi đoàn Ấp">📢 30 Chi đoàn (gửi thông báo đến toàn bộ 30 chi đoàn)</option>

                    <optgroup label="🏆 Cụm Thi Đua">
                      {COMPETITION_CLUSTERS.map(c => (
                        <option key={c.id} value={c.name}>
                          🏆 {c.label}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="📍 Các Chi đoàn Ấp trực thuộc">
                      {INITIAL_BRANCHES.map(b => (
                        <option key={b.id} value={b.name}>📍 {b.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Mức độ ưu tiên</label>
                  <select
                    className="form-select"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="Bình thường">Bình thường</option>
                    <option value="Cao">🔥 Cao (Khẩn)</option>
                    <option value="Trung bình">Trung bình</option>
                  </select>
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Hạn hoàn thành <span className="text-danger">*</span></label>
                <input
                  type="date"
                  className="form-control"
                  required
                  onChange={(e) => {
                    const parts = e.target.value.split('-');
                    if (parts.length === 3) {
                      setFormData({ ...formData, dueDate: `${parts[2]}/${parts[1]}/${parts[0]}` });
                    }
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light border px-4" onClick={onClose}>Hủy</button>
              <button type="submit" className="btn btn-primary px-4 fw-semibold" style={{ backgroundColor: '#0066FF' }}>
                Tạo Công Việc Ngay
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// 7. Activity Attendance & Urgent Task Evaluation Modal
export function ActivityAttendanceModal({ show, onClose, activities = [], attendanceRecords = {}, onSaveAttendance }) {
  const [selectedActivityId, setSelectedActivityId] = useState('');
  const [attendanceData, setAttendanceData] = useState({});
  const [isUrgentTask, setIsUrgentTask] = useState(false);

  useEffect(() => {
    if (activities && activities.length > 0 && !selectedActivityId) {
      setSelectedActivityId(activities[0].id);
    }
  }, [activities, show]);

  useEffect(() => {
    if (selectedActivityId) {
      const record = attendanceRecords[selectedActivityId] || {};
      const initialMap = {};
      INITIAL_BRANCHES.forEach(b => {
        initialMap[b.name] = record[b.name] !== undefined ? record[b.name] : true;
      });
      setAttendanceData(initialMap);
      setIsUrgentTask(record.isUrgentTask || false);
    }
  }, [selectedActivityId, attendanceRecords, show]);

  if (!show) return null;

  const handleToggleBranch = (branchName) => {
    setAttendanceData(prev => ({
      ...prev,
      [branchName]: !prev[branchName]
    }));
  };

  const handleSelectAll = (val) => {
    const nextMap = {};
    INITIAL_BRANCHES.forEach(b => {
      nextMap[b.name] = val;
    });
    setAttendanceData(nextMap);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    if (selectedActivityId) {
      onSaveAttendance && onSaveAttendance(selectedActivityId, {
        ...attendanceData,
        isUrgentTask
      });
    }
    onClose();
  };

  const attendedCount = Object.values(attendanceData).filter(Boolean).length;

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
          <div className="modal-header border-bottom pb-3">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
              <CheckCircle className="text-success" size={22} />
              Điểm Danh & Kiểm Tra Số Lượng Chi Đoàn Tham Gia
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {/* Select Activity / Task */}
              <div className="row g-3 mb-3">
                <div className="col-md-8">
                  <label className="form-label fw-semibold text-dark" style={{ fontSize: '13px' }}>Chọn Hoạt động / Công việc phát động</label>
                  <select 
                    className="form-select"
                    value={selectedActivityId}
                    onChange={(e) => setSelectedActivityId(e.target.value)}
                  >
                    {activities.map(act => (
                      <option key={act.id} value={act.id}>
                        📌 {act.title} ({act.date || act.dueDate || 'Hoạt động Đoàn'})
                      </option>
                    ))}
                    {activities.length === 0 && (
                      <option value="default-act">📌 Hoạt động phát động chung 30 Chi đoàn Ấp</option>
                    )}
                  </select>
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <div className="form-check form-switch p-2 bg-warning-subtle rounded-3 border border-warning-subtle w-100 mb-0">
                    <input 
                      className="form-check-input ms-1 me-2 cursor-pointer" 
                      type="checkbox" 
                      id="urgentTaskCheck"
                      checked={isUrgentTask}
                      onChange={(e) => setIsUrgentTask(e.target.checked)}
                    />
                    <label className="form-check-label fw-bold text-warning-emphasis cursor-pointer" htmlFor="urgentTaskCheck" style={{ fontSize: '12px' }}>
                      ⚡ Công việc đột xuất / Bất ngờ
                    </label>
                  </div>
                </div>
              </div>

              {/* Attendance Quick Tools & Counter */}
              <div className="p-3 bg-light rounded-3 border mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
                <div>
                  <span className="fw-bold text-dark" style={{ fontSize: '13.5px' }}>
                    Kết quả điểm danh: <span className="text-primary fw-extrabold">{attendedCount} / 30</span> Chi đoàn tham gia
                  </span>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>
                    Tỷ lệ tham gia đợt này: <strong className="text-success">{Math.round((attendedCount / 30) * 100)}%</strong>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-success fw-semibold px-2.5 py-1"
                    style={{ fontSize: '11.5px' }}
                    onClick={() => handleSelectAll(true)}
                  >
                    ✓ Chọn tất cả (30/30)
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-secondary fw-semibold px-2.5 py-1"
                    style={{ fontSize: '11.5px' }}
                    onClick={() => handleSelectAll(false)}
                  >
                    ✗ Bỏ chọn tất cả
                  </button>
                </div>
              </div>

              {/* 30 Hamlets Checklist Grid */}
              <div className="row g-2" style={{ maxHeight: '340px', overflowY: 'auto' }}>
                {INITIAL_BRANCHES.map((b) => {
                  const isChecked = Boolean(attendanceData[b.name]);
                  return (
                    <div key={b.id} className="col-12 col-md-6 col-lg-4">
                      <div 
                        className={`p-2.5 rounded-3 border cursor-pointer transition d-flex align-items-center justify-content-between ${isChecked ? 'bg-success-subtle border-success' : 'bg-white border-light-subtle opacity-75'}`}
                        onClick={() => handleToggleBranch(b.name)}
                      >
                        <div>
                          <div className="fw-bold text-dark" style={{ fontSize: '12.5px' }}>{b.name}</div>
                          <div className="text-muted" style={{ fontSize: '10.5px' }}>Bí thư: {b.secretary_name}</div>
                        </div>
                        <input 
                          type="checkbox" 
                          className="form-check-input cursor-pointer"
                          checked={isChecked}
                          onChange={() => handleToggleBranch(b.name)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal-footer border-top pt-2">
              <button type="button" className="btn btn-light border px-4" onClick={onClose}>Hủy</button>
              <button type="submit" className="btn btn-success px-4 fw-semibold d-flex align-items-center gap-2" style={{ backgroundColor: '#16A34A', border: 'none' }}>
                <CheckCircle size={16} />
                <span>Lưu Điểm Danh & Đánh Giá</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// 8. Activity Detail & Response Modal for Chi Đoàn
export function ActivityDetailModal({ 
  show, 
  onClose, 
  activity = null, 
  currentRole = {}, 
  attendanceRecords = {}, 
  onRespondAttendance 
}) {
  const [isAbsenceMode, setIsAbsenceMode] = useState(false);
  const [absenceReason, setAbsenceReason] = useState('');

  if (!show || !activity) return null;

  const userBranchName = currentRole?.full_name || 'Chi đoàn Ấp Bùi Môn';
  const activityAttendance = attendanceRecords[activity.id] || {};
  const currentBranchRecord = activityAttendance[userBranchName];
  
  const hasAttended = typeof currentBranchRecord === 'boolean' 
    ? currentBranchRecord 
    : (currentBranchRecord?.attended !== undefined ? currentBranchRecord.attended : null);
  
  const savedReason = typeof currentBranchRecord === 'object' ? currentBranchRecord.reason : '';

  const handleConfirmAttend = () => {
    confetti({ particleCount: 75, spread: 75, origin: { y: 0.6 } });
    onRespondAttendance && onRespondAttendance(activity.id, userBranchName, true, '');
    setIsAbsenceMode(false);
    onClose();
  };

  const handleSubmitAbsence = (e) => {
    e.preventDefault();
    if (!absenceReason.trim()) {
      alert('Vui lòng nhập lý do chính đáng để gửi báo vắng!');
      return;
    }
    onRespondAttendance && onRespondAttendance(activity.id, userBranchName, false, absenceReason.trim());
    setIsAbsenceMode(false);
    setAbsenceReason('');
    onClose();
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
          <div className="modal-header border-bottom pb-3">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
              <Calendar className="text-primary" size={22} />
              Thông Tin Chi Tiết Hoạt Động & Xác Nhận Tham Gia
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            {/* Header info card */}
            <div className="p-3 bg-light rounded-3 border mb-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 fw-bold" style={{ fontSize: '11.5px' }}>
                  📌 Phân công: {activity.assigned_to || 'Tất cả 30 Chi đoàn Ấp'}
                </span>
                <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 fw-bold" style={{ fontSize: '11.5px' }}>
                  {activity.status || 'Sắp diễn ra'}
                </span>
              </div>
              <h4 className="fw-bold text-dark mb-2" style={{ fontSize: '18px' }}>
                {activity.title}
              </h4>
              <div className="row g-2 text-secondary" style={{ fontSize: '12.5px' }}>
                <div className="col-12 col-md-6 d-flex align-items-center gap-1.5">
                  <Clock size={15} className="text-primary" />
                  <span>Thời gian: <strong>{activity.time} ({activity.day}/{activity.month})</strong></span>
                </div>
                <div className="col-12 col-md-6 d-flex align-items-center gap-1.5">
                  <MapPin size={15} className="text-danger" />
                  <span>Địa điểm: <strong>{activity.location || OFFICIAL_ADDRESS}</strong></span>
                </div>
              </div>
            </div>

            {/* Description */}
            {activity.description && (
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '13px' }}>📋 Nội dung chi tiết chương trình:</label>
                <div className="p-3 bg-white border rounded-3 text-secondary" style={{ fontSize: '13px', whiteSpace: 'pre-line' }}>
                  {activity.description}
                </div>
              </div>
            )}

            {/* Notes / Important Warnings */}
            <div className="mb-3 p-3 bg-warning-subtle border border-warning-subtle rounded-3">
              <div className="fw-bold text-warning-emphasis d-flex align-items-center gap-2 mb-1" style={{ fontSize: '13px' }}>
                <Bell size={16} />
                <span>Lưu ý & Ghi chú quan trọng từ Ban Thường vụ Đoàn xã:</span>
              </div>
              <div className="text-warning-emphasis" style={{ fontSize: '12.5px' }}>
                {activity.notes || 'Trang phục: Áo màu xanh Thanh niên Việt Nam. Yêu cầu các Chi đoàn đăng ký danh sách tham gia đúng hạn để Ban Thường vụ tổng hợp thi đua.'}
              </div>
            </div>

            {/* Attached Document File Section */}
            <div className="mb-4">
              <label className="fw-bold text-dark mb-2 d-flex align-items-center gap-2" style={{ fontSize: '13px' }}>
                <FileText className="text-primary" size={18} />
                <span>Văn bản triển khai đính kèm:</span>
              </label>
              {activity.file_name || activity.file_url ? (
                <div className="p-3 bg-primary-subtle border border-primary-subtle rounded-3 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <FileText size={22} className="text-primary" />
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>
                        {activity.file_name || 'Ke_hoach_trien_khai_hoat_dong.pdf'}
                      </div>
                      <div className="text-muted" style={{ fontSize: '11px' }}>Văn bản chỉ đạo chính thức từ Đoàn xã</div>
                    </div>
                  </div>
                  <a 
                    href={activity.file_url || '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn btn-sm btn-primary fw-semibold d-flex align-items-center gap-1.5 px-3 py-1.5"
                    style={{ fontSize: '12px' }}
                  >
                    <FileText size={14} />
                    <span>Xem / Tải về</span>
                  </a>
                </div>
              ) : (
                <div className="p-3 bg-light border rounded-3 text-muted d-flex align-items-center gap-2" style={{ fontSize: '12.5px' }}>
                  <FileText size={16} />
                  <span>Văn bản kế hoạch triển khai đã được ban hành qua mục "Văn bản đến".</span>
                </div>
              )}
            </div>

            {/* Participation Response Box for Chi Đoàn */}
            <div className="p-3.5 bg-light rounded-3 border">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>
                  🏛️ Trạng thái tham gia của đơn vị: <span className="text-primary">{userBranchName}</span>
                </div>
                {hasAttended === true && (
                  <span className="badge bg-success text-white px-2.5 py-1" style={{ fontSize: '11.5px' }}>
                    ✅ Đã xác nhận THAM GIA
                  </span>
                )}
                {hasAttended === false && (
                  <span className="badge bg-danger text-white px-2.5 py-1" style={{ fontSize: '11.5px' }}>
                    ❌ Đã báo VẮNG MẶT
                  </span>
                )}
              </div>

              {!isAbsenceMode ? (
                <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
                  <button 
                    type="button" 
                    className="btn btn-success fw-semibold px-4 py-2 d-flex align-items-center gap-2 flex-grow-1 justify-content-center"
                    style={{ backgroundColor: '#16A34A', border: 'none' }}
                    onClick={handleConfirmAttend}
                  >
                    <CheckCircle size={18} />
                    <span>Xác Nhận THAM GIA</span>
                  </button>

                  <button 
                    type="button" 
                    className="btn btn-outline-danger fw-semibold px-4 py-2 d-flex align-items-center gap-2 flex-grow-1 justify-content-center"
                    onClick={() => setIsAbsenceMode(true)}
                  >
                    <Trash2 size={16} />
                    <span>Báo VẮNG (Không tham gia)</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitAbsence} className="mt-3 p-3 bg-white rounded-3 border border-danger-subtle">
                  <label className="form-label fw-bold text-danger mb-1" style={{ fontSize: '13px' }}>
                    Nhập lý do chính đáng không thể tham gia: <span className="text-danger">*</span>
                  </label>
                  <textarea 
                    className="form-control mb-2"
                    rows="3"
                    placeholder="Ví dụ: Bí thư và đoàn viên chi đoàn bận trùng lịch công tác đột xuất cấp ủy chỉ đạo..."
                    required
                    value={absenceReason}
                    onChange={(e) => setAbsenceReason(e.target.value)}
                  ></textarea>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-sm btn-light border" onClick={() => setIsAbsenceMode(false)}>Hủy</button>
                    <button type="submit" className="btn btn-sm btn-danger px-3 fw-semibold">
                      Gửi Báo Vắng
                    </button>
                  </div>
                </form>
              )}

              {savedReason && (
                <div className="mt-2.5 p-2 bg-white rounded-2 border text-danger" style={{ fontSize: '11.5px' }}>
                  <strong>Lý do vắng mặt đã ghi nhận:</strong> {savedReason}
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer border-top pt-2">
            <button type="button" className="btn btn-secondary px-4 fw-semibold" onClick={onClose}>Đóng Cửa Sổ</button>
          </div>
        </div>
      </div>
    </div>
  );
}

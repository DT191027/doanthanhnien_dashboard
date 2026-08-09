import React, { useState } from 'react';
import { Upload, Send, Calendar, FileText, PhoneCall, MessageSquare, Megaphone, HardDrive, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_BRANCHES, OFFICIAL_ADDRESS } from '../lib/supabase';
import { uploadPdfWithFailover, DOAN_XA_GMAIL } from '../lib/storageStrategy';

// 1. Create Activity Modal
export function CreateActivityModal({ show, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    day: '',
    month: '',
    time: '',
    location: '',
    description: ''
  });

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    onSave && onSave({
      ...formData,
      location: formData.location || OFFICIAL_ADDRESS
    });
    setFormData({ title: '', day: '', month: '', time: '', location: '', description: '' });
    onClose();
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
              <Calendar className="text-primary" size={20} />
              Tạo Hoạt động Mới
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
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
                <div className="col-6">
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
                <div className="col-6">
                  <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Ngày tổ chức <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    className="form-control"
                    required
                    onChange={(e) => {
                      const d = new Date(e.target.value);
                      const months = ['THÁNG 1','THÁNG 2','THÁNG 3','THÁNG 4','THÁNG 5','THÁNG 6','THÁNG 7','THÁNG 8','THÁNG 9','THÁNG 10','THÁNG 11','THÁNG 12'];
                      setFormData({ 
                        ...formData, 
                        day: String(d.getDate()).padStart(2, '0'),
                        month: months[d.getMonth()]
                      });
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

              <div className="mb-2">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Mô tả chi tiết</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Nội dung chương trình, yêu cầu tham gia..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light border px-4" onClick={onClose}>Hủy</button>
              <button type="submit" className="btn btn-primary px-4 fw-semibold" style={{ backgroundColor: '#0066FF' }}>
                Tạo Hoạt Động
              </button>
            </div>
          </form>
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
                  <option value="ALL">Gửi tất cả 30 Chi đoàn Ấp trực thuộc</option>
                  {INITIAL_BRANCHES.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
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

// 4. Send Message / Notification Modal
export function SendMessageModal({ show, onClose, onSave, currentRole }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetScope, setTargetScope] = useState('ALL');

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    confetti({ particleCount: 85, spread: 85, origin: { y: 0.6 } });
    
    const scopeText = targetScope === 'ALL' ? 'Tất cả 30 Chi đoàn Ấp' : targetScope;
    onSave && onSave({
      id: `noti-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      target_scope: scopeText,
      time_ago: 'Vừa xong'
    });
    setTitle('');
    setContent('');
    setTargetScope('ALL');
    onClose();
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
          <div className="modal-header border-bottom-0 pb-0">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
              <Megaphone className="text-primary" size={22} />
              Gửi Thông Báo / Chỉ Đạo Điều Hành
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark" style={{ fontSize: '13px' }}>Đơn vị nhận thông báo</label>
                <select 
                  className="form-select"
                  value={targetScope}
                  onChange={(e) => setTargetScope(e.target.value)}
                >
                  <option value="ALL">📢 Gửi tất cả 30 Chi đoàn Ấp trực thuộc</option>
                  {INITIAL_BRANCHES.map(b => (
                    <option key={b.id} value={b.name}>📍 {b.name}</option>
                  ))}
                </select>
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
                <span>Gửi Thông Báo Ngay</span>
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

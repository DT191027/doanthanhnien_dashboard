import React, { useState } from 'react';
import { Upload, Send, Calendar, FileText, PhoneCall } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_BRANCHES } from '../lib/supabase';

// 1. Create Activity Modal
export function CreateActivityModal({ show, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: 'Ra quân Ngày Chủ nhật xanh năm 2026',
    day: '25',
    month: 'THÁNG 5',
    time: '08:00 - 11:30',
    location: 'Hội trường UBND xã Xuân Thới Sơn',
    description: 'Chương trình phát động thi đua chào mừng ngày thành lập Đoàn.'
  });

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    onSave && onSave(formData);
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
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Tên hoạt động</label>
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
                  <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Thời gian thực hiện</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Ngày diễn ra</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value="25/05/2026"
                    readOnly
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Địa điểm tổ chức</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="mb-2">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Mô tả chi tiết</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
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

// 2. Issue Document Modal (Ban hành văn bản cho Đoàn xã)
export function IssueDocumentModal({ show, onClose, onSave }) {
  const [formData, setFormData] = useState({
    doc_number: '92-CV/ĐTN',
    title: 'Công văn v/v triển khai công tác phong trào tháng 6/2026',
    recipient_scope: 'ALL',
    file_name: 'Mau_Cong_Van_92_DX.pdf'
  });

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    onSave && onSave(formData);
    onClose();
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
              <Send className="text-primary" size={20} />
              Ban Hành Văn Bản Mới (Đoàn xã)
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Số / Ký hiệu văn bản</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={formData.doc_number}
                    onChange={(e) => setFormData({ ...formData, doc_number: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-8">
                  <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Tên / Trích yếu văn bản</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
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
                  <option value="ALL">-- Gửi tất cả 30 Chi đoàn Ấp trực thuộc --</option>
                  {INITIAL_BRANCHES.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Đính kèm tệp văn bản PDF mẫu</label>
                <div className="border border-2 border-dashed rounded-3 p-3 bg-light d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <FileText size={24} className="text-danger" />
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: '12.5px' }}>{formData.file_name}</div>
                      <div className="text-muted" style={{ fontSize: '10.5px' }}>Đã sẵn sàng tải lên và gửi tới 30 Ấp</div>
                    </div>
                  </div>
                  <a href="/Mau_Cong_Van_92_DX.pdf" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">
                    Xem mẫu PDF
                  </a>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light border px-4" onClick={onClose}>Hủy</button>
              <button type="submit" className="btn btn-primary px-4 fw-semibold" style={{ backgroundColor: '#0066FF' }}>
                Ban Hành Văn Bản Ngay
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// 3. Submit Document Modal (Nộp văn bản cho Chi đoàn Ấp)
export function SubmitDocumentModal({ show, onClose, onSave, currentRole }) {
  const [formData, setFormData] = useState({
    title: 'Báo cáo công tác Tháng 5/2026',
    file_name: 'Bao_Cao_T5_ApBuiMon.pdf'
  });

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    confetti({ particleCount: 90, spread: 90, origin: { y: 0.6 } });
    onSave && onSave(formData);
    onClose();
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
              <Upload className="text-primary" size={20} />
              Nộp Báo Cáo / Văn Bản lên Đoàn Xã
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Đơn vị nộp</label>
                <input type="text" className="form-control bg-light" value={currentRole.full_name} readOnly />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Tên báo cáo / văn bản</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Đính kèm tệp PDF báo cáo mẫu</label>
                <div className="border border-2 border-dashed rounded-3 p-3 bg-light d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <FileText size={24} className="text-success" />
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: '12.5px' }}>{formData.file_name}</div>
                      <div className="text-muted" style={{ fontSize: '10.5px' }}>Đã ký tên và sẵn sàng nộp</div>
                    </div>
                  </div>
                  <a href="/Bao_Cao_T5_ApBuiMon.pdf" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-success">
                    Xem mẫu PDF
                  </a>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light border px-4" onClick={onClose}>Hủy</button>
              <button type="submit" className="btn btn-success px-4 fw-semibold">
                Nộp Báo Cáo Ngay
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// 4. Support Contact Modal
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
              Bộ phận hỗ trợ kỹ thuật và văn thư Đoàn xã luôn sẵn sàng hỗ trợ 24/7.
            </p>

            <div className="bg-light p-3 rounded-3 text-start mb-3" style={{ fontSize: '13px' }}>
              <div className="mb-2"><strong>📞 Hotline Kỹ Thuật:</strong> 0908.123.456</div>
              <div className="mb-2"><strong>✉️ Email tiếp nhận:</strong> doanxaxuanthoison@tphcm.gov.vn</div>
              <div><strong>🏢 Văn phòng:</strong> Trụ sở UBND xã Xuân Thới Sơn, Thành phố Hồ Chí Minh</div>
            </div>
          </div>
          <div className="modal-footer justify-content-center">
            <button type="button" className="btn btn-primary px-4 fw-semibold" onClick={onClose}>Đóng Cửa Sổ</button>
          </div>
        </div>
      </div>
    </div>
  );
}

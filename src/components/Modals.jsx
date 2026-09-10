import React, { useState, useEffect } from 'react';
import { Upload, Send, Calendar, FileText, PhoneCall, MessageSquare, Megaphone, HardDrive, CheckCircle, CheckSquare, Eye, Clock, MapPin, Bell, Trash2, Users, UserCheck, Building, Plus, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_BRANCHES, OFFICIAL_ADDRESS, COMPETITION_CLUSTERS, formatDateDDMMYYYY, getPriorityBadgeStyle, getActivityTimeStatus } from '../lib/supabase';
import { uploadPdfWithFailover, DOAN_XA_GMAIL } from '../lib/storageStrategy';
import { ReceiptConfirmationBox } from './SecondaryViews';

// Component chọn nhiều đơn vị nhận / phân công
export function MultiUnitSelect({ selected = [], onChange, label = 'Phân công đơn vị' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  const selectedList = Array.isArray(selected)
    ? selected
    : (selected && selected !== 'ALL' && selected !== 'Tất cả 30 Chi đoàn Ấp' ? [selected] : ['Tất cả 30 Chi đoàn Ấp']);

  const isAllSelected = selectedList.includes('Tất cả 30 Chi đoàn Ấp') || selectedList.includes('ALL') || selectedList.length === INITIAL_BRANCHES.length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(['Tất cả 30 Chi đoàn Ấp']);
    }
  };

  const handleToggleCluster = (cluster) => {
    const clusterBranchNames = cluster.branches || [];
    let current = isAllSelected ? INITIAL_BRANCHES.map(b => b.name) : selectedList.filter(s => s !== 'Tất cả 30 Chi đoàn Ấp' && s !== 'ALL');
    const hasAllCluster = clusterBranchNames.every(b => current.includes(b));

    let updated;
    if (hasAllCluster) {
      updated = current.filter(b => !clusterBranchNames.includes(b));
    } else {
      updated = Array.from(new Set([...current, ...clusterBranchNames]));
    }
    if (updated.length === INITIAL_BRANCHES.length || updated.length === 0) {
      updated = ['Tất cả 30 Chi đoàn Ấp'];
    }
    onChange(updated);
  };

  const handleToggleBranch = (branchName) => {
    let current = isAllSelected ? INITIAL_BRANCHES.map(b => b.name) : selectedList.filter(s => s !== 'Tất cả 30 Chi đoàn Ấp' && s !== 'ALL');
    if (current.includes(branchName)) {
      current = current.filter(b => b !== branchName);
    } else {
      current = [...current, branchName];
    }
    if (current.length === INITIAL_BRANCHES.length || current.length === 0) {
      current = ['Tất cả 30 Chi đoàn Ấp'];
    }
    onChange(current);
  };

  const renderDisplayText = () => {
    if (isAllSelected || selectedList.length === 0) {
      return '📢 Tất cả 30 Chi đoàn Ấp trực thuộc';
    }
    if (selectedList.length === 1) {
      return `📍 ${selectedList[0]}`;
    }
    return `📌 Đã chọn (${selectedList.length} đơn vị): ${selectedList.slice(0, 2).join(', ')}${selectedList.length > 2 ? '...' : ''}`;
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        type="button"
        className="form-select text-start d-flex align-items-center justify-content-between bg-white border"
        style={{ fontSize: '13px', minHeight: '38px' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-truncate fw-medium">{renderDisplayText()}</span>
      </button>

      {isOpen && (
        <div 
          className="position-absolute start-0 end-0 mt-1 bg-white border rounded-3 shadow-lg p-2 text-dark" 
          style={{ zIndex: 1085, maxHeight: '300px', overflowY: 'auto' }}
        >
          <div 
            className="p-2 rounded hover-bg-light cursor-pointer d-flex align-items-center gap-2 fw-bold text-primary border-bottom mb-1"
            onClick={handleToggleAll}
            style={{ fontSize: '12.5px' }}
          >
            <input 
              type="checkbox" 
              className="form-check-input mt-0 cursor-pointer" 
              checked={isAllSelected}
              onChange={() => {}}
            />
            <span>📢 Gửi tất cả 30 Chi đoàn Ấp trực thuộc</span>
          </div>

          <div className="fw-bold text-secondary px-2 pt-1 pb-1" style={{ fontSize: '11.5px', textTransform: 'uppercase' }}>
            🏆 Cụm Thi Đua
          </div>
          {COMPETITION_CLUSTERS.map(cluster => {
            const clusterBranchNames = cluster.branches || [];
            const isClusterChecked = isAllSelected || clusterBranchNames.every(b => selectedList.includes(b));
            return (
              <div 
                key={cluster.id}
                className="p-2 rounded hover-bg-light cursor-pointer d-flex align-items-center gap-2"
                onClick={() => handleToggleCluster(cluster)}
                style={{ fontSize: '12px' }}
              >
                <input 
                  type="checkbox" 
                  className="form-check-input mt-0 cursor-pointer" 
                  checked={isClusterChecked}
                  onChange={() => {}}
                />
                <div>
                  <span className="fw-semibold">🏆 {cluster.label}</span>
                  <div className="text-muted" style={{ fontSize: '10.5px' }}>({cluster.branches?.join(', ')})</div>
                </div>
              </div>
            );
          })}

          <div className="fw-bold text-secondary px-2 pt-2 pb-1 border-top mt-1" style={{ fontSize: '11.5px', textTransform: 'uppercase' }}>
            📍 Các Chi đoàn Ấp trực thuộc
          </div>
          {INITIAL_BRANCHES.map(branch => {
            const isBranchChecked = isAllSelected || selectedList.includes(branch.name);
            return (
              <div 
                key={branch.id}
                className="p-2 rounded hover-bg-light cursor-pointer d-flex align-items-center gap-2"
                onClick={() => handleToggleBranch(branch.name)}
                style={{ fontSize: '12.5px' }}
              >
                <input 
                  type="checkbox" 
                  className="form-check-input mt-0 cursor-pointer" 
                  checked={isBranchChecked}
                  onChange={() => {}}
                />
                <span>📍 {branch.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// 1. Create Activity Modal with 3-Step Wizard & Sub-task force division
export function CreateActivityModal({ show, onClose, onSave }) {
  const [step, setStep] = useState(1);
  const [hasSubTasks, setHasSubTasks] = useState(true);
  const [subTasks, setSubTasks] = useState([
    { id: 'sub-1', branch: 'Chi đoàn Ấp Bùi Môn', time: '08:00 - 10:00', location: 'Đường Ấp 1, khu vực Nhà văn hóa', description: 'Trồng cây xanh & dọn vệ sinh tuyến đường' },
    { id: 'sub-2', branch: 'Chi đoàn Ấp Dân Thắng', time: '08:00 - 10:00', location: 'Tuyến đường trước Trường Tiểu học Xuân Thới Sơn', description: 'Tuyên truyền phân loại rác thải' }
  ]);

  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('11:30');

  const [formData, setFormData] = useState({
    title: '',
    priority: 'Bình thường',
    doc_category: 'act_docs',
    day: '',
    month: '',
    year: '',
    time: '08:00 - 11:30',
    location: '',
    description: '',
    notes: '',
    assigned_to: ['Tất cả 30 Chi đoàn Ấp'],
    file_name: '',
    file_url: ''
  });
  const [rawDate, setRawDate] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!show) return null;

  const handleClose = () => {
    setStep(1);
    setIsSubmitting(false);
    onClose && onClose();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    let cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim();
    cleanTitle = cleanTitle.replace(/^(Ke hoach|Thong bao|Quyet dinh|Ke_hoach|Thong_bao|Quyet_dinh)\s*/i, '');
    cleanTitle = cleanTitle ? cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1) : 'Hoạt động Thanh niên mới';

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const uploaded = await uploadPdfWithFailover(file, 'activities_documents');

    setStartTime('08:00');
    setEndTime('11:30');

    setFormData(prev => ({
      ...prev,
      title: prev.title || cleanTitle,
      time: '08:00 - 11:30',
      doc_category: prev.doc_category || 'act_docs',
      day: prev.day || String(today.getDate()).padStart(2, '0'),
      month: prev.month || String(today.getMonth() + 1).padStart(2, '0'),
      year: prev.year || today.getFullYear(),
      location: prev.location || OFFICIAL_ADDRESS,
      notes: prev.notes || 'Đề nghị 30 Chi đoàn Ấp triển khai tham gia đầy đủ và đúng thời gian quy định. Trang phục áo màu xanh Thanh niên Việt Nam.',
      description: prev.description || `Kế hoạch chi tiết chương trình theo văn bản triển khai đính kèm: ${file.name}`,
      assigned_to: prev.assigned_to || ['Tất cả 30 Chi đoàn Ấp'],
      file_name: uploaded.fileName || file.name,
      file_url: uploaded.url || '#'
    }));

    if (!rawDate) setRawDate(todayStr);
    setIsUploading(false);
  };

  const handleAddSubTask = () => {
    const newId = `sub-${Date.now()}`;
    const defaultBranch = INITIAL_BRANCHES[subTasks.length % INITIAL_BRANCHES.length]?.name || 'Chi đoàn Ấp Bùi Môn';
    setSubTasks([
      ...subTasks,
      {
        id: newId,
        branch: defaultBranch,
        time: formData.time || '08:00 - 10:00',
        location: formData.location || 'Khu vực Trung tâm Văn hóa Ấp',
        description: 'Phụ trách công tác tổng vệ sinh và tuyên truyền'
      }
    ]);
  };

  const handleUpdateSubTask = (id, field, value) => {
    setSubTasks(subTasks.map(st => st.id === id ? { ...st, [field]: value } : st));
  };

  const handleRemoveSubTask = (id) => {
    setSubTasks(subTasks.filter(st => st.id !== id));
  };

  const handleSubmitFinal = (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });

    const assignedStr = Array.isArray(formData.assigned_to) 
      ? (formData.assigned_to.length === 0 || formData.assigned_to.includes('Tất cả 30 Chi đoàn Ấp') ? 'Tất cả 30 Chi đoàn Ấp' : formData.assigned_to.join(', '))
      : (formData.assigned_to || 'Tất cả 30 Chi đoàn Ấp');

    const formattedTime = startTime && endTime ? `${startTime} - ${endTime}` : (formData.time || '08:00 - 11:30');

    onSave && onSave({
      ...formData,
      time: formattedTime,
      assigned_to: assignedStr,
      hasSubTasks: hasSubTasks,
      subTasks: hasSubTasks ? subTasks : [],
      priority: formData.priority || 'Bình thường',
      doc_category: formData.doc_category || 'act_docs',
      location: formData.location || OFFICIAL_ADDRESS
    });

    setFormData({
      title: '',
      priority: 'Bình thường',
      doc_category: 'act_docs',
      day: '',
      month: '',
      time: '08:00 - 11:30',
      location: '',
      description: '',
      notes: '',
      assigned_to: ['Tất cả 30 Chi đoàn Ấp'],
      file_name: '',
      file_url: ''
    });
    setRawDate('');
    setStep(1);
    setIsSubmitting(false);
    onClose && onClose();
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
          <div className="modal-header border-bottom pb-2">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
              <Calendar className="text-primary" size={20} />
              Tạo Hoạt động Mới
            </h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>

          {/* 3-Step Wizard Navigation Header matching Screenshot 3 */}
          <div className="px-4 pt-3">
            <div className="d-flex align-items-center justify-content-center gap-2 py-2 px-3 bg-light rounded-3 border" style={{ fontSize: '12.5px' }}>
              <div className={`d-flex align-items-center gap-1.5 fw-bold ${step === 1 ? 'text-primary' : 'text-success'}`}>
                <span className={`badge ${step === 1 ? 'bg-primary text-white' : 'bg-success text-white'} rounded-circle p-1`} style={{ width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {step > 1 ? '✓' : '1'}
                </span>
                <span>Thông tin hoạt động</span>
              </div>
              <span className="text-muted">➔</span>
              <div className={`d-flex align-items-center gap-1.5 fw-bold ${step === 2 ? 'text-primary' : step > 2 ? 'text-success' : 'text-muted'}`}>
                <span className={`badge ${step === 2 ? 'bg-primary text-white' : step > 2 ? 'bg-success text-white' : 'bg-secondary-subtle text-secondary'} rounded-circle p-1`} style={{ width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {step > 2 ? '✓' : '2'}
                </span>
                <span>Phân công lực lượng</span>
              </div>
              <span className="text-muted">➔</span>
              <div className={`d-flex align-items-center gap-1.5 fw-bold ${step === 3 ? 'text-primary' : 'text-muted'}`}>
                <span className={`badge ${step === 3 ? 'bg-primary text-white' : 'bg-secondary-subtle text-secondary'} rounded-circle p-1`} style={{ width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  3
                </span>
                <span>Xác nhận & Thông báo</span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!formData.title.trim()) { alert('Vui lòng nhập tên hoạt động!'); return; }
              if (hasSubTasks) setStep(2);
              else setStep(3);
            }}>
              <div className="modal-body p-4 pt-2">
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
                    <div className="text-success mt-1.5 fw-bold d-flex align-items-center gap-1.5 p-2 bg-white rounded border border-success-subtle" style={{ fontSize: '12px' }}>
                      <CheckCircle size={15} className="text-success flex-shrink-0" />
                      <span>✓ Đã trích xuất & tự động điền Tên hoạt động, Thời gian ({startTime} - {endTime}), Địa điểm từ văn bản: <strong>{formData.file_name}</strong></span>
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

                <div className="mb-3">
                  <label className="form-label fw-semibold text-primary d-flex align-items-center gap-1.5" style={{ fontSize: '13px' }}>
                    <FileText size={15} />
                    <span>Mục đích văn bản (Tự động đưa vào Văn bản đi & Lưu trữ văn bản)</span>
                  </label>
                  <select
                    className="form-select bg-light border-primary-subtle"
                    value={formData.doc_category || 'act_docs'}
                    onChange={(e) => setFormData({ ...formData, doc_category: e.target.value })}
                  >
                    <option value="decision_docs">⚖️ Văn bản quyết định</option>
                    <option value="act_docs">📌 Ban hành hoạt động</option>
                    <option value="implementation_docs">📢 Văn bản triển khai</option>
                    <option value="meeting_docs">🤝 Văn bản cuộc họp</option>
                  </select>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-md-3">
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
                  <div className="col-md-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Giờ bắt đầu <span className="text-danger">*</span></label>
                    <input
                      type="time"
                      className="form-control"
                      required
                      value={startTime}
                      onChange={(e) => {
                        const val = e.target.value;
                        setStartTime(val);
                        setFormData(prev => ({ ...prev, time: `${val} - ${endTime}` }));
                      }}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Giờ kết thúc <span className="text-danger">*</span></label>
                    <input
                      type="time"
                      className="form-control"
                      required
                      value={endTime}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEndTime(val);
                        setFormData(prev => ({ ...prev, time: `${startTime} - ${val}` }));
                      }}
                    />
                  </div>
                  <div className="col-md-3">
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
                          setFormData({ 
                            ...formData, 
                            day: String(d.getDate()).padStart(2, '0'),
                            month: String(d.getMonth() + 1).padStart(2, '0'),
                            year: d.getFullYear(),
                            dateIso: e.target.value
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
                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Phân công đơn vị thực hiện (Có thể chọn nhiều)</label>
                    <MultiUnitSelect 
                      selected={formData.assigned_to} 
                      onChange={(selectedArray) => setFormData({ ...formData, assigned_to: selectedArray })} 
                    />
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

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Mô tả chi tiết nội dung chương trình</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Nội dung chương trình, yêu cầu tham gia..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>

                {/* Force Sub-division choice matching Screenshot 3 left panel */}
                <div className="mt-4 pt-3 border-top">
                  <label className="fw-bold text-dark mb-2 d-flex align-items-center gap-2" style={{ fontSize: '13.5px' }}>
                    <span>Phân chia lực lượng cho hoạt động này:</span>
                  </label>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <div 
                        className={`p-3 rounded-3 border cursor-pointer transition d-flex align-items-start gap-2.5 ${hasSubTasks ? 'border-primary bg-primary-subtle bg-opacity-25 shadow-sm' : 'bg-white hover-bg-light'}`}
                        onClick={() => setHasSubTasks(true)}
                      >
                        <input 
                          type="radio" 
                          name="subTaskOption" 
                          className="form-check-input mt-1 cursor-pointer"
                          checked={hasSubTasks} 
                          onChange={() => setHasSubTasks(true)} 
                        />
                        <div>
                          <div className="fw-bold text-dark d-flex align-items-center gap-1.5" style={{ fontSize: '13.5px' }}>
                            <Users className="text-primary" size={16} />
                            <span>Có phân chia lực lượng</span>
                          </div>
                          <div className="text-secondary mt-1" style={{ fontSize: '11.5px', lineHeight: '1.4' }}>
                            Hoạt động này sẽ được phân công cho các Chi đoàn / khu vực / tổ đội cụ thể
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div 
                        className={`p-3 rounded-3 border cursor-pointer transition d-flex align-items-start gap-2.5 ${!hasSubTasks ? 'border-primary bg-primary-subtle bg-opacity-25 shadow-sm' : 'bg-white hover-bg-light'}`}
                        onClick={() => setHasSubTasks(false)}
                      >
                        <input 
                          type="radio" 
                          name="subTaskOption" 
                          className="form-check-input mt-1 cursor-pointer"
                          checked={!hasSubTasks} 
                          onChange={() => setHasSubTasks(false)} 
                        />
                        <div>
                          <div className="fw-bold text-dark d-flex align-items-center gap-1.5" style={{ fontSize: '13.5px' }}>
                            <UserCheck className="text-secondary" size={16} />
                            <span>Không phân chia lực lượng</span>
                          </div>
                          <div className="text-secondary mt-1" style={{ fontSize: '11.5px', lineHeight: '1.4' }}>
                            Hoạt động chung, không cần phân công lực lượng cụ thể
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top bg-light">
                <button type="button" className="btn btn-light border px-4" onClick={handleClose}>Hủy</button>
                <button type="submit" className="btn btn-primary px-4 fw-semibold d-flex align-items-center gap-1.5" style={{ backgroundColor: '#0066FF' }}>
                  <span>{hasSubTasks ? 'Tiếp tục phân công lực lượng →' : 'Tiếp tục xem lại →'}</span>
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="modal-body p-4 pt-2">
              {/* Step 2 Header matching Screenshot 3 right panel */}
              <div className="p-3 bg-primary-subtle bg-opacity-25 border border-primary-subtle rounded-3 mb-3 d-flex align-items-center gap-3">
                <div className="p-2.5 bg-primary text-white rounded-circle flex-shrink-0">
                  <Users size={22} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0.5" style={{ fontSize: '15px' }}>Phân công lực lượng</h6>
                  <div className="text-secondary" style={{ fontSize: '12.5px' }}>
                    Thiết lập phân công lực lượng, thời gian và địa điểm cho từng khu vực / Chi đoàn.
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-between mb-2">
                <label className="fw-bold text-dark" style={{ fontSize: '13px' }}>
                  Thêm khu vực / Chi đoàn được phân công ({subTasks.length}):
                </label>
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-primary fw-semibold px-3 rounded-3 d-flex align-items-center gap-1"
                  onClick={handleAddSubTask}
                >
                  <Plus size={15} />
                  <span>Thêm mới</span>
                </button>
              </div>

              <div className="d-flex flex-column gap-3 mb-3" style={{ maxHeight: '360px', overflowY: 'auto' }}>
                {subTasks.map((sub, idx) => (
                  <div key={sub.id} className="p-3 bg-white border rounded-3 shadow-xs position-relative hover-border-primary transition">
                    <div className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom">
                      <div className="fw-bold text-primary d-flex align-items-center gap-2" style={{ fontSize: '13.5px' }}>
                        <Building size={16} />
                        <span>Khu vực / Chi đoàn #{idx + 1}</span>
                      </div>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-danger border-0 p-1" 
                        title="Xóa khu vực này"
                        onClick={() => handleRemoveSubTask(sub.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="row g-2.5">
                      <div className="col-12 col-md-6">
                        <label className="form-label text-dark fw-semibold mb-1" style={{ fontSize: '12px' }}>Chi đoàn / Đơn vị phụ trách</label>
                        <select 
                          className="form-select form-select-sm"
                          value={sub.branch}
                          onChange={(e) => handleUpdateSubTask(sub.id, 'branch', e.target.value)}
                        >
                          {INITIAL_BRANCHES.map(b => (
                            <option key={b.id} value={b.name}>📍 {b.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label text-dark fw-semibold mb-1" style={{ fontSize: '12px' }}>Thời gian thực hiện</label>
                        <input 
                          type="text" 
                          className="form-control form-control-sm"
                          placeholder="Ví dụ: 08:00 - 10:00"
                          value={sub.time}
                          onChange={(e) => handleUpdateSubTask(sub.id, 'time', e.target.value)}
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label text-dark fw-semibold mb-1" style={{ fontSize: '12px' }}>Địa điểm / Tuyến đường phụ trách</label>
                        <input 
                          type="text" 
                          className="form-control form-control-sm"
                          placeholder="Ví dụ: Đường Ấp 1, khu vực Nhà văn hóa..."
                          value={sub.location}
                          onChange={(e) => handleUpdateSubTask(sub.id, 'location', e.target.value)}
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label text-dark fw-semibold mb-1" style={{ fontSize: '12px' }}>Nhiệm vụ / Phần việc cụ thể</label>
                        <input 
                          type="text" 
                          className="form-control form-control-sm"
                          placeholder="Ví dụ: Trồng cây xanh, thu gom rác..."
                          value={sub.description}
                          onChange={(e) => handleUpdateSubTask(sub.id, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                type="button" 
                className="btn btn-outline-primary btn-sm w-100 py-2 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-1.5"
                style={{ borderStyle: 'dashed' }}
                onClick={handleAddSubTask}
              >
                <Plus size={16} />
                <span>+ Thêm khu vực / Chi đoàn</span>
              </button>

              <div className="p-3 mt-3 bg-info-subtle border border-info-subtle rounded-3 text-info-emphasis d-flex align-items-center gap-2" style={{ fontSize: '12px' }}>
                <Bell size={16} className="flex-shrink-0" />
                <span>ℹ️ <strong>Lưu ý:</strong> Các Chi đoàn sẽ nhận được thông báo và nhiệm vụ đã được phân công.</span>
              </div>

              <div className="modal-footer border-top bg-light mt-3 px-0 pb-0">
                <button type="button" className="btn btn-light border px-4" onClick={() => setStep(1)}>Quay lại</button>
                <button type="button" className="btn btn-primary px-4 fw-semibold" style={{ backgroundColor: '#0066FF' }} onClick={() => setStep(3)}>
                  Tiếp tục →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="modal-body p-4 pt-2">
              <div className="p-3 bg-success-subtle bg-opacity-25 border border-success-subtle rounded-3 mb-3 text-center">
                <div className="p-2 bg-success text-white rounded-circle d-inline-flex mb-1.5">
                  <CheckCircle size={24} />
                </div>
                <h6 className="fw-bold text-dark mb-0.5" style={{ fontSize: '15px' }}>Xem lại & Ban hành Hoạt động</h6>
                <div className="text-secondary" style={{ fontSize: '12px' }}>
                  Kiểm tra thông tin trước khi phát động hoạt động tới các đơn vị.
                </div>
              </div>

              <div className="p-3.5 bg-white border rounded-3 mb-3">
                <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '15px' }}>📌 {formData.title || 'Hoạt động Thanh niên'}</h6>
                <div className="row g-2 text-secondary mb-2" style={{ fontSize: '12.5px' }}>
                  <div className="col-6">⏰ Thời gian: <strong>{formData.time}</strong></div>
                  <div className="col-6">📅 Ngày: <strong>{formatDateDDMMYYYY(formData.day, formData.month, formData.year)}</strong></div>
                  <div className="col-12">📍 Địa điểm chung: <strong>{formData.location || OFFICIAL_ADDRESS}</strong></div>
                  <div className="col-12">📢 Phân công đơn vị: <strong>{Array.isArray(formData.assigned_to) ? formData.assigned_to.join(', ') : formData.assigned_to}</strong></div>
                </div>

                {hasSubTasks && subTasks.length > 0 && (
                  <div className="mt-3 pt-2.5 border-top">
                    <div className="fw-bold text-primary mb-2" style={{ fontSize: '13px' }}>
                      👥 Phân công lực lượng chi tiết ({subTasks.length} khu vực):
                    </div>
                    <div className="d-flex flex-column gap-1.5">
                      {subTasks.map((st, i) => (
                        <div key={i} className="p-2 bg-light rounded border text-dark" style={{ fontSize: '12px' }}>
                          <strong>📍 {st.branch}</strong> — {st.location} ({st.time})
                          {st.description && <span className="text-muted d-block">📋 Nhiệm vụ: {st.description}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer border-top bg-light px-0 pb-0">
                <button type="button" className="btn btn-light border px-4" onClick={() => setStep(hasSubTasks ? 2 : 1)}>Quay lại</button>
                <button type="button" className="btn btn-primary px-4 fw-semibold d-flex align-items-center gap-1.5" style={{ backgroundColor: '#0066FF' }} onClick={handleSubmitFinal}>
                  <Send size={16} />
                  <span>🚀 Ban Hành Hoạt Động & Phát Thông Báo</span>
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
    date: new Date().toISOString().split('T')[0],
    category: 'decision_docs',
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
    const categoryMap = {
      decision_docs: 'Văn bản quyết định',
      act_docs: 'Ban hành hoạt động',
      implementation_docs: 'Văn bản triển khai',
      meeting_docs: 'Văn bản cuộc họp'
    };
    const chosenCat = formData.category || 'decision_docs';
    const chosenDate = formData.date || new Date().toISOString().split('T')[0];

    onSave && onSave({ 
      ...formData, 
      date: chosenDate,
      issue_date: chosenDate,
      category: chosenCat,
      category_label: categoryMap[chosenCat] || 'Văn bản quyết định',
      file_name: selectedFile ? selectedFile.name : formData.file_name || 'Van_Ban.pdf',
      file_url: finalStatus ? finalStatus.file_url : formData.file_url || fallbackUrl,
      storage_provider: finalStatus ? finalStatus.storage_provider : 'supabase'
    });
    
    setFormData({ 
      doc_number: '', 
      title: '', 
      date: new Date().toISOString().split('T')[0],
      category: 'decision_docs', 
      recipient_scope: 'ALL', 
      file_name: '', 
      file_url: '' 
    });
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
                <div className="col-md-3">
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
                <div className="col-md-3">
                  <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Ngày ban hành / đăng</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
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

              {/* Mục đích của văn bản - Nút chức năng chọn theo thứ tự yêu cầu */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-primary d-flex align-items-center justify-content-between mb-2" style={{ fontSize: '13px' }}>
                  <span className="d-flex align-items-center gap-1.5">
                    <FileText size={15} />
                    <span>Mục đích của văn bản <span className="text-danger">*</span></span>
                  </span>
                  <span className="badge bg-primary-subtle text-primary fw-bold" style={{ fontSize: '11px' }}>
                    {formData.category === 'decision_docs' && '⚖️ Văn bản quyết định'}
                    {formData.category === 'act_docs' && '📌 Ban hành hoạt động'}
                    {formData.category === 'implementation_docs' && '📢 Văn bản triển khai'}
                    {formData.category === 'meeting_docs' && '🤝 Văn bản cuộc họp'}
                  </span>
                </label>
                
                <div className="row g-2">
                  {[
                    { key: 'decision_docs', label: 'Văn bản quyết định', icon: '⚖️', desc: 'Quyết định, quy chế' },
                    { key: 'act_docs', label: 'Ban hành hoạt động', icon: '📌', desc: 'Kế hoạch, phong trào' },
                    { key: 'implementation_docs', label: 'Văn bản triển khai', icon: '📢', desc: 'Công văn, hướng dẫn' },
                    { key: 'meeting_docs', label: 'Văn bản cuộc họp', icon: '🤝', desc: 'Biên bản, triệu tập họp' }
                  ].map((cat, idx) => {
                    const isSelected = (formData.category || 'decision_docs') === cat.key;
                    return (
                      <div className="col-6 col-md-3" key={cat.key}>
                        <button
                          type="button"
                          className={`btn w-100 p-2.5 rounded-3 text-start border d-flex flex-column justify-content-between transition-all ${
                            isSelected 
                              ? 'btn-primary shadow-sm border-primary text-white' 
                              : 'btn-light bg-white border-secondary-subtle text-dark hover-shadow'
                          }`}
                          onClick={() => setFormData({ ...formData, category: cat.key })}
                          style={{ minHeight: '64px', cursor: 'pointer' }}
                        >
                          <div className="d-flex align-items-center justify-content-between w-100 mb-1">
                            <span style={{ fontSize: '15px' }}>{cat.icon}</span>
                            <span className={`badge ${isSelected ? 'bg-white text-primary' : 'bg-light text-secondary'} rounded-pill`} style={{ fontSize: '9.5px' }}>
                              #{idx + 1}
                            </span>
                          </div>
                          <div className="fw-bold" style={{ fontSize: '12px', lineHeight: '1.2' }}>{cat.label}</div>
                          <div className={`mt-0.5 text-truncate ${isSelected ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '10px' }}>
                            {cat.desc}
                          </div>
                        </button>
                      </div>
                    );
                  })}
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
  const [rawDate, setRawDate] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (editData) {
      setTitle(editData.title || '');
      setContent(editData.content || '');
      setTargetScope(editData.target_scope === 'Tất cả 30 Chi đoàn Ấp' ? 'ALL' : editData.target_scope || 'ALL');
      setPriority(editData.priority || 'Bình thường');
      setTime(editData.activity_details?.time || editData.time || '');
      setDateStr(formatDateDDMMYYYY(editData.activity_details || editData.date));
      setLocation(editData.activity_details?.location || editData.location || '');
      setRawDate('');
    } else {
      setTitle('');
      setContent('');
      setTargetScope('ALL');
      setPriority('Bình thường');
      setTime('');
      setDateStr('');
      setRawDate('');
      setLocation('');
    }
  }, [editData, show]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    confetti({ particleCount: 85, spread: 85, origin: { y: 0.6 } });
    
    const scopeText = Array.isArray(targetScope)
      ? (targetScope.length === 0 || targetScope.includes('Tất cả 30 Chi đoàn Ấp') ? 'Tất cả 30 Chi đoàn Ấp' : targetScope.join(', '))
      : (targetScope === 'ALL' ? 'Tất cả 30 Chi đoàn Ấp' : targetScope);

    const finalTime = time.trim() || '08:00 - 11:30';
    const finalDate = dateStr.trim() || new Date().toLocaleDateString('vi-VN');
    const finalLocation = location.trim() || 'Hội trường UBND xã';

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
    setRawDate('');
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
                  <label className="form-label fw-semibold text-dark" style={{ fontSize: '13px' }}>Đơn vị nhận thông báo (Có thể chọn nhiều)</label>
                  <MultiUnitSelect 
                    selected={targetScope}
                    onChange={setTargetScope}
                  />
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
                    placeholder="Ví dụ: 08:00 - 11:30"
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
                    type="date"
                    className="form-control"
                    value={rawDate}
                    onChange={(e) => {
                      setRawDate(e.target.value);
                      if (e.target.value) {
                        const d = new Date(e.target.value);
                        const dayStr = String(d.getDate()).padStart(2, '0');
                        const monthStr = String(d.getMonth() + 1).padStart(2, '0');
                        const yearStr = d.getFullYear();
                        setDateStr(`${dayStr}/${monthStr}/${yearStr}`);
                      }
                    }}
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
                    placeholder=""
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
      const record = attendanceRecords[selectedActivityId] || attendanceRecords[String(selectedActivityId)] || {};
      const initialMap = {};
      INITIAL_BRANCHES.forEach(b => {
        const item = record[b.name];
        if (typeof item === 'boolean') {
          initialMap[b.name] = item;
        } else if (typeof item === 'object' && item !== null) {
          initialMap[b.name] = Boolean(item.attended);
        } else {
          initialMap[b.name] = true;
        }
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
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth()+1).padStart(2, '0')}/${now.getFullYear()}`;
      const formatted = { isUrgentTask };

      Object.entries(attendanceData).forEach(([bName, isAttended]) => {
        formatted[bName] = isAttended 
          ? { attended: true, time: timeStr } 
          : { attended: false, reason: 'Vắng mặt theo điểm danh của Admin', time: timeStr };
      });

      onSaveAttendance && onSaveAttendance(selectedActivityId, formatted);
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
  onRespondAttendance,
  onConfirmReceipt
}) {
  const [isAbsenceMode, setIsAbsenceMode] = useState(false);
  const [absenceReason, setAbsenceReason] = useState('');

  if (!show || !activity) return null;

  const isDoanXa = currentRole?.role === 'admin' || currentRole?.role === 'doan_xa' || currentRole?.full_name?.includes('Đoàn xã');
  const userBranchName = currentRole?.full_name || 'Chi đoàn Ấp Bùi Môn';
  const activityAttendance = attendanceRecords[activity.id] || {};
  const currentBranchRecord = activityAttendance[userBranchName];
  
  const priorityBadge = getPriorityBadgeStyle(activity.priority);
  const timeStatus = getActivityTimeStatus(activity);

  const hasAttended = typeof currentBranchRecord === 'boolean' 
    ? currentBranchRecord 
    : (currentBranchRecord?.attended !== undefined ? currentBranchRecord.attended : null);
  
  const savedReason = typeof currentBranchRecord === 'object' ? currentBranchRecord.reason : '';

  const confirmedBy = Array.isArray(activity.confirmedBy) ? activity.confirmedBy : [];
  const absentBy = Array.isArray(activity.absentBy) ? activity.absentBy : [];
  const participatingBranches = [];
  const absentBranches = [];

  if (typeof activityAttendance === 'object' && activityAttendance !== null) {
    Object.entries(activityAttendance).forEach(([branch, record]) => {
      if (typeof record === 'boolean') {
        if (record) {
          const matchConf = confirmedBy.find(c => (typeof c === 'string' ? c : c?.branch) === branch);
          participatingBranches.push({ name: branch, time: (typeof matchConf === 'object' ? matchConf?.time : null) || 'Đã xác nhận' });
        }
      } else if (typeof record === 'object' && record !== null) {
        if (record.attended) {
          participatingBranches.push({ name: branch, time: record.time || 'Đã xác nhận' });
        } else {
          absentBranches.push({ name: branch, reason: record.reason || 'Báo vắng mặt', time: record.time || 'Vừa xong' });
        }
      }
    });
  }

  confirmedBy.forEach(c => {
    if (!c) return;
    const bName = typeof c === 'string' ? c : (c.branch || c.name || '');
    const bTime = typeof c === 'object' ? (c.time || 'Đã xác nhận') : 'Đã xác nhận';
    if (bName && !participatingBranches.some(p => p.name === bName)) {
      participatingBranches.push({ name: bName, time: bTime });
    }
  });

  absentBy.forEach(a => {
    if (!a) return;
    const bName = typeof a === 'string' ? a : (a.branch || a.name || '');
    const bReason = typeof a === 'object' ? (a.reason || 'Báo vắng mặt') : 'Báo vắng mặt';
    const bTime = typeof a === 'object' ? (a.time || 'Vừa xong') : 'Vừa xong';
    if (bName && !absentBranches.some(p => p.name === bName)) {
      absentBranches.push({ name: bName, reason: bReason, time: bTime });
    }
  });

  const handleConfirmAttend = () => {
    confetti({ particleCount: 75, spread: 75, origin: { y: 0.6 } });
    onRespondAttendance && onRespondAttendance(activity.id, userBranchName, true, '', activity.title);
    onConfirmReceipt && onConfirmReceipt('activity', activity);
    setIsAbsenceMode(false);
    onClose();
  };

  const handleSubmitAbsence = (e) => {
    e.preventDefault();
    if (!absenceReason.trim()) {
      alert('Vui lòng nhập lý do chính đáng để gửi báo vắng!');
      return;
    }
    onRespondAttendance && onRespondAttendance(activity.id, userBranchName, false, absenceReason.trim(), activity.title);
    onConfirmReceipt && onConfirmReceipt('activity', activity);
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
              <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 fw-bold" style={{ fontSize: '11.5px' }}>
                  📌 Phân công: {activity.assigned_to || 'Tất cả 30 Chi đoàn Ấp'}
                </span>
                <div className="d-flex align-items-center gap-1.5 flex-wrap">
                  <span className={`badge ${priorityBadge.bg} border px-2.5 py-1 fw-bold`} style={{ fontSize: '11.5px' }}>
                    {priorityBadge.label}
                  </span>
                  <span className={`badge ${timeStatus.badgeClass} border px-2.5 py-1 fw-bold`} style={{ fontSize: '11.5px' }}>
                    {timeStatus.statusText}
                  </span>
                  <ReceiptConfirmationBox 
                    type="activity" 
                    item={activity} 
                    currentRole={currentRole} 
                    isDoanXa={isDoanXa} 
                    onConfirmReceipt={onConfirmReceipt} 
                    inModal={true}
                  />
                </div>
              </div>
              <h4 className="fw-bold text-dark mb-2" style={{ fontSize: '18px' }}>
                {activity.title}
              </h4>
              <div className="row g-2 text-secondary" style={{ fontSize: '12.5px' }}>
                <div className="col-12 col-md-6 d-flex align-items-center gap-1.5">
                  <Clock size={15} className="text-primary" />
                  <span>Thời gian: <strong>{activity.time} ({formatDateDDMMYYYY(activity.day, activity.month, activity.year)})</strong></span>
                </div>
                <div className="col-12 col-md-6 d-flex align-items-center gap-1.5">
                  <MapPin size={15} className="text-danger" />
                  <span>Địa điểm: <strong>{activity.location || OFFICIAL_ADDRESS}</strong></span>
                </div>
              </div>
            </div>

            {/* Force Sub-division Details Section if activity.hasSubTasks */}
            {activity.hasSubTasks && activity.subTasks && activity.subTasks.length > 0 && (
              <div className="mb-3 p-3 bg-primary-subtle bg-opacity-25 border border-primary-subtle rounded-3">
                <div className="fw-bold text-primary d-flex align-items-center gap-2 mb-2" style={{ fontSize: '13.5px' }}>
                  <Users size={18} />
                  <span>Phân công lực lượng chi tiết theo khu vực ({activity.subTasks.length} vị trí / đơn vị)</span>
                </div>

                {!isDoanXa ? (
                  (() => {
                    const mySub = activity.subTasks.find(st => st.branch === userBranchName || userBranchName.includes(st.branch));
                    if (mySub) {
                      return (
                        <div className="p-3 bg-white border border-primary rounded-3 text-dark shadow-xs">
                          <div className="fw-bold text-success mb-1.5" style={{ fontSize: '13px' }}>
                            📍 Phân công riêng cho đơn vị [{userBranchName}]:
                          </div>
                          <div className="row g-2" style={{ fontSize: '12.5px' }}>
                            <div className="col-12 col-md-6">⏰ Thời gian: <strong>{mySub.time || activity.time}</strong></div>
                            <div className="col-12 col-md-6">📍 Tuyến đường / Địa điểm: <strong>{mySub.location}</strong></div>
                            {mySub.description && (
                              <div className="col-12 text-secondary mt-1">📋 Nhiệm vụ cụ thể: <strong>{mySub.description}</strong></div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="p-2.5 bg-white border rounded-3 text-secondary" style={{ fontSize: '12px' }}>
                        Đơn vị thực hiện theo vị trí tập trung chung do Ban Thường vụ phân công.
                      </div>
                    );
                  })()
                ) : (
                  <div className="row g-2">
                    {activity.subTasks.map((st, i) => (
                      <div key={i} className="col-12 col-md-6">
                        <div className="p-2.5 bg-white border rounded-3 text-dark shadow-xs" style={{ fontSize: '12px' }}>
                          <div className="fw-bold text-primary mb-1">📍 {st.branch}</div>
                          <div>⏰ Thời gian: <strong>{st.time || activity.time}</strong></div>
                          <div>📍 Địa điểm: <strong>{st.location}</strong></div>
                          {st.description && <div className="text-muted mt-1">📋 Nhiệm vụ: {st.description}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

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

            {/* Attendance & Participation Summary Box for Admin vs Chi Đoàn */}
            {isDoanXa ? (
              <div className="p-3.5 bg-light rounded-3 border">
                <div className="fw-bold text-dark mb-2.5 d-flex align-items-center justify-content-between flex-wrap gap-2" style={{ fontSize: '14px' }}>
                  <span>📊 Thống kê Phản hồi của 30 Chi đoàn Ấp:</span>
                  <div className="d-flex align-items-center gap-2" style={{ fontSize: '12px' }}>
                    <span className="badge bg-success text-white px-2.5 py-1">
                      ✅ Tham gia: {participatingBranches.length}/30
                    </span>
                    <span className="badge bg-danger text-white px-2.5 py-1">
                      ❌ Báo vắng: {absentBranches.length}/30
                    </span>
                  </div>
                </div>

                <div className="row g-2">
                  <div className="col-12 col-md-6">
                    <div className="p-2.5 bg-white border rounded-3 h-100">
                      <div className="fw-bold text-success mb-2 border-bottom pb-1" style={{ fontSize: '12.5px' }}>
                        ✅ Chi đoàn xác nhận tham gia ({participatingBranches.length})
                      </div>
                      {participatingBranches.length === 0 ? (
                        <div className="text-muted py-2 text-center" style={{ fontSize: '11.5px' }}>Chưa có đơn vị xác nhận</div>
                      ) : (
                        <div className="d-flex flex-column gap-1" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                          {participatingBranches.map((b, idx) => (
                            <div key={idx} className="d-flex align-items-center justify-content-between p-1.5 bg-success-subtle bg-opacity-25 rounded border border-success-subtle" style={{ fontSize: '11.5px' }}>
                              <span className="fw-semibold text-dark">✓ {b.name}</span>
                              <span className="text-muted" style={{ fontSize: '10.5px' }}>{b.time}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="p-2.5 bg-white border rounded-3 h-100">
                      <div className="fw-bold text-danger mb-2 border-bottom pb-1 d-flex align-items-center justify-content-between" style={{ fontSize: '12.5px' }}>
                        <span>❌ Chi đoàn báo vắng mặt ({absentBranches.length})</span>
                        {absentBranches.length > 0 && (
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-0.5" style={{ fontSize: '10.5px' }}>
                            Cần nắm lý do
                          </span>
                        )}
                      </div>
                      {absentBranches.length === 0 ? (
                        <div className="text-muted py-3 text-center" style={{ fontSize: '11.5px' }}>Không có đơn vị báo vắng</div>
                      ) : (
                        <div className="d-flex flex-column gap-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {absentBranches.map((b, idx) => (
                            <div key={idx} className="p-2.5 bg-danger-subtle bg-opacity-25 border border-danger-subtle rounded-3" style={{ fontSize: '11.5px' }}>
                              <div className="d-flex align-items-center justify-content-between mb-1.5 flex-wrap gap-1">
                                <span className="fw-bold text-danger d-flex align-items-center gap-1">
                                  <XCircle size={14} className="text-danger flex-shrink-0" />
                                  <span>{b.name}</span>
                                </span>
                                <span className="badge bg-white text-muted border fw-normal" style={{ fontSize: '10.5px' }}>
                                  ⏰ {b.time}
                                </span>
                              </div>
                              <div className="p-2 bg-white rounded border border-danger-subtle text-dark" style={{ fontSize: '11.5px' }}>
                                <span className="text-danger fw-bold me-1">💬 Lý do vắng mặt:</span>
                                <span className="text-secondary">{b.reason}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
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
            )}
          </div>
          <div className="modal-footer border-top pt-2">
            <button type="button" className="btn btn-secondary px-4 fw-semibold" onClick={onClose}>Đóng Cửa Sổ</button>
          </div>
        </div>
      </div>
    </div>
  );
}

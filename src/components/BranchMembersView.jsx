import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Award, 
  Mail, 
  Phone, 
  Calendar, 
  GraduationCap, 
  X, 
  UserCheck, 
  FileSpreadsheet,
  Building,
  ShieldCheck,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { INITIAL_BRANCHES, OFFICIAL_HAMLETS } from '../lib/supabase';

export default function BranchMembersView({ 
  members = [], 
  currentRole, 
  onSaveMember, 
  onDeleteMember 
}) {
  const isDoanXa = currentRole?.role === 'doan_xa' || currentRole?.role === 'admin' || !currentRole;
  const userBranchName = currentRole?.branch_name || currentRole?.full_name?.replace(/^Bí thư\s*/i, '') || '';

  const [selectedBranch, setSelectedBranch] = useState(isDoanXa ? 'ALL' : (userBranchName || 'ALL'));
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedGender, setSelectedGender] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Modals state
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);

  // 5-Second Restore Timer State
  const [pendingDeletedMember, setPendingDeletedMember] = useState(null);
  const [restoreCountdown, setRestoreCountdown] = useState(5);
  const [showRestoreNoticeModal, setShowRestoreNoticeModal] = useState(false);
  const countdownRef = useRef(null);

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // Form State for Create/Edit Member
  const [formData, setFormData] = useState({
    id: '',
    full_name: '',
    branch_name: userBranchName || 'Chi đoàn Ấp Mỹ Hoà 2',
    position: 'Đoàn viên',
    gender: 'Nam',
    birth_date: '2000-01-01',
    join_date: '2016-03-26',
    phone: '',
    email: '',
    status: 'Đang sinh hoạt',
    education: 'Đại học',
    notes: ''
  });

  const safeMembers = Array.isArray(members) ? members : [];

  // Filter members list based on user role, selected controls, and pending deletions
  const filteredMembers = safeMembers.filter(m => {
    if (!m || (pendingDeletedMember && m.id === pendingDeletedMember.id)) return false;

    // Branch filter
    let matchesBranch = true;
    if (selectedBranch !== 'ALL') {
      const cleanSel = selectedBranch.replace(/^Chi đoàn\s*/i, '').trim().toLowerCase();
      const cleanM = String(m.branch_name || '').replace(/^Chi đoàn\s*/i, '').trim().toLowerCase();
      matchesBranch = cleanM.includes(cleanSel) || cleanSel.includes(cleanM);
    }

    // Status filter
    const matchesStatus = selectedStatus === 'ALL' || m.status === selectedStatus;

    // Gender filter
    const matchesGender = selectedGender === 'ALL' || m.gender === selectedGender;

    // Search keyword
    const kw = searchKeyword.trim().toLowerCase();
    const nameStr = String(m.full_name || '').toLowerCase();
    const phoneStr = String(m.phone || '').toLowerCase();
    const posStr = String(m.position || '').toLowerCase();
    const emailStr = String(m.email || '').toLowerCase();
    const matchesSearch = !kw || nameStr.includes(kw) || phoneStr.includes(kw) || posStr.includes(kw) || emailStr.includes(kw);

    return matchesBranch && matchesStatus && matchesGender && matchesSearch;
  });

  // Calculate Metrics
  const totalMembers = filteredMembers.length;
  const maleCount = filteredMembers.filter(m => m.gender === 'Nam').length;
  const femaleCount = filteredMembers.filter(m => m.gender === 'Nữ').length;
  const outstandingCount = filteredMembers.filter(m => m.status === 'Đoàn viên ưu tú').length;

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setFormData({
      id: `dv-${Date.now()}`,
      full_name: '',
      branch_name: selectedBranch !== 'ALL' ? selectedBranch : (userBranchName || 'Chi đoàn Ấp Mỹ Hoà 2'),
      position: 'Đoàn viên',
      gender: 'Nam',
      birth_date: '2002-01-01',
      join_date: '2018-03-26',
      phone: '',
      email: '',
      status: 'Đang sinh hoạt',
      education: 'Đại học',
      notes: ''
    });
    setShowMemberModal(true);
  };

  const handleOpenEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      id: member.id,
      full_name: member.full_name || '',
      branch_name: member.branch_name || 'Chi đoàn Ấp Mỹ Hoà 2',
      position: member.position || 'Đoàn viên',
      gender: member.gender || 'Nam',
      birth_date: member.birth_date || '2000-01-01',
      join_date: member.join_date || '2016-03-26',
      phone: member.phone || '',
      email: member.email || '',
      status: member.status || 'Đang sinh hoạt',
      education: member.education || 'Đại học',
      notes: member.notes || ''
    });
    setShowMemberModal(true);
  };

  const handleSubmitMember = (e) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      alert('Vui lòng nhập Họ và tên đoàn viên!');
      return;
    }

    const payload = {
      ...formData,
      full_name: formData.full_name.trim(),
      updated_at: new Date().toISOString()
    };

    onSaveMember && onSaveMember(payload);
    setShowMemberModal(false);
  };

  const handleConfirmDelete = () => {
    if (!deletingMember) return;
    const target = deletingMember;
    setDeletingMember(null);

    // If there was a previous pending deletion, purge it permanently before starting new timer
    if (pendingDeletedMember && pendingDeletedMember.id !== target.id) {
      if (countdownRef.current) clearInterval(countdownRef.current);
      onDeleteMember && onDeleteMember(pendingDeletedMember.id, pendingDeletedMember.full_name);
    }

    setPendingDeletedMember(target);
    setRestoreCountdown(5);

    let count = 5;
    countdownRef.current = setInterval(() => {
      count -= 1;
      setRestoreCountdown(count);
      if (count <= 0) {
        clearInterval(countdownRef.current);
        onDeleteMember && onDeleteMember(target.id, target.full_name);
        setPendingDeletedMember(null);
      }
    }, 1000);
  };

  const handleCancelPendingDelete = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    const restoredName = pendingDeletedMember?.full_name || 'Đoàn viên';
    setPendingDeletedMember(null);
    setShowRestoreNoticeModal(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Đoàn viên ưu tú':
        return <span className="badge bg-success text-white border px-2.5 py-1 rounded-2">🌟 Đoàn viên ưu tú</span>;
      case 'Đang sinh hoạt':
        return <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 rounded-2">● Đang sinh hoạt</span>;
      case 'Chuyển sinh hoạt':
        return <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2.5 py-1 rounded-2">🔄 Chuyển sinh hoạt</span>;
      case 'Trưởng thành Đoàn':
        return <span className="badge bg-secondary-subtle text-secondary border px-2.5 py-1 rounded-2">🎓 Trưởng thành Đoàn</span>;
      default:
        return <span className="badge bg-light text-dark border px-2.5 py-1 rounded-2">{status || 'Đoàn viên'}</span>;
    }
  };

  return (
    <div className="content-card">
      {/* Header section */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3 border-bottom pb-3">
        <div>
          <h3 className="card-title-header mb-1 d-flex align-items-center gap-2">
            <Users className="text-primary" size={24} />
            Quản lý Danh sách Đoàn viên 30 Chi đoàn Ấp
          </h3>
          <div className="text-secondary" style={{ fontSize: '13px' }}>
            Hệ thống quản lý hồ sơ lý lịch, chức vụ, trình độ và trạng thái sinh hoạt đoàn viên thuộc Đoàn xã Xuân Thới Sơn
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button 
            className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-3 shadow-sm"
            style={{ backgroundColor: '#0066FF', border: 'none' }}
            onClick={handleOpenAddModal}
          >
            <UserPlus size={18} />
            <span>+ Thêm Đoàn viên mới</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-primary-subtle border border-primary-subtle rounded-3 h-100">
            <div className="d-flex align-items-center justify-content-between text-primary mb-1">
              <span className="fw-bold" style={{ fontSize: '12.5px' }}>👥 Tổng số Đoàn viên</span>
              <Users size={18} />
            </div>
            <div className="fw-extrabold text-primary" style={{ fontSize: '26px', lineHeight: 1.1 }}>
              {totalMembers} <span className="fs-6 fw-normal text-muted">Đoàn viên</span>
            </div>
            <div className="text-primary mt-1 fw-semibold" style={{ fontSize: '11px' }}>Hồ sơ đã cập nhật</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-success-subtle border border-success-subtle rounded-3 h-100">
            <div className="d-flex align-items-center justify-content-between text-success mb-1">
              <span className="fw-bold" style={{ fontSize: '12.5px' }}>🌟 Đoàn viên Ưu tú</span>
              <Award size={18} />
            </div>
            <div className="fw-extrabold text-success" style={{ fontSize: '26px', lineHeight: 1.1 }}>
              {outstandingCount} <span className="fs-6 fw-normal text-muted">Đoàn viên</span>
            </div>
            <div className="text-success mt-1 fw-semibold" style={{ fontSize: '11px' }}>Đủ điều kiện xét cảm tình Đảng</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-info-subtle border border-info-subtle rounded-3 h-100">
            <div className="d-flex align-items-center justify-content-between text-info-emphasis mb-1">
              <span className="fw-bold" style={{ fontSize: '12.5px' }}>👨‍👩‍👧 Giới tính (Nam / Nữ)</span>
              <UserCheck size={18} />
            </div>
            <div className="fw-extrabold text-info-emphasis" style={{ fontSize: '24px', lineHeight: 1.1 }}>
              {maleCount} Nam <span className="fs-6 fw-normal text-muted">/ {femaleCount} Nữ</span>
            </div>
            <div className="text-info-emphasis mt-1 fw-semibold" style={{ fontSize: '11px' }}>Cân đối cơ cấu giới tính</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-warning-subtle border border-warning-subtle rounded-3 h-100">
            <div className="d-flex align-items-center justify-content-between text-warning-emphasis mb-1">
              <span className="fw-bold" style={{ fontSize: '12.5px' }}>🏛️ Chi đoàn Ấp trực thuộc</span>
              <Building size={18} />
            </div>
            <div className="fw-extrabold text-warning-emphasis" style={{ fontSize: '26px', lineHeight: 1.1 }}>
              30 <span className="fs-6 fw-normal text-muted">Chi đoàn Ấp</span>
            </div>
            <div className="text-warning-emphasis mt-1 fw-semibold" style={{ fontSize: '11px' }}>100% Ấp có tổ chức Đoàn</div>
          </div>
        </div>
      </div>

      {/* Toolbar: Filters & Search */}
      <div className="p-3 bg-light rounded-3 border mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-4">
            <div className="search-input-group w-100">
              <Search size={16} className="text-secondary me-2" />
              <input 
                type="text" 
                className="form-control border-0 bg-transparent"
                placeholder="Tìm tên, SĐT, email, chức vụ..." 
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <div className="d-flex align-items-center gap-1.5">
              <Filter size={15} className="text-secondary" />
              <select 
                className="form-select form-select-sm"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                disabled={!isDoanXa}
              >
                <option value="ALL">🏛️ Tất cả 30 Chi đoàn Ấp</option>
                {INITIAL_BRANCHES.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <select 
              className="form-select form-select-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">⭐ Tất cả Trạng thái</option>
              <option value="Đang sinh hoạt">● Đang sinh hoạt</option>
              <option value="Đoàn viên ưu tú">🌟 Đoàn viên ưu tú</option>
              <option value="Chuyển sinh hoạt">🔄 Chuyển sinh hoạt</option>
              <option value="Trưởng thành Đoàn">🎓 Trưởng thành Đoàn</option>
            </select>
          </div>

          <div className="col-12 col-sm-6 col-md-2">
            <select 
              className="form-select form-select-sm"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              <option value="ALL">👤 Giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table of Members */}
      <div className="table-responsive">
        <table className="custom-table align-middle">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>STT</th>
              <th>Họ và Tên</th>
              <th>Chi đoàn Ấp</th>
              <th>Chức vụ</th>
              <th>Giới tính</th>
              <th>Ngày vào Đoàn</th>
              <th>Trình độ</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th className="text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-4 text-muted" style={{ fontSize: '13.5px' }}>
                  Không tìm thấy đoàn viên nào phù hợp với bộ lọc tìm kiếm.
                </td>
              </tr>
            ) : (
              filteredMembers.map((m, index) => (
                <tr key={m.id || index} className="hover-bg-light transition">
                  <td className="fw-bold text-muted" style={{ fontSize: '12px' }}>{index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="avatar-circle-sm bg-primary text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', borderRadius: '50%', fontSize: '13px' }}>
                        {m.full_name ? m.full_name.charAt(0).toUpperCase() : 'D'}
                      </div>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: '13.5px' }}>{m.full_name}</div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>{m.email || 'Chưa cập nhật email'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-light text-primary border px-2 py-1" style={{ fontSize: '11.5px', fontWeight: 600 }}>
                      {m.branch_name}
                    </span>
                  </td>
                  <td className="fw-semibold text-dark" style={{ fontSize: '12.5px' }}>
                    {m.position || 'Đoàn viên'}
                  </td>
                  <td style={{ fontSize: '12.5px' }}>
                    <span className={`badge ${m.gender === 'Nữ' ? 'bg-danger-subtle text-danger' : 'bg-primary-subtle text-primary'} border px-2 py-0.5`}>
                      {m.gender || 'Nam'}
                    </span>
                  </td>
                  <td className="text-secondary" style={{ fontSize: '12px' }}>
                    {m.join_date || '26/03/2016'}
                  </td>
                  <td className="text-secondary" style={{ fontSize: '12px' }}>
                    {m.education || 'Đại học'}
                  </td>
                  <td className="fw-medium text-dark" style={{ fontSize: '12.5px' }}>
                    {m.phone ? `📱 ${m.phone}` : '—'}
                  </td>
                  <td>
                    {getStatusBadge(m.status)}
                  </td>
                  <td className="text-end">
                    <div className="d-inline-flex align-items-center gap-1.5">
                      <button 
                        className="btn btn-sm btn-outline-info d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-2 fw-semibold"
                        style={{ fontSize: '11.5px' }}
                        title="Xem chi tiết hồ sơ đoàn viên"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingMember(m);
                        }}
                      >
                        <Eye size={14} />
                        <span>Xem</span>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-2 fw-semibold"
                        style={{ fontSize: '11.5px' }}
                        title="Chỉnh sửa thông tin đoàn viên"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(m);
                        }}
                      >
                        <Edit3 size={14} />
                        <span>Sửa</span>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-2 fw-semibold"
                        style={{ fontSize: '11.5px' }}
                        title="Xóa hồ sơ đoàn viên"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingMember(m);
                        }}
                      >
                        <Trash2 size={14} />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal 1: Create or Edit Member (Fixed Centered Overlay) */}
      {showMemberModal && (
        <div 
          className="modal d-block bg-dark bg-opacity-50" 
          style={{ zIndex: 1070 }}
          onClick={() => setShowMemberModal(false)}
        >
          <div 
            className="modal-dialog modal-dialog-centered modal-lg shadow-lg" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-4 p-4">
              <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2" style={{ fontSize: '16.5px' }}>
                  <UserPlus className="text-primary" size={22} />
                  {editingMember ? 'Chỉnh sửa Thông tin Đoàn viên' : 'Thêm mới Đoàn viên vào Danh sách 30 Ấp'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowMemberModal(false)}></button>
              </div>

              <form onSubmit={handleSubmitMember}>
                <div className="row g-3">
                  <div className="col-12 col-md-7">
                    <label className="form-label text-dark fw-semibold" style={{ fontSize: '13px' }}>
                      Họ và Tên Đoàn viên <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="Nhập họ và tên đầy đủ..." 
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-5">
                    <label className="form-label text-dark fw-semibold" style={{ fontSize: '13px' }}>Giới tính</label>
                    <select 
                      className="form-select"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-dark fw-semibold" style={{ fontSize: '13px' }}>Chi đoàn Ấp sinh hoạt</label>
                    <select 
                      className="form-select"
                      value={formData.branch_name}
                      onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
                      disabled={!isDoanXa}
                    >
                      {INITIAL_BRANCHES.map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-dark fw-semibold" style={{ fontSize: '13px' }}>Chức vụ trong Chi đoàn</label>
                    <select 
                      className="form-select"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    >
                      <option value="Đoàn viên">Đoàn viên</option>
                      <option value="Ủy viên BCH Chi đoàn">Ủy viên BCH Chi đoàn</option>
                      <option value="Phó Bí thư Chi đoàn">Phó Bí thư Chi đoàn</option>
                      <option value="Bí thư Chi đoàn">Bí thư Chi đoàn</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-dark fw-semibold" style={{ fontSize: '13px' }}>Ngày sinh</label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={formData.birth_date}
                      onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-dark fw-semibold" style={{ fontSize: '13px' }}>Ngày kết nạp Đoàn</label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={formData.join_date}
                      onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-dark fw-semibold" style={{ fontSize: '13px' }}>Số điện thoại liên hệ</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="Ví dụ: 0903xxxxxx" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-dark fw-semibold" style={{ fontSize: '13px' }}>Email</label>
                    <input 
                      type="email" 
                      className="form-control"
                      placeholder="doanvien@gmail.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-dark fw-semibold" style={{ fontSize: '13px' }}>Trình độ học vấn</label>
                    <select 
                      className="form-select"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    >
                      <option value="12/12">THPT (12/12)</option>
                      <option value="Trung cấp">Trung cấp</option>
                      <option value="Cao đẳng">Cao đẳng</option>
                      <option value="Đại học">Đại học</option>
                      <option value="Thạc sĩ">Thạc sĩ</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-dark fw-semibold" style={{ fontSize: '13px' }}>Trạng thái sinh hoạt</label>
                    <select 
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Đang sinh hoạt">● Đang sinh hoạt</option>
                      <option value="Đoàn viên ưu tú">🌟 Đoàn viên ưu tú</option>
                      <option value="Chuyển sinh hoạt">🔄 Chuyển sinh hoạt</option>
                      <option value="Trưởng thành Đoàn">🎓 Trưởng thành Đoàn</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label text-dark fw-semibold" style={{ fontSize: '13px' }}>Ghi chú / Thành tích nổi bật</label>
                    <textarea 
                      className="form-control"
                      rows="2"
                      placeholder="Ví dụ: Đạt danh hiệu Thanh niên tiên tiến làm theo lời Bác năm 2026..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2.5 mt-4 pt-3 border-top">
                  <button type="button" className="btn btn-light border fw-semibold px-4 rounded-3" onClick={() => setShowMemberModal(false)}>
                    Hủy bỏ
                  </button>
                  <button type="submit" className="btn btn-primary px-4 fw-bold rounded-3 shadow-sm" style={{ backgroundColor: '#0066FF' }}>
                    {editingMember ? '💾 Cập nhật Thông tin' : '💾 Lưu Hồ sơ Đoàn viên'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: View Detail (Fixed Centered Overlay) */}
      {viewingMember && (
        <div 
          className="modal d-block bg-dark bg-opacity-50" 
          style={{ zIndex: 1070 }}
          onClick={() => setViewingMember(null)}
        >
          <div 
            className="modal-dialog modal-dialog-centered shadow-lg" 
            style={{ maxWidth: '560px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-4 p-4">
              <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2" style={{ fontSize: '16.5px' }}>
                  <UserCheck className="text-primary" size={22} />
                  Hồ sơ Chi tiết Đoàn viên
                </h5>
                <button type="button" className="btn-close" onClick={() => setViewingMember(null)}></button>
              </div>

              <div className="p-3 bg-light rounded-3 border mb-3 text-center">
                <div className="avatar-circle-lg bg-primary text-white fw-bold d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '56px', height: '56px', borderRadius: '50%', fontSize: '22px' }}>
                  {viewingMember.full_name?.charAt(0).toUpperCase()}
                </div>
                <h4 className="fw-bold text-dark mb-1">{viewingMember.full_name}</h4>
                <div className="text-primary fw-semibold" style={{ fontSize: '13.5px' }}>{viewingMember.branch_name}</div>
                <div className="mt-2">{getStatusBadge(viewingMember.status)}</div>
              </div>

              <div className="row g-2 text-dark" style={{ fontSize: '13px' }}>
                <div className="col-6"><strong>Chức vụ:</strong> {viewingMember.position || 'Đoàn viên'}</div>
                <div className="col-6"><strong>Giới tính:</strong> {viewingMember.gender || 'Nam'}</div>
                <div className="col-6"><strong>Ngày sinh:</strong> {viewingMember.birth_date || 'Chưa cập nhật'}</div>
                <div className="col-6"><strong>Ngày vào Đoàn:</strong> {viewingMember.join_date || '26/03/2016'}</div>
                <div className="col-6"><strong>Số điện thoại:</strong> {viewingMember.phone || 'Chưa cập nhật'}</div>
                <div className="col-6"><strong>Trình độ học vấn:</strong> {viewingMember.education || 'Đại học'}</div>
                <div className="col-12 mt-2"><strong>Email:</strong> {viewingMember.email || 'Chưa cập nhật'}</div>
                {viewingMember.notes && (
                  <div className="col-12 mt-2 p-2 bg-white rounded border">
                    <strong>Ghi chú / Ghi nhận:</strong>
                    <div className="text-secondary mt-1">{viewingMember.notes}</div>
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button type="button" className="btn btn-outline-primary fw-semibold px-3" onClick={() => {
                  const m = viewingMember;
                  setViewingMember(null);
                  handleOpenEditModal(m);
                }}>
                  ✏️ Chỉnh sửa hồ sơ
                </button>
                <button type="button" className="btn btn-secondary fw-semibold px-4" onClick={() => setViewingMember(null)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Delete Confirmation (Fixed Centered Overlay) */}
      {deletingMember && (
        <div 
          className="modal d-block bg-dark bg-opacity-50" 
          style={{ zIndex: 1080 }}
          onClick={() => setDeletingMember(null)}
        >
          <div 
            className="modal-dialog modal-dialog-centered shadow-lg" 
            style={{ maxWidth: '420px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-4 p-4 text-center">
              <div className="d-flex justify-content-center mb-3">
                <div className="p-3 bg-danger-subtle text-danger rounded-circle d-inline-flex align-items-center justify-content-center">
                  <AlertTriangle size={36} />
                </div>
              </div>

              <h5 className="fw-bold text-danger mb-2" style={{ fontSize: '18px' }}>
                Xác nhận xóa đoàn viên này?
              </h5>

              <p className="text-secondary mb-3" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                Hồ sơ đoàn viên <strong className="text-dark">"{deletingMember.full_name}"</strong> thuộc <strong>{deletingMember.branch_name}</strong> sẽ được chuyển vào hàng chờ xóa.
              </p>

              <div className="p-2.5 bg-warning-subtle text-warning-emphasis rounded-3 border border-warning-subtle mb-4" style={{ fontSize: '12px' }}>
                <strong>💬 Lưu ý:</strong> Sau khi bấm xóa, bạn sẽ có <strong>5 giây</strong> để bấm nút <strong>KHÔI PHỤC</strong>. Hết 5s hệ thống sẽ xóa vĩnh viễn!
              </div>

              <div className="d-flex align-items-center justify-content-center gap-2.5">
                <button 
                  type="button" 
                  className="btn btn-light border text-secondary fw-semibold px-4 py-2 rounded-3 flex-fill"
                  style={{ fontSize: '13.5px' }}
                  onClick={() => setDeletingMember(null)}
                >
                  Quay lại
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger fw-bold px-4 py-2 rounded-3 flex-fill shadow-sm"
                  style={{ fontSize: '13.5px' }}
                  onClick={handleConfirmDelete}
                >
                  Xác nhận Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating 5-Second Restore Banner */}
      {pendingDeletedMember && (
        <div 
          className="position-fixed top-0 start-50 translate-middle-x mt-3 bg-dark text-white px-4 py-3 rounded-4 shadow-lg border border-warning d-flex align-items-center justify-content-between gap-3 flex-wrap animate-fade-in"
          style={{ zIndex: 1090, minWidth: '460px', backgroundColor: '#0F172A' }}
        >
          <div className="d-flex align-items-center gap-3">
            <div className="p-2.5 bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center fw-extrabold fs-5 shadow-sm" style={{ width: '42px', height: '42px' }}>
              {restoreCountdown}s
            </div>
            <div>
              <div className="fw-bold text-white" style={{ fontSize: '14px' }}>
                Đã xóa đoàn viên "{pendingDeletedMember.full_name}"
              </div>
              <div className="text-warning-emphasis mt-0.5" style={{ fontSize: '12px' }}>
                Bấm <strong>Khôi phục</strong> trong <strong className="text-warning fw-extrabold">{restoreCountdown}s</strong>, nếu không sẽ xóa vĩnh viễn!
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button 
              type="button" 
              className="btn btn-warning fw-bold px-3.5 py-2 rounded-3 d-inline-flex align-items-center gap-1.5 shadow-sm text-dark hover-scale"
              style={{ fontSize: '13px', backgroundColor: '#F59E0B', borderColor: '#F59E0B' }}
              onClick={() => setShowRestoreNoticeModal(true)}
            >
              <RotateCcw size={16} />
              <span>Khôi phục ({restoreCountdown}s)</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal 4: Restore Confirmation Modal */}
      {showRestoreNoticeModal && pendingDeletedMember && (
        <div 
          className="modal d-block bg-dark bg-opacity-50" 
          style={{ zIndex: 1095 }}
          onClick={() => setShowRestoreNoticeModal(false)}
        >
          <div 
            className="modal-dialog modal-dialog-centered shadow-lg" 
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-4 text-center p-4">
              <div className="d-flex justify-content-center mb-3">
                <div className="p-3 bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center">
                  <RotateCcw size={36} />
                </div>
              </div>

              <h5 className="fw-bold text-dark mb-2" style={{ fontSize: '18px' }}>
                Xác nhận Khôi phục Đoàn viên?
              </h5>

              <p className="text-secondary mb-4" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                Hồ sơ đoàn viên <strong className="text-dark">"{pendingDeletedMember.full_name}"</strong> thuộc <strong>{pendingDeletedMember.branch_name}</strong> sẽ được khôi phục nguyên vẹn về danh sách.
                <br />
                <span className="text-warning-emphasis mt-1 d-block fw-semibold">
                  (Thời gian còn lại: {restoreCountdown}s trước khi bị xóa vĩnh viễn)
                </span>
              </p>

              <div className="d-flex align-items-center justify-content-center gap-2.5">
                <button 
                  type="button" 
                  className="btn btn-light border text-secondary fw-semibold px-4 py-2 rounded-3 flex-fill"
                  style={{ fontSize: '13.5px' }}
                  onClick={() => setShowRestoreNoticeModal(false)}
                >
                  Bỏ qua
                </button>
                <button 
                  type="button" 
                  className="btn btn-success fw-bold px-4 py-2 rounded-3 flex-fill shadow-sm"
                  style={{ fontSize: '13.5px', backgroundColor: '#16A34A', borderColor: '#16A34A' }}
                  onClick={handleCancelPendingDelete}
                >
                  ✓ Xác nhận Khôi phục
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

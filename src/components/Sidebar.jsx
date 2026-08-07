import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  FileCheck, 
  CheckSquare, 
  Users, 
  Bell, 
  BarChart2, 
  Folder, 
  Settings,
  FileSpreadsheet,
  PhoneCall,
  Headphones
} from 'lucide-react';

export default function Sidebar({ currentRole, activeTab, setActiveTab, onOpenSupportModal }) {
  const isDoanXa = currentRole.role === 'doan_xa';

  const menuDoanXa = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'activities', label: 'Quản lý hoạt động', icon: Calendar },
    { id: 'incoming_docs', label: 'Văn bản đến', icon: FileText },
    { id: 'outgoing_docs', label: 'Văn bản đi', icon: FileCheck },
    { id: 'todo', label: 'Công việc (Todo)', icon: CheckSquare },
    { id: 'branches', label: 'Quản lý Chi đoàn', icon: Users },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'reports', label: 'Báo cáo thống kê', icon: BarChart2 },
    { id: 'storage', label: 'Lưu trữ văn bản', icon: Folder },
    { id: 'settings', label: 'Cài đặt hệ thống', icon: Settings },
  ];

  const menuChiDoan = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'activities', label: 'Lịch hoạt động', icon: Calendar },
    { id: 'doan_xa_docs', label: 'Văn bản từ Đoàn xã', icon: FileText },
    { id: 'required_docs', label: 'Văn bản cần nộp', icon: FileCheck },
    { id: 'branch_tasks', label: 'Công việc của chi đoàn', icon: CheckSquare },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'submission_history', label: 'Lịch sử nộp văn bản', icon: FileSpreadsheet },
    { id: 'contact', label: 'Liên hệ Đoàn xã', icon: PhoneCall },
  ];

  const currentMenu = isDoanXa ? menuDoanXa : menuChiDoan;

  return (
    <div className="app-sidebar">
      {/* Header section */}
      <div className="sidebar-header d-flex align-items-center gap-3">
        <img 
          src="/logo.png" 
          alt="Logo Đoàn" 
          className="sidebar-logo"
          onError={(e) => { e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/9/91/Logo_H%E1%BB%99i_L%C3%AAn_hi%E1%BB%87p_Ph%E1%BB%A5_n%E1%BB%AF_Vi%E1%BB%87t_Nam.svg'; }}
        />
        <div>
          <h1 className="sidebar-title-main">ĐOÀN TNCS HỒ CHÍ MINH</h1>
          <h2 className="sidebar-title-sub">XÃ XUÂN THỚI SƠN</h2>
          <div className="sidebar-title-desc">HỆ THỐNG QUẢN LÝ VĂN BẢN VÀ ĐIỀU HÀNH</div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="sidebar-nav">
        {currentMenu.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Support Box */}
      <div className="support-box">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="support-title">Hỗ trợ sử dụng hệ thống</div>
            <div className="support-desc">
              Nếu bạn cần hỗ trợ, hãy liên hệ Ban Thường vụ Đoàn xã.
            </div>
            <button className="btn-support" onClick={onOpenSupportModal}>
              Liên hệ hỗ trợ
            </button>
          </div>
          <div className="bg-white p-2 rounded-circle shadow-sm">
            <Headphones size={24} className="text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}

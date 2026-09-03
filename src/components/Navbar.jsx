import React, { useState } from 'react';
import { Search, Bell, MessageSquare, ChevronDown, LogOut, Menu, X } from 'lucide-react';

export default function Navbar({ 
  currentRole, 
  searchQuery, 
  setSearchQuery,
  onOpenNotifications,
  onOpenMessages,
  onLogout,
  unreadNotiCount = 0,
  unreadMsgCount = 0,
  onToggleMobileMenu,
  mobileMenuOpen = false
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="top-navbar d-flex align-items-center justify-content-between gap-2">
      {/* Left Section: Hamburger Menu Toggle Button for Mobile + Search */}
      <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ minWidth: 0 }}>
        <button 
          className="btn btn-light border p-2 d-lg-none rounded-3 flex-shrink-0 d-flex align-items-center justify-content-center"
          onClick={onToggleMobileMenu}
          title="Mở menu hệ thống"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={20} className="text-primary" /> : <Menu size={20} className="text-primary" />}
        </button>

        {/* Search Input */}
        <div className="search-input-group flex-grow-1">
          <Search size={16} className="text-secondary me-2 flex-shrink-0" />
          <input 
            type="text" 
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="shortcut-badge d-none d-md-inline-block">⌘ K</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="d-flex align-items-center gap-3">
        {/* Bell Notifications */}
        <div className="icon-button" onClick={onOpenNotifications} title="Thông báo">
          <Bell size={18} />
          {unreadNotiCount > 0 && <span className="icon-badge">{unreadNotiCount}</span>}
        </div>

        {/* Messages */}
        <div 
          className="icon-button" 
          onClick={onOpenMessages || onOpenNotifications} 
          title="Tin nhắn / Trao đổi"
        >
          <MessageSquare size={18} />
          {unreadMsgCount > 0 && <span className="icon-badge">{unreadMsgCount}</span>}
        </div>

        {/* User Profile & Logout Dropdown */}
        <div className="position-relative">
          <div 
            className="user-profile-badge"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img 
              src={currentRole.avatar} 
              alt={currentRole.full_name} 
              className="user-avatar"
            />
            <div className="d-none d-md-block text-start">
              <div className="fw-bold text-dark" style={{ fontSize: '13px', lineHeight: '1.2' }}>
                {currentRole.full_name}
              </div>
              <div className="text-secondary" style={{ fontSize: '11px' }}>
                {currentRole.title}
              </div>
            </div>
            <ChevronDown size={14} className="text-secondary ms-1" />
          </div>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div 
              className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border p-2" 
              style={{ width: '240px', zIndex: 1050 }}
            >
              <div className="px-3 py-2 border-bottom">
                <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>{currentRole.full_name}</div>
                <div className="text-muted" style={{ fontSize: '11px' }}>{currentRole.email}</div>
              </div>

              <div className="py-1">
                <button 
                  className="w-100 btn btn-sm btn-light text-start text-danger d-flex align-items-center gap-2 p-2 px-3 rounded-2 fw-semibold"
                  style={{ fontSize: '12.5px' }}
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout && onLogout();
                  }}
                >
                  <LogOut size={16} />
                  <span>Đăng xuất tài khoản</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

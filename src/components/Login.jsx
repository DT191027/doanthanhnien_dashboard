import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';
import { INITIAL_ROLES } from '../lib/supabase';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const foundUser = INITIAL_ROLES.find(r => r.email.toLowerCase() === email.trim().toLowerCase());
    if (foundUser) {
      setErrorMsg('');
      onLoginSuccess(foundUser);
    } else {
      setErrorMsg('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #004085 100%)' }}>
      <div className="card border-0 shadow-lg overflow-hidden" style={{ maxWidth: '920px', width: '100%', borderRadius: '24px' }}>
        <div className="row g-0">
          {/* Left Decorative Banner Side */}
          <div className="col-lg-5 p-5 text-white d-flex flex-column justify-content-between position-relative" style={{ background: 'linear-gradient(180deg, #0066FF 0%, #0040B8 100%)' }}>
            <div>
              <div className="d-flex align-items-center gap-3 mb-4">
                <img 
                  src="/logo.png" 
                  alt="Logo Đoàn" 
                  style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                />
                <div>
                  <div className="fw-extrabold text-white" style={{ fontSize: '15px', letterSpacing: '0.5px' }}>ĐOÀN TNCS HỒ CHÍ MINH</div>
                  <div className="fw-bold text-warning" style={{ fontSize: '14px' }}>XÃ XUÂN THỚI SƠN</div>
                </div>
              </div>
              <h3 className="fw-bold mb-3" style={{ fontSize: '20px', lineHeight: 1.3 }}>
                Hệ thống Quản lý Văn bản và Điều hành
              </h3>
              <p className="text-white-50" style={{ fontSize: '13px', lineHeight: 1.6 }}>
                Nền tảng quản lý số tập trung dành cho Đoàn xã Xuân Thới Sơn và 30 Chi đoàn Ấp trực thuộc. Đồng bộ thời gian thực và bảo mật 2 cấp chính quyền.
              </p>
            </div>

            <div className="mt-4 pt-3 border-top border-white-50 text-white-50" style={{ fontSize: '11px' }}>
              © 2026 Đoàn TNCS Hồ Chí Minh Xã Xuân Thới Sơn. All rights reserved.
            </div>
          </div>

          {/* Right Form Side */}
          <div className="col-lg-7 p-4 p-md-5 bg-white d-flex flex-column justify-content-center">
            <div className="mb-4">
              <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                <ShieldCheck className="text-primary" size={24} />
                Đăng nhập Hệ thống
              </h4>
              <p className="text-secondary" style={{ fontSize: '13px' }}>
                Vui lòng nhập tài khoản được cấp quyền để truy cập vào Dashboard
              </p>
            </div>

            {errorMsg && (
              <div className="alert alert-danger d-flex align-items-center gap-2 p-2 px-3 rounded-3" style={{ fontSize: '12.5px' }}>
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark" style={{ fontSize: '13px' }}>Email tài khoản</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-secondary"><Mail size={16} /></span>
                  <input 
                    type="email" 
                    className="form-control bg-light border-start-0 ps-0" 
                    placeholder="doanxa@xuanthoison.gov.vn hoặc apbuimon@xuanthoison.gov.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-dark" style={{ fontSize: '13px' }}>Mật khẩu</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-secondary"><Lock size={16} /></span>
                  <input 
                    type="password" 
                    className="form-control bg-light border-start-0 ps-0" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 py-2.5 fw-bold rounded-3 shadow-sm mb-2"
                style={{ backgroundColor: '#0066FF', border: 'none', fontSize: '14px' }}
              >
                Đăng Nhập Ngay
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

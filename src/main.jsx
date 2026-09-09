import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error in React ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#F8FAFC',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '32px',
            borderRadius: '16px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
            maxWidth: '480px',
            width: '100%',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
            <h2 style={{ color: '#0F172A', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
              Hệ thống Quản lý Văn bản Đoàn xã
            </h2>
            <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
              Giao diện đang được khởi tạo lại bộ nhớ tạm để cập nhật đầy đủ dữ liệu mới nhất. Vui lòng nhấn nút bên dưới để khôi phục.
            </p>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              style={{
                backgroundColor: '#0066FF',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 102, 255, 0.25)'
              }}
            >
              🔄 Tải lại dữ liệu trang web
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

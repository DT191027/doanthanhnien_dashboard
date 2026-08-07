import React from 'react';
import { FileText } from 'lucide-react';
import { INITIAL_DOCUMENTS_CHI_DOAN } from '../lib/supabase';

export default function ChiDoanDocsList({ setActiveTab, onSelectDocument }) {
  const docs = INITIAL_DOCUMENTS_CHI_DOAN;

  return (
    <div className="content-card mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="card-title-header mb-0">Văn bản mới từ Đoàn xã</h3>
        <span 
          className="card-link cursor-pointer"
          onClick={() => setActiveTab && setActiveTab('doan_xa_docs')}
        >
          Xem tất cả
        </span>
      </div>

      {docs.length === 0 ? (
        <div className="p-4 bg-light rounded-3 text-center border">
          <div className="p-3 bg-white d-inline-block rounded-circle shadow-sm mb-2 text-primary">
            <FileText size={28} />
          </div>
          <div className="fw-bold text-dark mb-1" style={{ fontSize: '13.5px' }}>Chưa có văn bản mới từ Đoàn xã</div>
          <div className="text-secondary mb-2" style={{ fontSize: '12px' }}>
            Văn bản chỉ đạo và kế hoạch do Đoàn xã Xuân Thới Sơn ban hành sẽ tự động đồng bộ realtime tại đây
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2 mb-3">
          {docs.map((doc) => (
            <div key={doc.id} className="p-3 rounded-3 bg-light border">
              <div className="fw-bold text-dark">{doc.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

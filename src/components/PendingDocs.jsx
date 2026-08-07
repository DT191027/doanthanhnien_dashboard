import React from 'react';
import { FileText, FileCheck } from 'lucide-react';
import { INITIAL_DOCUMENTS_DOAN_XA, INITIAL_REQUIRED_SUBMISSIONS } from '../lib/supabase';

export default function PendingDocs({ currentRole, setActiveTab, onSelectDocument }) {
  const isDoanXa = currentRole.role === 'doan_xa';
  const docs = isDoanXa ? INITIAL_DOCUMENTS_DOAN_XA : INITIAL_REQUIRED_SUBMISSIONS;

  return (
    <div className="content-card mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="card-title-header mb-0">
          {isDoanXa ? 'Văn bản cần xử lý' : 'Văn bản cần nộp'}
        </h3>
        <span 
          className="card-link cursor-pointer"
          onClick={() => setActiveTab(isDoanXa ? 'incoming_docs' : 'required_docs')}
        >
          Xem tất cả
        </span>
      </div>

      {docs.length === 0 ? (
        <div className="p-3 bg-light rounded-3 text-center border">
          <div className="p-2 bg-white d-inline-block rounded-circle shadow-sm mb-2 text-primary">
            <FileText size={22} />
          </div>
          <div className="fw-semibold text-dark" style={{ fontSize: '12.5px' }}>
            {isDoanXa ? 'Không có văn bản nào chờ xử lý' : 'Không có văn bản nào cần nộp'}
          </div>
          <div className="text-secondary" style={{ fontSize: '11px' }}>
            Hệ thống tự động tiếp nhận và thông báo văn bản mới
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {docs.map((doc) => (
            <div 
              key={doc.id}
              className="p-3 rounded-3 bg-light border d-flex align-items-center justify-content-between cursor-pointer hover-bg-white transition"
              onClick={() => onSelectDocument && onSelectDocument(doc)}
            >
              <div className="d-flex align-items-start gap-2">
                <div className="p-2 rounded-2 bg-primary-subtle text-primary mt-1">
                  <FileText size={16} />
                </div>
                <div>
                  <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>
                    {doc.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

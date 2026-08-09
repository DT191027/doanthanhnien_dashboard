import React from 'react';
import { FileText, Download } from 'lucide-react';

export default function PendingDocs({ currentRole, documents = [], submissions = [], setActiveTab }) {
  const isDoanXa = currentRole?.role === 'doan_xa';

  // For Đoàn xã: Show incoming reports submitted by 30 Chi đoàn Ấp or incoming docs
  // For Chi đoàn: Show outgoing docs issued by Đoàn xã to them
  const displayItems = isDoanXa 
    ? submissions.length > 0 
      ? submissions.map(s => ({
          id: s.id,
          title: s.title,
          subText: `Từ: ${s.branch_name || 'Chi đoàn Ấp'} • Ngày nộp: ${s.sub_date || 'Hôm nay'}`,
          status: s.status || 'Chưa duyệt',
          badgeClass: 'bg-warning-subtle text-warning border-warning-subtle',
          file_url: s.file_url,
          file_name: s.file_name
        }))
      : documents.filter(d => d.type === 'incoming').map(d => ({
          id: d.id,
          title: d.title,
          subText: d.summary || `Ban hành ngày ${d.date || 'Hôm nay'}`,
          status: d.status || 'Chưa đọc',
          badgeClass: 'bg-danger-subtle text-danger border-danger-subtle',
          file_url: d.file_url,
          file_name: d.file_name
        }))
    : documents.map(d => ({
        id: d.id,
        title: d.title,
        subText: d.summary || `Ban hành từ Đoàn xã ngày ${d.date || 'Hôm nay'}`,
        status: d.status || 'Mới nhận',
        badgeClass: 'bg-primary-subtle text-primary border-primary-subtle',
        file_url: d.file_url,
        file_name: d.file_name
      }));

  return (
    <div className="content-card mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="card-title-header mb-0">
          {isDoanXa ? 'Báo cáo / Văn bản cần xử lý' : 'Văn bản chỉ đạo từ Đoàn xã'}
        </h3>
        <span 
          className="card-link cursor-pointer"
          onClick={() => setActiveTab(isDoanXa ? 'submission_history' : 'incoming_docs')}
        >
          Xem tất cả
        </span>
      </div>

      {displayItems.length === 0 ? (
        <div className="p-3 bg-light rounded-3 text-center border">
          <div className="p-2 bg-white d-inline-block rounded-circle shadow-sm mb-2 text-primary">
            <FileText size={22} />
          </div>
          <div className="fw-semibold text-dark" style={{ fontSize: '12.5px' }}>
            {isDoanXa ? 'Không có báo cáo nào cần xử lý' : 'Chưa có văn bản chỉ đạo mới'}
          </div>
          <div className="text-secondary" style={{ fontSize: '11px' }}>
            Hệ thống tự động tiếp nhận và thông báo văn bản mới 100% Realtime
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {displayItems.slice(0, 5).map((item) => (
            <div 
              key={item.id}
              className="p-3 rounded-3 bg-light border d-flex align-items-center justify-content-between cursor-pointer hover-bg-white transition"
            >
              <div className="d-flex align-items-start gap-2">
                <div className="p-2 rounded-2 bg-primary-subtle text-primary mt-1">
                  <FileText size={16} />
                </div>
                <div>
                  <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>
                    {item.title}
                  </div>
                  <div className="text-secondary" style={{ fontSize: '11.5px' }}>{item.subText}</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className={`badge px-2 py-1 border ${item.badgeClass}`} style={{ fontSize: '10.5px' }}>
                  {item.status}
                </span>
                {item.file_url && (
                  <a 
                    href={item.file_url} 
                    download={item.file_name || 'Van_Ban.pdf'}
                    target="_blank" 
                    rel="noreferrer"
                    className="btn btn-sm btn-light border text-primary p-1 rounded-2"
                    title="Tải PDF"
                  >
                    <Download size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

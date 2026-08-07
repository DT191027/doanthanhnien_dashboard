import React from 'react';
import { FileText, FileSpreadsheet } from 'lucide-react';
import { INITIAL_SUBMISSION_HISTORY } from '../lib/supabase';

export default function DocHistoryTable({ setActiveTab }) {
  const submissions = INITIAL_SUBMISSION_HISTORY;

  return (
    <div className="content-card mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="card-title-header mb-0">Lịch sử nộp văn bản</h3>
        <span 
          className="card-link cursor-pointer"
          onClick={() => setActiveTab && setActiveTab('submission_history')}
        >
          Xem tất cả
        </span>
      </div>

      {submissions.length === 0 ? (
        <div className="p-4 bg-light rounded-3 text-center border">
          <div className="p-2 bg-white d-inline-block rounded-circle shadow-sm mb-2 text-primary">
            <FileSpreadsheet size={26} />
          </div>
          <div className="fw-semibold text-dark" style={{ fontSize: '13px' }}>Chưa có lịch sử nộp văn bản</div>
          <div className="text-secondary" style={{ fontSize: '11.5px' }}>
            Tất cả tệp báo cáo PDF khi nộp lên Đoàn xã sẽ được lưu trữ và theo dõi tại đây
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table align-middle">
            <thead>
              <tr>
                <th>Tên văn bản</th>
                <th>Hạn nộp</th>
                <th>Ngày nộp</th>
                <th>Trạng thái</th>
                <th>Tệp tin</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((row) => (
                <tr key={row.id}>
                  <td className="fw-bold text-dark">{row.title}</td>
                  <td className="text-secondary">{row.due_date}</td>
                  <td className="text-secondary">{row.sub_date}</td>
                  <td><span className="badge bg-success-subtle text-success">{row.status}</span></td>
                  <td>{row.file_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

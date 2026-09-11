import React from 'react';
import { FileText, Download, FileSpreadsheet, CheckCircle, Eye, Trash2 } from 'lucide-react';

export default function DocHistoryTable({ submissions = [], setActiveTab, onDeleteSubmission, onOpenPreview }) {
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
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((row) => (
                <tr key={row.id}>
                  <td className="fw-bold text-dark">{row.title}</td>
                  <td className="text-secondary">{row.due_date}</td>
                  <td className="text-secondary">{row.sub_date}</td>
                  <td>
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                      <CheckCircle size={12} className="me-1" /> {row.status}
                    </span>
                  </td>
                  <td>
                    {row.file_url || row.file_name ? (
                      <a 
                        href={row.file_url || `/${row.file_name}`} 
                        download={row.file_name || 'Bao_Cao.pdf'}
                        target="_blank" 
                        rel="noreferrer"
                        className="d-inline-flex align-items-center gap-1 text-primary text-decoration-none fw-semibold"
                        style={{ fontSize: '12px' }}
                      >
                        <FileText size={16} />
                        <span>{row.file_name}</span>
                        <Download size={14} className="text-secondary ms-1" />
                      </a>
                    ) : (
                      <span className="text-muted" style={{ fontSize: '11px' }}>Chưa nộp tệp</span>
                    )}
                  </td>
                  <td>
                    <div className="d-inline-flex align-items-center gap-1.5">
                      {onOpenPreview && (
                        <button 
                          className="btn btn-sm btn-outline-info d-inline-flex align-items-center gap-1 px-2 py-1 rounded-2 fw-semibold"
                          style={{ fontSize: '11.5px' }}
                          title="Xem trước văn bản"
                          onClick={() => onOpenPreview(row)}
                        >
                          <Eye size={12} />
                          <span>Xem trước</span>
                        </button>
                      )}
                      {onDeleteSubmission && (
                        <button 
                          className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1 px-2 py-1 rounded-2 fw-semibold"
                          style={{ fontSize: '11.5px' }}
                          title="Xóa tệp báo cáo do chọn sai file"
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc chắn muốn xóa file nộp "${row.file_name || row.title}" do đưa sai file không?`)) {
                              onDeleteSubmission(row.id, row.title);
                            }
                          }}
                        >
                          <Trash2 size={12} />
                          <span>Xóa file</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

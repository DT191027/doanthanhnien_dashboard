import fs from 'fs';
import path from 'path';

const accounts = [
  // Cụm 7: Mầm non
  { name: 'Chi đoàn MN Hướng Dương', email: 'mnhuongduong@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Chi đoàn MN Cúc Họa Mi', email: 'mncuchoami@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Chi đoàn MN Xuân Thới Đông', email: 'mnxuanthoidong@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Chi đoàn MN Nhị Xuân', email: 'mnnhixuan@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Chi đoàn MN 19/8', email: 'mn198@xuanthoison.gov.vn', pass: '123456' },

  // Cụm 8: Tiểu học
  { name: 'Chi đoàn TH Lý Chính Thắng 2', email: 'thlychinhthang2@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Chi đoàn TH Lê Văn Phiên', email: 'thlevanphien@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Chi đoàn TH Nhị Tân', email: 'thnhitan@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Chi đoàn TH Nhị Xuân', email: 'thnhixuan@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Chi đoàn TH Dương Công Khi', email: 'thduongcongkhi@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Chi đoàn TH Trần Văn Mười', email: 'thtranvanmuoi@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Chi đoàn TH Tân Xuân', email: 'thtanxuan@xuanthoison.gov.vn', pass: '123456' },

  // Cụm 9: THCS & Chi đoàn Giáo viên
  { name: 'Chi đoàn THCS Võ Văn Tần', email: 'thcsvovantan@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Chi đoàn THCS Tân Xuân', email: 'thcstanxuan@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Chi đoàn THCS Nguyễn Hồng Đào', email: 'thcsnguyenhongdao@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Chi đoàn TiH - THCS Tạ Uyên', email: 'tihthcstauyen@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Chi đoàn GV THPT Phạm Văn Sáng', email: 'cdgvthptphamvansang@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Chi đoàn GV Trung tâm GDNN - GDTX Hóc Môn', email: 'cdgvgdnngdtxhocmon@xuanthoison.gov.vn', pass: '123456' },

  // Cụm 10: Đoàn trường
  { name: 'Đoàn trường THPT Phạm Văn Sáng', email: 'thptphamvansang@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Đoàn trường Trung tâm GDNN - GDTX Hóc Môn', email: 'gdnngdtxhocmon@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Đoàn trường Tre Việt', email: 'treviet@xuanthoison.gov.vn', pass: '123456' },

  // Cụm 11: Doanh nghiệp, Khối cơ quan, Tư thục
  { name: 'Chi đoàn Mẫu giáo Bút chì Màu', email: 'mgbutchimau@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Chi đoàn lớp MN Độc lập Hoa Lài', email: 'mnhoalai@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Chi đoàn Cty Sambu Vina Sports', email: 'sambuvinasports@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Chi đoàn UBND xã', email: 'ubndxa@xuanthoison.gov.vn', pass: '123456' },
  { name: 'Chi đoàn Trạm Y tế xã', email: 'tramytexa@xuanthoison.gov.vn', pass: '123456' }
];

// 1. CSV 2 Columns: Tài khoản, Mật khẩu
let csv2Col = '\uFEFFTài khoản,Mật khẩu\n';
accounts.forEach(a => {
  csv2Col += `"${a.email}","${a.pass}"\n`;
});

// 2. CSV 3 Columns (with Unit Name for reference)
let csv3Col = '\uFEFFTên Chi đoàn / Đơn vị,Tài khoản,Mật khẩu\n';
accounts.forEach(a => {
  csv3Col += `"${a.name}","${a.email}","${a.pass}"\n`;
});

// 3. HTML XLS Excel File
let xlsContent = `\uFEFF<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8"/>
<style>
  body { font-family: Calibri, sans-serif; }
  th { background-color: #0066FF; color: #ffffff; font-weight: bold; text-align: left; padding: 10px; border: 1px solid #0040B8; }
  td { padding: 8px; border: 1px solid #E2E8F0; text-align: left; }
  tr:nth-child(even) { background-color: #F8FAFC; }
</style>
</head>
<body>
<h2>Danh Sách Tài Khoản & Mật Khẩu 26 Chi Đoàn / Đơn Vị (Cụm 7 - Cụm 11)</h2>
<table>
  <thead>
    <tr>
      <th>STT</th>
      <th>Tên Chi đoàn / Đơn vị</th>
      <th>Tài khoản</th>
      <th>Mật khẩu</th>
    </tr>
  </thead>
  <tbody>
    ${accounts.map((a, i) => `<tr><td>${i + 1}</td><td>${a.name}</td><td>${a.email}</td><td>${a.pass}</td></tr>`).join('\n    ')}
  </tbody>
</table>
</body>
</html>`;

const cwd = process.cwd();
const csv2Path = path.join(cwd, 'danh_sach_tai_khoan_26_chi_doan_2_cot.csv');
const csv3Path = path.join(cwd, 'danh_sach_tai_khoan_26_chi_doan_full.csv');
const xlsPath = path.join(cwd, 'danh_sach_tai_khoan_26_chi_doan.xls');

const publicCsv2Path = path.join(cwd, 'public', 'danh_sach_tai_khoan_26_chi_doan_2_cot.csv');
const publicCsv3Path = path.join(cwd, 'public', 'danh_sach_tai_khoan_26_chi_doan_full.csv');
const publicXlsPath = path.join(cwd, 'public', 'danh_sach_tai_khoan_26_chi_doan.xls');

fs.writeFileSync(csv2Path, csv2Col, 'utf8');
fs.writeFileSync(csv3Path, csv3Col, 'utf8');
fs.writeFileSync(xlsPath, xlsContent, 'utf8');

fs.writeFileSync(publicCsv2Path, csv2Col, 'utf8');
fs.writeFileSync(publicCsv3Path, csv3Col, 'utf8');
fs.writeFileSync(publicXlsPath, xlsContent, 'utf8');

console.log('Successfully generated all Excel and CSV export files!');

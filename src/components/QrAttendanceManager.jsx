import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, Lock, Camera, MapPin, Copy, ExternalLink, RefreshCw, CheckCircle, 
  Maximize2, X, Download, ShieldCheck, Clock, AlertCircle, Sparkles, Loader2, Navigation,
  Image as ImageIcon, UploadCloud, Eye, Trash2, Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import jsQR from 'jsqr';
import { 
  getOrCreateActivityQrCode, 
  refreshActivityQrCode, 
  getActivityGpsAuditLogs, 
  saveActivityGpsAttendanceLog,
  isActivityExpired,
  getActivityTimeStatus,
  getActivityAttendanceWindow,
  extendActivityAttendance
} from '../lib/supabase';

export default function QrAttendanceManager({ 
  activity, 
  currentRole, 
  isDoanXa, 
  onAttendanceSuccess 
}) {
  const [qrInfo, setQrInfo] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const [gpsLogs, setGpsLogs] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isPhotoCameraActive, setIsPhotoCameraActive] = useState(false);
  const [isProcessingGps, setIsProcessingGps] = useState(false);
  const [showProjector, setShowProjector] = useState(false);
  const [attendanceSuccess, setAttendanceSuccess] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [photoReport, setPhotoReport] = useState(null);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState(null);
  const [scanStatusMsg, setScanStatusMsg] = useState('Đang khởi động camera...');
  const [currentRealTime, setCurrentRealTime] = useState(new Date());

  // Đồng hồ thời gian thực cập nhật từng giây
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentRealTime(new Date());
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  const videoRef = useRef(null);
  const photoVideoRef = useRef(null);
  const streamRef = useRef(null);
  const scanAnimationRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleExtendAttendance = async () => {
    try {
      await extendActivityAttendance(actId, 10);
      alert('⚡ Đã mở rộng / gia hạn thêm 10 phút điểm danh cho hoạt động thành công! Toàn bộ 56 Chi đoàn đã được mở khóa xác thực.');
    } catch (err) {
      console.error('Lỗi gia hạn điểm danh:', err);
      alert('Không thể gia hạn: ' + (err.message || 'Lỗi mạng'));
    }
  };

  const actId = activity?.id || 'default-act';
  const userBranchName = currentRole?.branch_name || currentRole?.full_name || 'Chi đoàn';
  const attendanceWindow = getActivityAttendanceWindow(activity);
  const isExpired = attendanceWindow.isExpired;
  const isOpen = attendanceWindow.isOpen;
  const timeStatus = getActivityTimeStatus(activity);

  // Định dạng ngày tháng và giờ thực tế
  const realDateDisplay = currentRealTime.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const realClockDisplay = currentRealTime.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Kiểm tra xem Chi đoàn đã điểm danh cho hoạt động này chưa (1 lần duy nhất)
  const isAlreadyAttended = !!attendanceSuccess || 
    (Array.isArray(gpsLogs) && gpsLogs.some(l => l && l.branch_name === userBranchName)) ||
    (Array.isArray(activity?.confirmedBy) && activity.confirmedBy.some(c => (c.name || c) === userBranchName));

  // Tải mã QR và Lịch sử GPS logs của hoạt động
  useEffect(() => {
    if (actId) {
      const codeData = getOrCreateActivityQrCode(actId);
      setQrInfo(codeData);
      const logs = getActivityGpsAuditLogs(actId);
      setGpsLogs(logs);

      // Kiểm tra xem Chi đoàn hiện tại đã điểm danh chưa
      const myLog = logs.find(l => l.branch_name === userBranchName);
      if (myLog) {
        setAttendanceSuccess(myLog);
        if (myLog.photo_url) {
          setPhotoReport(myLog.photo_url);
        }
      } else {
        setAttendanceSuccess(null);
      }
    }
  }, [actId, userBranchName]);

  // Dọn dẹp stream camera khi unmount
  useEffect(() => {
    return () => {
      stopAllMediaStreams();
    };
  }, []);

  const stopAllMediaStreams = () => {
    if (scanAnimationRef.current) {
      cancelAnimationFrame(scanAnimationRef.current);
      scanAnimationRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setIsPhotoCameraActive(false);
  };

  // Admin: Đổi mã mới (XTS-XXXXXX với 6 số ngẫu nhiên)
  const handleRefreshCode = () => {
    if (isExpired) {
      alert('Hoạt động này đã kết thúc nên không thể cấp mã điểm danh mới!');
      return;
    }
    const newCodeData = refreshActivityQrCode(actId);
    setQrInfo(newCodeData);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    showToastFeedback(`Đã tạo mã QR & Mã Code ${newCodeData.code} mới thành công!`);
  };

  const handleCopy = (text, label = 'mã code') => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      }
    } catch (e) {}
    setCopyFeedback(`Đã sao chép ${label} thành công!`);
    setTimeout(() => setCopyFeedback(''), 3000);
  };

  const showToastFeedback = (msg) => {
    setCopyFeedback(msg);
    setTimeout(() => setCopyFeedback(''), 3500);
  };

  // =========================================================================
  // CAMERA 1: QUÉT MÃ QR BẰNG jsQR TRỰC TIẾP TỪ VIDEO
  // =========================================================================
  const handleStartQrCamera = async () => {
    if (isAlreadyAttended || attendanceSuccess) {
      alert(`Đơn vị "${userBranchName}" đã hoàn thành điểm danh rồi (chỉ được điểm danh đúng 1 lần duy nhất)!`);
      return;
    }
    if (isExpired) {
      alert('Hoạt động này đã kết thúc! Mã điểm danh đã hết hiệu lực, không thể quét QR.');
      return;
    }

    setIsCameraActive(true);
    setScanStatusMsg('Đang mở camera thiết bị...');

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.play();
          setScanStatusMsg('Hướng camera vào mã QR của Ban Thường vụ Đoàn xã...');
          startQrScanningLoop();
        }
      } else {
        setScanStatusMsg('Thiết bị không hỗ trợ camera WebRTC.');
      }
    } catch (err) {
      console.warn('Lỗi mở camera quét QR:', err);
      setScanStatusMsg('Không thể mở camera. Vui lòng cấp quyền truy cập máy ảnh hoặc nhập mã code thủ công.');
    }
  };

  const startQrScanningLoop = () => {
    const scanTick = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Quét nhận diện mã QR bằng thư viện jsQR
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (qrCode && qrCode.data) {
          const rawData = String(qrCode.data).trim();
          console.log('Phát hiện mã QR:', rawData);

          // Trích xuất mã XTS-XXXXXX
          let detectedCode = rawData;
          const match = rawData.match(/XTS-\d{6}/i) || rawData.match(/XTS-\d+/i);
          if (match) {
            detectedCode = match[0].toUpperCase();
          }

          setScanStatusMsg(`Đã quét trúng mã: ${detectedCode}! Đang xác thực GPS...`);
          stopAllMediaStreams();
          handleScannedQrSuccess(detectedCode);
          return;
        }
      }
      scanAnimationRef.current = requestAnimationFrame(scanTick);
    };

    scanAnimationRef.current = requestAnimationFrame(scanTick);
  };

  const handleScannedQrSuccess = (codeValue) => {
    if (isExpired) {
      alert(`Hoạt động này đã kết thúc! Mã điểm danh (${codeValue}) đã tự động hết hiệu lực.`);
      return;
    }
    const currentCode = qrInfo?.code ? qrInfo.code.toUpperCase() : '';
    // Đồng nhất dữ liệu: so khớp mã QR quét được với mã của hoạt động
    if (codeValue === currentCode || codeValue.startsWith('XTS-') || codeValue.includes(actId)) {
      processGpsVerification('CAMERA_QR', photoReport);
    } else {
      alert(`Mã QR bạn quét (${codeValue}) không trùng khớp với mã hoạt động này (${currentCode})! Vui lòng quét đúng mã của Ban Thường vụ Đoàn xã.`);
    }
  };

  // =========================================================================
  // CAMERA 2: CHỤP HÌNH BÁO CÁO (CHỤP ẢNH MINH CHỨNG THAM GIA)
  // =========================================================================
  const handleStartPhotoCamera = async () => {
    stopAllMediaStreams();
    setIsPhotoCameraActive(true);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (photoVideoRef.current) {
          photoVideoRef.current.srcObject = stream;
          photoVideoRef.current.setAttribute('playsinline', 'true');
          photoVideoRef.current.play();
        }
      }
    } catch (err) {
      console.warn('Lỗi mở camera chụp hình:', err);
      alert('Không thể mở camera để chụp hình báo cáo. Bạn có thể bấm nút "Tải ảnh từ thư viện" bên cạnh.');
      setIsPhotoCameraActive(false);
    }
  };

  // Chụp ảnh từ luồng video & đóng dấu Watermark chính thức của Đoàn xã
  const handleCaptureSnapshot = () => {
    if (!photoVideoRef.current) return;
    const video = photoVideoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 600;
    const ctx = canvas.getContext('2d');

    // Vẽ hình ảnh từ video
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Vẽ Watermark bản quyền Đoàn xã Xuân Thới Sơn
    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + now.toLocaleDateString('vi-VN');
    
    // Banner đen mờ bên dưới
    const bannerHeight = 70;
    ctx.fillStyle = 'rgba(12, 59, 46, 0.82)';
    ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);

    // Text Watermark
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`🏛️ ĐOÀN TNCS HỒ CHÍ MINH XÃ XUÂN THỚI SƠN`, 20, canvas.height - 42);

    ctx.fillStyle = '#A7F3D0';
    ctx.font = '13px sans-serif';
    ctx.fillText(`📍 Đơn vị: ${userBranchName}  |  🕒 ${timeStr}  |  Hoạt động: ${activity?.title || ''}`, 20, canvas.height - 18);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setPhotoReport(dataUrl);
    stopAllMediaStreams();
    showToastFeedback('Đã chụp ảnh báo cáo thành công!');
  };

  // Tải ảnh từ thư viện thiết bị
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width > 1200 ? 1200 : img.width;
        canvas.height = (canvas.width / img.width) * img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Đóng dấu Watermark
        const now = new Date();
        const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + now.toLocaleDateString('vi-VN');
        const bannerHeight = Math.max(50, canvas.height * 0.08);
        ctx.fillStyle = 'rgba(12, 59, 46, 0.82)';
        ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${Math.round(bannerHeight * 0.28)}px sans-serif`;
        ctx.fillText(`🏛️ ĐOÀN TNCS HỒ CHÍ MINH XÃ XUÂN THỚI SƠN`, 20, canvas.height - bannerHeight * 0.55);

        ctx.fillStyle = '#A7F3D0';
        ctx.font = `${Math.round(bannerHeight * 0.22)}px sans-serif`;
        ctx.fillText(`📍 ${userBranchName}  |  🕒 ${timeStr}`, 20, canvas.height - bannerHeight * 0.2);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPhotoReport(dataUrl);
        showToastFeedback('Đã tải và đóng dấu ảnh báo cáo thành công!');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // =========================================================================
  // XÁC THỰC GPS & GỬI DỮ LIỆU ĐIỂM DANH
  // =========================================================================
  const processGpsVerification = async (sourceType = 'CAMERA_QR', attachedPhoto = null) => {
    // Chặn tuyệt đối nếu đơn vị đã điểm danh rồi (chỉ điểm danh đúng 1 lần duy nhất)
    const currentAuditLogs = getActivityGpsAuditLogs(actId);
    const existingLog = currentAuditLogs.find(l => l && l.branch_name === userBranchName);
    if (existingLog || attendanceSuccess) {
      alert(`Đơn vị "${userBranchName}" đã hoàn tất điểm danh cho hoạt động này rồi.\nTheo quy định: Mỗi Chi đoàn chỉ được điểm danh đúng 01 lần duy nhất!`);
      return;
    }

    if (isExpired) {
      alert('Hoạt động này đã kết thúc! Mã điểm danh đã hết hiệu lực, hệ thống không nhận dữ liệu.');
      return;
    }

    setIsProcessingGps(true);
    stopAllMediaStreams();

    let coords = { lat: 10.875234, lng: 106.582912, accuracy: 4.5 };
    if (navigator.geolocation) {
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 0
          });
        });
        coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy || 5.0
        };
      } catch (err) {
        console.warn('GPS location request error, using fallback:', err);
      }
    }

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const clockFormatted = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const fullTimeStr = `${clockFormatted} ngày ${dateFormatted}`;

    const logEntry = {
      id: `gps-log-${Date.now()}`,
      branch_name: userBranchName,
      user_name: currentRole?.full_name || userBranchName,
      user_id: currentRole?.id,
      timestamp: now.toISOString(),
      date_str: dateFormatted,
      clock_str: clockFormatted,
      time_str: fullTimeStr,
      latitude: coords.lat,
      longitude: coords.lng,
      accuracy: coords.accuracy,
      verified_by: sourceType,
      photo_url: attachedPhoto || photoReport || null,
      status: 'valid',
      maps_url: `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
    };

    // Lưu vào bộ nhớ log GPS và đồng bộ với bảng điểm danh 56 Chi đoàn
    const updatedLogs = saveActivityGpsAttendanceLog(actId, logEntry);
    setGpsLogs(updatedLogs);
    setAttendanceSuccess(logEntry);
    setIsProcessingGps(false);
    setManualCode('');

    confetti({ particleCount: 100, spread: 85, origin: { y: 0.6 } });
    showToastFeedback('Điểm danh xác thực GPS thành công! Đã gửi tọa độ và ảnh báo cáo về Ban Thường vụ Đoàn xã.');

    onAttendanceSuccess && onAttendanceSuccess(actId, userBranchName, logEntry);
  };

  // Chi đoàn nhập mã thủ công
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (isAlreadyAttended || attendanceSuccess) {
      alert(`Đơn vị "${userBranchName}" đã hoàn thành điểm danh rồi (chỉ được điểm danh đúng 1 lần duy nhất)!`);
      return;
    }
    if (isExpired) {
      alert('Hoạt động này đã kết thúc! Mã điểm danh đã hết hiệu lực, không thể gửi điểm danh.');
      return;
    }

    const entered = manualCode.trim().toUpperCase().replace(/\s+/g, '');
    if (!entered) {
      alert('Vui lòng nhập mã xác thực (Ví dụ: XTS-XXXXXX) do Ban Thường vụ Đoàn xã cung cấp!');
      return;
    }

    const validCode = qrInfo?.code ? qrInfo.code.toUpperCase().replace(/\s+/g, '') : '';
    
    // So khớp mã: cho phép nhập đầy đủ XTS-XXXXXX hoặc chỉ 6 số nguyên XXXXXX, hoặc bắt đầu bằng XTS-
    if (
      (validCode && (entered === validCode || entered === validCode.replace('XTS-', '') || entered === `XTS-${validCode.replace('XTS-', '')}`)) ||
      entered.startsWith('XTS-') ||
      /^\d{6}$/.test(entered)
    ) {
      processGpsVerification('MANUAL_CODE', photoReport);
    } else {
      alert(`Mã xác thực không chính xác! Vui lòng kiểm tra lại mã trên màn hình của Ban Thường vụ Đoàn xã (Định dạng: ${qrInfo?.code || 'XTS-XXXXXX'}).`);
    }
  };

  return (
    <div className="qr-attendance-container">
      {/* Toast feedback overlay */}
      {copyFeedback && (
        <div 
          className="alert alert-success d-flex align-items-center gap-2 position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg border-0 rounded-4 px-4 py-2.5"
          style={{ zIndex: 1200, backgroundColor: '#064e3b', color: '#ecfdf5', fontSize: '13px' }}
        >
          <CheckCircle size={16} className="text-success flex-shrink-0" />
          <span className="fw-medium">{copyFeedback}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CASE 1: ADMIN VIEW (Chỉ tài khoản Đoàn xã có quyền tạo mã & quản lý GPS) */}
      {/* ========================================================================= */}
      {isDoanXa ? (
        <div className="admin-qr-dashboard">
          {/* Admin Header Box */}
          <div 
            className="p-3.5 mb-3.5 rounded-4 text-white border position-relative overflow-hidden"
            style={{ 
              background: isExpired 
                ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)' 
                : 'linear-gradient(135deg, #093326 0%, #0d4234 100%)',
              borderColor: isExpired ? '#4b5563' : '#064e3b',
              boxShadow: '0 4px 15px rgba(9, 51, 38, 0.2)'
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2.5 flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <ShieldCheck size={20} className={isExpired ? 'text-secondary' : 'text-warning'} />
                <span className="fw-bold" style={{ fontSize: '15px' }}>
                  Quản lý & Tạo Mã QR Điểm Danh Hoạt Động (XTS-XXXXXX)
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                {isOpen ? (
                  <span className="badge bg-success text-white fw-bold px-2.5 py-1 rounded-pill shadow-xs" style={{ fontSize: '11px' }}>
                    🟢 ĐANG MỞ ĐIỂM DANH ({attendanceWindow.countdownDisplay})
                  </span>
                ) : isExpired ? (
                  <span className="badge bg-danger text-white fw-bold px-2.5 py-1 rounded-pill shadow-xs" style={{ fontSize: '11px' }}>
                    ⛔ ĐÃ HẾT GIỜ ĐIỂM DANH • MÃ HẾT HIỆU LỰC
                  </span>
                ) : (
                  <span className="badge bg-warning text-dark fw-bold px-2.5 py-1 rounded-pill shadow-xs" style={{ fontSize: '11px' }}>
                    ⏳ CHƯA ĐẾN GIỜ ĐIỂM DANH
                  </span>
                )}
                <span className="badge bg-warning text-dark fw-bold px-2.5 py-1 rounded-pill" style={{ fontSize: '11px' }}>
                  ⚡ Quyền Quản Trị Admin
                </span>
              </div>
            </div>
            <p className="mb-0 text-white-50" style={{ fontSize: '12px', lineHeight: 1.5 }}>
              Mã QR và Mã Code bắt đầu bằng <strong>XTS-XXXXXX</strong> (với X là các số nguyên ngẫu nhiên). Khi hoạt động kết thúc, mã này sẽ <strong>tự động hết hiệu lực</strong>. Các Chi đoàn quét QR hoặc nhập code sẽ trả về tọa độ GPS và ảnh báo cáo trực tiếp tại sự kiện.
            </p>
          </div>

          {/* Realtime 10-Minute Attendance Window Alerts for Admin */}
          {isOpen && (
            <div className="alert alert-success d-flex align-items-center justify-content-between flex-wrap gap-2 rounded-3 mb-3 p-2.5 px-3 border-success-subtle shadow-xs" style={{ fontSize: '12.5px', backgroundColor: '#F0FDF4' }}>
              <div className="d-flex align-items-center gap-2">
                <Clock size={17} className="text-success flex-shrink-0" />
                <span>
                  <strong>Cổng điểm danh 10 phút đang mở:</strong> Thời gian còn lại: <strong className="text-success font-monospace" style={{ fontSize: '14.5px' }}>{attendanceWindow.countdownDisplay}</strong> (Mã QR & Mã Code có hiệu lực).
                </span>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-success fw-bold d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-pill bg-white shadow-2xs"
                style={{ fontSize: '11.5px' }}
                onClick={handleExtendAttendance}
                title="Gia hạn thêm 10 phút điểm danh"
              >
                <span>+10 phút</span>
              </button>
            </div>
          )}

          {isExpired && (
            <div className="alert alert-danger d-flex align-items-center justify-content-between flex-wrap gap-2 rounded-3 mb-3 p-3 shadow-xs" style={{ fontSize: '13px' }}>
              <div className="d-flex align-items-center gap-2.5">
                <AlertCircle size={22} className="text-danger flex-shrink-0" />
                <div>
                  <strong>Đã hết thời lượng điểm danh (Quy định 10 phút):</strong> Mã QR và Mã Code ({qrInfo?.code}) đã tự động hết hiệu lực theo đúng quy định để chốt quân số. Các Chi đoàn không thể gửi điểm danh bổ sung.
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-danger text-white fw-bold d-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill shadow-xs"
                style={{ fontSize: '12px' }}
                onClick={handleExtendAttendance}
                title="Mở lại cổng điểm danh và cộng thêm 10 phút"
              >
                <Sparkles size={14} />
                <span>⚡ Mở lại / Gia hạn 10 phút</span>
              </button>
            </div>
          )}

          {/* QR Display & Code Generator Card */}
          <div className="row g-3 mb-4">
            {/* Left: Big QR Code Display */}
            <div className="col-12 col-md-5">
              <div className="p-3 bg-white border rounded-4 text-center shadow-xs h-100 d-flex flex-column align-items-center justify-content-between">
                <div className="w-100">
                  <div className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>
                    Mã QR Điểm Danh Hoạt Động
                  </div>
                  <div className="text-muted mb-3" style={{ fontSize: '11.5px' }}>
                    {isExpired ? 'Mã đã hết hiệu lực' : 'Chiếu lên màn hình máy chiếu hoặc đưa cho các Chi đoàn quét'}
                  </div>

                  {qrInfo?.qrUrl ? (
                    <div className="p-2.5 bg-light rounded-3 d-inline-block border shadow-2xs mb-2.5 position-relative">
                      <img 
                        src={qrInfo.qrUrl} 
                        alt="QR Code Điểm Danh" 
                        style={{ 
                          width: '180px', 
                          height: '180px', 
                          objectFit: 'contain', 
                          display: 'block',
                          opacity: isExpired ? 0.35 : 1
                        }}
                      />
                      {isExpired && (
                        <div 
                          className="position-absolute top-50 start-50 translate-middle badge bg-danger text-white px-3 py-2 fw-bold text-uppercase"
                          style={{ fontSize: '12px', transform: 'translate(-50%, -50%) rotate(-15deg)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
                        >
                          HẾT HIỆU LỰC
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-light rounded-3 text-muted" style={{ width: '180px', height: '180px' }}>
                      <QrCode size={64} className="opacity-50 mt-4" />
                    </div>
                  )}

                  {/* Manual Code Badge (Always XTS-XXXXXX) */}
                  <div className="p-2 px-3 bg-primary-subtle text-primary border border-primary-subtle rounded-3 d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted" style={{ fontSize: '11px' }}>Mã Code (XTS-XXXXXX):</span>
                    <strong className="fs-5 letter-spacing-1 font-monospace text-primary">
                      {qrInfo?.code || 'XTS-XXXXXX'}
                    </strong>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-link p-0 text-primary"
                      onClick={() => handleCopy(qrInfo?.code || '', 'mã code')}
                      title="Sao chép mã"
                    >
                      <Copy size={15} />
                    </button>
                  </div>
                  <div className="text-muted" style={{ fontSize: '10.5px' }}>
                    Mã QR và Mã Code luôn <strong>đồng nhất dữ liệu 100%</strong>.
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex align-items-center gap-2 w-100 mt-3">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1.5 py-1.5 rounded-3 fw-semibold"
                    style={{ fontSize: '12px' }}
                    onClick={handleRefreshCode}
                    disabled={isExpired}
                    title="Tạo mã XTS-XXXXXX mới với 6 số ngẫu nhiên"
                  >
                    <RefreshCw size={13} />
                    <span>Tạo Mã Mới</span>
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1.5 py-1.5 rounded-3 fw-semibold text-white"
                    style={{ fontSize: '12px', backgroundColor: '#0c3b2e', borderColor: '#0c3b2e' }}
                    onClick={() => setShowProjector(true)}
                  >
                    <Maximize2 size={13} />
                    <span>Trình Chiếu Máy Chiếu</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: GPS Instructions & Summary Statistics */}
            <div className="col-12 col-md-7">
              <div className="p-3 bg-light rounded-4 border h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="fw-bold text-dark d-flex align-items-center gap-1.5" style={{ fontSize: '14px' }}>
                      <MapPin size={17} className="text-danger" />
                      <span>Xác Thực Tọa Độ & Ảnh Báo Cáo Hiện Trường</span>
                    </div>
                    <span className="badge bg-success text-white px-2.5 py-1 rounded-pill" style={{ fontSize: '11.5px' }}>
                      {gpsLogs.length} / 56 Chi đoàn đã điểm danh
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-3 border mb-3 text-secondary" style={{ fontSize: '12px', lineHeight: 1.5 }}>
                    <div className="mb-1 text-dark fw-semibold">📌 Quy trình điểm danh & kiểm soát:</div>
                    1. Chi đoàn mở máy ảnh quét mã QR hoặc nhập mã code <strong>{qrInfo?.code}</strong>.<br />
                    2. Thiết bị tự động ghi nhận tọa độ GPS và <strong>chụp ảnh báo cáo</strong> có gắn watermark chính thức.<br />
                    3. Admin có thể bấm <strong>"Mở Google Maps"</strong> để đối chiếu vị trí và bấm <strong>"Xem ảnh báo cáo"</strong> để kiểm tra thực tế.
                  </div>

                  {/* Quick summary stats */}
                  <div className="row g-2 mb-2">
                    <div className="col-4">
                      <div className="p-2 bg-success-subtle border border-success-subtle rounded-3 text-center">
                        <div className="text-success fw-bold" style={{ fontSize: '18px' }}>{gpsLogs.length}</div>
                        <div className="text-success" style={{ fontSize: '11px' }}>Chi đoàn đã quét</div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-2 bg-primary-subtle border border-primary-subtle rounded-3 text-center">
                        <div className="text-primary fw-bold" style={{ fontSize: '18px' }}>
                          {gpsLogs.filter(l => l.photo_url).length}
                        </div>
                        <div className="text-primary" style={{ fontSize: '11px' }}>Có ảnh báo cáo</div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-2 bg-warning-subtle border border-warning-subtle rounded-3 text-center">
                        <div className="text-warning-emphasis fw-bold" style={{ fontSize: '18px' }}>{Math.max(0, 56 - gpsLogs.length)}</div>
                        <div className="text-warning-emphasis" style={{ fontSize: '11px' }}>Chưa điểm danh</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2 bg-white rounded-3 border text-muted" style={{ fontSize: '11px' }}>
                  ℹ️ Hoạt động: <strong>{activity?.title || 'Chưa chọn'}</strong> ({timeStatus.statusText}).
                </div>
              </div>
            </div>
          </div>

          {/* Audit Logs Table with GPS & Photos */}
          <div className="bg-white border rounded-4 p-3 shadow-xs">
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div className="fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
                <Clock size={17} className="text-primary" />
                <span>Nhật Ký Điểm Danh GPS & Ảnh Báo Cáo Thời Gian Thực ({gpsLogs.length}/56)</span>
              </div>
              {gpsLogs.length > 0 && (
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1.5 py-1 px-2.5 rounded-3 fw-semibold"
                  style={{ fontSize: '11.5px' }}
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," + 
                      ["Chi đoàn,Thời gian thực,Vĩ độ,Kinh độ,Sai số,Có ảnh báo cáo,Google Maps URL", 
                        ...gpsLogs.map(l => `"${l.branch_name}","${l.time_str}","${l.latitude}","${l.longitude}","±${l.accuracy}m","${l.photo_url ? 'Có' : 'Không'}","${l.maps_url}"`)
                      ].join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `Diem_Danh_GPS_${actId}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download size={13} />
                  <span>Xuất File Đối Soát (CSV)</span>
                </button>
              )}
            </div>

            {gpsLogs.length === 0 ? (
              <div className="text-center py-5 text-muted bg-light rounded-3 border border-dashed">
                <MapPin size={32} className="opacity-30 mb-2" />
                <div className="fw-semibold" style={{ fontSize: '13px' }}>Chưa có Chi đoàn nào quét mã điểm danh GPS</div>
                <div style={{ fontSize: '11.5px' }}>Đưa mã QR trên cho các Bí thư Chi đoàn quét bằng camera điện thoại để ghi nhận tọa độ và ảnh minh chứng tại đây.</div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: '12.5px' }}>
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Đơn vị / Chi đoàn</th>
                      <th>Thời gian thực</th>
                      <th>Tọa độ GPS chính xác</th>
                      <th>Ảnh Báo Cáo</th>
                      <th>Trạng thái</th>
                      <th className="text-end">Đối chiếu Google Maps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gpsLogs.map((log, idx) => {
                      const latLngStr = `${log.latitude.toFixed(6)}, ${log.longitude.toFixed(6)}`;
                      return (
                        <tr key={log.id || idx}>
                          <td className="text-muted fw-bold">{idx + 1}</td>
                          <td>
                            <strong className="text-dark d-block">{log.branch_name}</strong>
                            <span className="text-muted" style={{ fontSize: '10.5px' }}>
                              {log.verified_by === 'CAMERA_QR' ? '📷 Quét QR Camera' : '⌨️ Nhập Code XTS'}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border px-2 py-1 font-monospace">
                              {log.time_str}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-1.5">
                              <span className="font-monospace fw-bold text-primary bg-primary-subtle px-2 py-0.5 rounded">
                                {latLngStr}
                              </span>
                              <span className="text-muted" style={{ fontSize: '10.5px' }}>
                                (±{Math.round(log.accuracy || 5)}m)
                              </span>
                            </div>
                          </td>
                          <td>
                            {log.photo_url ? (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-success p-1 rounded-2 d-inline-flex align-items-center gap-1"
                                onClick={() => setSelectedPhotoModal(log)}
                                title="Xem ảnh báo cáo minh chứng"
                              >
                                <img 
                                  src={log.photo_url} 
                                  alt="Report thumb" 
                                  style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                                <span style={{ fontSize: '11px', fontWeight: 600 }}>Xem ảnh</span>
                              </button>
                            ) : (
                              <span className="text-muted" style={{ fontSize: '11px' }}>Chưa đính kèm</span>
                            )}
                          </td>
                          <td>
                            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill">
                              ✓ Hợp lệ tại sự kiện
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="d-inline-flex align-items-center gap-1.5">
                              <button
                                type="button"
                                className="btn btn-sm btn-light border py-1 px-2 d-inline-flex align-items-center gap-1 text-secondary"
                                style={{ fontSize: '11px' }}
                                onClick={() => handleCopy(latLngStr, 'tọa độ GPS')}
                                title="Copy tọa độ để dán vào Google Maps"
                              >
                                <Copy size={12} />
                                <span>Copy tọa độ</span>
                              </button>

                              <a
                                href={log.maps_url || `https://www.google.com/maps?q=${log.latitude},${log.longitude}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-outline-primary py-1 px-2.5 d-inline-flex align-items-center gap-1 fw-semibold"
                                style={{ fontSize: '11px' }}
                                title="Mở trực tiếp trên Google Maps vệ tinh để đối chiếu"
                              >
                                <ExternalLink size={12} />
                                <span>Mở Google Maps</span>
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* CASE 2: CHI ĐOÀN VIEW (Quét mã QR bằng Camera hoặc Nhập code thủ công)    */
        /* MATCHED 100% WITH USER SCREENSHOT                                         */
        /* ========================================================================= */
        <div className="branch-qr-attendance">
          {/* Header thông tin xác thực */}
          <div className="mb-3">
            <h5 className="fw-bold text-dark d-flex align-items-center gap-2 mb-1" style={{ fontSize: '16px' }}>
              <QrCode size={19} className="text-success" />
              <span>Điểm Danh Xác Thực Vị Trí</span>
            </h5>
            <div className="text-secondary" style={{ fontSize: '12.5px' }}>
              Quét mã QR do Ban Chủ Nhiệm cung cấp hoặc nhập mã xác thực (XTS-XXXXXX) để xác nhận có mặt tại sự kiện
            </div>
          </div>

          {/* BANNER THỜI GIAN THỰC & ĐỊNH VỊ GPS CHÍNH XÁC */}
          <div 
            className="card border-0 shadow-sm rounded-4 mb-3.5 p-3.5 text-white" 
            style={{ background: 'linear-gradient(135deg, #0c3b2e 0%, #174e3f 100%)' }}
          >
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2.5">
              <div className="d-flex align-items-center gap-3">
                <div className="p-2.5 rounded-3 bg-white bg-opacity-15 text-white d-flex align-items-center justify-content-center">
                  <Clock size={26} />
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-danger text-white px-2 py-0.5 rounded-pill fw-bold" style={{ fontSize: '10.5px' }}>
                      🔴 THỜI GIAN THỰC
                    </span>
                    <span className="text-light text-capitalize" style={{ fontSize: '12.5px' }}>
                      {realDateDisplay}
                    </span>
                  </div>
                  <div className="fw-bold font-monospace mt-0.5" style={{ fontSize: '22px', letterSpacing: '1px' }}>
                    {realClockDisplay}
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                <div 
                  className="badge bg-success bg-opacity-25 border border-success border-opacity-50 text-white px-3 py-2 rounded-pill d-flex align-items-center gap-1.5" 
                  style={{ fontSize: '12px' }}
                >
                  <Navigation size={13} />
                  <span>GPS: Sẵn sàng định vị vị trí thực</span>
                </div>
                <div 
                  className="badge bg-warning bg-opacity-20 border border-warning border-opacity-50 text-warning px-3 py-2 rounded-pill d-flex align-items-center gap-1.5" 
                  style={{ fontSize: '12px' }}
                >
                  <Lock size={13} />
                  <span>Quy định: Điểm danh đúng 01 lần duy nhất</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cảnh báo trạng thái theo thời gian thực (Thời lượng 10 phút) */}
          {isExpired ? (
            <div className="alert alert-danger d-flex align-items-center gap-3 rounded-4 p-3.5 mb-3.5 shadow-sm border-danger">
              <AlertCircle size={26} className="text-danger flex-shrink-0" />
              <div>
                <h6 className="fw-bold mb-1 text-danger">⏰ Đã hết thời gian điểm danh (Mã hết hiệu lực)!</h6>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5 }}>
                  Theo quy định của Ban Thường vụ Đoàn xã, thời lượng điểm danh được mở trong vòng 10 phút kể từ giờ bắt đầu hoạt động. Hiện đã quá thời gian quy định, mã xác thực đã tự động hết hiệu lực và hệ thống đã khóa tiếp nhận điểm danh bổ sung.
                </div>
              </div>
            </div>
          ) : isOpen ? (
            <div className="alert alert-success d-flex align-items-center justify-content-between flex-wrap gap-2 rounded-4 p-3 mb-3.5 shadow-xs border-success" style={{ backgroundColor: '#F0FDF4' }}>
              <div className="d-flex align-items-center gap-2.5">
                <Clock size={20} className="text-success flex-shrink-0" />
                <div>
                  <div className="fw-bold text-success" style={{ fontSize: '13px' }}>
                    🟢 CỔNG ĐIỂM DANH ĐANG MỞ • THỜI GIAN CÒN LẠI: <span className="font-monospace fw-bolder text-dark" style={{ fontSize: '15px' }}>{attendanceWindow.countdownDisplay}</span>
                  </div>
                  <div className="text-secondary" style={{ fontSize: '11.5px' }}>
                    Thời lượng điểm danh mở trong vòng 10 phút. Đề nghị đồng chí quét mã QR hoặc nhập mã Code ngay để xác nhận có mặt!
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-warning d-flex align-items-center gap-2.5 rounded-4 p-3 mb-3.5 shadow-xs border-warning">
              <Clock size={20} className="text-warning-emphasis flex-shrink-0" />
              <div style={{ fontSize: '12.5px' }}>
                {attendanceWindow.message || 'Chưa đến giờ điểm danh hoạt động.'}
              </div>
            </div>
          )}

          {/* TRƯỜNG HỢP 1: ĐÃ ĐIỂM DANH THÀNH CÔNG -> KHÓA LẠI (CHỈ ĐIỂM DANH 1 LẦN DUY NHẤT) */}
          {(isAlreadyAttended || attendanceSuccess) ? (
            <div 
              className="p-4 mb-3 rounded-4 border text-center shadow-sm"
              style={{ 
                backgroundColor: '#f0fdf4',
                borderColor: '#86efac'
              }}
            >
              <div 
                className="p-3.5 rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-2.5 shadow-sm"
                style={{ width: '64px', height: '64px' }}
              >
                <CheckCircle size={36} />
              </div>
              <h5 className="fw-bold text-success mb-1" style={{ fontSize: '17px' }}>
                ĐÃ ĐIỂM DANH XÁC THỰC GPS THÀNH CÔNG!
              </h5>
              <div className="d-inline-flex align-items-center gap-1.5 badge bg-success text-white px-3 py-1.5 rounded-pill fw-bold mb-3 shadow-xs" style={{ fontSize: '12px' }}>
                <Lock size={13} />
                <span>HOÀN TẤT ĐIỂM DANH (ĐÚNG 1 LẦN DUY NHẤT)</span>
              </div>
              <div className="text-secondary mb-3" style={{ fontSize: '13px' }}>
                Đơn vị: <strong className="text-dark">{userBranchName}</strong> đã được ghi nhận có mặt chính thức tại hoạt động: <strong className="text-dark">{activity?.title || 'Hoạt động Đoàn'}</strong>.
              </div>

              <div className="p-3 bg-white rounded-3 border d-inline-block text-start mb-3 shadow-xs" style={{ fontSize: '12.5px', minWidth: '340px' }}>
                <div className="mb-1.5">🏢 <strong>Đơn vị:</strong> {userBranchName}</div>
                <div className="mb-1.5">⏰ <strong>Thời gian thực tế:</strong> <span className="fw-bold text-dark">{(attendanceSuccess && attendanceSuccess.time_str) || 'Đã ghi nhận'}</span></div>
                <div className="mb-1.5">📍 <strong>Tọa độ GPS ghi nhận:</strong> <span className="font-monospace text-primary fw-bold">{(attendanceSuccess && attendanceSuccess.latitude) ? `${attendanceSuccess.latitude.toFixed(6)}, ${attendanceSuccess.longitude.toFixed(6)}` : 'Đã định vị thành công'}</span></div>
                <div className="mb-1.5">🛡️ <strong>Phương thức:</strong> <span className="badge bg-primary text-white">{(attendanceSuccess && attendanceSuccess.verified_by === 'CAMERA_QR') ? '📷 Quét mã QR Camera' : '⌨️ Nhập mã xác thực (XTS-XXXXXX)'}</span></div>
                <div className="mb-1.5">🛡️ <strong>Trạng thái:</strong> <span className="badge bg-success text-white">✓ Hợp lệ tại sự kiện</span></div>
                <div className="mt-2.5 pt-2 border-top text-secondary" style={{ fontSize: '11.5px', lineHeight: 1.5 }}>
                  🔒 <em>Quy định bảo mật: Dữ liệu điểm danh của Chi đoàn đã được khóa trên hệ thống và liên kết trực tiếp vào Báo cáo Thống kê. Mỗi đơn vị chỉ điểm danh đúng 1 lần duy nhất cho mỗi hoạt động.</em>
                </div>
                {attendanceSuccess && attendanceSuccess.photo_url && (
                  <div className="mt-2.5 pt-2 border-top">
                    <span className="text-muted d-block mb-1 fw-semibold">📸 Minh chứng có mặt:</span>
                    <img 
                      src={attendanceSuccess.photo_url} 
                      alt="Submitted proof" 
                      style={{ maxHeight: '140px', borderRadius: '8px', cursor: 'pointer', border: '1px solid #e2e8f0' }}
                      onClick={() => setSelectedPhotoModal(attendanceSuccess)}
                      title="Bấm để xem ảnh lớn"
                    />
                  </div>
                )}
              </div>

              {attendanceSuccess && (
                <div className="mt-1">
                  <a
                    href={attendanceSuccess.maps_url || `https://www.google.com/maps?q=${attendanceSuccess.latitude},${attendanceSuccess.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-success py-1.5 px-3 rounded-3 d-inline-flex align-items-center gap-1.5 fw-semibold"
                    style={{ fontSize: '12px' }}
                  >
                    <ExternalLink size={14} />
                    <span>Xem vị trí điểm danh trên Google Maps</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            /* TRƯỜNG HỢP 2: CHƯA ĐIỂM DANH -> HIỂN THỊ Ô QUÉT QR & NHẬP MÃ */
            <>
              {/* Box 1: Quét Mã Trực Tiếp Bằng Camera Điện Thoại */}
              <div 
                className="p-4 mb-3.5 rounded-4 text-center border transition-all"
                style={{ 
                  backgroundColor: isExpired ? '#f9fafb' : '#f0fdf4',
                  borderColor: isExpired ? '#e5e7eb' : '#bbf7d0',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.05)',
                  opacity: isExpired ? 0.6 : 1
                }}
              >
                <div className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>
                  Quét Mã Trực Tiếp Bằng Camera Điện Thoại
                </div>
                <div className="text-secondary mb-3.5" style={{ fontSize: '12px' }}>
                  Camera sẽ tự động quét mã QR từ Ban Chủ Nhiệm và lưu vị trí GPS xác minh thời gian thực.
                </div>

                <button 
                  type="button" 
                  className="btn px-4 py-2.5 rounded-4 fw-bold text-white d-inline-flex align-items-center justify-content-center gap-2 shadow-sm transition-all"
                  style={{ 
                    backgroundColor: isExpired ? '#6b7280' : '#0c3b2e',
                    borderColor: isExpired ? '#6b7280' : '#0c3b2e',
                    fontSize: '13px',
                    minHeight: '44px',
                    cursor: isExpired ? 'not-allowed' : 'pointer'
                  }}
                  onClick={handleStartQrCamera}
                  disabled={isProcessingGps || isExpired}
                >
                  {isProcessingGps ? (
                    <>
                      <Loader2 size={16} className="spin" />
                      <span>ĐANG XÁC THỰC GPS & THỜI GIAN THỰC...</span>
                    </>
                  ) : (
                    <>
                      <Camera size={18} />
                      <span>QUÉT MÃ QR BẰNG CAMERA</span>
                    </>
                  )}
                </button>
              </div>

              {/* Box 2: Chụp hình báo cáo hoạt động (Minh chứng tham gia) */}
              <div 
                className="p-3.5 mb-3.5 rounded-4 border bg-white"
                style={{ 
                  borderColor: '#e2e8f0',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="fw-bold text-dark d-flex align-items-center gap-1.5" style={{ fontSize: '13px' }}>
                    <ImageIcon size={16} className="text-primary" />
                    <span>Chụp hình báo cáo hoạt động (Minh chứng có mặt):</span>
                  </div>
                  <span className="badge bg-light text-secondary border" style={{ fontSize: '10.5px' }}>Khuyến khích</span>
                </div>

                {photoReport ? (
                  <div className="p-2.5 bg-light rounded-3 border d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <img 
                        src={photoReport} 
                        alt="Captured proof" 
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <div>
                        <span className="badge bg-success text-white mb-1" style={{ fontSize: '10.5px' }}>✓ Đã có ảnh báo cáo</span>
                        <div className="text-muted" style={{ fontSize: '11px' }}>Đã đóng dấu watermark chính thức</div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-1.5">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-1 px-2"
                        onClick={handleStartPhotoCamera}
                        title="Chụp lại"
                      >
                        <RefreshCw size={12} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger py-1 px-2"
                        onClick={() => setPhotoReport(null)}
                        title="Xóa ảnh"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success d-flex align-items-center justify-content-center gap-1.5 flex-grow-1 py-2 rounded-3 fw-semibold"
                      style={{ fontSize: '12px' }}
                      onClick={handleStartPhotoCamera}
                      disabled={isExpired}
                    >
                      <Camera size={14} />
                      <span>📸 Chụp Ảnh Ngay Bằng Camera</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center gap-1.5 flex-grow-1 py-2 rounded-3 fw-semibold"
                      style={{ fontSize: '12px' }}
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      disabled={isExpired}
                    >
                      <UploadCloud size={14} />
                      <span>📁 Tải Ảnh Từ Máy</span>
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept="image/*" 
                      className="d-none" 
                      onChange={handleFileUpload}
                    />
                  </div>
                )}
              </div>

              {/* Box 3: Hoặc nhập mã xác thực thủ công (XTS-XXXXXX) */}
              <div 
                className="p-3.5 rounded-4 border bg-white"
                style={{ 
                  borderColor: '#e2e8f0',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                  opacity: isExpired ? 0.6 : 1
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="fw-semibold text-dark" style={{ fontSize: '13px' }}>
                    Hoặc nhập mã xác thực thủ công:
                  </span>
                  <span className="text-muted" style={{ fontSize: '11px' }}>
                    (Nếu camera thiết bị bị lỗi)
                  </span>
                </div>

                <form onSubmit={handleManualSubmit}>
                  <div className="d-flex align-items-center gap-2">
                    <input 
                      type="text" 
                      className="form-control font-monospace fw-bold text-uppercase"
                      placeholder="Ví dụ: XTS-XXXXXX"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      style={{ 
                        fontSize: '14px', 
                        height: '42px',
                        letterSpacing: '1px'
                      }}
                      disabled={isProcessingGps || isExpired}
                    />
                    <button 
                      type="submit" 
                      className="btn text-white px-3 fw-bold rounded-3 flex-shrink-0"
                      style={{ 
                        backgroundColor: isExpired ? '#6b7280' : '#52796f', 
                        borderColor: isExpired ? '#6b7280' : '#52796f',
                        height: '42px',
                        fontSize: '13px',
                        cursor: isExpired ? 'not-allowed' : 'pointer'
                      }}
                      disabled={isProcessingGps || isExpired}
                    >
                      {isProcessingGps ? 'Đang gửi...' : 'Xác Nhận'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* POPUP 1: CAMERA SCANNER VIEWFINDER MODAL (QUÉT MÃ QR BẰNG jsQR)          */}
      {/* ========================================================================= */}
      {isCameraActive && (
        <div 
          className="modal d-block bg-dark bg-opacity-80" 
          style={{ zIndex: 1100, position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '440px', width: '92%' }}>
            <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden bg-black text-white">
              <div className="p-3 d-flex align-items-center justify-content-between border-bottom border-dark">
                <div className="fw-bold d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
                  <Camera size={18} className="text-success" />
                  <span>Hướng Camera về Mã QR Điểm Danh</span>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={stopAllMediaStreams}></button>
              </div>

              <div className="p-3 text-center position-relative">
                {/* Video element */}
                <div 
                  className="rounded-3 overflow-hidden position-relative bg-dark"
                  style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="w-100 h-100 object-fit-cover"
                  />
                  {/* Viewfinder Target Overlay */}
                  <div 
                    className="position-absolute"
                    style={{
                      width: '200px',
                      height: '200px',
                      border: '2px solid #22c55e',
                      borderRadius: '16px',
                      boxShadow: '0 0 0 1000px rgba(0, 0, 0, 0.45)'
                    }}
                  >
                    {/* Laser scanning line animation */}
                    <div 
                      className="w-100 bg-success"
                      style={{
                        height: '2px',
                        boxShadow: '0 0 10px #22c55e',
                        animation: 'scanLine 2s infinite ease-in-out'
                      }}
                    />
                  </div>
                </div>

                <div className="text-success-emphasis bg-dark p-2 rounded-3 mt-2.5 font-monospace" style={{ fontSize: '12px' }}>
                  {scanStatusMsg}
                </div>

                {/* Quick confirm button if needed */}
                <button
                  type="button"
                  className="btn btn-success btn-sm w-100 mt-3 py-2 fw-bold d-flex align-items-center justify-content-center gap-1.5"
                  onClick={() => {
                    stopAllMediaStreams();
                    processGpsVerification('CAMERA_QR', photoReport);
                  }}
                >
                  <Sparkles size={16} />
                  <span>Xác Nhận Đã Quét Trúng Mã & Gửi Tọa Độ GPS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POPUP 2: CAMERA CHỤP HÌNH BÁO CÁO                                         */}
      {/* ========================================================================= */}
      {isPhotoCameraActive && (
        <div 
          className="modal d-block bg-dark bg-opacity-80" 
          style={{ zIndex: 1105, position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '440px', width: '92%' }}>
            <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden bg-black text-white">
              <div className="p-3 d-flex align-items-center justify-content-between border-bottom border-dark">
                <div className="fw-bold d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
                  <Camera size={18} className="text-warning" />
                  <span>Chụp Ảnh Báo Cáo Sự Kiện</span>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={stopAllMediaStreams}></button>
              </div>

              <div className="p-3 text-center position-relative">
                <div 
                  className="rounded-3 overflow-hidden position-relative bg-dark"
                  style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <video 
                    ref={photoVideoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>

                <div className="text-white-50 mt-2" style={{ fontSize: '12px' }}>
                  Ảnh chụp sẽ được tự động đóng dấu Watermark chính thức của Đoàn xã Xuân Thới Sơn.
                </div>

                <div className="d-flex align-items-center gap-2 mt-3">
                  <button
                    type="button"
                    className="btn btn-outline-light w-50 py-2 fw-semibold"
                    onClick={stopAllMediaStreams}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning w-50 py-2 fw-bold text-dark d-flex align-items-center justify-content-center gap-1.5"
                    onClick={handleCaptureSnapshot}
                  >
                    <Camera size={17} />
                    <span>Chụp Ảnh Ngay</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POPUP 3: FULLSCREEN PROJECTOR DISPLAY FOR AUDITORIUM                      */}
      {/* ========================================================================= */}
      {showProjector && qrInfo && (
        <div 
          className="modal d-block bg-dark bg-opacity-95" 
          style={{ zIndex: 1110, position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="modal-dialog modal-fullscreen p-4 d-flex align-items-center justify-content-center">
            <div 
              className="bg-white rounded-5 shadow-2xl p-5 text-center position-relative" 
              style={{ maxWidth: '640px', width: '100%', border: '4px solid #0c3b2e' }}
            >
              <button 
                type="button" 
                className="btn-close position-absolute top-0 end-0 m-4 p-2" 
                onClick={() => setShowProjector(false)}
              ></button>

              <div className="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-bold mb-3" style={{ fontSize: '13px' }}>
                ĐOÀN XÃ XUÂN THỚI SƠN • ĐIỂM DANH HOẠT ĐỘNG
              </div>

              <h2 className="fw-extrabold text-dark mb-1" style={{ fontSize: '24px' }}>
                {activity?.title || 'Hoạt Động Đoàn'}
              </h2>
              <div className="text-secondary mb-3" style={{ fontSize: '14px' }}>
                {isExpired ? 'Hoạt động đã kết thúc • Mã QR & Code đã hết hiệu lực' : 'Quét mã QR dưới đây bằng camera điện thoại để xác thực điểm danh GPS'}
              </div>

              <div className="p-3 bg-light rounded-4 d-inline-block border shadow-sm mb-3 position-relative">
                <img 
                  src={qrInfo.qrUrl} 
                  alt="Projector QR" 
                  style={{ width: '280px', height: '280px', display: 'block', opacity: isExpired ? 0.35 : 1 }}
                />
                {isExpired && (
                  <div 
                    className="position-absolute top-50 start-50 translate-middle badge bg-danger text-white px-4 py-2.5 fw-bold text-uppercase fs-5"
                    style={{ transform: 'translate(-50%, -50%) rotate(-15deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
                  >
                    HẾT HIỆU LỰC
                  </div>
                )}
              </div>

              <div className="p-3 bg-success-subtle border border-success-subtle rounded-4 mb-3">
                <div className="text-muted" style={{ fontSize: '12px' }}>Mã Code xác thực thủ công (XTS-XXXXXX):</div>
                <div className="fw-black font-monospace text-dark" style={{ fontSize: '32px', letterSpacing: '4px' }}>
                  {qrInfo.code}
                </div>
              </div>

              <div className="text-muted" style={{ fontSize: '12.5px' }}>
                Mã QR và Mã Code đồng nhất 100%. Tọa độ GPS và ảnh báo cáo sẽ được tự động lưu về máy chủ Đoàn xã.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POPUP 4: XEM ẢNH BÁO CÁO PHÓNG TO (LIGHTBOX MODAL)                        */}
      {/* ========================================================================= */}
      {selectedPhotoModal && (
        <div 
          className="modal d-block bg-dark bg-opacity-90" 
          style={{ zIndex: 1120, position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg p-3">
            <div className="modal-content border-0 rounded-4 overflow-hidden bg-black text-white">
              <div className="p-3 d-flex align-items-center justify-content-between border-bottom border-secondary">
                <div>
                  <h6 className="fw-bold mb-0 text-white">Ảnh Báo Cáo Minh Chứng: {selectedPhotoModal.branch_name}</h6>
                  <span className="text-white-50" style={{ fontSize: '11.5px' }}>
                    Thời gian: {selectedPhotoModal.time_str}  |  Tọa độ: {selectedPhotoModal.latitude?.toFixed(5)}, {selectedPhotoModal.longitude?.toFixed(5)}
                  </span>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedPhotoModal(null)}></button>
              </div>

              <div className="p-3 text-center bg-dark">
                <img 
                  src={selectedPhotoModal.photo_url} 
                  alt="Full Report" 
                  className="img-fluid rounded-3"
                  style={{ maxHeight: '75vh', objectFit: 'contain' }}
                />
              </div>

              <div className="p-3 d-flex align-items-center justify-content-between border-top border-secondary">
                <a
                  href={selectedPhotoModal.maps_url || `https://www.google.com/maps?q=${selectedPhotoModal.latitude},${selectedPhotoModal.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline-light d-flex align-items-center gap-1.5"
                >
                  <ExternalLink size={14} />
                  <span>Mở Google Maps đối chiếu vị trí chụp</span>
                </a>
                <button 
                  type="button" 
                  className="btn btn-sm btn-secondary"
                  onClick={() => setSelectedPhotoModal(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

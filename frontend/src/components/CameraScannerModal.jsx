import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, AlertCircle, Sparkles } from 'lucide-react';

export default function CameraScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [errorMsg, setErrorMsg] = useState('');
  const scannerRef = useRef(null);
  const isStartedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    const html5QrCode = new Html5Qrcode('qr-reader-container');
    scannerRef.current = html5QrCode;

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start(
      { facingMode: 'environment' },
      config,
      (decodedText) => {
        // Scanned successfully
        if (html5QrCode && isStartedRef.current) {
          html5QrCode.stop().then(() => {
            isStartedRef.current = false;
            onScanSuccess(decodedText);
          }).catch(() => {
            onScanSuccess(decodedText);
          });
        }
      },
      (errorMessage) => {
        // Scan parse frame error (silent)
      }
    ).then(() => {
      isStartedRef.current = true;
    }).catch((err) => {
      console.error('Camera start error:', err);
      setErrorMsg('Could not access camera. Please allow camera permissions or use your phone camera / Google Lens.');
    });

    return () => {
      if (scannerRef.current && isStartedRef.current) {
        scannerRef.current.stop().catch(() => {});
        isStartedRef.current = false;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative max-w-md w-full bg-[#1c120c] rounded-3xl border-2 border-[#d4af37] shadow-2xl overflow-hidden text-white p-6 space-y-4">
        
        <div className="flex items-center justify-between border-b border-[#382015] pb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#e5c158]" />
            <h3 className="font-cinzel text-lg font-bold text-white">QR Code Scanner Desk</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#f4ece1]/80 text-center">
          Point camera at participant's digital ticket or printed pass QR code to check them in.
        </p>

        {errorMsg ? (
          <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border-2 border-[#e5c158] bg-black p-1 shadow-inner">
            <div id="qr-reader-container" className="w-full h-64 bg-black rounded-xl overflow-hidden"></div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#2a1a12] hover:bg-[#382015] text-[#f4ece1] font-bold text-xs border border-[#d4af37]/30 transition-colors"
        >
          Cancel &amp; Close Scanner
        </button>

      </div>
    </div>
  );
}

"use client";
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef } from 'react';

export default function Scanner({ onResult }: { onResult: (data: string) => void }) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner("reader", { 
	  fps: 60,
	  qrbox: { width: 400, height: 200 },
	  aspectRatio: 1.777778,
	  videoConstraints: {
	    focusMode: "continuous", // Modern mobile browsers try to keep it sharp
	    width: { min: 640, ideal: 1280 }, // Higher res helps see thin barcode lines
	    height: { min: 480, ideal: 720 }
	  }
	}, false);

      scannerRef.current.render((text) => onResult(text), () => {});
    }
    return () => {
      // scannerRef.current?.clear().catch(console.error);
      // scannerRef.current = null;
    };
  }, [onResult]);

  return <div id="reader" className="overflow-hidden rounded-lg shadow-lg"></div>;
}
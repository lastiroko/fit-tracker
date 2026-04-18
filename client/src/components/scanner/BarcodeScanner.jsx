import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { scanBarcode } from '../../api';

export default function BarcodeScanner({ onResult, onLoading }) {
  const scannerRef = useRef(null);
  const scanningRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const scannerId = 'barcode-reader';

    const scanner = new Html5Qrcode(scannerId, { verbose: false });
    scannerRef.current = scanner;

    async function startScanning() {
      try {
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 100 },
          },
          async (decodedText) => {
            if (scanningRef.current || !mountedRef.current) return;
            scanningRef.current = true;

            onLoading(true);
            try {
              await scanner.stop();
              const result = await scanBarcode(decodedText);
              if (mountedRef.current) {
                onResult(result);
              }
            } catch (err) {
              console.error('Barcode lookup failed:', err);
              if (mountedRef.current) {
                scanningRef.current = false;
                onLoading(false);
                // Restart scanning after failed lookup
                startScanning();
              }
            }
          },
          () => {} // ignore scan errors
        );
      } catch (err) {
        console.error('Failed to start barcode scanner:', err);
      }
    }

    startScanning();

    return () => {
      mountedRef.current = false;
      scanner.stop().catch(() => {});
    };
  }, [onResult, onLoading]);

  return <div id="barcode-reader" className="barcode-reader" />;
}

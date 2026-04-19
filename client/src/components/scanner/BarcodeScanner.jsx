import { useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { scanBarcode } from '../../api';

const PRODUCT_FORMATS = [
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
];

async function safeStop(scanner) {
  if (!scanner) return;
  try {
    if (scanner.isScanning) {
      await scanner.stop();
    }
  } catch {
    // Library throws "Cannot stop, scanner is not running or paused" when
    // stop() races with a pending callback. Swallow — we only care that it's stopped.
  }
}

export default function BarcodeScanner({ onResult, onLoading }) {
  const scannerRef = useRef(null);
  const scanningRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const scannerId = 'barcode-reader';

    const scanner = new Html5Qrcode(scannerId, {
      verbose: false,
      formatsToSupport: PRODUCT_FORMATS,
    });
    scannerRef.current = scanner;

    async function startScanning() {
      try {
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 15,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
              return {
                width: Math.floor(minEdge * 0.9),
                height: Math.floor(minEdge * 0.45),
              };
            },
            aspectRatio: 4 / 3,
          },
          async (decodedText) => {
            if (scanningRef.current || !mountedRef.current) return;
            scanningRef.current = true;

            onLoading(true);
            await safeStop(scanner);
            try {
              const result = await scanBarcode(decodedText);
              if (mountedRef.current) {
                onResult(result);
              }
            } catch (err) {
              console.error('Barcode lookup failed:', err);
              if (mountedRef.current) {
                scanningRef.current = false;
                onLoading(false);
                startScanning();
              }
            }
          },
          () => {},
        );
      } catch (err) {
        console.error('Failed to start barcode scanner:', err);
      }
    }

    startScanning();

    return () => {
      mountedRef.current = false;
      safeStop(scanner);
    };
  }, [onResult, onLoading]);

  return <div id="barcode-reader" className="barcode-reader" />;
}

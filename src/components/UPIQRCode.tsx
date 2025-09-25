import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface UPIQRCodeProps {
  upiData: string;
  size?: number;
  className?: string;
}

const UPIQRCode: React.FC<UPIQRCodeProps> = ({ 
  upiData, 
  size = 200, 
  className = '' 
}) => {
  const [qrCodeURL, setQrCodeURL] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const qrCodeDataURL = await QRCode.toDataURL(upiData, {
          width: size,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });
        
        setQrCodeURL(qrCodeDataURL);
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code');
      } finally {
        setIsLoading(false);
      }
    };

    if (upiData) {
      generateQRCode();
    }
  }, [upiData, size]);

  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-red-100 text-red-600 rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-sm text-center">{error}</span>
      </div>
    );
  }

  return (
    <div className={`inline-block ${className}`}>
      <img 
        src={qrCodeURL} 
        alt="UPI QR Code" 
        className="rounded-lg border border-gray-200 shadow-sm"
        width={size}
        height={size}
      />
    </div>
  );
};

export default UPIQRCode;

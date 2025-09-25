import React, { useState } from 'react';
import { UPIService } from '../utils/upiIntegration';
import type { UPIPaymentData } from '../utils/upiIntegration';
import UPIQRCode from './UPIQRCode';

interface UPIPaymentProps {
  onPaymentComplete: (success: boolean, transactionId?: string) => void;
  defaultAmount?: number;
  merchantVPA?: string;
  merchantName?: string;
}

const UPIPayment: React.FC<UPIPaymentProps> = ({
  onPaymentComplete,
  defaultAmount = 0,
  merchantVPA = 'moneytree@paytm', // Replace with your actual UPI ID
  merchantName = 'Money Tree App'
}) => {
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [description, setDescription] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showQR, setShowQR] = useState<boolean>(false);

  const handleUPIPayment = () => {
    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);

    const paymentData: UPIPaymentData = {
      payeeVPA: merchantVPA,
      payeeName: merchantName,
      amount: amount,
      transactionNote: description || `Payment to ${merchantName}`,
      transactionRef: `MT${Date.now()}`, // Generate unique transaction reference
    };

    try {
      UPIService.initiateUPIPayment(paymentData);
      
      // Simulate payment completion (in real app, you'd handle the callback)
      setTimeout(() => {
        setIsProcessing(false);
        // In a real implementation, you'd verify the payment status
        onPaymentComplete(true, paymentData.transactionRef);
      }, 3000);
      
    } catch (error) {
      console.error('UPI Payment Error:', error);
      setIsProcessing(false);
      onPaymentComplete(false);
    }
  };

  const generateQRCode = () => {
    const paymentData: UPIPaymentData = {
      payeeVPA: merchantVPA,
      payeeName: merchantName,
      amount: amount,
      transactionNote: description || `Payment to ${merchantName}`,
      transactionRef: `MT${Date.now()}`,
    };

    const qrData = UPIService.generateUPIQRData(paymentData);
    setShowQR(true);
    
    // You can use a QR code library like qrcode.js to generate actual QR code
    console.log('QR Code Data:', qrData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg">
          <h2 className="text-xl font-bold">💳 UPI Payment</h2>
        </div>
      </div>

      <div className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount"
            min="1"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Payment description"
          />
        </div>

        {/* Merchant Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Pay to:</strong> {merchantName}
          </p>
          <p className="text-sm text-gray-600">
            <strong>UPI ID:</strong> {merchantVPA}
          </p>
        </div>

        {/* Payment Buttons */}
        <div className="space-y-3">
          {/* Direct UPI Payment */}
          <button
            onClick={handleUPIPayment}
            disabled={isProcessing || amount <= 0}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              '🚀 Pay with UPI Apps'
            )}
          </button>

          {/* QR Code Payment */}
          <button
            onClick={generateQRCode}
            disabled={amount <= 0}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            📱 Generate QR Code
          </button>
        </div>

        {/* Popular UPI Apps */}
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-3 text-center">Supported UPI Apps</p>
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">G</span>
              </div>
              <p className="text-xs mt-1">Google Pay</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">P</span>
              </div>
              <p className="text-xs mt-1">PhonePe</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">P</span>
              </div>
              <p className="text-xs mt-1">Paytm</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">B</span>
              </div>
              <p className="text-xs mt-1">BHIM</p>
            </div>
          </div>
        </div>

        {/* QR Code Display */}
        {showQR && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-2">Scan QR Code to Pay</p>
            <div className="bg-white p-4 rounded-lg inline-block">
              <UPIQRCode 
                upiData={UPIService.generateUPIQRData({
                  payeeVPA: merchantVPA,
                  payeeName: merchantName,
                  amount: amount,
                  transactionNote: description || `Payment to ${merchantName}`,
                  transactionRef: `MT${Date.now()}`,
                })}
                size={192}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Use any UPI app to scan and pay ₹{amount}
            </p>
            <button
              onClick={() => setShowQR(false)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Hide QR Code
            </button>
          </div>
        )}

        {/* Security Note */}
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-700">
            🔒 Secure payment powered by UPI. Your payment data is encrypted and secure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UPIPayment;

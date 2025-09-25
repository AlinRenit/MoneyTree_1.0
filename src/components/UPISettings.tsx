import React, { useState } from 'react';
import UPIPayment from './UPIPayment';

interface UPISettingsProps {
  onClose: () => void;
  onAddTransaction: (transaction: { amount: number; category: 'income' | 'expense' | 'saving'; description: string }) => void;
}

const UPISettings: React.FC<UPISettingsProps> = ({ onClose, onAddTransaction }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [merchantSettings, setMerchantSettings] = useState({
    vpa: 'moneytree@paytm',
    name: 'Money Tree App',
    merchantCode: 'MT001'
  });

  const handlePaymentComplete = (success: boolean, transactionId?: string) => {
    if (success) {
      // Add the transaction to the app
      onAddTransaction({
        amount: 1000, // This would be the actual payment amount
        category: 'income',
        description: `UPI Test Payment - ${transactionId}`
      });
      
      // Show success state instead of alert
      setTimeout(() => {
        setShowPayment(false);
      }, 2000);
    } else {
      // Show error state instead of alert
      setTimeout(() => {
        setShowPayment(false);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">💳 UPI Integration Settings</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {showPayment ? (
            <div>
              <UPIPayment
                onPaymentComplete={handlePaymentComplete}
                defaultAmount={1000}
                merchantVPA={merchantSettings.vpa}
                merchantName={merchantSettings.name}
              />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowPayment(false)}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  ← Back to Settings
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Merchant Settings */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">🏪 Merchant Configuration</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      UPI VPA (Virtual Payment Address)
                    </label>
                    <input
                      type="text"
                      value={merchantSettings.vpa}
                      onChange={(e) => setMerchantSettings({...merchantSettings, vpa: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="merchant@upi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Merchant Name
                    </label>
                    <input
                      type="text"
                      value={merchantSettings.name}
                      onChange={(e) => setMerchantSettings({...merchantSettings, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Merchant Code
                    </label>
                    <input
                      type="text"
                      value={merchantSettings.merchantCode}
                      onChange={(e) => setMerchantSettings({...merchantSettings, merchantCode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* UPI Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Supported Features</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Deep Link Payments</li>
                    <li>• QR Code Generation</li>
                    <li>• Multiple UPI Apps Support</li>
                    <li>• Transaction Validation</li>
                    <li>• Real-time Payment Status</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">🔧 Integration Options</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• UPI Deep Links</li>
                    <li>• QR Code Scanning</li>
                    <li>• Payment Gateway APIs</li>
                    <li>• Webhook Callbacks</li>
                    <li>• Bank Account Integration</li>
                  </ul>
                </div>
              </div>

              {/* Test Payment */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-3 text-center">🧪 Test UPI Payment</h3>
                <p className="text-gray-600 text-sm mb-4 text-center">
                  Test the UPI integration with a sample payment
                </p>
                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200"
                >
                  🚀 Test UPI Payment Flow
                </button>
              </div>

              {/* Integration Guide */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">📋 Integration Steps</h4>
                <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                  <li>Configure your UPI VPA and merchant details</li>
                  <li>Test payments using the test payment button</li>
                  <li>Implement webhook endpoints for payment confirmation</li>
                  <li>Add payment validation and error handling</li>
                  <li>Go live with real UPI payments</li>
                </ol>
              </div>

              {/* Security Note */}
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">🔐 Security Guidelines</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Never store sensitive payment data locally</li>
                  <li>• Always validate payments on the server</li>
                  <li>• Use HTTPS for all payment-related communications</li>
                  <li>• Implement proper error handling and logging</li>
                  <li>• Follow PCI DSS compliance guidelines</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UPISettings;

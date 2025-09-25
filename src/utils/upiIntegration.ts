// UPI Integration Utility
export interface UPIPaymentData {
  payeeVPA: string; // Virtual Payment Address (e.g., merchant@paytm)
  payeeName: string;
  amount: number;
  transactionNote: string;
  transactionRef?: string;
  merchantCode?: string;
}

export class UPIService {
  /**
   * Generate UPI deep link for payment
   */
  static generateUPILink(data: UPIPaymentData): string {
    const params = new URLSearchParams({
      pa: data.payeeVPA, // Payee VPA
      pn: data.payeeName, // Payee Name
      am: data.amount.toString(), // Amount
      tn: data.transactionNote, // Transaction Note
      cu: 'INR', // Currency
    });

    if (data.transactionRef) {
      params.append('tr', data.transactionRef); // Transaction Reference
    }
    if (data.merchantCode) {
      params.append('mc', data.merchantCode); // Merchant Code
    }

    return `upi://pay?${params.toString()}`;
  }

  /**
   * Open UPI app for payment
   */
  static initiateUPIPayment(data: UPIPaymentData): void {
    const upiLink = this.generateUPILink(data);
    
    if (typeof window !== 'undefined') {
      // For web - open UPI link
      window.location.href = upiLink;
    }
  }

  /**
   * Generate QR code data for UPI payment
   */
  static generateUPIQRData(data: UPIPaymentData): string {
    return this.generateUPILink(data);
  }

  /**
   * Validate UPI ID format
   */
  static validateUPIId(upiId: string): boolean {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(upiId);
  }

  /**
   * Parse UPI response (when user returns from UPI app)
   */
  static parseUPIResponse(url: string): {
    status: 'SUCCESS' | 'FAILURE' | 'PENDING';
    txnId?: string;
    responseCode?: string;
  } {
    try {
      const urlParams = new URL(url).searchParams;
      const status = urlParams.get('Status') || 'FAILURE';
      const txnId = urlParams.get('txnId');
      const responseCode = urlParams.get('responseCode');

      return {
        status: status as 'SUCCESS' | 'FAILURE' | 'PENDING',
        txnId: txnId || undefined,
        responseCode: responseCode || undefined,
      };
    } catch (error) {
      return { status: 'FAILURE' };
    }
  }
}

// Common UPI Apps with their package names for deep linking
export const UPI_APPS = {
  GOOGLE_PAY: 'tez://upi/pay',
  PHONEPE: 'phonepe://upi/pay',
  PAYTM: 'paytmmp://upi/pay',
  BHIM: 'bhim://upi/pay',
  AMAZON_PAY: 'amazonpay://upi/pay',
} as const;

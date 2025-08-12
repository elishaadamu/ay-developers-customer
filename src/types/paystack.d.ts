interface PaystackPopup {
  setup(options: {
    key: string;
    email: string;
    amount: number;
    currency: string;
    ref: string;
    metadata?: {
      userId?: string;
      name?: string;
      [key: string]: any;
    };
    callback: (response: { reference: string; [key: string]: any }) => void;
    onClose: () => void;
  }): {
    openIframe(): void;
  };
}

interface Window {
  PaystackPop: PaystackPopup;
}

type PaymentType = DirectDebitPayment | CardPayment | PaypalPayment | Saved;

interface DirectDebitPayment extends Payment {
  type: 'directDebit';
  bsb: number;
  accNumber: number;
  accName: string;
}

interface CardPayment extends Payment {
  type: 'card';
  cardNumber: string;
  expiry: string;
  cardholder?: string;
  ccv?: number;
}

interface PaypalPayment extends Payment {
  type: 'paypal';
  email: string;
  token?: string;
}

interface Saved extends Payment {
  type: 'saved';
}

interface Payment {
  type: 'card' | 'directDebit' | 'paypal' | 'saved';
}

export type SavedPayment = PaymentType & {
  nickname: string;
  isDefault?: boolean;
};

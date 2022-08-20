export type PaymentType = (DirectDebitPayment | CardPayment | PaypalPayment | Saved) & {
  id?: number;
};

interface DirectDebitPayment extends Payment {
  type: SavedPaymentType.DIRECT_DEBIT;
  bsb: number;
  accountNumber: number;
  accountName: string;
}

interface CardPayment extends Payment {
  type: SavedPaymentType.CARD;
  cardNumber: string;
  expiryDate: string;
  cardholder?: string;
  ccv?: number;
}

interface PaypalPayment extends Payment {
  type: SavedPaymentType.PAYPAL;
  email: string;
  token?: string;
}

interface Payment {
  type: SavedPaymentType;
  id: number;
}

export enum SavedPaymentType {
  DIRECT_DEBIT = 'DIRECT_DEBIT',
  CARD = 'CARD',
  PAYPAL = 'PAYPAL',
  SAVED = 'SAVED'
}

interface Saved {
  type: SavedPaymentType.SAVED;
}

export type SavedPayment = {
  id?: number;
  nickname: string;
  isDefault?: boolean;
  payment: PaymentType;
};

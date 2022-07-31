import { SavedPayment } from '../models/SavedPaymentTypes';

export const dummySavedPayments: SavedPayment[] = [
  { nickname: 'My Card', type: 'card', expiry: '03/23', cardNumber: '●●●●1234' },
  { nickname: 'Family Paypal', type: 'paypal', email: 'family@example.com' },
  { nickname: 'My Paypal', type: 'paypal', email: 'name@example.com', isDefault: true },
  {
    nickname: 'My Commbank Account',
    type: 'directDebit',
    bsb: 123456,
    accName: 'John Smith',
    accNumber: 123456789012
  }
];

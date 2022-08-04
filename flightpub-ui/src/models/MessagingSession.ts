import Message from './Message';
import { User } from './User';
import { Wishlist } from './Wishlist';

export interface MessagingSession {
  id: number;
  status: SessionStatus;
  users: User[];
  messages: Message[];
  wishlist: Wishlist;
}

export enum SessionStatus {
  TRIAGE = 'TRIAGE',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}

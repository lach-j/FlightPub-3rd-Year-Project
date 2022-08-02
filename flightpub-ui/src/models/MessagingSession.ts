import Message from './Message';
import { User } from './User';

export interface MessagingSession {
  id: number;
  status: SessionStatus;
  users: User[];
  messages: Message[];
  wishlistId: number;
}

export enum SessionStatus {
  TRIAGE = 'TRIAGE',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}

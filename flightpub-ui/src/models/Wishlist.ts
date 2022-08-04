import { Destination } from './Destination';

export interface Wishlist {
  id: number;
  dateCreated: Date;
  wishlistItems: WishlistItem[];
}

export interface WishlistItem {
  id: number;
  destination: Destination;
  destinationRank: number;
}

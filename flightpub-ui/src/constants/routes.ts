export const routes = {
  default: '/',
  home: '/home',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot',
  resetPassword: '/reset',
  search: '/search',
  map: '/map',
  account: '/account',
  booking: '/booking',
  searchResults: '/searchResults',
  admin: '/admin',
  holidayPackages: {
    base: '/holidays',
    book: {
      base: '/holidays/book',
      id: '/holidays/book/:packageId'
    }
  },
  passengerDetails: '/passengerDetails',
  travelAgents: {
    base: '/travel-agents',
    createHolidayBooking: '/travel-agents/createHolidayBooking',
    session: {
      base: '/travel-agents/session',
      id: '/travel-agents/session/:sessionId'
    }
  },
  wishlist: {
    base: '/wishlist',
    new: '/wishlist/new'
  }
};

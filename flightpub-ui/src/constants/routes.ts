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
  holidayPackages: '/holidays',
  passengerDetails: '/passengerDetails',
  travelAgents: {
    base: '/travel-agents',
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

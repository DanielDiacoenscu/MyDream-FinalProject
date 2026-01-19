module.exports = {
  routes: [
    {
      method: 'PUT',
      path: '/user/wishlist', 
      handler: 'wishlist.update',
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/wishlist/me', 
      handler: 'wishlist.getMe',
      config: { auth: false, policies: [], middlewares: [] },
    },
  ],
};

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    await next();

    // Check if we are fetching the current user
    if (
      ctx.request.url.startsWith('/api/users/me') &&
      ctx.response.status === 200 &&
      ctx.response.body
    ) {
      const userId = ctx.response.body.id;
      if (userId) {
        // Fetch the full user data including wishlist
        const fullUser = await strapi.entityService.findOne(
          'plugin::users-permissions.user',
          userId,
          { populate: ['wishlist', 'wishlist.Images'] }
        );
        
        // Overwrite the response with the full data
        ctx.response.body = fullUser;
      }
    }
  };
};

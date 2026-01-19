module.exports = (plugin) => {
  // 1. Define the Custom Controller Function
  plugin.controllers.user.updateWishlist = async (ctx) => {
    const user = ctx.state.user;
    const { productIds } = ctx.request.body;

    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    if (!Array.isArray(productIds)) {
      return ctx.badRequest('productIds must be an array');
    }

    try {
      // Force update the wishlist relation
      const updatedUser = await strapi.entityService.update('plugin::users-permissions.user', user.id, {
        data: {
          wishlist: productIds
        },
        populate: ['wishlist']
      });

      return updatedUser;
    } catch (err) {
      console.error('Wishlist Sync Error:', err);
      return ctx.internalServerError('Failed to update wishlist');
    }
  };

  // 2. Add the Custom Route Definition
  plugin.routes['content-api'].routes.push({
    method: 'PUT',
    path: '/user/wishlist',
    handler: 'user.updateWishlist',
    config: {
      prefix: '',
      policies: []
    }
  });

  return plugin;
};

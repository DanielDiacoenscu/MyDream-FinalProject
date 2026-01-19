'use strict';

const jwt = require('jsonwebtoken');

module.exports = {
  // 1. UPDATE (Save Wishlist)
  async update(ctx) {
    const authHeader = ctx.request.header.authorization;
    if (!authHeader) return ctx.unauthorized('No token provided');
    const token = authHeader.replace('Bearer ', '');

    try {
      const decoded = jwt.verify(token, strapi.config.get('plugin.users-permissions.jwtSecret'));
      const userId = decoded.id;
      const { productIds } = ctx.request.body;

      if (!Array.isArray(productIds)) return ctx.badRequest('productIds must be an array');

      const updatedUser = await strapi.entityService.update('plugin::users-permissions.user', userId, {
        data: { wishlist: productIds },
        populate: ['wishlist']
      });

      return updatedUser;
    } catch (err) {
      return ctx.unauthorized('Invalid token');
    }
  },

  // 2. GET ME (Fetch Profile + Wishlist)
  async getMe(ctx) {
    const authHeader = ctx.request.header.authorization;
    if (!authHeader) return ctx.unauthorized('No token provided');
    const token = authHeader.replace('Bearer ', '');

    try {
      const decoded = jwt.verify(token, strapi.config.get('plugin.users-permissions.jwtSecret'));
      const userId = decoded.id;

      // Fetch User WITH Wishlist and Images
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
        populate: {
          wishlist: {
            populate: ['Images']
          }
        }
      });

      return user;
    } catch (err) {
      return ctx.unauthorized('Invalid token');
    }
  }
};

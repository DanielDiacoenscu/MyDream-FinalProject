module.exports = (plugin) => {
  // Запазваме оригиналната функция 'me'
  const originalMe = plugin.controllers.user.me;

  // Пренаписваме функцията 'me' (която се вика при логин)
  plugin.controllers.user.me = async (ctx) => {
    // 1. Извикваме оригиналната логика
    await originalMe(ctx);

    // 2. Взимаме ID-то на потребителя
    const userId = ctx.response.body.id;

    if (userId) {
      // 3. Четем потребителя ОТНОВО, но този път с 'populate=wishlist'
      const userWithWishlist = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        userId,
        {
          populate: ['wishlist', 'role']
        }
      );

      // 4. Връщаме пълните данни на фронтенда
      ctx.body = userWithWishlist;
    }
  };

  return plugin;
};

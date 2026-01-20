export default {
  async afterCreate(event) {
    const { result } = event;
    
    console.log('============== NEW ORDER RECEIVED ==============');
    console.log('Order ID:', result.id);

    let orderProducts = result.products;

    // Safety Check: If products is a string, parse it
    if (typeof orderProducts === 'string') {
      try {
        orderProducts = JSON.parse(orderProducts);
      } catch (e) {
        console.error('Failed to parse products JSON:', e);
        return;
      }
    }

    if (!orderProducts || !Array.isArray(orderProducts)) {
      return;
    }

    for (const item of orderProducts) {
      try {
        const product: any = await strapi.entityService.findOne('api::product.product', item.id);
        if (!product) continue;

        const currentStock = product.stock || 0;
        const quantityBought = item.quantity || 1;
        const newStock = currentStock - quantityBought;

        console.log(`Stock Update for ${product.name}: ${currentStock} -> ${newStock}`);

        await strapi.entityService.update('api::product.product', item.id, {
          data: {
            stock: newStock >= 0 ? newStock : 0,
          } as any,
        });

        if (newStock < 5) {
          // Email is disabled to prevent checkout timeout
          console.log(`⚠️ Low Stock Alert for ${product.name} (Stock: ${newStock}). Email skipped.`);
        }

      } catch (err) {
        console.error('Error updating stock:', err);
      }
    }
    console.log('============== END ORDER PROCESSING ==============');
  },
};

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  async bootstrap({ strapi }) {
    // Schedule: Run every day at 9:00 AM
    strapi.cron.add({
      '* * * * *': async () => {
        console.log('⏰ Starting Daily Low Stock Check...');
        
        try {
          // 1. Find products with stock < 5
          const lowStockProducts = await strapi.entityService.findMany('api::product.product', {
            filters: {
              stock: {
                $lt: 5,
              },
            },
          });

          if (!lowStockProducts || lowStockProducts.length === 0) {
            console.log('✅ No low stock products found today.');
            return;
          }

          console.log(`⚠️ Found ${lowStockProducts.length} products with low stock.`);

          // 2. Format the email HTML
          const productRows = lowStockProducts.map(p => 
            `<tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${p.name}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${p.stock}</td>
            </tr>`
          ).join('');

          const emailHtml = `
            <h1>Daily Low Stock Report</h1>
            <p>The following products are running low (less than 5 left):</p>
            <table style="border-collapse: collapse; width: 100%;">
              <thead>
                <tr style="background-color: #f2f2f2;">
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product Name</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Stock</th>
                </tr>
              </thead>
              <tbody>
                ${productRows}
              </tbody>
            </table>
            <p>Please restock these items soon.</p>
          `;

          // 3. Send email using Resend API (Port 443 - No Blocking!)
          // We use 'onboarding@resend.dev' because you haven't verified a domain yet.
          // It will only send to the email you signed up with.
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer re_5BncZ1G7_6RZAx5pYiCtQ7H5KoEzuj7hE'
            },
            body: JSON.stringify({
              from: 'onboarding@resend.dev', 
              to: 'mydreambeauty.bulgaria@gmail.com',
              subject: `⚠️ Daily Stock Alert: ${lowStockProducts.length} items low`,
              html: emailHtml
            })
          });

          if (res.ok) {
            console.log('📧 Daily Low Stock Report sent successfully!');
          } else {
            const err = await res.text();
            console.error('❌ Failed to send email via Resend:', err);
          }

        } catch (error) {
          console.error('❌ Error in Daily Low Stock Cron Job:', error);
        }
      },
    });
  },
};

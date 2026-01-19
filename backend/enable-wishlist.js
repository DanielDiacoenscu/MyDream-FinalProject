// Use the named export for TypeScript/Node compatibility
const { createStrapi } = require('@strapi/strapi');

async function enablePermission() {
  console.log('Starting Strapi script...');

  try {
    // Load Strapi (pointing to dist since this is a TS project)
    const strapi = await createStrapi({ distDir: './dist' }).load();
    
    console.log('Strapi loaded successfully.');

    // 1. Find the 'Authenticated' role
    const authenticatedRole = await strapi.entityService.findMany('plugin::users-permissions.role', {
      filters: { type: 'authenticated' }
    });

    if (!authenticatedRole || authenticatedRole.length === 0) {
      console.error('Error: Authenticated role not found!');
      process.exit(1);
    }

    const roleId = authenticatedRole[0].id;
    console.log(`Found Authenticated Role ID: ${roleId}`);

    // 2. Find the 'update' permission for 'api::wishlist.wishlist'
    const action = 'api::wishlist.wishlist.update';

    // 3. Check if permission already exists
    const existingPermission = await strapi.entityService.findMany('plugin::users-permissions.permission', {
      filters: {
        action: action,
        role: roleId
      }
    });

    if (existingPermission.length > 0) {
      console.log('Permission already enabled!');
    } else {
      // 4. Create the permission
      await strapi.entityService.create('plugin::users-permissions.permission', {
        data: {
          action: action,
          role: roleId
        }
      });
      console.log('SUCCESS: Wishlist Update permission enabled for Authenticated users.');
    }

  } catch (error) {
    console.error('Script failed:', error);
  }

  // Force exit after 2 seconds to ensure logs are flushed
  setTimeout(() => process.exit(0), 2000);
}

enablePermission();

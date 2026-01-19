module.exports = {
  apps: [
    {
      name: 'strapi-backend',
      script: 'npm',
      args: 'start',
      cwd: '/root/MyDream-FinalProject/backend',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

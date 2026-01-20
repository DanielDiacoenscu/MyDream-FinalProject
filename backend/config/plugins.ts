export default ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Must be false for port 587
        auth: {
          user: 'mydreambeauty.bulgaria@gmail.com',
          pass: 'hrrpkoeophldynoe',
        },
      },
      settings: {
        defaultFrom: 'mydreambeauty.bulgaria@gmail.com',
        defaultReplyTo: 'mydreambeauty.bulgaria@gmail.com',
      },
    },
  },
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
  },
});

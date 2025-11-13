export const EnvConfig = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB_URI,
  port: Number(process.env.PORT) || 3200,
  default_limit: Number(process.env.DEFAULT_LIMIT) || 10,
});

import path from 'path'

export default {
  DB_PORT: process.env.DB_PORT,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  S3_USER: process.env.S3_USER,
  S3_PASSWORD: process.env.S3_PASSWORD,
  SERVER_PORT: parseInt(process.env.SERVER_PORT || '3001'),
  JWT_SECRET: process.env.JWT_SECRET,
  UPLOAD_PATH: process.env.UPLOAD_PATH || path.join(process.cwd(), 'upload'),
  HOST: process.env.NODE_ENV === 'development' ? 'localhost' : '0.0.0.0',
}

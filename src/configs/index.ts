const MYSQL_MAIN_HOST = process.env.MYSQL_MAIN_HOST || 'localhost';
const MYSQL_MAIN_ROOT_PASSWORD = process.env.MYSQL_MAIN_ROOT_PASSWORD || 'root';
const MYSQL_MAIN_USER = process.env.MYSQL_MAIN_USER || 'admin';
const MYSQL_MAIN_PASSWORD = process.env.MYSQL_MAIN_PASSWORD || '123';
const MYSQL_MAIN_DATABASE = process.env.MYSQL_MAIN_DATABASE || 'knacx_exam';

const MYSQL_SEC_HOST = process.env.MYSQL_SEC_HOST || 'localhost';
const MYSQL_SEC_ROOT_PASSWORD = process.env.MYSQL_SEC_ROOT_PASSWORD || 'root';
const MYSQL_SEC_USER = process.env.MYSQL_SEC_USER || 'admin';
const MYSQL_SEC_PASSWORD = process.env.MYSQL_SEC_PASSWORD || '123';
const MYSQL_SEC_DATABASE =
  process.env.MYSQL_SEC_DATABASE || 'knacx_exam_backup';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'mysecret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'mysecret';
const CACHE_KEY = process.env.CACHE_KEY || 'key';
export {
  MYSQL_MAIN_HOST,
  MYSQL_MAIN_ROOT_PASSWORD,
  MYSQL_MAIN_USER,
  MYSQL_MAIN_PASSWORD,
  MYSQL_MAIN_DATABASE,
  MYSQL_SEC_HOST,
  MYSQL_SEC_ROOT_PASSWORD,
  MYSQL_SEC_USER,
  MYSQL_SEC_PASSWORD,
  MYSQL_SEC_DATABASE,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  CACHE_KEY,
};

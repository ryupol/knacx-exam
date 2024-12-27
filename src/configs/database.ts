import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  MYSQL_MAIN_DATABASE,
  MYSQL_MAIN_HOST,
  MYSQL_MAIN_PASSWORD,
  MYSQL_MAIN_USER,
  MYSQL_SEC_DATABASE,
  MYSQL_SEC_HOST,
  MYSQL_SEC_PASSWORD,
  MYSQL_SEC_USER,
} from '.';

export const databaseConfig: TypeOrmModuleOptions[] = [
  {
    //  Main
    type: 'mysql',
    host: MYSQL_MAIN_HOST,
    port: 3306,
    username: MYSQL_MAIN_USER,
    password: MYSQL_MAIN_PASSWORD,
    database: MYSQL_MAIN_DATABASE,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  },

  {
    // Secondary
    type: 'mysql',
    host: MYSQL_SEC_HOST,
    port: 3307,
    username: MYSQL_SEC_USER,
    password: MYSQL_SEC_PASSWORD,
    database: MYSQL_SEC_DATABASE,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  },
];

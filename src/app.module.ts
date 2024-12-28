import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MYSQL_MAIN_DATABASE,
  MYSQL_MAIN_HOST,
  MYSQL_MAIN_PASSWORD,
  MYSQL_MAIN_USER,
} from './configs';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    AuthModule,
    ProductsModule,
    OrdersModule,
    TypeOrmModule.forRoot({
      //  Main
      type: 'mysql',
      host: MYSQL_MAIN_HOST,
      port: 3306,
      username: MYSQL_MAIN_USER,
      password: MYSQL_MAIN_PASSWORD,
      database: MYSQL_MAIN_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

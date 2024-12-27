import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './configs/database';

@Module({
  imports: [
    AuthModule,
    ProductsModule,
    TypeOrmModule.forRoot(databaseConfig[0]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

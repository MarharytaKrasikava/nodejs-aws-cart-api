import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as cdk from 'aws-cdk-lib';

import { AppController } from './app.controller';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import * as dotenv from 'dotenv';
import { DatabaseConfig } from './getDbCreds';
import { CartEntity } from './cart/DB/cart.entity';
import { CartItemEntity } from './cart/DB/cart-item.entity';

dotenv.config();

@Module({
  imports: [
    AuthModule,
    CartModule,
    OrderModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        console.log('Setting up database connection...');
        try {
          const bdConfing = new DatabaseConfig();
          const dbCredentials = await bdConfing.getDatabaseConfig();
          // const host =
          //   process.env.NODE_ENV === 'AWS_LAMBDA'
          //     ? cdk.Fn.importValue(process.env.DB_ENDPOINT_VALUE)
          //     : process.env.DB_HOST || 'localhost';
          return {
            type: 'postgres',
            host:
              process.env.NODE_ENV === 'AWS_LAMBDA'
                ? process.env.DB_HOST
                : process.env.DB_ENDPOINT_VALUE,
            port: 5432,
            username: dbCredentials.username,
            password: dbCredentials.password,
            database: dbCredentials.dbname,
            synchronize: process.env.NODE_ENV !== 'AWS_LAMBDA',
            entities: [CartEntity, CartItemEntity],
            logging: process.env.NODE_ENV !== 'AWS_LAMBDA',
            retryAttempts: 3,
            retryDelay: 3000,
            ssl: process.env.NODE_ENV === 'AWS_LAMBDA' ? true : false,
            extra: {
              max: 20, // connection pool size
              connectionTimeoutMillis: 5000,
            },
          };
        } catch (error) {
          console.error('Database connection error:', error);
          throw error;
        }
      },
    }),
    TypeOrmModule.forFeature([CartEntity, CartItemEntity]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

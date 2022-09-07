import { CacheModule, Module } from '@nestjs/common';
import { CourierService } from './couriers.service';
import { CourierController } from './couriers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Courier, CourierSchema } from './schemas/courier.schema';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Courier.name, schema: CourierSchema}]), 
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      auth_pass: 'courier123',
      ttl: 0
    })],
  controllers: [CourierController],
  providers: [CourierService]
})
export class CourierModule {}

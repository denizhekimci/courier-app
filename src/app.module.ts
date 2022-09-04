import { Module } from '@nestjs/common';
import { CourierController } from './courier/courier.controller';
import { CourierModule } from './courier/courier.module';
import { CourierService } from './courier/courier.service';
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [CourierModule, MongooseModule.forRoot('mongodb://admin:courier123@localhost:27023/courierdb')],
  controllers: [CourierController],
  providers: [CourierService],
})
export class AppModule {}

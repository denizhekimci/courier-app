import { Module } from '@nestjs/common';
import { CourierModule } from './courier/couriers.module';
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    CourierModule,
    MongooseModule.forRoot('mongodb://localhost:27017/test'),
  ]
})
export class AppModule { }

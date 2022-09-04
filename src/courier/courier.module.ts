import { Module } from '@nestjs/common';
import { CourierService } from './courier.service';
import { CourierController } from './courier.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Courier, CourierSchema } from './schemas/courier.schema';

@Module({
  imports: [MongooseModule.forFeature([])],
  controllers: [CourierController],
  providers: [CourierService]
})
export class CourierModule {}

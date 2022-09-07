import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourierService } from './couriers.service';
import { CreateCourierDto } from './dto/create-courier.dto';
import { UpdateCourierDto } from './dto/update-courier.dto';
import { Courier } from './schemas/courier.schema';

@Controller('couriers')
export class CourierController {
  constructor(private readonly courierService: CourierService) {}

  @Post()
  public async create(@Body() createCourierDto: CreateCourierDto) {
    return await this.courierService.create(createCourierDto);
  }

  @Get()
  public async findAll() {
    return await this.courierService.findAll();
  }

  @Get(':courierId')
  public async findOne(@Param('courierId') courierId: string): Promise<Courier> {
    return await this.courierService.findOne(courierId);
  }

  @Patch(':courierId')
  public async update(@Param('courierId') courierId: string, @Body() updateCourierDto: UpdateCourierDto) {
    return await this.courierService.update(courierId, updateCourierDto);
  }

  @Delete(':courierId')
  public async remove(@Param('courierId') courierId: string) {
    return await this.courierService.remove(courierId);
  }
}

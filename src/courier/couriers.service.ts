import { CACHE_MANAGER, Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourierDto } from './dto/create-courier.dto';
import { UpdateCourierDto } from './dto/update-courier.dto';
import { Courier, CourierDocument } from './schemas/courier.schema';
import { Cache } from 'cache-manager';

@Injectable()
export class CourierService implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, @InjectModel(Courier.name) private readonly courierModel: Model<CourierDocument>) { }

  async onModuleInit() {
    // saves all records from mongodb to cache
    const couriersFromDB = await this.courierModel.find().exec();
    if (couriersFromDB) {
      this.setDataToCache('couriers', couriersFromDB);
    }
  }
  async onModuleDestroy() {
    // deletes all records from cache
    await this.cacheManager.reset();
  }

  async create(createCourierDto: CreateCourierDto): Promise<Courier> {
    // creates a new object in mongodb and saves to cache
    const createdCourier = await this.courierModel.create(createCourierDto);

    const createdCourierParsed = this.parseDatafromDB(createdCourier);
    const cache = await this.getDataFromCache('couriers');
    cache.push(createdCourierParsed);
    this.setDataToCache('couriers', cache);

    return createdCourier;
  }

  async findAll(): Promise<Courier[]> {
    // if cache is not empty return all records from cache
    const couriersCached = await this.cacheManager.get('couriers');

    if (couriersCached) {
      return couriersCached as Courier[];
    }
    // if cache is empty return records from mongodb
    const couriersFromDB = await this.courierModel.find().exec();
    this.setDataToCache('couriers', couriersFromDB);
    return couriersFromDB;
  }

  async findOne(courierId: string): Promise<Courier> {
    // if id exists on cache, return data from cache
    const cache = await this.getDataFromCache('couriers');
    const val = cache.find((value) => value._id === courierId);

    if (val) {
      return new this.courierModel(val);
    }
    // if id doesn't exist on cache, return data from mongodb
    return await this.courierModel.findOne({ _id: courierId }).exec();
  }

  async update(courierId: string, updateCourierDto: UpdateCourierDto): Promise<Courier> {
    // updates existing record on mongodb and cache
    const courier = await this.courierModel.findOneAndUpdate(
      { _id: courierId },
      { latitude: updateCourierDto.latitude, longitude: updateCourierDto.longitude },
      { new: true }).exec();

    const updatedCourier = this.parseDatafromDB(courier);
    const cache = await this.getDataFromCache('couriers');
    const courierFromCache = cache.find((value) => value._id === updatedCourier._id);
    courierFromCache.latitude = courier.latitude;
    courierFromCache.longitude = courier.longitude;
    cache.map(value => value._id !== courierFromCache._id ? value : courierFromCache);
    this.setDataToCache('couriers', cache);

    return courier;
  }

  async remove(courierId: string): Promise<Courier> {
    // deletes record from mongodb and cache.
    const deletedCourier = await this.courierModel
      .findByIdAndRemove({ _id: courierId })
      .exec();
    const cache = await this.getDataFromCache('couriers');
    const deleted = cache.find((value) => value._id === courierId);
    const index = cache.indexOf(deleted, 0);
    if (index > -1) {
      cache.splice(index, 1);
    }
    this.setDataToCache('couriers', cache);
    return deletedCourier;
  }

  private async setDataToCache(key: string, value: any[]): Promise<void> {
    // sets data to cache
    await this.cacheManager.set(key, value);
  }

  private async getDataFromCache(key: string): Promise<any[]> {
    // gets data from cache
    return await this.cacheManager.get(key);
  }

  private parseDatafromDB(data: any): any {
    // parses object which returned from mongodb
    let jsonData = JSON.stringify(data);
    return JSON.parse(jsonData);
  }
}

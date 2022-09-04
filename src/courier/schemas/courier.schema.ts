import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourierDocument = Courier & Document;

@Schema()
export class Courier {
    @Prop()
    latitude: number;

    @Prop()
    longitude: number;
}

export const CourierSchema = SchemaFactory.createForClass(Courier);
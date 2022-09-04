import { ApiProperty } from "@nestjs/swagger";

export class CreateCourierDto {
    @ApiProperty()
    latitude: number;

    @ApiProperty()
    longitude: number;
}

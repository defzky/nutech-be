import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ImageProductDto {
  @ApiProperty({
    example: 'image-example',
    description: 'Product Image',
  })
  @IsNotEmpty()
  @IsString()
  readonly image: string;
}

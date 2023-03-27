import { IsEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Adidas',
    description: 'Product Name',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 80000,
    description: 'Product Selling Price',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly sellingPrice: number;

  @ApiProperty({
    example: 3000,
    description: 'Product Purchase Price',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly purchasePrice: number;

  @ApiProperty({
    example: 70,
    description: 'Product Stock',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly stock: number;

  @ApiProperty({
    example: 'user_id',
    description: 'Id User',
  })
  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}

import { IsEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  readonly sellingPrice: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  readonly purchasePrice: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  readonly stock: number;

  @ApiProperty()
  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}

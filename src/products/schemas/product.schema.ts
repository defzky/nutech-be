import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ nullable: true })
  image: string;

  @Prop()
  sellingPrice: number;

  @Prop()
  purchasePrice: number;

  @Prop()
  stock: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

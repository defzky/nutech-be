import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Product } from './schemas/product.schema';
import { Query } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: mongoose.Model<Product>,
  ) {}

  async setImage(productId: string, avatarUrl: string): Promise<Product> {
    const res = await this.productModel.findByIdAndUpdate(
      productId,
      {
        $set: {
          image: avatarUrl,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
    return res;
  }

  async findAll(query: Query): Promise<Product[]> {
    const resPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    const products = query.page
      ? await this.productModel
          .find({ ...keyword })
          .limit(resPerPage)
          .skip(skip)
      : await this.productModel.find({ ...keyword }).skip(skip);

    return products;
  }

  async uploadImage(
    productId: string,
    user: User,
    imageUrl: string,
  ): Promise<Product> {
    const productWithImage = {
      image: imageUrl,
      productId,
    };
    const data = Object.assign(productWithImage, { user: user._id });
    const res = await this.productModel.create(data);
    return res;
  }

  async createWithDto(product: CreateProductDto, user: User): Promise<Product> {
    const data = Object.assign(product, { user: user._id });
    const res = await this.productModel.create(data);
    return res;
  }

  async create(product: Product, user: User): Promise<Product> {
    const data = Object.assign(product, { user: user._id });

    const res = await this.productModel.create(data);
    return res;
  }

  async findById(id: string): Promise<Product> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    return product;
  }

  async updateById(id: string, product: UpdateProductDto): Promise<Product> {
    return await this.productModel.findByIdAndUpdate(id, product, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<Product> {
    return await this.productModel.findByIdAndDelete(id);
  }
}

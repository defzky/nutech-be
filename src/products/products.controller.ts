import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { ProductService } from './products.services';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { of } from 'rxjs';
import { extname, join } from 'path';

@ApiTags('Products')
@Controller('api/products')
export class ProductController {
  private logger = new Logger('Product Controller');
  constructor(private productService: ProductService) {}

  @Get('image/:imageName')
  async findProductImage(
    @Param('imageName') imageName,
    @Res() res,
  ): Promise<any> {
    return of(
      res.sendFile(join(process.cwd(), 'public/images/products/' + imageName)),
    );
  }

  @Put(':productId/upload-images')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'public/images/products',
        filename: (req, file, cb) => {
          const extension = extname(file.originalname);
          const randomName = uuidv4();
          return cb(null, `${randomName}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new HttpException(
              'Only image files are allowed!',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(
    @Param('productId') productId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Product> {
    const avatarUrl = `${file.filename}`;
    return this.productService.setImage(productId, avatarUrl);
  }

  @Get()
  async getAllaProducts(@Query() query: ExpressQuery): Promise<Product[]> {
    return this.productService.findAll(query);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createProduct(
    @Body() product: CreateProductDto,
    @Req() req,
  ): Promise<Product> {
    return this.productService.createWithDto(product, req.user);
  }

  @Get(':id')
  async getProduct(
    @Param('id')
    id: string,
  ): Promise<Product> {
    return this.productService.findById(id);
  }

  @Put(':id')
  async updateProduct(
    @Param('id')
    id: string,
    @Body()
    product: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateById(id, product);
  }

  @Delete(':id')
  async deleteProduct(
    @Param('id')
    id: string,
  ): Promise<Product> {
    return this.productService.deleteById(id);
  }
}

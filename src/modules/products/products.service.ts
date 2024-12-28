import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { join } from 'path';
import { createWriteStream } from 'fs';
import * as fastCsv from 'fast-csv';
import { Response } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_KEY } from 'src/configs';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll() {
    // Check if cache exists
    const cachedProducts = await this.cacheManager.get<Product[]>(CACHE_KEY);
    if (cachedProducts) {
      return cachedProducts; // Return cached data
    }
    const products = await this.productRepository.find();
    if (!products) {
      throw new HttpException(`Products was not found`, HttpStatus.NOT_FOUND);
    }
    await this.cacheManager.set(CACHE_KEY, products);

    return products;
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new HttpException(
        `Product with ID ${id} was not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const newProduct = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(newProduct);
    await this.cacheManager.del(CACHE_KEY);
    return savedProduct;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    const updatedProduct = { ...product, ...updateProductDto };

    await this.productRepository.update(id, updatedProduct);
    await this.cacheManager.del(CACHE_KEY);

    return updatedProduct;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.productRepository.delete(id);

    await this.cacheManager.del(CACHE_KEY);
    return;
  }

  async exportToCsv(response: Response) {
    const products = await this.findAll(); // Get all products
    const csvFilePath = join(__dirname, 'products.csv');

    // Create CSV
    const csvStream = fastCsv.format({ headers: true });
    const writeStream = createWriteStream(csvFilePath);

    csvStream.pipe(writeStream).on('finish', () => {
      response.download(csvFilePath);
    });

    // Write data to the stream
    products.forEach((product) => {
      csvStream.write(product);
    });

    csvStream.end();
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { join } from 'path';
import { createWriteStream } from 'fs';
import * as fastCsv from 'fast-csv';
import { Response } from 'express';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const newProduct = this.productRepository.create(createProductDto);
    return this.productRepository.save(newProduct);
  }

  findAll() {
    return this.productRepository.find();
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

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    const updatedProduct = { ...product, ...updateProductDto };
    return this.productRepository.update(id, updatedProduct);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.productRepository.delete(id);
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

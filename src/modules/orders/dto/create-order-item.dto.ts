import { IsString, IsNumber, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  product_name: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}

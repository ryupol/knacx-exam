import { Controller, Post, Get, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() orderDto: CreateOrderDto) {
    const order = await this.ordersService.createOrder(orderDto);
    return { message: 'Order created successfully!', order };
  }

  @Get()
  async getOrders() {
    const orders = await this.ordersService.getOrders();
    return orders;
  }
}

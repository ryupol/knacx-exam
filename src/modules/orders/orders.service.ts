import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly dataSource: DataSource, // Transaction
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { customer_name, items } = createOrderDto;

    return await this.dataSource.transaction(async (manager) => {
      if (items.length === 0 || !items) {
        throw new BadRequestException('items should not be empty');
      }
      const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const order = manager.create(Order, {
        customer_name,
        total_price: totalPrice,
      });
      const savedOrder = await manager.save(order);

      const orderItems = items.map((item) =>
        manager.create(OrderItem, {
          ...item,
          order: savedOrder,
        }),
      );

      await manager.save(orderItems);

      return savedOrder;
    });
  }

  async getOrders(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['order_items'] });
  }
}

import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('ORDER_SERVICE') private orderService: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('Order_created')
  handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    // console.log(`Pattern: ${context.getPattern}`);
    // console.log(context.getMessage());
    // console.log(context.getChannelRef());\
    console.log('Order recieved for processing', data);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    const isInStock = true;
    if (isInStock) {
      console.log('Inventory available, Processing Order');
      channel.ack(originalMsg);
      // Order Completed
      this.orderService.emit('order_completed', data);
    } else {
      console.log('Inventory not available');
      channel.ack(originalMsg);
      // Order Canceled
      this.orderService.emit('order_canceled', data);
    }
  }
}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
    } else {
      console.log('Inventory not available');
      channel.ack(originalMsg);
    }
  }
}

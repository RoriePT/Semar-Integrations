import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelName } from 'src/utils/enum/enum';

@WebSocketGateway({ cors: true })
export class PayinGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Track sockets by orderId
  private orderSockets = null;
  constructor() {
    this.orderSockets = new Map<string, Socket>();
  }

  handleConnection(client: Socket) {
    //   console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // Cleanup orderSockets map
    for (const [orderId, socket] of this.orderSockets.entries()) {
      if (socket.id === client.id) {
        this.orderSockets.delete(orderId);
      }
    }
  }

  @SubscribeMessage('joinOrder')
  handleJoinOrder(
    @MessageBody() data: { orderId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { orderId } = data;
    client.join(orderId);
    client.emit('joinedOrder', { message: `Joined room for order ${orderId}` });
  }

  notifyOrderAssigned(
    orderId: string,
    url: string,
    type: 'MEMBER' | 'GATEWAY',
    gatewayName,
    userDetails?: {
      id: string;
      name: string;
      email?: string;
      mobileNumber?: string;
    },
    amount?: number,
    channel?: ChannelName,
  ) {
    const channelMap = {
      [ChannelName.UPI]: 'upi',
      [ChannelName.BANKING]: 'netbanking',
      [ChannelName.E_WALLET]: 'e-wallet',
    };

    this.server.to(orderId).emit('orderAssigned', {
      orderId,
      url,
      type,
      gatewayName,
      userDetails,
      amount,
      channel: channel ? channelMap[channel] : ChannelName.UPI,
    });
  }

  test(orderId) {
    this.server.to(orderId).emit('orderTest', {
      message: 'ORDER RECEIVED',
    });
  }
}

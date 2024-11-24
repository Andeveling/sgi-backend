import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export type SingleProductDataNotification = {
  productId: string;
  newStock: number;
};

export type MultipleProductDataNotification = {
  products: SingleProductDataNotification[];
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private productSubscriptions: Map<string, Set<string>> = new Map();

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.productSubscriptions.forEach((subscribers, productId) => {
      subscribers.delete(client.id);
      if (subscribers.size === 0) {
        this.productSubscriptions.delete(productId);
      }
    });
  }

  @SubscribeMessage('subscribeToStockUpdates')
  handleSubscribe(
    @MessageBody() data: { productId: string },
    @ConnectedSocket() client: Socket, 
  ): WsResponse<string> {
    const { productId } = data;
    if (!productId || typeof productId !== 'string') {
      client.emit('error', { message: 'Invalid productId' });
      return {
        event: 'subscribeToStockUpdates',
        data: 'Invalid productId',
      };
    }

    if (!this.productSubscriptions.has(productId)) {
      this.productSubscriptions.set(productId, new Set());
    }
    this.productSubscriptions.get(productId).add(client.id);

    return {
      event: 'subscribeToStockUpdates',
      data: `Subscribed to updates for product ${productId}`,
    };
  }

  notifyProductStockUpdate(data: SingleProductDataNotification): void {
    const { productId, newStock } = data;
    const subscribers = this.productSubscriptions.get(productId);

    if (subscribers) {
      subscribers.forEach((clientId) => {
        const client = this.server.sockets.sockets.get(clientId);
        if (!client) {
          subscribers.delete(clientId);
          return;
        }
        client.emit('productStockUpdated', { productId, newStock });
      });
    }
  }

  notifyProductsStockUpdate(products: MultipleProductDataNotification) {
    this.server.emit('productsStockUpdated', products);
  }
}

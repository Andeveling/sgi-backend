import { TaskCommentsService } from '@/task-comments/task-comments.service';
import { TaskLikeService } from '@/task-like/task-like.service';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { count } from 'console';
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
  private taskSubscriptions: Map<string, Set<string>> = new Map();
  constructor(
    private readonly taskLikeService: TaskLikeService,
    private readonly tasksCommentService: TaskCommentsService,
  ) {}

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
    this.server.emit('clientConnected', { id: client.id });
  }

  handleDisconnect(client: Socket): void {
    this.productSubscriptions.forEach((subscribers, productId) => {
      subscribers.delete(client.id);
      if (subscribers.size === 0) {
        this.productSubscriptions.delete(productId);
      }
    });

    this.taskSubscriptions.forEach((subscribers, taskId) => {
      subscribers.delete(client.id);
      if (subscribers.size === 0) {
        this.taskSubscriptions.delete(taskId);
      }
    });
    console.log(`Client disconnected: ${client.id}`);
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

  /// TASK LIKES ///

  @SubscribeMessage('subscribeToTaskLikes')
  async handleTaskSubscribe(
    @MessageBody() data: { taskId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { taskId } = data;

    if (!taskId) {
      client.emit('error', { message: 'Invalid taskId' });
      return;
    }

    if (!this.taskSubscriptions.has(taskId)) {
      this.taskSubscriptions.set(taskId, new Set());
    }
    this.taskSubscriptions.get(taskId).add(client.id);

    // Obtener estado inicial de likes
    const { count } = await this.taskLikeService.getLikes(taskId);
    const userId = client.handshake.query.userId as string;
    const { isStarred } = await this.taskLikeService.isStarred(taskId, userId);

    // Enviar estado inicial al cliente
    client.emit('taskLikesUpdated', { taskId, likeCount: count, isStarred });
  }

  @SubscribeMessage('toggleTaskLike')
  async handleToggleLike(
    @MessageBody() data: { taskId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { taskId, userId } = data;

    if (!taskId || !userId) {
      client.emit('error', { message: 'Invalid taskId or userId' });
      return;
    }

    console.log('toggleTaskLike', taskId, userId);

    // Alternar el like
    const { liked } = await this.taskLikeService.toggleLike(taskId, userId);
    console.log('Like toggled:', liked);

    // Notificar a los suscriptores
    this.notifyTaskLikeUpdate(taskId, userId);
    client.emit('taskLikeToggled', { taskId, liked });
  }

  private async notifyTaskLikeUpdate(
    taskId: string,
    userId: string,
  ): Promise<void> {
    const subscribers = this.taskSubscriptions.get(taskId);

    if (subscribers) {
      const { count } = await this.taskLikeService.getLikes(taskId);
      const { isStarred } = await this.taskLikeService.isStarred(
        taskId,
        userId,
      );

      subscribers.forEach((clientId) => {
        const client = this.server.sockets.sockets.get(clientId);
        if (!client) {
          subscribers.delete(clientId);
          return;
        }

        client.emit('taskLikesUpdated', {
          taskId,
          likeCount: count,
          isStarred,
        });
      });
    }
  }

  @SubscribeMessage('getTaskLikeStatus')
  async handleGetTaskLikeStatus(
    @MessageBody() data: { taskId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { taskId, userId } = data;

    if (!taskId || !userId) {
      client.emit('error', { message: 'Invalid taskId or userId' });
      return;
    }

    const { count } = await this.taskLikeService.getLikes(taskId);
    const { isStarred } = await this.taskLikeService.isStarred(taskId, userId);

    client.emit('taskLikeStatus', { taskId, likeCount: count, isStarred });
  }

  /// TASK COMMENTS ///
  @SubscribeMessage('subscribeToTaskComments')
  async handleTaskCommentsSubscribe(
    @MessageBody() data: { taskId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { taskId } = data;

    if (!taskId) {
      client.emit('error', { message: 'Invalid taskId' });
      return;
    }

    // Gestionar suscripciones
    if (!this.taskSubscriptions.has(taskId)) {
      this.taskSubscriptions.set(taskId, new Set());
    }
    this.taskSubscriptions.get(taskId).add(client.id);

    // Enviar datos iniciales al cliente
    await this.sendTaskCommentsData(taskId, client);
  }

  @SubscribeMessage('addTaskComment')
  async handleAddTaskComment(
    @MessageBody() data: { taskId: string; userId: string; content: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { taskId, userId, content } = data;

    if (!taskId || !userId || !content) {
      client.emit('error', { message: 'Invalid input data' });
      return;
    }

    // Agregar el comentario y notificar
    await this.tasksCommentService.addComment(taskId, userId, content);
    await this.notifyTaskCommentsUpdate(taskId);
  }

  @SubscribeMessage('getTaskCommentsData')
  async handleGetTaskCommentsData(
    @MessageBody() data: { taskId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { taskId } = data;

    if (!taskId) {
      client.emit('error', { message: 'Invalid taskId' });
      return;
    }

    // Enviar datos iniciales al cliente
    await this.sendTaskCommentsData(taskId, client);
  }

  private async notifyTaskCommentsUpdate(taskId: string): Promise<void> {
    // Obtener datos actualizados
    const [comments, count] = await Promise.all([
      this.tasksCommentService.findAllComments(taskId),
      this.tasksCommentService.countAllComments(taskId),
    ]);

    // Emitir actualizaciones a los clientes suscritos
    const subscribers = this.taskSubscriptions.get(taskId);
    if (subscribers) {
      subscribers.forEach((clientId) => {
        const client = this.server.sockets.sockets.get(clientId);
        if (client) {
          client.emit('taskCommentsUpdated', { taskId, comments, count });
        }
      });
    }
  }

  private async sendTaskCommentsData(
    taskId: string,
    client: Socket,
  ): Promise<void> {
    const [comments, count] = await Promise.all([
      this.tasksCommentService.findAllComments(taskId),
      this.tasksCommentService.countAllComments(taskId),
    ]);

    client.emit('taskCommentsData', { taskId, comments, count });
  }
}

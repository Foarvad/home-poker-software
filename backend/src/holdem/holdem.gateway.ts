import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { HoldemService } from './holdem.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { AddPlayerHandDto } from './dto/add-player-hand.dto';

@WebSocketGateway({ namespace: '/holdem', cors: { origin: '*' } })
export class HoldemGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private holdemService: HoldemService) { }

  private async broadcastSession(sessionId: string, groups: ('managers' | 'players')[]) {
    const session = await this.holdemService.getSessionById(sessionId);

    if (groups.includes('players')) {
      this.server.to(sessionId).emit('session', session);
    }

    if (groups.includes('managers')) {
      this.server.to(`${sessionId}-manager`).emit('session', session);
    }
  }

  handleConnection(client: Socket) {
    console.log('Client connected!');
  }

  @SubscribeMessage('getSessions')
  async getSessions(client: Socket) {
    const sessions = await this.holdemService.getSessions();
    client.emit('sessions', sessions);
  }

  @SubscribeMessage('getSession')
  async getSessionById(client: Socket, { sessionId }: { sessionId: string }) {
    try {
      const session = await this.holdemService.getSessionById(sessionId);
      client.emit('session', session);
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('createSession')
  async createSession(
    @MessageBody() dto: CreateSessionDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.holdemService.createSession(dto);

      const sessions = await this.holdemService.getSessions();
      this.server.emit('sessions', sessions);

      return 'Session created';
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('joinSessionAsManager')
  async joinSessionAsManager(@ConnectedSocket() client: Socket, @MessageBody() { sessionId }: { sessionId: string }) {
    try {
      await client.join(`${sessionId}-manager`);

      return 'Joined session as manager';
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('joinSession')
  async joinSession(@ConnectedSocket() client: Socket, @MessageBody() { sessionId }: { sessionId: string }) {
    try {
      await client.join(sessionId);

      return 'Joined session';
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('leaveSession')
  async leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() { sessionId }: { sessionId: string }) {
    try {
      await client.leave(sessionId);

      return 'Session leaved';
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('startSession')
  async startSession(
    @MessageBody() { sessionId }: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.holdemService.startSession(sessionId);

      await this.broadcastSession(sessionId, ['players', 'managers']);

      return 'Session started';
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('endSession')
  async endSession(
    @MessageBody() { sessionId }: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.holdemService.endSession(sessionId);

      await this.broadcastSession(sessionId, ['players', 'managers']);

      return 'Session ended';
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('nextHand')
  async nextHand(
    @MessageBody() { sessionId }: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.holdemService.nextHand(sessionId);

      await this.broadcastSession(sessionId, ['players', 'managers']);

      return 'Next hand started';
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('addPlayerHand')
  async addPlayerHand(
    @MessageBody() { sessionId, hand }: { sessionId: string; hand: AddPlayerHandDto },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.holdemService.addPlayerHand(sessionId, hand);

      await this.broadcastSession(sessionId, ['managers']);

      return 'Player hand added';
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('addFlop')
  async addFlop(
    @MessageBody() { sessionId, flop }: { sessionId: string; flop: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.holdemService.addFlop(sessionId, flop);

      await this.broadcastSession(sessionId, ['managers']);

      return 'Flop added'
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('addTurn')
  async addTurn(
    @MessageBody() { sessionId, turn }: { sessionId: string; turn: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.holdemService.addTurn(sessionId, turn);

      await this.broadcastSession(sessionId, ['managers']);

      return 'Turn added'
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('addRiver')
  async addRiver(@MessageBody() { sessionId, river }: { sessionId: string; river: string }) {
    try {
      await this.holdemService.addRiver(sessionId, river);

      await this.broadcastSession(sessionId, ['managers']);

      return 'River added';
    } catch (error) {
      this.server.emit('error', error.message);
    }
  }
}

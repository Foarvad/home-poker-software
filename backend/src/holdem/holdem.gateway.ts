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

  handleConnection(client: Socket) {
    console.log('Client connected!');
  }

  @SubscribeMessage('getSessions')
  async getSessions() {
    const sessions = await this.holdemService.getSessions();
    this.server.emit('sessions', sessions);
  }

  @SubscribeMessage('getSessionById')
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
      const session = await this.holdemService.createSession(dto);
      this.server.emit('sessionCreated', session);

      const sessions = await this.holdemService.getSessions();
      this.server.emit('sessions', sessions);
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('joinSession')
  async joinSession(@ConnectedSocket() client: Socket, { sessionId }: { sessionId: string }) {
    try {
      await client.join(sessionId);
      client.emit('sessionJoined', sessionId);
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('leaveSession')
  async leaveRoom(@ConnectedSocket() client: Socket, { sessionId }: { sessionId: string }) {
    try {
      await client.leave(sessionId);
      client.emit('sessionLeaved', sessionId);
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
      this.server.emit('sessionStarted', sessionId);
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
      this.server.emit('sessionEnded', sessionId);
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
      // Notifying players that are in this session
      this.server.to(sessionId).emit('nextHandStarted', sessionId);
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
      // Notifying players that are in this session
      this.server.to(sessionId).emit('playerHandAdded', { sessionId, playerName: hand.playerName });
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
      // Notifying players that are in this session
      this.server.to(sessionId).emit('flopAdded', { sessionId, flop });
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
      // Notifying players that are in this session
      this.server.to(sessionId).emit('turnAdded', { sessionId, turn });
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('addRiver')
  async addRiver(@MessageBody() { sessionId, river }: { sessionId: string; river: string }) {
    try {
      await this.holdemService.addRiver(sessionId, river);
      // Notifying players that are in this session
      this.server.to(sessionId).emit('riverAdded', { sessionId, river });
    } catch (error) {
      this.server.emit('error', error.message);
    }
  }
}

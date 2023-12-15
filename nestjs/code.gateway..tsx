import {
	Server,
	Socket,
} from 'socket.io'
import type {
	OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
} from '@nestjs/websockets'
import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import {
	OnEvent,
} from '@nestjs/event-emitter'

import {
	handleWebsocketConnection, handleWebsocketDisconnect,
} from '../../shared/utils/handle-websocket-connection.util'
import {
	CodeService,
} from './code.service'
import {
	cookieParser,
} from '../../shared/utils/cookie-parser.util'
import {
	GetCodeFromIdData,
	PushNewCodeToLocalDbsProps,
} from './code.types'

const sessions: Record<string, string> = {
}
@WebSocketGateway({
	namespace: '/code',
},)
export class CodeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly codeService: CodeService,) {}

	@WebSocketServer() private readonly server!: Server

	public handleConnection(client: Socket,): void {
		handleWebsocketConnection(client, sessions,)
	}

	public handleDisconnect(client: Socket,): void {
		handleWebsocketDisconnect(client, sessions,)
	}

	@OnEvent('push-code',)
	public async handleResultGetEvent(data: PushNewCodeToLocalDbsProps,): Promise<void> {
		const socketId = Object.keys(sessions,).find((id,) => {
			return sessions[id] === data.sessionId
		},)

		if (socketId) {
			this.server.to(socketId,).emit('push-new-code', {
				newCode: data.newCode,
			},)
		}
	}

	@SubscribeMessage('get-codes-by-id',)
	public async handleMessage(client: Socket, data: GetCodeFromIdData,): Promise<void> {
		const cookies = cookieParser(client.request.headers.cookie,)

		const podSessionId = cookies['pod_session']

		if (podSessionId) {
			const newCodes = await this.codeService.getAllCodesById(data.code.id, podSessionId,)

			const socketId = Object.keys(sessions,).find((id,) => {
				return sessions[id] === podSessionId
			},)

			if (socketId) {
				this.server.to(socketId,).emit('batch-codes-update', {
					newCodes,
				},)
			}
		}
	}
}

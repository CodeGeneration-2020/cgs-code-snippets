import * as React from 'react'
import type {
	Socket,
} from 'socket.io-client'
import io from 'socket.io-client'

import {
	POD_SESSION_EMITTER_KEYS,
} from '../../../../shared/event-emitters-keys/pod-session.emitter-keys'
import {
	useAuth,
} from '../../../store/auth.store'
import {
	SOKET_URLS,
} from '../../constants/socket-urls.constants'
import {
	SOCKET_CONFIG,
} from '../../constants/configs.constants'
import type {
	ConnectionReturn,
} from './pod-session.types'

export const usePodSessionGeteway = (): void => {
	const socketRef = React.useRef<Socket | null>(null,)

	const [setAuth,] = useAuth((state,) => {
		return [state.setAuth,]
	},)

	React.useEffect(() => {
		socketRef.current = io(SOKET_URLS.podSession, SOCKET_CONFIG,)

		socketRef.current.on(POD_SESSION_EMITTER_KEYS.CONNECTION, ({
			auth,
		}: ConnectionReturn,) => {
			setAuth(auth,)()
		},)

		return () => {
			socketRef.current?.disconnect()
		}
	}, [],)
}

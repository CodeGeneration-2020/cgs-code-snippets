import * as React from 'react'
import type {
	Socket,
} from 'socket.io-client'
import {
	io,
} from 'socket.io-client'

import {
	pinCodeService,
} from '../../../services/pin-codes/pin-codes.service'
import {
	PIN_CODE_EMITTER_KEYS,
} from '../../../../shared/event-emitters-keys/pin-code.emitter-keys'
import {
	SOKET_URLS,
} from '../../constants/socket-urls.constants'
import {
	SOCKET_CONFIG,
} from '../../constants/configs.constants'
import {
	useBatchAddPinCodes,
} from '../../hooks/batch-add-pin-codes.hook'
import {
	useSendLastPinCodeToServer,
} from './hooks/send-last-pin-code.hook'
import type {
	NewPinCode,
	NewPinCodes,
} from './pin-code.types'

export const usePinCodeGateway = (): void => {
	const socketRef = React.useRef<Socket | null>(null,)

	const {
		getLastPinCode,
	} = useSendLastPinCodeToServer({
		socketRef,
	},)

	const {
		fetch: batchAdd,
	} = useBatchAddPinCodes()

	const updateLocalPinCodes = async(): Promise<void> => {
		await getLastPinCode(undefined,)
	}

	React.useEffect(() => {
		socketRef.current = io(SOKET_URLS.pinCode, SOCKET_CONFIG,)

		socketRef.current.on('connect', async() => {
			if (socketRef.current) {
				await updateLocalPinCodes()
			}
		},)

		socketRef.current.on(PIN_CODE_EMITTER_KEYS.BATCH_PIN_CODES_UPDATE, (data: NewPinCodes,) => {
			batchAdd(data.newPinCodes,)
		},)

		socketRef.current.on(PIN_CODE_EMITTER_KEYS.PUSH_NEW_CODE, async(data: NewPinCode,) => {
			const lastPinCode = await pinCodeService.getLastPinCode()

			const isNewPinCodeNext = (data.newCode.id - lastPinCode?.id) === 1

			if (isNewPinCodeNext) {
				await pinCodeService.addPinCode(data.newCode,)
			} else {
				await updateLocalPinCodes()
			}
		},)

		window.addEventListener('online', updateLocalPinCodes,)

		return () => {
			socketRef.current?.disconnect()

			window.removeEventListener('online', updateLocalPinCodes,)
		}
	}, [],)
}

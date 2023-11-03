import * as React from 'react'
import {
	useInternetConnectionStore,
} from '../../../store/internet-connection.store'

type InternetConnectionListenerProps = {
	children: React.ReactNode
}

export const InternetConnectionListener: React.FunctionComponent<InternetConnectionListenerProps> = ({
	children,
},): React.ReactNode => {
	const [setOnline, setOffline,] = useInternetConnectionStore((state,) => {
		return [state.setOnline, state.setOffline, state.isOnline,]
	},)

	const updateInternetConnectionStatus = (): void => {
		if (navigator.onLine) {
			setOnline()
			return
		}

		setOffline()
	}

	React.useEffect(() => {
		window.addEventListener('online', updateInternetConnectionStatus,)
		window.addEventListener('offline', updateInternetConnectionStatus,)

		updateInternetConnectionStatus()

		return () => {
			window.removeEventListener('online', updateInternetConnectionStatus,)
			window.removeEventListener('offline', updateInternetConnectionStatus,)
		}
	}, [],)

	return <>{children}</>
}

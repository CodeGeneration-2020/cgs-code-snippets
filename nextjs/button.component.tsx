import React from 'react'
import type {
	ButtonProps,
} from 'react-aria-components'

import type {
	TextBtnProps,
} from './components/text-btn.component'
import TextBtn from './components/text-btn.component'
import type {
	IconBtnProps,
} from './components/icon-btn.component'
import IconBtn from './components/icon-btn.component'

import {
	ButtonType,
} from './button.types'

type Props<T extends ButtonType> = ButtonProps & React.RefAttributes<HTMLButtonElement> & {
	loading?: boolean
	additionalProps: T extends ButtonType.TEXT
		? TextBtnProps<T>
		: T extends ButtonType.ICON
		? IconBtnProps<T>
		: never
}

const Button = <T extends ButtonType,>({
	loading,
	additionalProps,
	...buttonAttributes
}: Props<T>,): React.ReactElement => {
	const isLoading = Boolean(loading,)
	const isDisabled = isLoading || Boolean(buttonAttributes.isDisabled,)

	const baseProps = {
		isDisabled,
		isLoading,
		...buttonAttributes,
	}

	switch (additionalProps.btnType) {
	case ButtonType.TEXT:
		return <TextBtn {...baseProps} {...additionalProps} />
	case ButtonType.ICON:
		return <IconBtn {...baseProps} {...additionalProps} />
	default:
		throw new Error('Unsupported button type',)
	}
}

export default Button

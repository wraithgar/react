import React, {PropsWithChildren} from 'react'
import {SystemCommonProps} from '../constants'
import {StyledSpan} from '../Primitives/StyledSpan'

export interface BarProps extends SystemCommonProps {
  progress?: string | number
}

export function Bar({progress, children, ...props}: PropsWithChildren<BarProps>): JSX.Element {
  return (
    <StyledSpan {...props} sx={{width: progress ? `${progress}%` : 0}}>
      {children}
    </StyledSpan>
  )
}

import React, {PropsWithChildren} from 'react'
import {SystemCommonProps} from '../constants'
import {StyledSpan} from '../Primitives/StyledSpan'
import {SxProp} from '../sx'

export interface BarProps extends SystemCommonProps, SxProp {
  progress?: string | number
}

export function Bar({sx, progress, children, ...props}: PropsWithChildren<BarProps>): JSX.Element {
  return (
    <StyledSpan {...props} sx={{width: progress ? `${progress}%` : 0, ...sx}}>
      {children}
    </StyledSpan>
  )
}

import React, {PropsWithChildren} from 'react'
import {get, WidthProps} from 'styled-system'
import {SystemCommonProps} from '../constants'
import {StyledSpan} from '../Primitives/StyledSpan'
import {SxProp} from '../sx'

const sizeMap = {
  small: '5px',
  large: '10px',
  default: '8px'
}

export interface ProgressContainerProps extends WidthProps, SystemCommonProps, SxProp {
  inline?: boolean
  barSize?: keyof typeof sizeMap
}

export function ProgressContainer({
  sx,
  inline,
  barSize = 'default',
  children,
  ...props
}: PropsWithChildren<ProgressContainerProps>): JSX.Element {
  return (
    <StyledSpan
      {...props}
      sx={{
        display: inline ? 'inline-flex' : 'flex',
        overflow: 'hidden',
        backgroundColor: get('colors.gray.2'),
        borderRadius: get('radii.1'),
        height: sizeMap[barSize],
        ...sx
      }}
    >
      {children}
    </StyledSpan>
  )
}

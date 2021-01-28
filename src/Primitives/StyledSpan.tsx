import styled from 'styled-components'
import {COMMON, SystemCommonProps} from '../constants'
import sx, {SxProp} from '../sx'

export interface StyledSpanProps extends SystemCommonProps, SxProp {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export const StyledSpan = styled.span<StyledSpanProps>`
  ${COMMON}
  ${sx}
`

import classnames from 'classnames'
import React from 'react'
import styled from 'styled-components'
import {COMMON, get, SystemCommonProps} from './constants'
import {Box, CounterLabel} from '.'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

type StyledAvatarStackWrapperProps = {
  count?: number
} & SystemCommonProps &
  SxProp

const AvatarStackWrapper = styled.span<StyledAvatarStackWrapperProps>`
  display: flex;
  position: relative;
  height: 24px;
  min-width: ${props => (props.count === 1 ? '24px' : props.count === 2 ? '44px' : '38px')};

  .pc-AvatarItemWrapper {
    flex-shrink: 0;
    margin-left: -${get('space.1')};
    transition: padding 0.6s cubic-bezier(0.68, -0.6, 0.32, 1.6), opacity 0.2s ease-in-out, visibility 0.2s ease-in-out,
      box-shadow 0.1s ease-in-out;
    &:first-child {
      margin-left: 0;
    }
  }

  .pc-AvatarItem {
    flex-shrink: 0;
    height: 24px;
    width: 24px;
    box-shadow: 0 0 0 1px ${get('colors.canvas.default')};
    position: relative;
    overflow: hidden;
  }

  &.pc-AvatarStack--right {
    justify-content: flex-end;
    .pc-AvatarItemWrapper {
      margin-left: 0 !important;
      margin-right: -${get('space.1')};

      &:first-child {
        margin-right: 0;
      }
    }

    .pc-AvatarStackBody {
      flex-direction: row-reverse;
    }
  }

  .pc-AvatarItemWrapper:hover {
    padding-left: ${get('space.2')};
    padding-right: ${get('space.2')};

    &:first-child {
      padding-right: 0;
    }
  }

  ${COMMON}
  ${sx};
`
const transformChildren = (children: React.ReactNode) => {
  return React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child
    return (
      <Box className="pc-AvatarItemWrapper">
        {React.cloneElement(child, {
          className: classnames(child.props.className, 'pc-AvatarItem'),
          sx: {zIndex: 10 - index, ...child.props.sx}
        })}
      </Box>
    )
  })
}

export type AvatarStackProps = {
  alignRight?: boolean
} & ComponentProps<typeof AvatarStackWrapper>

const AvatarStack = ({children, alignRight, ...rest}: AvatarStackProps) => {
  const count = React.Children.count(children)
  const wrapperClassNames = classnames({
    'pc-AvatarStack--two': count === 2,
    'pc-AvatarStack--three-plus': count > 2,
    'pc-AvatarStack--right': alignRight
  })
  return (
    <AvatarStackWrapper count={count} className={wrapperClassNames} {...rest}>
      <Box position="absolute" display="flex" className="pc-AvatarStackBody">
        {transformChildren(children)}
        <Box>
          <CounterLabel sx={{padding: '6px 8px', marginRight: '-4px'}}>+21</CounterLabel>
        </Box>
      </Box>
    </AvatarStackWrapper>
  )
}

export default AvatarStack

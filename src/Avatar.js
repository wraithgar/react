import React, {forwardRef} from 'react'
import PropTypes from 'prop-types'
import Box from './Box'
import theme from './theme'
import {sx, mergeCustomStyles} from './sx'

function getBorderRadius(props) {
  if (props.square) {
    return props.size <= 24 ? '4px' : '6px'
  } else {
    return '50%'
  }
}

const Avatar = forwardRef((props, forwardedRef) => {
  return (
    <Box
      as="img"
      height={props.size}
      width={props.size}
      overflow="hidden"
      verticalAlign="middle"
      sx={mergeCustomStyles(props.sx, {borderRadius: getBorderRadius(props), lineHeight: 'condensedUltra'})}
      {...props}
      ref={forwardedRef}
    />
  )
})

Avatar.defaultProps = {
  theme,
  size: 20,
  alt: '',
  square: false
}

Avatar.propTypes = {
  size: PropTypes.number,
  square: PropTypes.bool,
  ...sx.propTypes,
  theme: PropTypes.object
}

export default Avatar

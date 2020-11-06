import PropTypes from 'prop-types'
import css from '@styled-system/css'

export const sx = props => css(props.sx)
export const mergeCustomStyles = (base, override) => Object.assign(base, override)

sx.propTypes = {
  sx: PropTypes.object
}

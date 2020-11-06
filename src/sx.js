import PropTypes from 'prop-types'
import css from '@styled-system/css'

export const sx = props => css(props.sx)
// merges user defined sx props with sx props defined in a component implementation
// the second argument/style object passed in will take precendence over the first
export const mergeCustomStyles = (base = {}, override = {}) => Object.assign(base, override)

sx.propTypes = {
  sx: PropTypes.object
}

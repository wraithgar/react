import styled from 'styled-components'
import React, {forwardRef, useRef} from 'react'
import {COMMON} from './constants'
import theme from './theme'
import sx from './sx'
import useDetails from './hooks/useDetails'

const StyledDetails = styled.details`
  & > summary {
    list-style: none;
  }
  & > summary::-webkit-details-marker {
    display: none;
  }

  ${COMMON}
  ${sx};
`

const Details = forwardRef(({closeOnOutsideClick, defaultOpen, onClickOutside, ...rest}, forwardedRef) => {
  const backupRef = useRef(null)
  const ref = forwardedRef ?? backupRef
  const {getDetailsProps} = useDetails({ref, closeOnOutsideClick, defaultOpen, onClickOutside})
  return <StyledDetails {...getDetailsProps()} {...rest} />
})

Details.displayName = 'Details'

Details.defaultProps = {
  theme,
}

Details.propTypes = {
  ...COMMON.propTypes,
  ...sx.propTypes,
}

export default Details

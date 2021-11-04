import React from 'react'
import styled from 'styled-components'
import {Box} from '..'
import sx, {SxProp} from '../sx'

const StyledButton = styled(Box).attrs(() => ({
  as: 'button'
}))``
// const StyledButton = styled.div<SxProp>`...${sx};`
// const StyledButton = styledWithSx.div`...`

// const StyledButton = styled.button<SxProp>`${sx};`
// const StyledButton = styled('button')({
//
// })

type BaseProps = {
  message: string
}

const ComponentWithRef = React.forwardRef<HTMLButtonElement, BaseProps>((props, ref) => {
  return <StyledButton ref={ref}>{props.message}</StyledButton>
  // return <Box ref={ref} as="button">{props.message}</Box>
})

export function Sandbox() {}

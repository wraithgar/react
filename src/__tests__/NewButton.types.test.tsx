import React, {ComponentPropsWithRef} from 'react'
import {NewButton, NewButtonProps} from '../NewButton'
import ButtonBase from '../NewButton/button-base'

export function newButtonBaseCase() {
  return <NewButton>Push me</NewButton>
}

export function newButtonWithAsProp() {
  return <NewButton as="a">Push me</NewButton>
}

export function buttonPropsWithAsProp(aReactNode: React.ReactNode): NewButtonProps {
  return {
    children: aReactNode,
    as: 'a',
    onClick: () => null,
    // This errors, but it shouldn't:
    href: '#'
  }
}

type AlternateButtonProps = ComponentPropsWithRef<typeof ButtonBase>
export function alternateButtonPropsWithAsProp(aReactNode: React.ReactNode): AlternateButtonProps {
  return {
    children: aReactNode,
    // this doesn't work, and i'm not sure why — possibly because of our handwritten `as` type in types.tsx?
    as: 'a',
    onClick: () => null,
    href: '#'
  }
}

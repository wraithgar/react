import { XIcon } from '@primer/octicons-react'
import styled, { css } from 'styled-components'
import { variant } from 'styled-system'
import { get } from '../constants'
import { defaultTokenSize, tokenSizes, TokenSizeKeys } from "./TokenBase"

interface Props {
    parentTokenTag: 'span' | 'button' | 'a'
    variant?: TokenSizeKeys
}

const variants = variant({
    variants: {
      sm: {
        height: `${tokenSizes.sm}px`,
        width: `${tokenSizes.sm}px`,
      },
      md: {
        height: `${tokenSizes.md}px`,
        width: `${tokenSizes.md}px`,
      },
      lg: {
        height: `${tokenSizes.lg}px`,
        width: `${tokenSizes.lg}px`,
      },
      xl: {
        height: `${tokenSizes.xl}px`,
        width: `${tokenSizes.xl}px`,
      }
    }
  })

const removeTokenButtonStyles = css`
    background-color: transparent;
    font-family: inherit;
    cursor: pointer;
    user-select: none;
    appearance: none;
    text-decoration: none;
    padding: 0;

    align-self: baseline;
    border: 0;
    border-radius: 999px;

    &:hover,
    &:focus {
        background-color: ${get('colors.fade.fg10')};
    }

    &:active {
        background-color: ${get('colors.fade.fg15')};
    }
`;

const RemoveTokenButton = styled.span.attrs<Props>(({parentTokenTag, variant, ...rest}) => {
    delete rest.children;

    return ({
        as: parentTokenTag === 'span' ? 'button' : 'span',
        tabIndex: -1,
        className: 'RemoveTokenButton',
        children: <XIcon size={tokenSizes[variant || defaultTokenSize] * 0.75} /> // TODO: figure out how to set `size` using `fontSizes` from Primitives
    })
})<Props>`
    ${removeTokenButtonStyles}
    ${variants}
`;

RemoveTokenButton.defaultProps = {
    variant: defaultTokenSize
}

export default RemoveTokenButton;

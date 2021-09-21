import { XIcon } from '@primer/octicons-react'
import styled from 'styled-components'
import { defaultTokenSize, tokenSizes, TokenSizeKeys } from "./TokenBase"
import { TokenButtonProps, tokenButtonStyles, variants, getTokenButtonIconSize } from './_tokenButtonUtils'

const RemoveTokenButton = styled.span.attrs<TokenButtonProps>(({borderOffset, parentTokenTag, variant, ...rest}) => {
    delete rest.children;

    return ({
        borderOffset,
        as: parentTokenTag === 'span' ? 'button' : 'span',
        tabIndex: -1,
        children: <XIcon size={getTokenButtonIconSize(variant)} /> // TODO: figure out how to set `size` using `fontSizes` from Primitives
    })
})<TokenButtonProps>`
    ${tokenButtonStyles}
    ${variants}
    transform: ${props => `translate(${props.borderOffset}px, -${props.borderOffset}px)`};
`;

RemoveTokenButton.defaultProps = {
    variant: defaultTokenSize
}

export default RemoveTokenButton;

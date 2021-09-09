// NOTE:
// I'm proposing we just get rid of this component, but I'm keeping it around just incase we
// find a reason to make Topic tokens different from the default Token component.

import React from 'react'
import styled from 'styled-components'
import { get } from '../constants'
import TokenBase, { TokenBaseProps } from './TokenBase'
import RemoveTokenButton from './_RemoveTokenButton'

const DefaultToken = styled(TokenBase)`
    background-color: ${get('colors.accent.subtle')};
    border-color: ${props => props.isSelected ? get('colors.accent.fg') : get('colors.accent.subtle')};
    border-style: solid;
    border-width: ${props => props.isSelected ? '1px' : 0};
    color: ${get('colors.accent.fg')};
    padding-right: ${props => props.handleRemove ? 0 : undefined};

    &:hover {
        background-color: ${get('colors.accent.muted')};
    }

    > .RemoveTokenButton {
        color: ${get('colors.accent.fg')};
    }
`;

// TODO: make this text truncate
const TokenTextContainer = styled('span')`
    white-space: nowrap;
`;

const TokenTopic: React.FC<TokenBaseProps> = ({
    as,
    handleRemove,
    text,
    variant,
    ...rest
}) => {

    return (
        <DefaultToken as={as} handleRemove={handleRemove} text={text} {...rest}>
            <TokenTextContainer>{text}</TokenTextContainer>
            {handleRemove ? (
                <RemoveTokenButton
                    parentTokenTag={as || 'span'}
                    tabIndex={-1}
                    onClick={handleRemove}
                    variant={variant}
                />
            ) : null}
        </DefaultToken>
    )
};

export default TokenTopic;

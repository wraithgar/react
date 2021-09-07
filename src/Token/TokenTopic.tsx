import React from 'react'
import styled from 'styled-components'
import { get } from '../constants'
import TokenBase, { TokenBaseProps } from './TokenBase'
import RemoveTokenButton from './_RemoveTokenButton'

const DefaultToken = styled(TokenBase)`
    background-color: ${props => props.isSelected ? get('colors.topicTag.activeBg') : get('colors.topicTag.bg')};
    border-color: ${get('colors.topicTag.text')};
    border-style: solid;
    border-width: ${props => props.isSelected ? '1px' : 0};
    color: ${get('colors.topicTag.text')};
    padding-right: ${props => props.handleRemove ? 0 : undefined};

    &:hover {
        background-color: ${get('colors.topicTag.hoverBg')};
    }

    > .RemoveTokenButton {
        color: ${get('colors.topicTag.text')};
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

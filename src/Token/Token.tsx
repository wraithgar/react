import React from 'react'
import styled from 'styled-components'
import { get } from '../constants'
import TokenBase, { isTokenHoverable, TokenBaseProps } from './TokenBase'
import RemoveTokenButton from './_RemoveTokenButton'

interface Props extends TokenBaseProps {
    leadingVisual?: React.FunctionComponent<any>
}

const tokenBorderWidthPx = 1;

const DefaultToken = styled(TokenBase)`
    background-color: ${get('colors.neutral.subtle')};
    border-color: ${props => props.isSelected ? get('colors.fg.default') : get('colors.border.subtle')};
    border-style: solid;
    border-width: 1px;
    color: ${props => props.isSelected ? get('colors.fg.default') : get('colors.fg.muted')};
    padding-right: ${props => (props.handleRemove || props.handleAdd) ? 0 : undefined};

    &:hover {
        background-color: ${props => isTokenHoverable(props) ? get('colors.neutral.muted') : undefined};
        box-shadow: ${props => isTokenHoverable(props) ? get('colors.shadow.medium') : undefined};
        color: ${props => isTokenHoverable(props) ? get('colors.fg.default') : undefined};
    }
`;

// TODO: make this text truncate
const TokenTextContainer = styled('span')`
    flex-grow: 1;
    white-space: nowrap;
`;

const LeadingVisualContainer = styled('span')`
    flex-shrink: 0;
    line-height: 0;
`;

const Token: React.FC<Props> = ({
    /**
     * A function that renders a component before the token text
     */
    leadingVisual: LeadingVisual,
    ...tokenBaseProps
}) => {
    const { handleRemove, handleAdd, text, as, variant } = tokenBaseProps;

    return (
        <DefaultToken {...tokenBaseProps}>
            {LeadingVisual ? (
                <LeadingVisualContainer>
                    <LeadingVisual />
                </LeadingVisualContainer>
            ) : null}
            <TokenTextContainer>{text}</TokenTextContainer>
            {handleRemove ? (
                <RemoveTokenButton
                    borderOffset={tokenBorderWidthPx}
                    parentTokenTag={as || 'span'}
                    tabIndex={-1}
                    onClick={handleRemove}
                    variant={variant}
                />
            ) : null}
        </DefaultToken>
    )
};

export default Token;

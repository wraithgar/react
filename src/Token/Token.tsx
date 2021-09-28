import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { get } from '../constants'
import TokenBase, { isTokenHoverable, TokenBaseProps } from './TokenBase'
import RemoveTokenButton from './_RemoveTokenButton'

export interface TokenProps extends TokenBaseProps {
    /**
     * A function that renders a component before the token text
     */
    leadingVisual?: React.FunctionComponent<any>
}

const tokenBorderWidthPx = 1;

const DefaultToken = styled(TokenBase)`
    background-color: ${get('colors.neutral.subtle')};
    border-color: ${props => props.isSelected ? get('colors.fg.default') : get('colors.border.subtle')};
    border-style: solid;
    border-width: 1px;
    color: ${props => props.isSelected ? get('colors.fg.default') : get('colors.fg.muted')};
    max-width: 100%;
    padding-right: ${props => (props.handleRemove) ? 0 : undefined};

    &:hover {
        background-color: ${props => isTokenHoverable(props) ? get('colors.neutral.muted') : undefined};
        box-shadow: ${props => isTokenHoverable(props) ? get('colors.shadow.medium') : undefined};
        color: ${props => isTokenHoverable(props) ? get('colors.fg.default') : undefined};
    }
`;

const TokenTextContainer = styled('span')`
    flex-grow: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const LeadingVisualContainer = styled('span')`
    flex-shrink: 0;
    line-height: 0;
`;

const Token = forwardRef<HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement, TokenProps>(({
    as,
    handleRemove,
    id,
    leadingVisual: LeadingVisual,
    ref,
    text,
    variant,
    ...resizeTo
}, forwardedRef) => (
    <DefaultToken
        as={as}
        handleRemove={handleRemove}
        id={id?.toString()}
        text={text}
        ref={forwardedRef}
        variant={variant}
        {...resizeTo}
    >
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
));

export default Token;

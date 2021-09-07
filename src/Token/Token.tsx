import React from 'react'
import styled from 'styled-components'
import { get } from '../constants'
import TokenBase, { TokenBaseProps } from './TokenBase'
import RemoveTokenButton from './_RemoveTokenButton'

interface Props extends TokenBaseProps {
    leadingVisual?: React.FunctionComponent<any>
}

const tokenBorderWidthPx = 1;

const DefaultToken = styled(TokenBase)`
    background-color: ${props => props.isSelected ? get('colors.fade.fg10') : 'transparent'};
    border-width: ${tokenBorderWidthPx}px;
    border-style: solid;
    border-color: ${props => props.isSelected ? get('colors.border.tertiary') : get('colors.border.primary')};
    padding-right: ${props => props.handleRemove ? 0 : undefined};

    > .RemoveTokenButton {
        transform: translate(${tokenBorderWidthPx}px, -${tokenBorderWidthPx}px);
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
    leadingVisual: LeadingVisual,
    ...tokenBaseProps
}) => {
    const { handleRemove, text, as, variant } = tokenBaseProps;

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

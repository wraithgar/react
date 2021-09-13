import React from 'react'
import styled from 'styled-components'
import { get } from '../constants'
import TokenBase, { TokenBaseProps } from './TokenBase'
import AddTokenButton from './_AddTokenButton'
import RemoveTokenButton from './_RemoveTokenButton'

interface Props extends TokenBaseProps {
    leadingVisual?: React.FunctionComponent<any>
}

const tokenBorderWidthPx = 1;

//
// Very "plain" style - just a border
//
// const DefaultToken = styled(TokenBase)`
//     background-color: ${props => props.isSelected ? get('colors.fade.fg10') : 'transparent'};
//     border-width: ${tokenBorderWidthPx}px;
//     border-style: solid;
//     border-color: ${props => props.isSelected ? get('colors.border.tertiary') : get('colors.border.primary')};
//     padding-right: ${props => props.handleRemove ? 0 : undefined};

//     > ._TokenButton {
//         transform: translate(${tokenBorderWidthPx}px, -${tokenBorderWidthPx}px);
//     }
// `;

const DefaultToken = styled(TokenBase)`
    background-color: ${get('colors.accent.subtle')};
    border-color: ${props => props.isSelected ? get('colors.accent.fg') : get('colors.accent.subtle')};
    border-style: solid;
    border-width: ${props => props.isSelected ? '1px' : 0};
    color: ${get('colors.accent.fg')};
    padding-right: ${props => (props.handleRemove || props.handleAdd) ? 0 : undefined};

    &:hover {
        background-color: ${get('colors.accent.muted')};
    }

    > ._TokenButton {
        color: ${get('colors.accent.fg')};
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
                    parentTokenTag={as || 'span'}
                    tabIndex={-1}
                    onClick={handleRemove}
                    variant={variant}
                />
            ) : null}
            {handleAdd ? (
                <AddTokenButton
                    parentTokenTag={as || 'span'}
                    tabIndex={-1}
                    onClick={handleAdd}
                    variant={variant}
                />
            ) : null}
        </DefaultToken>
    )
};

export default Token;

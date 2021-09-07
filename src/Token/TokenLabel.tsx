import React from 'react'
import styled from 'styled-components'
import { get } from '../constants'
import TokenBase, { TokenBaseProps } from './TokenBase'
import RemoveTokenButton from './_RemoveTokenButton'
import tinycolor from 'tinycolor2'

interface Props extends TokenBaseProps {
    fillColor?: string
    isOutlined?: boolean // NOTE: different from `outline` prop on the label component because `isOutlined` sounds more like a boolean prop
}

const tokenBorderWidthPx = 1;
const defaultLightTextPrimitivesPath = 'colors.text.inverse';
const defaultDarkTextPrimitivesPath = 'colors.text.primary';

const getLabelTextColor = (
    fillColor: Props['fillColor'],
    isOutlined: Props['isOutlined']
) => {
    const bgColor = tinycolor(fillColor);

    if (isOutlined) {
        return fillColor
    }

    // TODO: come up with a better way to get a readable text color
    if (bgColor.isDark()) {
        return get(defaultLightTextPrimitivesPath)
    }

    return get(defaultDarkTextPrimitivesPath)
}

const getLabelBgColor = (
    fillColor: Props['fillColor'],
    isOutlined: Props['isOutlined'],
    isSelected: Props['isSelected']
) => {
    if (isOutlined) {
        if (isSelected) {
            return get('colors.fade.fg10')
        }

        return 'transparent'
    }

    if (fillColor) {
        return fillColor
    }

    return get('colors.label.primary.border');
}

const StyledTokenLabel = styled(TokenBase)<Props>`
  background-color: ${props => getLabelBgColor(props.fillColor, props.isOutlined, props.isSelected)};
  border-width: ${tokenBorderWidthPx}px;
  border-style: solid;
  border-color: ${props => props.fillColor};
  box-shadow: ${props => props.isSelected ? `0 0 0 2px ${props.fillColor}` : undefined};
  color: ${props => getLabelTextColor(props.fillColor || '#000', props.isOutlined) || get(defaultLightTextPrimitivesPath)};
  overflow: hidden;
  padding-right: ${props => props.handleRemove ? 0 : undefined};
  position: relative;

  > * {
      opacity: ${props => props.isSelected ? 0.8 : undefined};
  }

  > .RemoveTokenButton {
    color: currentColor;
    transform: translate(${tokenBorderWidthPx}px, -${tokenBorderWidthPx}px);
  }
`;

// // TODO: come up with a way to darken the passed color with JS by interpolating get('color.path')
// //       instead of using this weird pseudo-element hack that won't work with light colors.
// // OR just use opacity or some other property that doesn't depend on running JS on the color primitive's value
// &:before {
//     background-color: ${get('colors.fade.fg15')};
//     content: '';
//     display: ${props => props.isSelected ? 'block' : 'none'};
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
// }

// TODO: make this text truncate
const TokenTextContainer = styled('span')`
    white-space: nowrap;
    z-index: 1;
`;

const TokenLabel: React.FC<Props> = ({
    isOutlined,
    fillColor,
    ...tokenBaseProps
}) => {
    const { handleRemove, text, as, variant } = tokenBaseProps;

    return (
        <StyledTokenLabel
            isOutlined={isOutlined}
            fillColor={fillColor}
            {...tokenBaseProps}
        >
            <TokenTextContainer>{text}</TokenTextContainer>
            {handleRemove ? (
                <RemoveTokenButton
                    parentTokenTag={as || 'span'}
                    tabIndex={-1}
                    onClick={handleRemove}
                    variant={variant}
                />
            ) : null}
        </StyledTokenLabel>
    )
};

export default TokenLabel;

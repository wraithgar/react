import styled from 'styled-components'
import { get } from '../constants';
import { BadgeSizeKeys, badgeVariants } from './_badgeStyleUtils';

type BadgeColorOptions =
    | 'default'
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'

interface Props {
    color?: BadgeColorOptions
    variant?: BadgeSizeKeys
}

interface BadgeColorConfig {
    borderColor: (props: Props) => React.CSSProperties['color']
    textColor?: (props: Props) => React.CSSProperties['color']
}

const badgeColorMap: Record<BadgeColorOptions, BadgeColorConfig> = {
    default: {
        borderColor: get('colors.border.default')
    },
    primary: {
        borderColor: get('colors.fg.default')
    },
    secondary: {
        borderColor: get('colors.border.muted'),
        textColor: get('colors.fg.muted'),
    },
    info: {
        borderColor: get('colors.accent.fg'),
        textColor: get('colors.accent.fg'),
    },
    success: {
        borderColor: get('colors.success.fg'),
        textColor: get('colors.success.emphasis'),
    },
    warning: {
        borderColor: get('colors.attention.fg'),
        textColor: get('colors.attention.emphasis'),
    },
    danger: {
        borderColor: get('colors.danger.fg'),
        textColor: get('colors.danger.emphasis'),
    },
}

const Badge = styled.span<Props>`
    align-items: center;
    background-color: transparent;
    border-width: 1px;
    border-radius: 999px;
    border-style: solid;
    border-color: ${({color = 'default'}) => badgeColorMap[color].borderColor};
    color: ${({color = 'default'}) => badgeColorMap[color].textColor};
    display: inline-flex;
    font-weight: ${get('fontWeights.bold')};
    line-height: 1;
    white-space: nowrap;
    ${badgeVariants};
`;

Badge.defaultProps = {
    variant: 'sm',
    color: 'default'
}

export default Badge;

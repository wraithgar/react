import { IconProps } from '@primer/octicons-react';
import styled from 'styled-components'
import { get } from '../constants';
import { BadgeSizeKeys, badgeVariants } from './_badgeStyleUtils';

// TODO: consider making these a little less specific by using:
// 'default' | 'success' | 'done' | 'danger'
type BadgeStateColorOptions =
    | 'default'
    | 'open'
    | 'merged'
    | 'closed'

interface Props {
    color?: BadgeStateColorOptions
    // TODO: consider removing the `icon` prop, and just infer the correct icon based on `color` and `variant`
    icon?: React.ComponentType<{size?: IconProps['size']}>
    variant?: BadgeSizeKeys
}

const badgeStateColorMap: Record<BadgeStateColorOptions, (props: Props) => React.CSSProperties['color']> = {
    default: get('colors.neutral.emphasis'),
    open: get('colors.success.emphasis'),
    merged: get('colors.done.emphasis'),
    closed: get('colors.danger.emphasis'),
}

// const badgeStateIconSizeMap: Record<BadgeSizeKeys, number> = {
//     'sm':
// };

const StyledBadgeState = styled.span<Props>`
    align-items: center;
    background-color: ${({color = 'default'}) => badgeStateColorMap[color]};
    border-radius: 999px;
    color: ${get('colors.fg.onEmphasis')};
    display: inline-flex;
    font-weight: ${get('fontWeights.bold')};
    gap: ${get('space.1')};
    line-height: 1;
    white-space: nowrap;
    ${badgeVariants};
`;

const BadgeState: React.FC<Props> = ({children, icon: IconComponent, variant, ...rest}) => (
    <StyledBadgeState variant={variant} {...rest}>
        {IconComponent ? (
            <>
                <IconComponent size={variant === 'sm' ? 12 : 'small'} />
                {children}
            </>
        ) : children}
    </StyledBadgeState>
)

BadgeState.defaultProps = {
    variant: 'lg',
    color: 'default'
}

export default BadgeState;

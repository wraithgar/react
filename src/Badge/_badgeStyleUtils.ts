import { variant } from 'styled-system'

export type BadgeSizeKeys = 'sm' | 'md' | 'lg';

// TODO: consider moving to Primitives
export const badgeSizes: Record<BadgeSizeKeys, number> = {
    sm: 20,
    md: 24,
    lg: 32,
};

export const badgeVariants = variant<{fontSize: number, height: string, paddingLeft: number, paddingRight: number}, BadgeSizeKeys>({
    variants: {
      sm: {
        fontSize: 0,
        height: `${badgeSizes.sm}px`,
        paddingLeft: 2,
        paddingRight: 2,
      },
      md: {
        fontSize: 0,
        height: `${badgeSizes.md}px`,
        paddingLeft: 2,
        paddingRight: 2,
      },
      lg: {
        fontSize: 1,
        height: `${badgeSizes.lg}px`,
        paddingLeft: 3,
        paddingRight: 3,
      },
    }
  })
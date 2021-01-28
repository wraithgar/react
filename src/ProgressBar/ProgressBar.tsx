import React from 'react'
import {Bar, BarProps} from './Bar'
import {ProgressContainer, ProgressContainerProps} from './ProgressContainer'
import defaultTheme from '../theme'

export interface ProgressBarProps extends ProgressContainerProps, BarProps {}

export default function ProgressBar({
  progress,
  bg = 'green.5',
  theme = defaultTheme,
  ...rest
}: ProgressBarProps): JSX.Element {
  return (
    <ProgressContainer theme={theme} {...rest}>
      <Bar progress={progress} bg={bg} theme={theme} />
    </ProgressContainer>
  )
}

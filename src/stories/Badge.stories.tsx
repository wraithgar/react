import React from 'react'
import {Meta} from '@storybook/react'
import { GitMergeIcon, GitPullRequestIcon } from '@primer/octicons-react'

import { get } from '../constants'
import { BaseStyles, ThemeProvider } from '..'
import Box from '../Box'
import Text from '../Text'

import Badge from '../Badge/Badge'
import BadgeState from '../Badge/BadgeState'

export default {
  title: 'Prototyping/Badges',

  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ]
} as Meta

const SingleExampleContainer: React.FC<{ label?: string }> = ({children, label}) => (
    <Box
        display="flex" sx={{
            alignItems: 'start',
            flexDirection: 'column',
            gap: get('space.0'),
        }}
    >
        {label ? (
            <Text fontSize={0} color="text.tertiary">{label}</Text>
        ) : null}
        <Box
            display="flex" sx={{
                alignItems: 'start',
                gap: get('space.1'),
            }}
        >
            {children}
        </Box>
    </Box>
);

const ExampleCollectionContainer: React.FC = ({children}) => (
    <Box display="flex" sx={{
        alignItems: 'start',
        flexDirection: 'column',
        gap: get('space.6'),
    }}>
        {children}
    </Box>
);

export const badge = () => (
    <ExampleCollectionContainer>
        <SingleExampleContainer label="Neutral colors">
            <Badge>Default</Badge>
            <Badge color="primary">Primary</Badge>
            <Badge color="secondary">Secondary</Badge>
        </SingleExampleContainer>
        <SingleExampleContainer label="Functional colors">
            <Badge color="info">Info</Badge>
            <Badge color="success">Success</Badge>
            <Badge color="warning">Warning</Badge>
            <Badge color="danger">Danger</Badge>
        </SingleExampleContainer>
    </ExampleCollectionContainer>
)

export const badgeState = () => (
    <ExampleCollectionContainer>
        <SingleExampleContainer label="States">
            <BadgeState color="default">Info</BadgeState>
            <BadgeState color="open" icon={GitPullRequestIcon}>Success</BadgeState>
            <BadgeState color="merged" icon={GitMergeIcon}>Warning</BadgeState>
            <BadgeState color="closed" icon={GitPullRequestIcon}>Danger</BadgeState>
        </SingleExampleContainer>
    </ExampleCollectionContainer>
)

export const badgeStateSizes = () => (
    <ExampleCollectionContainer>
        <SingleExampleContainer label="Small">
            <BadgeState color="default" variant="sm">Info</BadgeState>
            <BadgeState color="open" icon={GitPullRequestIcon} variant="sm">Success</BadgeState>
            <BadgeState color="merged" icon={GitMergeIcon} variant="sm">Warning</BadgeState>
            <BadgeState color="closed" icon={GitPullRequestIcon} variant="sm">Danger</BadgeState>
        </SingleExampleContainer>
        <SingleExampleContainer label="Medium">
            <BadgeState color="default" variant="md">Info</BadgeState>
            <BadgeState color="open" icon={GitPullRequestIcon} variant="md">Success</BadgeState>
            <BadgeState color="merged" icon={GitMergeIcon} variant="md">Warning</BadgeState>
            <BadgeState color="closed" icon={GitPullRequestIcon} variant="md">Danger</BadgeState>
        </SingleExampleContainer>
        <SingleExampleContainer label="Large">
            <BadgeState color="default" variant="lg">Info</BadgeState>
            <BadgeState color="open" icon={GitPullRequestIcon} variant="lg">Success</BadgeState>
            <BadgeState color="merged" icon={GitMergeIcon} variant="lg">Warning</BadgeState>
            <BadgeState color="closed" icon={GitPullRequestIcon} variant="lg">Danger</BadgeState>
        </SingleExampleContainer>
    </ExampleCollectionContainer>
)

export const badgeSizes = () => (
    <ExampleCollectionContainer>
        <SingleExampleContainer label="Size options">
            <Badge variant="sm">Small (default)</Badge>
            <Badge variant="md">Medium</Badge>
            <Badge variant="lg">Large</Badge>
        </SingleExampleContainer>
    </ExampleCollectionContainer>
)

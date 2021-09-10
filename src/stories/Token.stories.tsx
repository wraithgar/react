import React from 'react'
import styled from 'styled-components'
import {Meta} from '@storybook/react'
import { VerifiedIcon } from '@primer/octicons-react'

import { get } from '../constants'
import { BaseStyles, ThemeProvider } from '..'
import Box from '../Box'
import Token from '../Token/Token'
import TokenProfile from '../Token/TokenProfile'
import TokenLabel from '../Token/TokenLabel'
import TokenTopic from '../Token/TokenTopic'
import Text from '../Text'

export default {
  title: 'Prototyping/Token',

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
        {children}
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

const CollectionOfCollectionsContainer = styled('div')`
    > * + * {
        border-top: 1px solid black;
        margin-top: 2.5rem;
        padding-top: 2.5rem;
    }
`;

export const defaultToken = () => (
    <ExampleCollectionContainer>
        <SingleExampleContainer label="Resting">
            <Token text="Default Token" />
        </SingleExampleContainer>
        <SingleExampleContainer label="w/ onRemove passed">
            <Token text="Default Token" handleRemove={() => { console.log('remove me') }} />
        </SingleExampleContainer>
        <SingleExampleContainer label="w/ leadingVisual passed">
            <Token text="Default Token" leadingVisual={() => <VerifiedIcon size={12} />} />
        </SingleExampleContainer>
        <SingleExampleContainer label="isSelected">
            <Token text="Default Token" isSelected={true} />
        </SingleExampleContainer>
    </ExampleCollectionContainer>
)

export const profileToken = () => (
    <ExampleCollectionContainer>
        <SingleExampleContainer label="Resting">
            <TokenProfile variant="lg" avatarSrc="https://avatars.githubusercontent.com/mperrotti" text="Mike Perrotti" />
        </SingleExampleContainer>
        <SingleExampleContainer label="w/ onRemove passed">
            <TokenProfile variant="lg" avatarSrc="https://avatars.githubusercontent.com/mperrotti" text="Mike Perrotti" handleRemove={() => { console.log('remove me') }} />
        </SingleExampleContainer>
        <SingleExampleContainer label="isSelected">
            <TokenProfile variant="lg" avatarSrc="https://avatars.githubusercontent.com/mperrotti" text="Mike Perrotti" isSelected={true} />
        </SingleExampleContainer>
    </ExampleCollectionContainer>
)

export const labelToken = () => (
    <CollectionOfCollectionsContainer>
        <ExampleCollectionContainer>
            <SingleExampleContainer label="Default (no fill color passed)">
                <TokenLabel text="Mike Perrotti" />
            </SingleExampleContainer>
            <SingleExampleContainer label="Default (#656BFE fill color passed)">
                <TokenLabel text="Mike Perrotti" fillColor="#656BFE" />
            </SingleExampleContainer>
            <SingleExampleContainer label="onRemove passed">
                <TokenLabel text="Mike Perrotti" fillColor="#656BFE" handleRemove={() => { console.log('remove me') }} />
            </SingleExampleContainer>
            <SingleExampleContainer label="isSelected">
                <TokenLabel text="Mike Perrotti" fillColor="#656BFE" isSelected={true} handleRemove={() => { console.log('remove me') }} />
            </SingleExampleContainer>
            <SingleExampleContainer label="Automatically picks a readable text color based on fill color">
                <Box display="flex" sx={{ gap: get('space.2') }}>
                    <TokenLabel text="Mike Perrotti" fillColor="#656BFE" />
                    <TokenLabel text="Mike Perrotti" fillColor="#FFF06C" />
                </Box>
            </SingleExampleContainer>
        </ExampleCollectionContainer>
    </CollectionOfCollectionsContainer>
)

export const sizes = () => (
    <ExampleCollectionContainer>
        <SingleExampleContainer label="default Token component">
            <Box display="flex" sx={{
                alignItems: 'start',
                gap: get('space.2'),
            }}>
                <Token variant="sm" text="SM Token" />
                <Token variant="md" text="MD Token" />
                <Token variant="lg" text="LG Token (default)" />
                <Token variant="xl" text="XL Token" />
            </Box>
        </SingleExampleContainer>
    </ExampleCollectionContainer>
);

import React, { useCallback, useState } from 'react'
import {Meta} from '@storybook/react'

import { BaseStyles, Box, ThemeProvider } from '..'
import TextInputTokens from '../TextInputTokens';

export default {
  title: 'Prototyping/Text Input with Tokens',

  decorators: [
    Story => {
      const [lastKey, setLastKey] = useState('none')
      const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        setLastKey(event.key)
      }, [])

      return (
        <ThemeProvider>
          <BaseStyles>
            <Box onKeyDownCapture={reportKey}>
              <Box position="absolute" right={5} top={2}>
                Last key pressed: {lastKey}
              </Box>
              <Box paddingTop={5}>
                <Story />
              </Box>
            </Box>
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ]
} as Meta

const mockTokens = [
  { text: 'zero', id: 0 },
  { text: 'one', id: 1 },
];

export const Default = () => {
    const [tokens, setTokens] = useState(mockTokens)
    const onTokenRemove: (tokenId: string | number) => void = (tokenId) => {
        setTokens(tokens.filter(token => token.id !== tokenId))
    };

    return (
      <TextInputTokens
          tokens={tokens}
          onTokenRemove={onTokenRemove}
      />
    )
};

export const Unstyled = () => {
  const [tokens, setTokens] = useState(mockTokens)
  const onTokenRemove: (tokenId: string | number) => void = (tokenId) => {
      setTokens(tokens.filter(token => token.id !== tokenId))
  };

  return (
    <TextInputTokens
        tokens={tokens}
        onTokenRemove={onTokenRemove}
        // TODO: come up with a nicer way to unstyle an input component
        sx={{
          'border': '0',
          'padding': '0',
          'boxShadow': 'none',
          ':focus-within': {
            'border': '0',
            'boxShadow': 'none',
          }
        }}
    />
  )
};

import React, { useCallback, useState } from 'react'
import {Meta} from '@storybook/react'
import { PlusIcon } from '@primer/octicons-react'

import { BaseStyles, Box, ThemeProvider } from '..'
import TextInputWithTokens, { TextInputWithTokensProps } from '../TextInputWithTokens';
import { ItemProps } from '../ActionList';
import TokenLabel from '../Token/TokenLabel';
import TextInputTokens from '../TextInputTokens';

interface Token {
    text?: string;
    id: string | number;
}

const items = [
    { text: 'zero', id: 0 },
    { text: 'one', id: 1 },
    { text: 'two', id: 2 },
    { text: 'three', id: 3 },
    { text: 'four', id: 4 },
    { text: 'five', id: 5 },
    { text: 'six', id: 6 },
    { text: 'seven', id: 7 },
    { text: 'twenty', id: 20 },
    { text: 'twentyone', id: 21 }
  ]

const labelItems = [
    { leadingVisual: getColorCircle('#a2eeef'), text: 'enhancement', id: 1, labelColor: '#a2eeef' },
    { leadingVisual: getColorCircle('#d73a4a'), text: 'bug', id: 2, labelColor: '#d73a4a' },
    { leadingVisual: getColorCircle('#0cf478'), text: 'good first issue', id: 3, labelColor: '#0cf478' },
    { leadingVisual: getColorCircle('#ffd78e'), text: 'design', id: 4, labelColor: '#ffd78e' },
    { leadingVisual: getColorCircle('#ff0000'), text: 'blocker', id: 5, labelColor: '#ff0000' },
    { leadingVisual: getColorCircle('#a4f287'), text: 'backend', id: 6, labelColor: '#a4f287' },
    { leadingVisual: getColorCircle('#8dc6fc'), text: 'frontend', id: 7, labelColor: '#8dc6fc' },
];

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

function getColorCircle(color: string) {
    return function () {
      return (
        <Box
          bg={color}
          borderColor={color}
          width={14}
          height={14}
          borderRadius={10}
          margin="auto"
          borderWidth="1px"
          borderStyle="solid"
        />
      )
    }
  }

export const Default = () => {
    const [tokens, setTokens] = useState<Token[]>(mockTokens)
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

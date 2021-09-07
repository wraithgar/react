import React, { useCallback, useState } from 'react'
import {Meta} from '@storybook/react'

import { BaseStyles, Box, ThemeProvider } from '..'
import TextInputWithTokens, { TextInputWithTokensProps } from '../TextInputWithTokens';
import { ItemProps } from '../ActionList';
import TokenLabel from '../Token/TokenLabel';

interface Token {
    text?: string;
    id: string | number;
}

const items = [
    { text: 'zero', id: 8 },
    { text: 'one', id: 9 },
    { text: 'two', id: 10 },
    { text: 'three', id: 11 },
    { text: 'four', id: 1 },
    { text: 'five', id: 2 },
    { text: 'six', id: 3 },
    { text: 'seven', id: 4 },
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
  title: 'Prototyping/Token Select',

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

const mockTokens = [
    {
        id: 0,
        text: 'zero'
    },
    {
        id: 1,
        text: 'one'
    },
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

export const TokenSelect = () => {
    const [filter, setFilter] = useState<string>('')
    const [tokens, setTokens] = useState<Token[]>(mockTokens)
    const [lastKey, setLastKey] = useState('none')
    const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
      setLastKey(event.key)
    }, [])
    const selectedTexts = tokens.map((item) => item.text);
    const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()) && !selectedTexts.includes(item.text))
    const onItemSelect: ItemProps['onAction'] = ({id, text}) => {
        // TODO: just make `id` required
        setTokens([...tokens, {id: id || 'someUniqueId', text}])
    };
    const onTokenRemove: (tokenId: string | number) => void = (tokenId) => {
        setTokens(tokens.filter(token => token.id !== tokenId))
    };

    return (
        <Box onKeyDownCapture={reportKey}>
            <Box position="absolute" right={5} top={2}>
                Last key pressed: {lastKey}
            </Box>
            <Box paddingTop={5}>
                <TextInputWithTokens
                    onFilterChange={setFilter}
                    tokens={tokens}
                    selectableItems={filteredItems}
                    onItemSelect={onItemSelect}
                    onTokenRemove={onTokenRemove}
                />
            </Box>
        </Box>
    )
};

export const TokenLabelSelect = () => {
    const [filter, setFilter] = useState<string>('')
    const [tokens, setTokens] = useState<Token[]>([])
    const [lastKey, setLastKey] = useState('none')
    const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
      setLastKey(event.key)
    }, [])
    const selectedTexts = tokens.map((item) => item.text);
    const filteredItems = labelItems.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()) && !selectedTexts.includes(item.text))
    const onItemSelect: ItemProps['onAction'] = ({id, text, labelColor}) => {
        // TODO: just make `id` required
        setTokens([...tokens, {id: id || 'someUniqueId', text, labelColor}])
    };
    const onTokenRemove: (tokenId: string | number) => void = (tokenId) => {
        setTokens(tokens.filter(token => token.id !== tokenId))
    };

    return (
        <Box onKeyDownCapture={reportKey}>
            <Box position="absolute" right={5} top={2}>
                Last key pressed: {lastKey}
            </Box>
            <Box paddingTop={5}>
                <TextInputWithTokens
                    onFilterChange={setFilter}
                    tokens={tokens}
                    selectableItems={filteredItems}
                    onItemSelect={onItemSelect}
                    onTokenRemove={onTokenRemove}
                    tokenComponent={TokenLabel}
                />
            </Box>
        </Box>
    )
};

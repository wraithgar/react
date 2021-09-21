import React, { useCallback, useState } from 'react'
import {Meta} from '@storybook/react'

import { BaseStyles, Box, ThemeProvider } from '..'
import { ItemProps } from '../ActionList';
import TextInputTokens from '../TextInputTokens';
import Autocomplete from '../Autocomplete/Autocomplete';

interface Token {
    text?: string;
    id: string | number;
}

const items = [
    { text: 'zero', id: 0, disabled: true },
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
  title: 'Prototyping/Autocomplete',

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
  { text: 'two', id: 2 },
  { text: 'three', id: 3 },
  { text: 'four', id: 4 },

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
    return (
        <Autocomplete>
          <Autocomplete.Input />
          <Autocomplete.Menu
            items={items}
            selectedItemIds={[]}
          />
        </Autocomplete>
    )
};

export const TokenSelect = () => {
    // TODO: consider migrating this boilerplate to a hook
    const [tokens, setTokens] = useState<Token[]>(mockTokens)
    const selectedTokenIds = tokens.map(token => token.id);
    const [selectedItemIds, setSelectedItemIds] = useState<Array<number | string>>(selectedTokenIds);
    const onTokenRemove: (tokenId: string | number) => void = (tokenId) => {
        setTokens(tokens.filter(token => token.id !== tokenId));
        setSelectedItemIds(selectedItemIds.filter(id => id !== tokenId));
    };
    const onItemSelect: ItemProps['onAction'] = ({id, text}) => {
        // TODO: just make `id` required
        if (id || id === 0) {
            setTokens([...tokens, {id, text}])
            setSelectedItemIds([...selectedItemIds, id])
        }
    };
    const onItemDeselect: ItemProps['onAction'] = ({id}) => {
        // TODO: just make `id` required
        if (id || id === 0) {
            onTokenRemove(id)
            setSelectedItemIds(selectedItemIds.filter(selectedItemId => selectedItemId !== id))
        }
    };

    return (
        <Autocomplete>
          <Autocomplete.Input
            as={TextInputTokens}
            tokens={tokens}
            onTokenRemove={onTokenRemove}
          />
          <Autocomplete.Menu
            items={items}
            selectedItemIds={selectedItemIds}
            onItemSelect={onItemSelect}
            onItemDeselect={onItemDeselect}
            selectionVariant="multiple"
          />
        </Autocomplete>
    )
};
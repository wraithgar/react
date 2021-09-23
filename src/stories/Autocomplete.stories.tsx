import React, { useCallback, useEffect, useState } from 'react'
import { Meta } from '@storybook/react'

import { BaseStyles, Box, ThemeProvider } from '..'
import TextInputTokens from '../TextInputTokens'
import Autocomplete from '../Autocomplete/Autocomplete'
import TokenLabel from '../Token/TokenLabel'
import { getDefaultItemFilter } from '../Autocomplete/AutocompleteMenu'

type Datum = {
  id: string | number
  text?: string
  fillColor?: string
  selected?: boolean
}

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

const items: Datum[] = [
    { text: 'zero', id: 0 },
    { text: 'one', id: 1 },
    { text: 'twe', id: 22 },
    { text: 'two', id: 2 },
    { text: 'twb', id: 23 },
    { text: 'three', id: 3 },
    { text: 'four', id: 4 },
    { text: 'five', id: 5 },
    { text: 'six', id: 6 },
    { text: 'seven', id: 7 },
    { text: 'twenty', id: 20 },
    { text: 'twentyone', id: 21 }
]

const labelItems = [
  { leadingVisual: getColorCircle('#a2eeef'), text: 'enhancement', id: 1, fillColor: '#a2eeef' },
  { leadingVisual: getColorCircle('#d73a4a'), text: 'bug', id: 2, fillColor: '#d73a4a' },
  { leadingVisual: getColorCircle('#0cf478'), text: 'good first issue', id: 3, fillColor: '#0cf478' },
  { leadingVisual: getColorCircle('#ffd78e'), text: 'design', id: 4, fillColor: '#ffd78e' },
  { leadingVisual: getColorCircle('#ff0000'), text: 'blocker', id: 5, fillColor: '#ff0000' },
  { leadingVisual: getColorCircle('#a4f287'), text: 'backend', id: 6, fillColor: '#a4f287' },
  { leadingVisual: getColorCircle('#8dc6fc'), text: 'frontend', id: 7, fillColor: '#8dc6fc' },
]

const mockTokens: Datum[] = [
  { text: 'zero', id: 0 },
  { text: 'one', id: 1 },
  { text: 'three', id: 3 },
  { text: 'four', id: 4 },
]

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
}

export const MultiSelectWithTokenInput = () => {
  // TODO: consider migrating this boilerplate to a hook
  const [tokens, setTokens] = useState<Datum[]>(mockTokens)
  const selectedTokenIds = tokens.map(token => token.id)
  const [selectedItemIds, setSelectedItemIds] = useState<Array<string | number>>(selectedTokenIds)
  const onTokenRemove: (tokenId: string | number) => void = (tokenId) => {
      setTokens(tokens.filter(token => token.id !== tokenId))
      setSelectedItemIds(selectedItemIds.filter(id => id !== tokenId))
  }
  const onItemSelect: (item: Datum) => void = (item) => {
      setTokens([...tokens, item])
      setSelectedItemIds([...selectedItemIds, item.id])
  }
  const onItemDeselect: (item: Datum) => void = (item) => {
    onTokenRemove(item.id)
    setSelectedItemIds(selectedItemIds.filter(selectedItemId => selectedItemId !== item.id))
  }

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
}

export const MultiSelectAddNewItem = () => {
  const [localItemsState, setLocalItemsState] = useState<Datum[]>(items);
  const [filterVal, setFilterVal] = useState<string>('');
  const [tokens, setTokens] = useState<Datum[]>(mockTokens)
  const selectedTokenIds = tokens.map(token => token.id)
  const [selectedItemIds, setSelectedItemIds] = useState<Array<string | number>>(selectedTokenIds)
  const onTokenRemove: (tokenId: string | number) => void = (tokenId) => {
      setTokens(tokens.filter(token => token.id !== tokenId))
      setSelectedItemIds(selectedItemIds.filter(id => id !== tokenId))
  }
  const onItemSelect: (item: Datum) => void = (item) => {
      setTokens([...tokens, item])
      setSelectedItemIds([...selectedItemIds, item.id])
      
      if (!localItemsState.some(localItem => localItem.id === item.id)) {
        setLocalItemsState([
          ...localItemsState,
          item
        ])
      }
  }
  const onItemDeselect: (item: Datum) => void = (item) => {
    onTokenRemove(item.id)
    setSelectedItemIds(selectedItemIds.filter(selectedItemId => selectedItemId !== item.id))
  }

  return (
      <Autocomplete>
        <Autocomplete.Input
          as={TextInputTokens}
          tokens={tokens}
          onTokenRemove={onTokenRemove}
          onChange={e => {
            setFilterVal(e.currentTarget.value)
          }}
        />
        <Autocomplete.Menu
          addNewItem={
            filterVal && 
            !localItemsState.map(localItem => localItem.text).includes(filterVal)
              ? {
                text: `Add '${filterVal}'`,
                handleAddItem: (item) => {
                  onItemSelect({
                    ...item,
                    text: filterVal,
                    selected: true
                  })
                  setFilterVal('');
                }
              }
            : undefined
          }
          items={localItemsState}
          selectedItemIds={selectedItemIds}
          onItemSelect={onItemSelect}
          onItemDeselect={onItemDeselect}
          selectionVariant="multiple"

        />
      </Autocomplete>
  )
}

// TODO: remove this when I'm done testing token select functionality
// export const TokenLabelSelect = () => {
//     // TODO: consider migrating this boilerplate to a hook
//     const [tokens, setTokens] = useState<Datum[]>([])
//     const selectedTokenIds = tokens.map(token => token.id);
//     const [selectedItemIds, setSelectedItemIds] = useState<Array<string | number>>(selectedTokenIds);
//     const onTokenRemove: (tokenId: string | number) => void = (tokenId) => {
//         setTokens(tokens.filter(token => token.id !== tokenId));
//         setSelectedItemIds(selectedItemIds.filter(id => id !== tokenId));
//     };
//     const onItemSelect: (item: Datum) => void = (item) => {
//         setTokens([...tokens, item])
//         setSelectedItemIds([...selectedItemIds, item.id])
//     };
//     const onItemDeselect: (item: Datum) => void = (item) => {
//       onTokenRemove(item.id)
//       setSelectedItemIds(selectedItemIds.filter(selectedItemId => selectedItemId !== item.id))
//     };

//     return (
//         <Autocomplete>
//           <Autocomplete.Input
//             as={TextInputTokens}
//             tokenComponent={TokenLabel}
//             tokens={tokens}
//             onTokenRemove={onTokenRemove}
//           />
//           <Autocomplete.Menu
//             items={labelItems}
//             selectedItemIds={selectedItemIds}
//             onItemSelect={onItemSelect}
//             onItemDeselect={onItemDeselect}
//             selectionVariant="multiple"
//           />
//         </Autocomplete>
//     )
// };
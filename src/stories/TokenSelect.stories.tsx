// import React, { useCallback, useState } from 'react'
// import {Meta} from '@storybook/react'
// import { PlusIcon } from '@primer/octicons-react'

// import { BaseStyles, Box, ThemeProvider } from '..'
// import TextInputWithTokens, { TextInputWithTokensProps } from '../TextInputWithTokens';
// import { ItemProps } from '../ActionList';
// import TokenLabel from '../Token/TokenLabel';

// interface Token {
//     text?: string;
//     id: string | number;
// }

// const items = [
//     { text: 'zero', id: 0 },
//     { text: 'one', id: 1 },
//     { text: 'two', id: 2 },
//     { text: 'three', id: 3 },
//     { text: 'four', id: 4 },
//     { text: 'five', id: 5 },
//     { text: 'six', id: 6 },
//     { text: 'seven', id: 7 },
//     { text: 'twenty', id: 20 },
//     { text: 'twentyone', id: 21 }
//   ]

// const labelItems = [
//     { leadingVisual: getColorCircle('#a2eeef'), text: 'enhancement', id: 1, labelColor: '#a2eeef' },
//     { leadingVisual: getColorCircle('#d73a4a'), text: 'bug', id: 2, labelColor: '#d73a4a' },
//     { leadingVisual: getColorCircle('#0cf478'), text: 'good first issue', id: 3, labelColor: '#0cf478' },
//     { leadingVisual: getColorCircle('#ffd78e'), text: 'design', id: 4, labelColor: '#ffd78e' },
//     { leadingVisual: getColorCircle('#ff0000'), text: 'blocker', id: 5, labelColor: '#ff0000' },
//     { leadingVisual: getColorCircle('#a4f287'), text: 'backend', id: 6, labelColor: '#a4f287' },
//     { leadingVisual: getColorCircle('#8dc6fc'), text: 'frontend', id: 7, labelColor: '#8dc6fc' },
// ];

// export default {
//   title: 'Prototyping/Token Select',

//   decorators: [
//     Story => {
//       const [lastKey, setLastKey] = useState('none')
//       const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
//         setLastKey(event.key)
//       }, [])

//       return (
//         <ThemeProvider>
//           <BaseStyles>
//             <Box onKeyDownCapture={reportKey}>
//               <Box position="absolute" right={5} top={2}>
//                 Last key pressed: {lastKey}
//               </Box>
//               <Box paddingTop={5}>
//                 <Story />
//               </Box>
//             </Box>
//           </BaseStyles>
//         </ThemeProvider>
//       )
//     }
//   ]
// } as Meta

// const mockTokens = [
//   { text: 'zero', id: 0 },
//   { text: 'one', id: 1 },
// ];

// const mockTokens_long = [
//   { text: 'zero', id: 0 },
//   { text: 'one', id: 1 },
//   { text: 'two', id: 2 },
//   { text: 'three', id: 3 },
//   { text: 'four', id: 4 },
//   { text: 'five', id: 5 },
//   { text: 'six', id: 6 },
//   { text: 'seven', id: 7 },
//   { text: 'eight', id: 8 },
//   { text: 'nine', id: 9 },
//   { text: 'ten', id: 10 },
//   { text: 'eleven', id: 11 },
//   { text: 'duplicatezero', id: 990 },
//   { text: 'duplicateone', id: 991 },
//   { text: 'duplicatetwo', id: 992 },
//   { text: 'duplicatethree', id: 993 },
//   { text: 'duplicatefour', id: 994 },
//   { text: 'duplicatefive', id: 995 },
//   { text: 'duplicatesix', id: 996 },
//   { text: 'duplicateseven', id: 997 },
//   { text: 'duplicateeight', id: 998 },
//   { text: 'duplicatenine', id: 999 },
//   { text: 'duplicateten', id: 1990 },
//   { text: 'duplicateeleven', id: 1991 },
//   { text: 'twenty', id: 20 },
//   { text: 'twentyone', id: 21 }
// ];

// function getColorCircle(color: string) {
//     return function () {
//       return (
//         <Box
//           bg={color}
//           borderColor={color}
//           width={14}
//           height={14}
//           borderRadius={10}
//           margin="auto"
//           borderWidth="1px"
//           borderStyle="solid"
//         />
//       )
//     }
//   }

// export const Default = () => {
//     const [filter, setFilter] = useState<string>('')
//     const [tokens, setTokens] = useState<Token[]>(mockTokens)
//     // const selectedTexts = tokens.map((item) => item.text);
//     const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase())) // && !selectedTexts.includes(item.text)
//     const onItemSelect: ItemProps['onAction'] = ({id = 'someUniqueId', text}) => {
//         // TODO: just make `id` required
//         setTokens([...tokens, {id, text}])
//     };
//     const onTokenRemove: (tokenId: string | number) => void = (tokenId) => {
//         setTokens(tokens.filter(token => token.id !== tokenId))
//     };

//     return (
//       <TextInputWithTokens
//           onFilterChange={setFilter}
//           tokens={tokens}
//           selectableItems={filteredItems}
//           onItemSelect={onItemSelect}
//           onTokenRemove={onTokenRemove}
//       />
//     )
// };

// export const ComboboxSortSelectedFirst = () => {
//   const [filter, setFilter] = useState<string>('')
//   const [tokens, setTokens] = useState<Token[]>([])
//   const [selectableItems, setSelectableItems] = useState<ItemProps[]>(items)
//   const filteredItems = selectableItems.filter(item => item?.text?.toLowerCase().startsWith(filter.toLowerCase()))
//   const isItemSelected = (item: ItemProps) => {
//     if (item.selected) {
//       return true;
//     }

//     return tokens.some((token) => token.id === item.id)
//   };
//   const onCloseOptionsList = () => {
//     setSelectableItems([...selectableItems].sort((itemA, itemB) => isItemSelected(itemA) === isItemSelected(itemB)
//       ? 0
//       : isItemSelected(itemA)
//         ? -1
//         : 1
//     ))
//   };
//   const onItemSelect: ItemProps['onAction'] = ({id = 'someUniqueId', text}) => {
//     // TODO: just make `id` required
//     setTokens([...tokens, {id, text}])
//   };
//   const onTokenRemove: (tokenId: string | number) => void = (tokenId) => {
//     setTokens(tokens.filter(token => token.id !== tokenId))
//   };

//   return (
//     <TextInputWithTokens
//         onFilterChange={setFilter}
//         tokens={tokens}
//         selectableItems={filteredItems}
//         onItemSelect={onItemSelect}
//         onTokenRemove={onTokenRemove}
//         onCloseOptionsList={onCloseOptionsList}
//     />
//   )
// };

// export const LabelSelect = () => {
//     const [filter, setFilter] = useState<string>('')
//     const [tokens, setTokens] = useState<Token[]>([])
//     const filteredItems = labelItems.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase())) // && !selectedTexts.includes(item.text)
//     const onItemSelect: ItemProps['onAction'] = ({id, text, labelColor}) => {
//         // TODO: just make `id` required
//         setTokens([...tokens, {id: id || 'someUniqueId', text, labelColor}])
//     };
//     const onTokenRemove: (tokenId: string | number) => void = (tokenId) => {
//         setTokens(tokens.filter(token => token.id !== tokenId))
//     };

//     return (
//       <TextInputWithTokens
//           onFilterChange={setFilter}
//           tokens={tokens}
//           selectableItems={filteredItems}
//           onItemSelect={onItemSelect}
//           onTokenRemove={onTokenRemove}
//           tokenComponent={TokenLabel}
//       />
//     )
// };

// export const CreateNewToken = () => {
//   const [filter, setFilter] = useState<string>('')
//   const [tokens, setTokens] = useState<Token[]>([])
//   const [selectableItems, setSelectableItems] = useState<ItemProps[]>([items[0], items[1]])
//   const filteredItems = selectableItems.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
//   const onItemSelect: ItemProps['onAction'] = ({id, text}) => {
//       // TODO: just make `id` required
//       setTokens([...tokens, {id: id || 'someUniqueId', text}])
//       if (!filteredItems.some(item => item.text === text)) {
//         setSelectableItems([...selectableItems, {id: id || `someUniqueId-${text}`, text, selected: true}])
//       }
//   };
//   const onTokenRemove: (tokenId: string | number) => void = (tokenId) => {
//       setTokens(tokens.filter(token => token.id !== tokenId))
//   };

//   return (
//     <TextInputWithTokens
//         onFilterChange={setFilter}
//         tokens={tokens}
//         selectableItems={filteredItems}
//         onItemSelect={onItemSelect}
//         onTokenRemove={onTokenRemove}
//         addNewTokenItem={filter && !filteredItems.some(item => item.text === filter) ? {
//           text: `Add '${filter}'`,
//           leadingVisual: () => (<PlusIcon />)
//         } : undefined}
//     />
//   )
// };

// export const ComboboxEmptyStateCustomText = () => {
//   const [filter, setFilter] = useState<string>('')
//   const [tokens, setTokens] = useState<Token[]>([])
//   const filteredItems = [items[0], items[1]].filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
//   const onItemSelect: ItemProps['onAction'] = ({id, text}) => {
//       // TODO: just make `id` required
//       setTokens([...tokens, {id: id || 'someUniqueId', text}])
//   };
//   const onTokenRemove: (tokenId: string | number) => void = (tokenId) => {
//       setTokens(tokens.filter(token => token.id !== tokenId))
//   };

//   return (
//     <TextInputWithTokens
//         onFilterChange={setFilter}
//         tokens={tokens}
//         selectableItems={filteredItems}
//         onItemSelect={onItemSelect}
//         onTokenRemove={onTokenRemove}
//         emptyStateText="No tokens match the query"
//     />
//   )
// };

// export const ManySelected = () => {
//   const [filter, setFilter] = useState<string>('')
//   const [tokens, setTokens] = useState<Token[]>(mockTokens_long)
//   // const selectedTexts = tokens.map((item) => item.text);
//   const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase())) // && !selectedTexts.includes(item.text)
//   const onItemSelect: ItemProps['onAction'] = ({id, text}) => {
//       // TODO: just make `id` required
//       setTokens([...tokens, {id: id || 'someUniqueId', text}])
//   };
//   const onTokenRemove: (tokenId: string | number) => void = (tokenId) => {
//       setTokens(tokens.filter(token => token.id !== tokenId))
//   };

//   return (
//     <div style={{maxWidth: '600px'}}>
//       <TextInputWithTokens
//           onFilterChange={setFilter}
//           tokens={tokens}
//           selectableItems={filteredItems}
//           onItemSelect={onItemSelect}
//           onTokenRemove={onTokenRemove}
//           maxHeight='125px'
//       />
//     </div>
//   )
// };

// export const Loading = () => {
//   const [filter, setFilter] = useState<string>('')
//   const [tokens, setTokens] = useState<Token[]>([])
//   const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase())) // && !selectedTexts.includes(item.text)
//   const onItemSelect: ItemProps['onAction'] = ({id, text}) => {
//       // TODO: just make `id` required
//       setTokens([...tokens, {id: id || 'someUniqueId', text}])
//   };
//   const onTokenRemove: (tokenId: string | number) => void = (tokenId) => {
//       setTokens(tokens.filter(token => token.id !== tokenId))
//   };

//   return (
//     <TextInputWithTokens
//         onFilterChange={setFilter}
//         tokens={tokens}
//         selectableItems={filteredItems}
//         onItemSelect={onItemSelect}
//         onTokenRemove={onTokenRemove}
//         loading={true}
//     />
//   )
// };

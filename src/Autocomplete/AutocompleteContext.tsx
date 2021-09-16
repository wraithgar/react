import {
    ChangeEventHandler,
    createContext,
    FocusEventHandler,
    KeyboardEventHandler
} from 'react'
import { ItemProps } from '../ActionList'
import { ItemInput } from '../ActionList/List'

export const AutocompleteContext = createContext<{
    activeDescendantRef?: React.MutableRefObject<HTMLElement | null>
    autocompleteSuggestion?: string;
    filterFn?: (item: ItemInput, i: number) => boolean;
    inputRef?: React.MutableRefObject<HTMLInputElement | null>
    inputValue?: string
    showMenu?: boolean
    setAutocompleteSuggestion?: React.Dispatch<React.SetStateAction<string>>
    setShowMenu?: React.Dispatch<React.SetStateAction<boolean>>
    setInputValue?: React.Dispatch<React.SetStateAction<string>>
    // selectedItems?: ItemProps[]
    // setSelectedItems?: React.Dispatch<React.SetStateAction<ItemProps[]>>
}>({})
  
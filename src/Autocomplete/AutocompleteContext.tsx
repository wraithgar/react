import { createContext } from 'react'

// TODO:
// - figure out how we can make all of these properties required without having to define them when calling `createContext`
// - figure out how we can reduce the number of properties that need to be passed
export const AutocompleteContext = createContext<{
    activeDescendantRef?: React.MutableRefObject<HTMLElement | null>
    autocompleteSuggestion?: string;
    inputRef?: React.MutableRefObject<HTMLInputElement | null>
    inputValue?: string
    showMenu?: boolean
    setAutocompleteSuggestion?: React.Dispatch<React.SetStateAction<string>>
    setShowMenu?: React.Dispatch<React.SetStateAction<boolean>>
    setInputValue?: React.Dispatch<React.SetStateAction<string>>
    // TODO: figure out if we could eliminate `isMenuDirectlyActivated` state and setState action from this Context
    isMenuDirectlyActivated?: boolean
    setIsMenuDirectlyActivated?: React.Dispatch<React.SetStateAction<boolean>>
}>({})
  
import { createContext } from 'react'


export const AutocompleteContext = createContext<{
    activeDescendantRef?: React.MutableRefObject<HTMLElement | null>
    autocompleteSuggestion?: string;
    inputRef?: React.MutableRefObject<HTMLInputElement | null>
    inputValue?: string
    isMenuDirectlyActivated?: boolean
    setAutocompleteSuggestion?: React.Dispatch<React.SetStateAction<string>>
    setInputValue?: React.Dispatch<React.SetStateAction<string>>
    setIsMenuDirectlyActivated?: React.Dispatch<React.SetStateAction<boolean>>
    setShowMenu?: React.Dispatch<React.SetStateAction<boolean>>
    showMenu?: boolean
}>({})
  
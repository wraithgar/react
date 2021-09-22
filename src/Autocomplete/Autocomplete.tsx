import React, { useRef, useState } from 'react'
import { ComponentProps } from '../utils/types';
import { AutocompleteContext } from './AutocompleteContext'
import AutocompleteInput from './AutocompleteInput';
import AutocompleteMenu from './AutocompleteMenu';


const Autocomplete: React.FC = ({ children }) => {
    const activeDescendantRef = useRef<HTMLElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [inputValue, setInputValue] = useState<string>('')
    const [showMenu, setShowMenu] = useState(false)
    const [autocompleteSuggestion, setAutocompleteSuggestion] = useState<string>('')
    const [isMenuDirectlyActivated, setIsMenuDirectlyActivated] = useState<boolean>(false)

    return (
      <AutocompleteContext.Provider value={{
        activeDescendantRef,
        autocompleteSuggestion,
        inputRef,
        inputValue,
        isMenuDirectlyActivated,
        setAutocompleteSuggestion,
        setInputValue,
        setIsMenuDirectlyActivated,
        setShowMenu,
        showMenu,
      }}>
        {children}
      </AutocompleteContext.Provider>
    )
  }

export type AutocompleteProps = ComponentProps<typeof Autocomplete>
export type { AutocompleteInputProps } from './AutocompleteInput'
export type { AutocompleteMenuProps } from './AutocompleteMenu'
export default Object.assign(Autocomplete, {
    AutocompleteContext,
    Input: AutocompleteInput,
    Menu: AutocompleteMenu,
})
  

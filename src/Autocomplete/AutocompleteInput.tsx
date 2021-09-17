import React, {
    ChangeEventHandler,
    FocusEventHandler,
    KeyboardEventHandler,
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react'
import type * as Polymorphic from "@radix-ui/react-polymorphic";
import { AutocompleteContext } from './AutocompleteContext';
import TextInput from '../TextInput';
import { useCombinedRefs } from '../hooks/useCombinedRefs';
import { ComponentProps } from '../utils/types';

type InternalAutocompleteInputProps = {
    as?: React.ComponentType<any>;
}

const AutocompleteInput = React.forwardRef(
    ({
        as: Component = TextInput,
        onFocus,
        onChange,
        onKeyDown,
        onKeyPress,
        value,
        ...props
    }, forwardedRef) => {
        const {
            activeDescendantRef,
            autocompleteSuggestion = '',
            inputRef,
            inputValue = '',
            isMenuDirectlyActivated,
            setInputValue,
            setShowMenu,
            showMenu,
        } = useContext(AutocompleteContext);
        const combinedInputRef = useCombinedRefs(inputRef, forwardedRef);
        const [highlightRemainingText, setHighlightRemainingText] = useState<boolean>(true);

        const handleInputFocus: FocusEventHandler = () => {
            if (setShowMenu) {
                setShowMenu(true);
            }
        };

        const handleInputBlur: FocusEventHandler = () => {
            if (setShowMenu) {
                setShowMenu(false);
            }
        };

        const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
            if (setInputValue) {
                setInputValue(e.currentTarget.value);
            }

            if (setShowMenu && !showMenu) {
                setShowMenu(true);
            }
        }

        const handleInputKeyDown: KeyboardEventHandler = (e) => {
            if (e.key === 'Backspace') {
                setHighlightRemainingText(false);
            }
        };

        const handleInputKeyUp: KeyboardEventHandler = (e) => {
            if (e.key === 'Backspace') {
                setHighlightRemainingText(true);
            }
        };

        const onInputKeyPress: KeyboardEventHandler = useCallback(
            event => {
                if (activeDescendantRef && event.key === 'Enter' && activeDescendantRef.current) {
                    event.preventDefault()
                    event.nativeEvent.stopImmediatePropagation()

                    // Forward Enter key press to active descendant so that item gets activated
                    const activeDescendantEvent = new KeyboardEvent(event.type, event.nativeEvent)
                    activeDescendantRef.current.dispatchEvent(activeDescendantEvent)
                }
            },
            [activeDescendantRef]
        )

        useEffect(() => {
            if (!inputRef?.current) {
                return;
            }

            if (!autocompleteSuggestion) {
                inputRef.current.value = inputValue;
            }

            if (highlightRemainingText && autocompleteSuggestion && (inputValue || isMenuDirectlyActivated)) {
                inputRef.current.value = autocompleteSuggestion;
      
                if (autocompleteSuggestion.toLowerCase().indexOf(inputValue.toLowerCase()) === 0) {
                    inputRef.current.setSelectionRange(inputValue.length, autocompleteSuggestion.length);
                }
            }
        }, [autocompleteSuggestion, inputValue])

        useEffect(() => {
            if (value && setInputValue) {
                setInputValue(value.toString());
            }
        }, [value]);

        return (
            <Component
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onKeyPress={onInputKeyPress}
                onKeyUp={handleInputKeyUp}
                ref={combinedInputRef}
                {...props}
            />
        );
    }
) as Polymorphic.ForwardRefComponent<"input", InternalAutocompleteInputProps>

export type AutocompleteInputProps = ComponentProps<typeof AutocompleteInput>
export default AutocompleteInput;

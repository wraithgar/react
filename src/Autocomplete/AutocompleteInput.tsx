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

interface Props {
    as?: React.ComponentType<any>;
}

const AutocompleteInput = React.forwardRef(
    ({
        as: Component = TextInput,
        onFocus,
        onChange,
        onKeyDown,
        onKeyPress,
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
        } = useContext(AutocompleteContext);
        const combinedInputRef = useCombinedRefs(inputRef, forwardedRef);
        const [highlightRemainingText, setHighlightRemainingText] = useState<boolean>(true);

        const handleInputFocus: FocusEventHandler = () => {
            if (setShowMenu) {
                setShowMenu(true);
            }
        };

        const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
            if (setInputValue) {
                setInputValue(e.currentTarget.value);
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

        return (
            <Component
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onKeyPress={onInputKeyPress}
                onKeyUp={handleInputKeyUp}
                ref={combinedInputRef}
                {...props}
            />
        );
    }
) as Polymorphic.ForwardRefComponent<"input", Props>

export default AutocompleteInput;

import React, {
    ChangeEventHandler,
    FocusEventHandler,
    KeyboardEventHandler,
    useCallback,
    useContext
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
            autocompleteSuggestion,
            inputRef,
            setInputValue,
            setShowMenu,
        } = useContext(AutocompleteContext);
        const combinedInputRef = useCombinedRefs(inputRef, forwardedRef);

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
            if (setInputValue && e.key === 'ArrowRight' && autocompleteSuggestion) {
                setInputValue(autocompleteSuggestion);
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

        return (
            <Component
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onKeyPress={onInputKeyPress}
                ref={combinedInputRef}
                {...props}
            />
        );
    }
) as Polymorphic.ForwardRefComponent<"input", Props>

export default AutocompleteInput;

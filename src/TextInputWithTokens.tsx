import React, { ChangeEventHandler, FocusEventHandler, KeyboardEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {omit, pick} from '@styled-system/props'
import classnames from 'classnames'
import styled, {css} from 'styled-components'
import {maxWidth, MaxWidthProps, minWidth, MinWidthProps, variant, width, WidthProps} from 'styled-system'
import { ActionList, ItemProps } from './ActionList'
import { ItemInput } from './ActionList/List'
import { FocusKeys } from './behaviors/focusZone'
import {COMMON, get, SystemCommonProps} from './constants'
import { FilteredActionList } from './FilteredActionList'
import { useAnchoredPosition, useProvidedRefOrCreate } from './hooks'
import { useCombinedRefs } from './hooks/useCombinedRefs'
import { useFocusZone } from './hooks/useFocusZone'
import Overlay from './Overlay'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'
import { TokenBaseProps } from './Token/TokenBase'
import Token from './Token/Token'
import { Box } from '.'

function scrollIntoViewingArea(
    child: HTMLElement,
    container: HTMLElement,
    margin = 8,
    behavior: ScrollBehavior = 'smooth'
  ) {
    const {top: childTop, bottom: childBottom} = child.getBoundingClientRect()
    const {top: containerTop, bottom: containerBottom} = container.getBoundingClientRect()
  
    const isChildTopAboveViewingArea = childTop < containerTop + margin
    const isChildBottomBelowViewingArea = childBottom > containerBottom - margin
  
    if (isChildTopAboveViewingArea) {
      const scrollHeightToChildTop = childTop - containerTop + container.scrollTop
      container.scrollTo({behavior, top: scrollHeightToChildTop - margin})
    } else if (isChildBottomBelowViewingArea) {
      const scrollHeightToChildBottom = childBottom - containerBottom + container.scrollTop
      container.scrollTo({behavior, top: scrollHeightToChildBottom + margin})
    }
  
    // either completely in view or outside viewing area on both ends, don't scroll
  }

const sizeVariants = variant({
  variants: {
    small: {
      minHeight: '28px',
      px: 2,
      py: '3px',
      fontSize: 0,
      lineHeight: '20px'
    },
    large: {
      px: 2,
      py: '10px',
      fontSize: 3
    }
  }
})

const Input = styled.input`
  border: 0;
  font-size: inherit;
  font-family: inherit;
  background-color: transparent;
  -webkit-appearance: none;
  color: inherit;
  flex-grow: 1;
  height: 100%;
  padding: 0;

  &:focus {
    outline: 0;
  }
`
const InputWrapper = styled.div`
  position: relative;

  &:after {
    content: attr(data-autocompleteSuggestion);
    pointer-events: none;
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    top: 1px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.5);
  }
`;

type StyledWrapperProps = {
  disabled?: boolean
  hasIcon?: boolean
  block?: boolean
  contrast?: boolean
  variant?: 'small' | 'large'
} & SystemCommonProps &
  WidthProps &
  MinWidthProps &
  MaxWidthProps &
  SxProp

const Wrapper = styled.span<StyledWrapperProps>`
  display: inline-flex;
  align-items: stretch;
  min-height: 34px;
  font-size: ${get('fontSizes.1')};
  line-height: 20px;
  color: ${get('colors.text.primary')};
  vertical-align: middle;
  background-repeat: no-repeat; // Repeat and position set for form states (success, error, etc)
  background-position: right 8px center; // For form validation. This keeps images 8px from right and centered vertically.
  border: 1px solid ${get('colors.border.primary')};
  border-radius: ${get('radii.2')};
  outline: none;
  box-shadow: ${get('shadows.shadow.inset')};
  flex-wrap: wrap;
  gap: 0.25rem;

  ${props => {
    if (props.hasIcon) {
      return css`
        padding: 0;
      `
    } else {
      return css`
        padding: 6px 12px;
      `
    }
  }}

  .TextInput-icon {
    align-self: center;
    color: ${get('colors.icon.tertiary')};
    margin: 0 ${get('space.2')};
    flex-shrink: 0;
  }

  &:focus-within {
    border-color: ${get('colors.state.focus.border')};
    box-shadow: ${get('shadows.state.focus.shadow')};
  }

  ${props =>
    props.contrast &&
    css`
      background-color: ${get('colors.input.contrastBg')};
    `}

  ${props =>
    props.disabled &&
    css`
      color: ${get('colors.text.secondary')};
      background-color: ${get('colors.input.disabledBg')};
      border-color: ${get('colors.input.disabledBorder')};
    `}

  ${props =>
    props.block &&
    css`
      display: block;
      width: 100%;
    `}

  // Ensures inputs don't zoom on mobile but are body-font size on desktop
  @media (min-width: ${get('breakpoints.1')}) {
    font-size: ${get('fontSizes.1')};
  }
  ${COMMON}
  ${width}
  ${minWidth}
  ${maxWidth}
  ${sizeVariants}
  ${sx};
`

interface Token {
    text?: string;
    id: string | number;
}

type TextInputWithTokensInternalProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: any // This is a band-aid fix until we have better type support for the `as` prop
  icon?: React.ComponentType<{className?: string}>
  // TODO: instead of passing `tokens`, consider passing `selectedItems` so there's a clearer relationship
  // between the tokens in the input and the selected items in the dropdown
  tokens: Token[]
  onTokenRemove: (tokenId: string | number) => void
  selectableItems: ItemInput[]
  onFilterChange: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void
  onItemSelect: NonNullable<ItemProps['onAction']>
  tokenComponent?: React.FunctionComponent<any> // TODO: change this bitwise `|` to allow props that match any of the token variants OR do something where we infer the props of the passed token component
  emptyStateText?: React.ReactNode | false
  addNewTokenItem?: Omit<ItemInput, 'onAction'> // TODO: Rethink this prop name. It's confusing.
  onCloseOptionsList?: () => void // TODO: reconsider having this prop at all
} & ComponentProps<typeof Wrapper> &
  ComponentProps<typeof Input>

// using forwardRef is important so that other components (ex. SelectMenu) can autofocus the input
const TextInputWithTokens = React.forwardRef<HTMLInputElement, TextInputWithTokensInternalProps>(
  ({
      icon: IconComponent,
      contrast,
      className,
      block,
      disabled,
      theme,
      sx: sxProp,
      tokens,
      selectableItems,
      onFilterChange,
      onItemSelect,
      onTokenRemove,
      tokenComponent: TokenComponent,
      emptyStateText,
      addNewTokenItem,
      onCloseOptionsList,
      ...rest},
    ref) => {
    const listContainerRef = useRef<HTMLDivElement>(null)
    const localInputRef = useRef<HTMLInputElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const activeDescendantRef = useRef<HTMLElement>()
    const combinedInputRef = useCombinedRefs(localInputRef, ref)
    // this class is necessary to style FilterSearch, plz no touchy!
    const wrapperClasses = classnames(className, 'TextInput-wrapper')
    const wrapperProps = pick(rest)
    const inputProps = omit(rest)
    const [selectedTokenIdx, setSelectedTokenIdx] = useState<number | undefined>()
    const [inputVal, setInputVal] = useState<string>('');
    const [showMenu, setShowMenu] = useState(false)
    const [selectedItems, setSelectedItems] = useState<ItemProps[]>(
      tokens.map(({id, text}) => ({ id, text }))
    );
    const [autocompleteSuggestion, setAutocompleteSuggestion] = useState<string>('');
    const [highlightedItem, setHighlightedItem] = useState<ItemProps | undefined>();

    const {containerRef} = useFocusZone({
      focusOutBehavior: 'stop',
      bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd
    })

    const closeOptionList = () => {
      setShowMenu(false);
      
      if (onCloseOptionsList) {
        onCloseOptionsList();
      }
    }
    const showOptionList = () => {
      setShowMenu(true);
    }

    const handleTokenRemove = (tokenId: number | string) => {
      onTokenRemove(tokenId);
      setSelectedItems(selectedItems.filter(selectedItem => selectedItem.id !== tokenId));
    }
    const handleTokenFocus: (tokenIdx: number) => FocusEventHandler = (tokenIdx) => () => {
        setSelectedTokenIdx(tokenIdx);
        closeOptionList();
    }
    const handleTokenBlur: FocusEventHandler = () => {
        setSelectedTokenIdx(undefined);
    }
    const handleTokenKeyUp: (tokenId: number | string) => KeyboardEventHandler = (tokenId) => (e) => {
        if (e.key === 'Backspace') {
          handleTokenRemove(tokenId);
        }

        if (e.key === 'Escape') {
            combinedInputRef?.current?.focus();
        }
    };

    const handleInputFocus: FocusEventHandler = () => {
        setSelectedTokenIdx(undefined);
        showOptionList();
    };
    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        onFilterChange(e.currentTarget.value, e);
        setInputVal(e.currentTarget.value);
    }
    const handleInputKeyDown: KeyboardEventHandler = (e) => {
      if (e.key === 'ArrowRight' && autocompleteSuggestion) {
        setInputVal(autocompleteSuggestion);
        // TODO: use hooks or something to always trigger `onFilterChange` when `inputVal` is changed
        onFilterChange(autocompleteSuggestion, e);
      }

      if (inputVal) {
        return;
      }

      const lastToken = tokens[tokens.length - 1];

      if (e.key === 'Backspace') {
        handleTokenRemove(lastToken.id);
        setInputVal(`${lastToken.text}` || '');
        // TODO: use hooks or something to always trigger `onFilterChange` when `inputVal` is changed
        onFilterChange(lastToken.text || '', e);
      }
    };
    const onInputKeyPress: KeyboardEventHandler = useCallback(
      event => {
        if (event.key === 'Enter' && activeDescendantRef.current) {
          event.preventDefault()
          event.nativeEvent.stopImmediatePropagation()
  
          // Forward Enter key press to active descendant so that item gets activated
          const activeDescendantEvent = new KeyboardEvent(event.type, event.nativeEvent)
          activeDescendantRef.current.dispatchEvent(activeDescendantEvent)
        }
      },
      [activeDescendantRef]
    )

    const getSelectedItems = (itemId?: string | number, checked?: boolean) => {
      const newlySelectedItem = selectableItems.find(item => item.id === itemId);

      if (checked) {
        return [...selectedItems, ...(newlySelectedItem ? [newlySelectedItem] : [])];
      }

      return selectedItems.filter(selectedChoice => selectedChoice.id !== itemId);
    };

    const itemsToRender: ItemInput[] = [
      // selectable tokens
      ...selectableItems.map((selectableItem) => ({
          ...selectableItem,
          selected: selectableItem.selected || selectedItems.map(item => item.id).includes(selectableItem.id),
          onAction: (item: ItemProps, e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
            setSelectedItems(
              getSelectedItems(
                item.id,
                !item.selected
              ) || []
            );

            if (!item.selected) {
              onItemSelect(item, e);
              setInputVal('');
              setAutocompleteSuggestion('');
            } else {
              handleTokenRemove(item.id !== null && item.id !== undefined ? item.id : '');
            }
          }
      })),
      // menu item used for creating a token from whatever is in the text input
      ...(addNewTokenItem
        ? [{
            ...addNewTokenItem,
            onAction: (_item: ItemProps, e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
              onItemSelect({ text: inputVal, id: `randomlyGeneratedId-${inputVal}` }, e)
            }
        }]
        : []
      )
    ];

    useFocusZone(
        {
          containerRef: listContainerRef,
          focusOutBehavior: 'wrap',
          focusableElementFilter: element => {
            return !(element instanceof HTMLInputElement)
          },
          activeDescendantFocus: combinedInputRef,
          onActiveDescendantChanged: (current, _previous, directlyActivated) => {
            activeDescendantRef.current = current
            const selectedItem = itemsToRender.find(item => item.id?.toString() === current?.dataset.id);
            // console.log('current id', current?.dataset.id);
            setHighlightedItem(selectedItem);

            if (current && scrollContainerRef.current && directlyActivated) {
              scrollIntoViewingArea(current, scrollContainerRef.current)
            }
          }
        }
    )

    useEffect(() => {
      if (highlightedItem?.text?.startsWith(inputVal)) {
        setAutocompleteSuggestion(highlightedItem.text);
      } else {
        setAutocompleteSuggestion('');
      }
    }, [highlightedItem, inputVal])

    return (
        <Wrapper
            className={wrapperClasses}
            hasIcon={!!IconComponent}
            block={block}
            theme={theme}
            disabled={disabled}
            contrast={contrast}
            sx={sxProp}
            ref={containerRef}
            {...wrapperProps}
        >
            {TokenComponent ? tokens?.map((token, i) => (
                <TokenComponent
                    onFocus={handleTokenFocus(i)}
                    onBlur={handleTokenBlur}
                    onKeyUp={handleTokenKeyUp(token.id)}
                    text={token.text || ''} // TODO: just make token.text required
                    isSelected={selectedTokenIdx === i}
                    handleRemove={() => { handleTokenRemove(token.id) }}
                    variant="xl"
                    fillColor={token.labelColor ? token.labelColor : undefined}
                />
            )) : null}

            <InputWrapper data-autocompleteSuggestion={autocompleteSuggestion} ref={listContainerRef}>
                <Input
                    ref={combinedInputRef}
                    disabled={disabled}
                    onFocus={handleInputFocus}
                    onKeyPress={onInputKeyPress}
                    onKeyDown={handleInputKeyDown}
                    onChange={handleInputChange}
                    type="text"
                    value={inputVal}
                    {...inputProps}
                />
                {showMenu && emptyStateText ? (
                    <Overlay
                        returnFocusRef={combinedInputRef}
                        overrideInitialFocus={true}
                        preventPortal={true} // TODO: remove this prop and use `portalContainerName={listContainerRef}` instead
                        preventFocusOnOpen={true}
                        onClickOutside={closeOptionList}
                        onEscape={closeOptionList}
                    >
                        {itemsToRender.length ? (
                          <ActionList
                            selectionVariant="multiple"
                            items={itemsToRender}
                            role="listbox"
                          />
                        ) : (
                          <Box p={3}>{emptyStateText}</Box>
                        )}
                    </Overlay>
                ) : null}
            </InputWrapper>
        </Wrapper>
    )
  }
)

TextInputWithTokens.defaultProps = {
    tokenComponent: Token,
    emptyStateText: 'No selectable options',
}

TextInputWithTokens.displayName = 'TextInput'

export type TextInputWithTokensProps = ComponentProps<typeof TextInputWithTokens>
export default TextInputWithTokens

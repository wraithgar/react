import React, { ChangeEventHandler, FocusEventHandler, KeyboardEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {omit, pick} from '@styled-system/props'
import classnames from 'classnames'
import styled, {css} from 'styled-components'
import { maxWidth, MaxWidthProps, minWidth, MinWidthProps, variant, width, WidthProps} from 'styled-system'
import { FocusKeys } from './behaviors/focusZone'
import {COMMON, get, SystemCommonProps} from './constants'
import { useCombinedRefs } from './hooks/useCombinedRefs'
import { useFocusZone } from './hooks/useFocusZone'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'
import Token from './Token/Token'

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
  height: 100%;
  width: 100%;
  padding: 0;

  &:focus {
    outline: 0;
  }
`
const InputWrapper = styled.div`
  position: relative;
  order: 1;
  flex-grow: 1;

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
  maxHeight?: React.CSSProperties['maxHeight']
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

  ${props => {
    if (props.maxHeight) {
      return css`
        max-height: ${props.maxHeight};
        overflow: auto;
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
  tokenComponent?: React.FunctionComponent<any> // TODO: change this bitwise `|` to allow props that match any of the token variants OR do something where we infer the props of the passed token component
  maxHeight?: React.CSSProperties['maxHeight']
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
      onTokenRemove,
      tokenComponent: TokenComponent,
      ...rest},
    ref) => {
    const localInputRef = useRef<HTMLInputElement>(null)
    const combinedInputRef = useCombinedRefs(localInputRef, ref)
    // this class is necessary to style FilterSearch, plz no touchy!
    const wrapperClasses = classnames(className, 'TextInput-wrapper')
    const wrapperProps = pick(rest)
    const { onChange, onFocus, onKeyDown, value, ...inputPropsRest } = omit(rest)
    const [selectedTokenIdx, setSelectedTokenIdx] = useState<number | undefined>()
    const [inputVal, setInputVal] = useState<string>(value);
    const [autocompleteSuggestion, setAutocompleteSuggestion] = useState<string>('');
    
    const {containerRef} = useFocusZone({
      focusOutBehavior: 'wrap',
      bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
      focusableElementFilter: element => {
        return !(element instanceof HTMLButtonElement)
      }
    })

    const handleTokenRemove = (tokenId: number | string) => {
      onTokenRemove(tokenId);
    }
    const handleTokenFocus: (tokenIdx: number) => FocusEventHandler = (tokenIdx) => () => {
        setSelectedTokenIdx(tokenIdx);
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

    const handleInputFocus: FocusEventHandler = (e) => {
        if (onFocus) {
            onFocus(e);
        }

        setSelectedTokenIdx(undefined);
    };
    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (onChange) {
            onChange(e);
        }

        setInputVal(e.currentTarget.value);
    }
    const handleInputKeyDown: KeyboardEventHandler = (e) => {
        if (onKeyDown) {
            onKeyDown(e);
        }

        if (inputVal) {
            return;
        }

        const lastToken = tokens[tokens.length - 1];

        if (e.key === 'Backspace') {
            handleTokenRemove(lastToken.id);
            // HACK: adding an extra space so that when I backspace, it doesn't delete the last letter
            setInputVal(`${lastToken.text} ` || ' ');
            // TODO: use hooks or something to always trigger `onFilterChange` when `inputVal` is changed
            // onFilterChange(lastToken.text || '', e);

            // HACK: for some reason we need to wait a tick for `.select()` to work
            setTimeout(() => {
                combinedInputRef?.current?.select();
            }, 1);
        }
    };

    return (
      <>
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
            <InputWrapper data-autocompleteSuggestion={autocompleteSuggestion}>
                <Input
                    ref={combinedInputRef}
                    disabled={disabled}
                    onFocus={handleInputFocus}
                    onKeyDown={handleInputKeyDown}
                    onChange={handleInputChange}
                    type="text"
                    value={inputVal}
                    {...inputPropsRest}
                />
            </InputWrapper>
            {tokens?.length && TokenComponent ? (
              tokens.map((token, i) => (
                  <TokenComponent
                      onFocus={handleTokenFocus(i)}
                      onBlur={handleTokenBlur}
                      onKeyUp={handleTokenKeyUp(token.id)}
                      text={token.text || ''} // TODO: just make token.text required
                      isSelected={selectedTokenIdx === i}
                      handleRemove={() => { handleTokenRemove(token.id) }}
                      variant="xl"
                      fillColor={token.labelColor ? token.labelColor : undefined}
                      tabIndex={0}
                  />
                ))
            ) : null}
        </Wrapper>
      </>
    )
  }
)

TextInputWithTokens.defaultProps = {
    tokenComponent: Token
}

TextInputWithTokens.displayName = 'TextInputWithTokens'

export type TextInputWithTokensProps = ComponentProps<typeof TextInputWithTokens>
export default TextInputWithTokens

import React, { FocusEventHandler, KeyboardEventHandler, useRef, useState } from 'react'
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
import Token, { TokenProps } from './Token/Token'
import { TokenLabelProps } from './Token/TokenLabel'
import { TokenProfileProps } from './Token/TokenProfile'

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

type AnyTokenProps = Partial<TokenProps & TokenLabelProps & TokenProfileProps>
type TokenDatum = Omit<AnyTokenProps, 'id'> & { id: number | string; }

// TODO: extend TextInput props
type TextInputWithTokensInternalProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: any // This is a band-aid fix until we have better type support for the `as` prop
  icon?: React.ComponentType<{className?: string}>
  tokens: TokenDatum[]
  onTokenRemove: (tokenId: string | number) => void
  tokenComponent?: React.ComponentType<TokenProps | TokenLabelProps | TokenProfileProps>
  maxHeight?: React.CSSProperties['maxHeight']
} & ComponentProps<typeof Wrapper> &
  ComponentProps<typeof Input>

// using forwardRef is important so that other components (ex. Autocomplete) can use the ref
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
    const { onFocus, onKeyDown, ...inputPropsRest } = omit(rest)
    const [selectedTokenIdx, setSelectedTokenIdx] = useState<number | undefined>()
    const {containerRef} = useFocusZone({
      focusOutBehavior: 'wrap',
      bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
      focusableElementFilter: element => {
        return !(element instanceof HTMLButtonElement)
      },
      getNextFocusable: (direction, from, event) => {
        if (!selectedTokenIdx && selectedTokenIdx !== 0) {
          return undefined
        }

        let nextIndex = selectedTokenIdx + 1;

        if (direction === 'next') {
          nextIndex += 1;
        }

        if (direction === 'previous') {
          nextIndex -= 1;
        }

        if (nextIndex > tokens.length || nextIndex < 1) {
          return combinedInputRef.current || undefined;
        }

        return containerRef?.current?.children[nextIndex] as HTMLElement
      },
    }, [selectedTokenIdx])

    const handleTokenRemove = (tokenId: TokenDatum['id']) => {
      onTokenRemove(tokenId);
    }

    const handleTokenFocus: (tokenIdx: number) => FocusEventHandler = (tokenIdx) => () => {
        setSelectedTokenIdx(tokenIdx);
    }

    const handleTokenBlur: FocusEventHandler = () => {
        setSelectedTokenIdx(undefined);
    }

    const handleTokenKeyUp: (tokenId: TokenDatum['id']) => KeyboardEventHandler = (tokenId) => (e) => {
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
    const handleInputKeyDown: KeyboardEventHandler = (e) => {
        if (onKeyDown) {
            onKeyDown(e);
        }

        if (combinedInputRef.current?.value) {
            return;
        }

        const lastToken = tokens[tokens.length - 1];

        if (e.key === 'Backspace') {
            handleTokenRemove(lastToken.id);

            if (combinedInputRef.current) {
              // TODO: eliminate the first hack by making changes to the Autocomplete component
              // COLEHELP 
              //
              // HACKS:
              // 1. Directly setting `combinedInputRef.current.value` instead of updating state because the autocomplete 
              //    highlight behavior doesn't work correctly if we update the value with a setState action in onChange
              // 2. Adding an extra space so that when I backspace, it doesn't delete the last letter
              combinedInputRef.current.value = `${lastToken.text} `;
            }

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
            <InputWrapper>
                <Input
                    ref={combinedInputRef}
                    disabled={disabled}
                    onFocus={handleInputFocus}
                    onKeyDown={handleInputKeyDown}
                    type="text"
                    {...inputPropsRest}
                />
            </InputWrapper>
            {tokens?.length && TokenComponent ? (
              tokens.map(({id, ...tokenRest}, i) => (
                  // TODO: fix this TS error that occurs because `avatarSrc` is required on TokenProfile
                  // COLEHELP
                  <TokenComponent
                      onFocus={handleTokenFocus(i)}
                      onBlur={handleTokenBlur}
                      onKeyUp={handleTokenKeyUp(id)}
                      isSelected={selectedTokenIdx === i}
                      handleRemove={() => { handleTokenRemove(id) }}
                      variant="xl"
                      tabIndex={0}
                      {...tokenRest}
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

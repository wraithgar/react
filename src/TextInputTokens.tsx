import React, { FocusEventHandler, KeyboardEventHandler, useRef, useState } from 'react'
import {omit} from '@styled-system/props'
import styled from 'styled-components'
import { FocusKeys } from './behaviors/focusZone'
import { useCombinedRefs } from './hooks/useCombinedRefs'
import { useFocusZone } from './hooks/useFocusZone'
import {ComponentProps, MandateProps} from './utils/types'
import Token, { TokenProps } from './Token/Token'
import { TokenLabelProps } from './Token/TokenLabel'
import { TokenProfileProps } from './Token/TokenProfile'
import { TokenSizeKeys } from './Token/TokenBase'
import TextInput, { TextInputProps } from './TextInput'
import { useProvidedRefOrCreate } from './hooks'
import UnstyledTextInput from './_UnstyledTextInput'

const InputWrapper = styled.div`
  order: 1;
  flex-grow: 1;
`;

type AnyTokenProps = Partial<TokenProps & TokenLabelProps & TokenProfileProps>
type TokenDatum = MandateProps<AnyTokenProps, 'id' | 'text'>
type TextInputWithTokensInternalProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: any // This is a band-aid fix until we have better type support for the `as` prop
  icon?: React.ComponentType<{className?: string}>
  tokens: TokenDatum[]
  onTokenRemove: (tokenId: string | number) => void
  tokenComponent?: React.ComponentType<TokenProps | TokenLabelProps | TokenProfileProps>
  maxHeight?: React.CSSProperties['maxHeight']
  preventTokenWrapping?: boolean
  tokenSizeVariant?: TokenSizeKeys
} & TextInputProps

// using forwardRef is important so that other components (ex. Autocomplete) can use the ref
const TextInputWithTokensComponent = React.forwardRef<HTMLInputElement, TextInputWithTokensInternalProps & {
  selectedTokenIdx: number | undefined,
  setSelectedTokenIdx: React.Dispatch<React.SetStateAction<number | undefined>>
}>(
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
      preventTokenWrapping,
      tokenSizeVariant,
      selectedTokenIdx,
      setSelectedTokenIdx,
      ...rest},
    externalRef) => {
    const ref = useProvidedRefOrCreate<HTMLInputElement>(externalRef as React.RefObject<HTMLInputElement>);
    const { onFocus, onKeyDown, ...inputPropsRest } = omit(rest)

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
            ref?.current?.focus();
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

        if (ref?.current?.value) {
            return;
        }

        const lastToken = tokens[tokens.length - 1];

        if (e.key === 'Backspace' && lastToken) {
            handleTokenRemove(lastToken.id);

            if (ref?.current) {
              // TODO: eliminate the first hack by making changes to the Autocomplete component
              // COLEHELP 
              //
              // HACKS:
              // 1. Directly setting `ref.current.value` instead of updating state because the autocomplete 
              //    highlight behavior doesn't work correctly if we update the value with a setState action in onChange
              // 2. Adding an extra space so that when I backspace, it doesn't delete the last letter
              ref.current.value = `${lastToken.text} `;
            }

            // HACK: for some reason we need to wait a tick for `.select()` to work
            setTimeout(() => {
                ref?.current?.select();
            }, 1);
        }
    };

    return (
      <>
        <InputWrapper>
            <UnstyledTextInput
                ref={ref}
                disabled={disabled}
                onFocus={handleInputFocus}
                onKeyDown={handleInputKeyDown}
                type="text"
                sx={{height: '100%'}}
                {...inputPropsRest}
            />
        </InputWrapper>
        {tokens?.length && TokenComponent ? (
          tokens.map(({id, ...tokenRest}, i) => (
              <TokenComponent
                  onFocus={handleTokenFocus(i)}
                  onBlur={handleTokenBlur}
                  onKeyUp={handleTokenKeyUp(id)}
                  isSelected={selectedTokenIdx === i}
                  handleRemove={() => { handleTokenRemove(id) }}
                  variant={tokenSizeVariant}
                  tabIndex={0}
                  {...tokenRest}
              />
            ))
        ) : null}
      </>
    )
  }
)

const TextInputWithTokens = React.forwardRef<HTMLInputElement, TextInputWithTokensInternalProps>(
  ({tokens, sx: sxProp, ...props}, ref) => {
    const localInputRef = useRef<HTMLInputElement>(null)
    const combinedInputRef = useCombinedRefs(localInputRef, ref)
    const [selectedTokenIdx, setSelectedTokenIdx] = useState<number | undefined>()
    const {containerRef} = useFocusZone({
      focusOutBehavior: 'wrap',
      bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
      focusableElementFilter: element => {
        return !(element instanceof HTMLButtonElement)
      },
      getNextFocusable: (direction) => {
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

    return (
      <TextInput
        ref={combinedInputRef}
        wrapperRef={containerRef}
        as={TextInputWithTokensComponent}
        selectedTokenIdx={selectedTokenIdx}
        setSelectedTokenIdx={setSelectedTokenIdx}
        tokens={tokens}
        sx={{
          'alignItems': props.preventTokenWrapping ? 'center' : undefined,
          'flexWrap': props.preventTokenWrapping ? 'nowrap' : 'wrap',
          'gap': '0.25rem',

          '> *': {
            'flexShrink': 0
          },

          ...(props.block ? {
            display: 'flex',
            width: '100%',
          } : {}),
          ...sxProp
        }}
        {...props}
      />
    )
  }
)

TextInputWithTokens.defaultProps = {
    tokenComponent: Token,
    tokenSizeVariant: "xl"
}

TextInputWithTokens.displayName = 'TextInputWithTokens'

export type TextInputWithTokensProps = ComponentProps<typeof TextInputWithTokens>
export default TextInputWithTokens

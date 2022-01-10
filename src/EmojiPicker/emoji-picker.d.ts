declare module 'emoji-picker' {
  export const SKIN_TONE_NEUTRAL = 'neutral'
  export const SKIN_TONE_LIGHT = '1f3fb'
  export const SKIN_TONE_MEDIUM_LIGHT = '1f3fc'
  export const SKIN_TONE_MEDIUM = '1f3fe'
  export const SKIN_TONE_MEDIUM_DARK = '1f3ff'
  export const SKIN_TONE_DARK = '1f3fd'

  export type SkinTones =
    | typeof SKIN_TONE_NEUTRAL
    | typeof SKIN_TONE_LIGHT
    | typeof SKIN_TONE_MEDIUM_LIGHT
    | typeof SKIN_TONE_MEDIUM
    | typeof SKIN_TONE_MEDIUM_DARK
    | typeof SKIN_TONE_DARK

  export interface EmojiData {
    unified: string
    originalUnified: string
    names: Array<string>
    emoji: string
    activeSkinTone: SkinTones
  }

  export interface EmojiPickerProps {
    onEmojiClick: (event: React.MouseEvent, data: EmojiData) => void
    emojiUrl?: string
    preload?: boolean
    skinTone?: SkinTones
    disableAutoFocus?: boolean
    disableSearchBar?: boolean
    disableSkinTonePicker?: boolean
    pickerStyle?: {[property: string]: string}
    groupNames?: Record<string, string>
    groupVisibility?: Record<string, boolean>
    native?: boolean
  }

  const EmojiPicker: React.FC<EmojiPickerProps>

  export default EmojiPicker
}

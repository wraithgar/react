import {RefObject} from 'react'
import {PROPERTY_DATA_NAME} from './constants'

const setEmojiName = (emojiName = '', emojiListRef: RefObject<HTMLDivElement>) => {
  const className = '.content-wrapper'
  const node = emojiListRef.current
    ? emojiListRef.current.closest(`${className}`)
    : document.querySelector(`.emoji-picker-react ${className}`)

  node?.setAttribute(PROPERTY_DATA_NAME, emojiName)
}

export default setEmojiName

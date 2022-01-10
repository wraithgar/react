import React from 'react'
import skinTones from '../../skinTones.json'
import {
  useActiveSkinTone,
  useSetActiveSkinTone,
  useSkinToneSpreadValue,
  useToggleSpreadSkinTones
} from '../../PickerContext'
import {
  SKIN_TONE_NEUTRAL,
  SKIN_TONE_LIGHT,
  SKIN_TONE_MEDIUM_LIGHT,
  SKIN_TONE_MEDIUM,
  SKIN_TONE_MEDIUM_DARK,
  SKIN_TONE_DARK,
  DATA_NAME
} from './constants'
import styled from 'styled-components'

const SkinToneMap = {
  neutral: '#ffd225',
  '1f3fb': '#ffdfbd'
}

const SkinTonesList = styled.ul`
  padding: 0;
  margin: 0;
  list-style-type: none;
  position: absolute;
  top: 13px;
  right: 40px;
`

const SkinTonesListItem = styled.li<{isActive: boolean; itemNumber: number; skinToneSpread: boolean}>`
  background-color: currentColor;
  position: absolute;
  padding: 0;
  border-radius: 2px;
  overflow: hidden;
  transition: transform 0.3s ease;

  transform: ${props =>
    `translateX(-${props.skinToneSpread ? props.itemNumber * 20 : 0}px) scale(${props.isActive ? '1.5' : 1})`};,
  zIndex: ${props => (props.isActive ? 2 : 1)};
`

const SkinTonesLabel = styled.label`
  height: 10px;
  width: 10px;
  padding: 0;
  display: block;
  cursor: pointer;
`

const SkinTonesRadioButton = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  visibility: hidden;
  display: none;
`

const SkinTones = () => {
  const toggleSkinTonesSpread = useToggleSpreadSkinTones()
  const skinToneSpread = useSkinToneSpreadValue()
  const setActiveSkinTone = useSetActiveSkinTone()
  const activeSkinTone = useActiveSkinTone()

  const handleClick = (value: string) => {
    setActiveSkinTone(value)
    toggleSkinTonesSpread()
  }

  return (
    <SkinTonesList>
      {skinTones.map((tone: string, i: number) => {
        const isActive = tone === activeSkinTone
        return (
          <SkinTonesListItem key={tone} isActive={isActive} itemNumber={i} skinToneSpread={skinToneSpread}>
            <SkinTonesLabel data-name={DATA_NAME}>
              <SkinTonesRadioButton type="radio" onChange={({target: {value}}) => handleClick(value)} value={tone} />
            </SkinTonesLabel>
          </SkinTonesListItem>
        )
      })}
    </SkinTonesList>
  )
}

export {
  SkinTones as default,
  SKIN_TONE_NEUTRAL,
  SKIN_TONE_LIGHT,
  SKIN_TONE_MEDIUM_LIGHT,
  SKIN_TONE_MEDIUM,
  SKIN_TONE_MEDIUM_DARK,
  SKIN_TONE_DARK,
  DATA_NAME
}

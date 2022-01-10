import {EMOJI_PROPERTY_UNIFIED, EMOJI_PROPERTY_SKIN_VARIATIONS} from './constants'

const RECENTLY_USED_KEY = 'epr_ru'

export const getRecentlyUsed = () => {
  try {
    const ruList = window.localStorage.getItem(RECENTLY_USED_KEY)

    return !ruList ? [] : JSON.parse(ruList)
  } catch (e) {
    return []
  }
}

export const setRecentlyUsed = ({unified, originalUnified}) => {
  try {
    const unifiedParts = unified.split('-')

    let skinVariation = ''

    if (unified !== originalUnified && unifiedParts.length > 1) {
      skinVariation = unifiedParts[1]
    }

    const ruList = [
      {
        [EMOJI_PROPERTY_UNIFIED]: originalUnified,
        ...(skinVariation && {
          [EMOJI_PROPERTY_SKIN_VARIATIONS]: skinVariation
        })
      },
      ...getRecentlyUsed().filter(item => item[EMOJI_PROPERTY_UNIFIED] !== originalUnified)
    ]

    const output = ruList.splice(0, 14)

    window.localStorage.setItem(RECENTLY_USED_KEY, JSON.stringify(output))
  } catch (e) {
    return
  }
}

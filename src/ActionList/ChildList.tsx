import {SystemCssProperties} from '@styled-system/css'
import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import type {AriaRole} from '../utils/types'
import {Divider} from './Divider'
import {Group, GroupProps} from './Group'

/**
 * Contract for props passed to the `ChildList` component.
 */
export interface ChildListProps {
  /**
   * The ARIA role describing the function of `ChildList` component. `listbox` is a common value.
   */
  role?: AriaRole

  /**
   * Style variations. Usage is discretionary.
   *
   * - `"inset"` - `ChildList` children are offset (vertically and horizontally) from `ChildList`’s edges
   * - `"full"` - `ChildList` children are flush (vertically and horizontally) with `ChildList` edges
   */
  variant?: 'inset' | 'full'
}

const StyledChildList = styled.div`
  font-size: ${get('fontSizes.1')};
`

/**
 * Returns `sx` prop values for `ChildList` children matching the given `ChildList` style variation.
 * @param variant `ChildList` style variation.
 */
function useChildListVariant(
  variant: ChildListProps['variant'] = 'inset'
): {
  firstGroupStyle?: SystemCssProperties
  lastGroupStyle?: SystemCssProperties
  headerStyle?: SystemCssProperties
  itemStyle?: SystemCssProperties
} {
  switch (variant) {
    case 'full':
      return {
        headerStyle: {paddingX: get('space.2')},
        itemStyle: {borderRadius: 0}
      }
    default:
      return {
        firstGroupStyle: {marginTop: get('space.2')},
        lastGroupStyle: {marginBottom: get('space.2')},
        itemStyle: {marginX: get('space.2')}
      }
  }
}

/**
 * ChildLists `Item`s, either grouped or ungrouped, with a `Divider` between each `Group`.
 */
export function ChildList({children, ...props}: React.PropsWithChildren<ChildListProps>): JSX.Element {
  // Get `sx` prop values for `ChildList` children matching the given `ChildList` style variation.
  const {firstGroupStyle, lastGroupStyle, headerStyle, itemStyle} = useChildListVariant(props.variant)

  const offset = 0
  const groups = React.Children.toArray(children).reduce(
    (acc: React.ReactNode[], child: React.ReactNode, index: number, arr) => {
      // Remove non-`Group` children
      if (!React.isValidElement(child) || child.type !== Group) {
        offset++
        return acc
      }

      // Add props to `Group` children
      const group: React.ReactElement<GroupProps> = child
      acc.push(
        React.cloneElement<GroupProps>(group, {
          sx: {
            ...(index === 0 + offset && firstGroupStyle),
            ...(index === arr.length - 1 && lastGroupStyle)
          },
          ...group.props
        })
      )
      return acc
    },
    [] as React.ReactNode[]
  )

  return (
    <StyledChildList {...props}>
      {groups?.map((g, index) => (
        <>
          {g}
          {index + 1 !== groups.length && <Divider />}
        </>
      ))}
    </StyledChildList>
  )
}

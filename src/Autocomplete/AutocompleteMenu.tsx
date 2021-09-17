import React, { useContext, useEffect, useRef, useState } from 'react'
import { ActionList, ItemProps } from '../ActionList'
import { ItemInput } from '../ActionList/List'
import { useAnchoredPosition } from '../hooks'
import { useFocusZone } from '../hooks/useFocusZone'
import Overlay, { OverlayProps } from '../Overlay'
import { ComponentProps } from '../utils/types'
import { Box, Spinner } from '../';
import { registerPortalRoot } from '../Portal'
import { AutocompleteContext } from './AutocompleteContext'

const DROPDOWN_PORTAL_CONTAINER_NAME = '__listcontainerportal__';

const getDefaultSortFn = (isItemSelectedFn: (itemId: string | number) => boolean) => 
    (itemIdA: string | number, itemIdB: string | number) => isItemSelectedFn(itemIdA) === isItemSelectedFn(itemIdB)
        ? 0
        : isItemSelectedFn(itemIdA)
            ? -1
            : 1;

function scrollIntoViewingArea(
    child: HTMLElement,
    container: HTMLElement,
    margin = 8,
    behavior: ScrollBehavior = 'smooth'
  ) {
    console.log('scrollIntoViewingArea being called')
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

type AutocompleteMenuInternalProps = {
  items: ItemInput[]
  selectedItemIds: Array<string | number>
  // TODO: come up with a better name for this prop
  selectedSortFn?: (itemIdA: string | number, itemIdB: string | number) => number
  // TODO: combine `onItemSelect` and `onItemDeselect` into 1 prop
  onItemSelect?: NonNullable<ItemProps['onAction']>
  onItemDeselect?: NonNullable<ItemProps['onAction']>
  emptyStateText?: React.ReactNode | false
  addNewItem?: Omit<ItemInput, 'onAction'> // TODO: Rethink this prop name. It's confusing.
  loading?: boolean
  selectionVariant?: 'single' | 'multiple'
  filterFn?: (item: ItemInput, i: number) => boolean;
}

const defaultItemFilter = (filterValue: string) => (item: ItemInput, _i: number) =>
  Boolean(item?.text?.toLowerCase().startsWith((filterValue).toLowerCase()));

// TODO:
// insteaad of using `forwardRef`, just use a regular Functional Component
// get rid of unused props
const AutocompleteMenu = React.forwardRef<HTMLInputElement, AutocompleteMenuInternalProps & Pick<OverlayProps, 'width' | 'height' | 'maxHeight'>>(
  ({
      items,
      selectedItemIds,
      selectedSortFn,
      onItemSelect,
      onItemDeselect,
      emptyStateText,
      addNewItem,
      loading,
      selectionVariant,
      filterFn: externalFilterFn,
      width,
      height,
      maxHeight,
    },
    ref) => {
        const {
            activeDescendantRef,
            // filterFn,
            inputRef,
            inputValue = '',
            setAutocompleteSuggestion,
            setShowMenu,
            setInputValue,
            setIsMenuDirectlyActivated,
            showMenu,
        } = useContext(AutocompleteContext)
        const filterFn = externalFilterFn ? externalFilterFn : defaultItemFilter(inputValue);
        const listContainerRef = useRef<HTMLDivElement>(null)
        const scrollContainerRef = useRef<HTMLDivElement>(null)
        const [highlightedItem, setHighlightedItem] = useState<ItemProps & { isDirectlyActivated: boolean } | undefined>();
        // TODO: clean up this mess by making id required on ItemProps
        const [sortedItemIds, setSortedItemIds] = useState<Array<number | string>>(items.map(({id}) => id || id === 0 ? id : ''));

        const {floatingElementRef, position} = useAnchoredPosition(
        {
            side: 'outside-bottom',
            align: 'start',
            anchorElementRef: inputRef
        },
        [showMenu, selectedItemIds]
        )

        const closeOptionList = () => {
            if (setShowMenu) {
                setShowMenu(false);
            }
        }

        const isItemSelected = (itemId: string | number) => items.find(
                (selectableItem) => selectableItem.id === itemId
            )?.selected || selectedItemIds.includes(itemId)

        const itemsToRender: ItemInput[] = [
            // selectable tokens
            ...items.map((selectableItem) => {
                return ({
                    ...selectableItem,
                    //TODO: just make `id` required
                    selected: selectionVariant === 'multiple' ? isItemSelected(selectableItem.id) : undefined,
                    onAction: (item: ItemProps, e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {

                        // TODO: clean up all of these `if/else` statements
                        if (item.selected) {
                            // TODO: make `onItemDeselect` optional
                            if (onItemDeselect) {
                                onItemDeselect(item, e);
                            }

                        } else {
                            // TODO: make `onItemSelect` optional
                            if (onItemSelect) {
                                onItemSelect(item, e);
                            }

                            if (selectionVariant === 'multiple') {
                                if (setInputValue) {
                                    setInputValue('');
                                }
    
                                if (setAutocompleteSuggestion) {
                                    setAutocompleteSuggestion('');
                                }
                            }
                        }

                        if (selectionVariant === 'single') {
                            if (setShowMenu) {
                                setShowMenu(false)
                            }
    
                            if (inputRef?.current) {
                                inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
                            }
                        }
                    }
                })}
            ),
            // menu item used for creating a token from whatever is in the text input
            ...(addNewItem
                ? [{
                    ...addNewItem,
                    onAction: onItemSelect ? (_item: ItemProps, e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
                        onItemSelect({ text: inputValue, id: `randomlyGeneratedId-${inputValue}` }, e)
                    } : undefined
                }]
                : []
            )
        ];

        useFocusZone({
            containerRef: listContainerRef,
            focusOutBehavior: 'wrap',
            focusableElementFilter: element => {
                return !(element instanceof HTMLInputElement)
            },
            activeDescendantFocus: inputRef,
            onActiveDescendantChanged: (current, _previous, directlyActivated) => {
                if (activeDescendantRef) {
                    activeDescendantRef.current = current || null
                }
                if (current) {
                    const selectedItem = itemsToRender.find(item => item.id?.toString() === current?.dataset.id);
                    setHighlightedItem({...selectedItem, isDirectlyActivated: directlyActivated});
    
                    if (setIsMenuDirectlyActivated) {
                        setIsMenuDirectlyActivated(directlyActivated);
                    }
                }

                if (current && scrollContainerRef.current && directlyActivated) {
                    scrollIntoViewingArea(current, scrollContainerRef.current)
                }
            }
        })

        useEffect(() => {
            if (!setAutocompleteSuggestion) {
                return;
            }

            if (highlightedItem?.text?.startsWith(inputValue || '')) {
                setAutocompleteSuggestion(highlightedItem.text);
            } else {
                setAutocompleteSuggestion('');
            }
        }, [highlightedItem, inputValue])

        useEffect(() => {
            setSortedItemIds(
                [...sortedItemIds].sort(selectedSortFn ? selectedSortFn : getDefaultSortFn(isItemSelected))
            )
        }, [showMenu])

        if (listContainerRef.current) {
            registerPortalRoot(listContainerRef.current, DROPDOWN_PORTAL_CONTAINER_NAME)
        }

        const itemSortOrderData = sortedItemIds.reduce<Record<string | number, number>>((acc, curr, i) => {
            acc[curr] = i;

            return acc;
        }, {});
        const sortedAndFilteredItemsToRender = [...(filterFn ? itemsToRender.filter(filterFn) : itemsToRender)].sort((a, b) =>
            itemSortOrderData[a.id] - itemSortOrderData[b.id]
        );
        
        return (
            <div ref={listContainerRef}>
                {showMenu && emptyStateText ? (
                    <Overlay
                        returnFocusRef={inputRef}
                        portalContainerName={DROPDOWN_PORTAL_CONTAINER_NAME}
                        preventFocusOnOpen={true}
                        onClickOutside={closeOptionList}
                        onEscape={closeOptionList}
                        ref={floatingElementRef as React.RefObject<HTMLDivElement>}
                        top={position?.top}
                        left={position?.left}
                        width={width}
                        height={height}
                        maxHeight={maxHeight}
                    >
                        {loading ? (
                            <Box p={3} display="flex" justifyContent="center">
                                <Spinner />
                            </Box>
                        ) : (
                            <>
                                {sortedAndFilteredItemsToRender.length ? (
                                    <ActionList
                                        selectionVariant="multiple"
                                        items={sortedAndFilteredItemsToRender}
                                        role="listbox"
                                    />
                                ) : (
                                    <Box p={3}>{emptyStateText}</Box>
                                )}
                            </>
                        )}
                    </Overlay>
                ) : null}
            </div>
        )
    }
)

AutocompleteMenu.defaultProps = {
    emptyStateText: 'No selectable options',
    selectionVariant: 'single',
}

AutocompleteMenu.displayName = 'AutocompleteMenu'

export type AutocompleteMenuProps = ComponentProps<typeof AutocompleteMenu>
export default AutocompleteMenu

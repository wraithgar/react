import React, { useContext, useEffect, useRef, useState } from 'react'
import { ActionList, ItemProps } from '../ActionList'
import { useAnchoredPosition } from '../hooks'
import { useFocusZone } from '../hooks/useFocusZone'
import Overlay, { OverlayProps } from '../Overlay'
import { ComponentProps } from '../utils/types'
import { Box, Spinner } from '../';
import { registerPortalRoot } from '../Portal'
import { AutocompleteContext } from './AutocompleteContext'
import { useCombinedRefs } from '../hooks/useCombinedRefs'
import { PlusIcon } from '@primer/octicons-react'
import { uniqueId } from '../utils/uniqueId'

type MandateProps<T extends {}, K extends keyof T> = Omit<T, K> & {
    [MK in K]-?: NonNullable<T[MK]>
}
type OnAction<T> = (item: T, event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;

const DROPDOWN_PORTAL_CONTAINER_NAME = '__listcontainerportal__';

const getDefaultSortFn = (isItemSelectedFn: (itemId: string | number) => boolean) => 
    (itemIdA: string | number, itemIdB: string | number) => isItemSelectedFn(itemIdA) === isItemSelectedFn(itemIdB)
        ? 0
        : isItemSelectedFn(itemIdA)
            ? -1
            : 1;

function getDefaultItemFilter<T extends MandateProps<ItemProps, 'id'>>(filterValue: string) {
    return function (item: T, _i: number) {
        return Boolean(
            item.text
                ?.toLowerCase()
                .startsWith((filterValue)
                .toLowerCase())
        )
    }
}

// TODO: DRY this out - it's also in FilteredActionList
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

type AutocompleteMenuInternalProps<T extends MandateProps<ItemProps, 'id'>> = {
  /**
   * A menu item that is used to allow users make a selection that is not available in the array passed to the `items` prop.
   * This menu item gets appended to the end of the list of options.
   */
  // TODO: rethink this part of the component API. this is kind of weird and confusing to use
  addNewItem?: Omit<T, 'onAction' | 'leadingVisual' | 'id'> & {handleAddItem: (item: Omit<T, 'onAction' | 'leadingVisual'>) => void} // TODO: Rethink this prop name. It's confusing.
  /**
   * The text that appears in the menu when there are no options in the array passed to the `items` prop.
   */
  emptyStateText?: React.ReactNode | false
  /**
   * A custom function used to filter the options in the array passed to the `items` prop.
   * By default, we filter out items that don't match the value of the autocomplete text input. The default filter is not case-sensitive.
   */
  filterFn?: (item: T, i: number) => boolean
  /**
   * The options for field values that are displayed in the dropdown menu.
   * One or more may be selected depending on the value of the `selectionVariant` prop.
   */
  items: T[]
  /**
   * The function that is called when an item in the list is de-selected
   */
  // TODO: in the component, pass a default function value
  onItemDeselect?: OnAction<T>
  /**
   * The function that is called when an item in the list is selected
   */
  // TODO: in the component, pass a default function value
  onItemSelect?: OnAction<T>
  /**
   * Whether the data is loaded for the menu items
   */
  loading?: boolean
  /**
   * The IDs of the selected items
   */
  // TODO: try and eliminate the need for a `selectedItemIds` prop
  // COLEHELP
  selectedItemIds: Array<string | number>
  /**
   * The sort function that is applied to the options in the array passed to the `items` prop after the user closes the menu.
   * By default, selected items are sorted to the top after the user closes the menu.
   */
  // TODO: come up with a better name for this prop. maybe "sortOnCloseFn"
  selectedSortFn?: (itemIdA: string | number, itemIdB: string | number) => number
  /**
   * Whether there can be one item selected from the menu or multiple items selected from the menu
   */
  selectionVariant?: 'single' | 'multiple'
}

function getDefaultOnItemSelectFn<T extends MandateProps<ItemProps, 'id'>>(setInputValueFn?: React.Dispatch<React.SetStateAction<string>>): OnAction<T> {
    if (setInputValueFn) {
        return function ({text = ''}) {
            setInputValueFn(text)
        }
    }

    return ({text}) => {
        console.error(`getDefaultOnItemSelectFn could not be called with ${text} because a function to set the text input was undefined`);
    }
}

function AutocompleteMenu<T extends MandateProps<ItemProps, 'id'>>(props: AutocompleteMenuInternalProps<T> & Pick<OverlayProps, 'width' | 'height' | 'maxHeight'>) {
    const {
        activeDescendantRef,
        inputRef,
        inputValue = '',
        setAutocompleteSuggestion,
        setShowMenu,
        setInputValue,
        setIsMenuDirectlyActivated,
        showMenu,
    } = useContext(AutocompleteContext)
    const {
        items,
        selectedItemIds,
        selectedSortFn,
        onItemSelect = getDefaultOnItemSelectFn(setInputValue),
        onItemDeselect,
        emptyStateText,
        addNewItem,
        loading,
        selectionVariant,
        filterFn = getDefaultItemFilter(inputValue),
        width,
        height,
        maxHeight,
    } = props;
    const listContainerRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [highlightedItem, setHighlightedItem] = useState<T>();
    const [sortedItemIds, setSortedItemIds] = useState<Array<number | string>>(items.map(({id}) => id));

    const {floatingElementRef, position} = useAnchoredPosition(
        {
            side: 'outside-bottom',
            align: 'start',
            anchorElementRef: inputRef
        },
        [showMenu, selectedItemIds]
    )

    const combinedOverlayRef = useCombinedRefs(scrollContainerRef, floatingElementRef);

    const closeOptionList = () => {
        if (setShowMenu) {
            setShowMenu(false);
        }
    }

    const isItemSelected = (itemId: string | number) => selectedItemIds.includes(itemId)

    const selectableItems = [
        // selectable tokens
        ...items.map((selectableItem) => {
            return ({
                ...selectableItem,
                id: selectableItem.id,
                selected: selectionVariant === 'multiple' ? isItemSelected(selectableItem.id) : undefined,
                onAction: (item: T, e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
                    const handleItemSelection = () => {
                        onItemSelect(item, e)

                        if (selectionVariant === 'multiple') {
                            setInputValue && setInputValue('')
                            setAutocompleteSuggestion && setAutocompleteSuggestion('')
                        }
                    }

                    if (item.selected) {
                        onItemDeselect && onItemDeselect(item, e)
                    } else {
                        handleItemSelection()
                    }

                    if (selectionVariant === 'single') {
                        setShowMenu && setShowMenu(false)
                        inputRef?.current?.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length)
                    }
                }
            })}
        ),
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
                const selectedItem = selectableItems.find(item => item.id.toString() === current?.dataset.id);
                setHighlightedItem(selectedItem)

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

        if (highlightedItem?.text?.startsWith(inputValue)) {
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

    const sortedAndFilteredItemsToRender =
        selectableItems.filter(
            // TODO: get rid of typecast
            //       w/o it, I get error `assignable to the constraint of type 'T', but 'T' could be instantiated with a different subtype of constraint 'MandateProps<ItemProps, "id">'`
            // COLEHELP
            (item, i) => filterFn(item as T, i)
        ).sort((a, b) => itemSortOrderData[a.id] - itemSortOrderData[b.id]);

    const allItemsToRender = [
        // sorted and filtered selectable items
        ...sortedAndFilteredItemsToRender,

        // menu item used for creating a token from whatever is in the text input
        ...(addNewItem
            ? [{
                ...addNewItem,
                leadingVisual: () => ( <PlusIcon /> ),
                onAction: (item: T, e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
                    // TODO: clean up this hacky-ness
                    addNewItem.handleAddItem({...item, id: item.id || uniqueId(), leadingVisual: undefined})

                    if (selectionVariant === 'multiple') {
                        setInputValue && setInputValue('')
                        setAutocompleteSuggestion && setAutocompleteSuggestion('')
                    }
                }
            }]
            : []
        )]

    return (
        <div ref={listContainerRef}>
            {showMenu && emptyStateText ? (
                <Overlay
                    returnFocusRef={inputRef}
                    portalContainerName={DROPDOWN_PORTAL_CONTAINER_NAME}
                    preventFocusOnOpen={true}
                    onClickOutside={closeOptionList}
                    onEscape={closeOptionList}
                    ref={combinedOverlayRef as React.RefObject<HTMLDivElement>}
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
                            {allItemsToRender.length ? (
                                <ActionList
                                    selectionVariant="multiple"
                                    // TODO: get rid of typecast
                                    // COLEHELP
                                    items={allItemsToRender as ItemProps[]}
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

AutocompleteMenu.defaultProps = {
    emptyStateText: 'No selectable options',
    selectionVariant: 'single',
}

AutocompleteMenu.displayName = 'AutocompleteMenu'

export type AutocompleteMenuProps = ComponentProps<typeof AutocompleteMenu>
export default AutocompleteMenu

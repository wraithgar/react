import {
  isAfter,
  isBefore,
  addMonths,
  subMonths,
  isWeekend,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  isSaturday,
  isSunday,
  nextSaturday,
  previousFriday,
  previousSunday,
  subYears,
  addYears,
  nextMonday,
  isMonday,
  previousMonday,
  isFriday,
  nextFriday,
  format
} from 'date-fns'
import React, {useCallback, useMemo, useRef} from 'react'
import Box from '../Box'
import {Month} from './Month'
import styled from 'styled-components'
import {COMMON, get, SystemCommonProps, SystemTypographyProps, TYPOGRAPHY} from '../constants'
import {useDatePicker} from './useDatePicker'
import {ChevronLeftIcon, ChevronRightIcon} from '@primer/octicons-react'
import StyledOcticon from '../StyledOcticon'
import Button, {ButtonPrimary} from '../Button'
import sx, {SxProp} from '../sx'
import {useFocusZone} from '../hooks/useFocusZone'
import {Direction, FocusKeys} from '../behaviors/focusZone'
import {sanitizeDate} from './utils'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const DatePickerPanelContainer = styled(Box)`
  align-items: stretch;
  background-color: ${get('colors.canvas.default')};
  display: flex;
  flex-direction: column;
  position: relative;
`

const DatePickerTopNav = styled(Box)`
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: ${get('space.3')};
  z-index: 10;
`

const DatePickerPanelMonths = styled(Box)`
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  gap: ${get('space.6')};
  margin-top: ${get('space.1')};
  padding: ${get('space.3')};
  position: relative;
`

const DatePickerPanelFooter = styled(Box)`
  align-items: flex-start;
  border-top: 1px solid;
  border-top-color: ${get('colors.border.default')};
  display: flex;

  gap: ${get('space.6')};
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: ${get('space.3')};
  padding-right: ${get('space.3')};
  flex-direction: row;
  justify-content: space-between;
  position: relative;
`

const ArrowButton = styled(Button)`
  width: 40px;
  height: 28px;
`

const Select = styled.select<SystemTypographyProps & SystemCommonProps & SxProp>`
  background: ${get('colors.canvas.default')};
  border: 0;
  color: ${get('colors.fg.default')};
  font-weight: 600;
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`

const Option = styled.option<SystemTypographyProps & SystemCommonProps & SxProp>`
  background: ${get('colors.canvas.default')};
  border: 0;
  color: ${get('colors.fg.default')};
  font-weight: 400;
  padding: ${get('space.2')} ${get('space.2')};
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`

export const DatePickerPanel = () => {
  const {
    configuration,
    saveValue,
    revertValue,
    currentViewingDate,
    goToMonth,
    nextMonth,
    previousMonth,
    onDateHover,
    setFocusDate,
    viewMode
  } = useDatePicker()
  const panelRef = useRef(null)
  const headerRef = useRef(null)
  const datePanelRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef(null)

  // #region Focus Zones
  const getNextFocusable = useCallback(
    (_: Direction, from: Element | undefined, event: KeyboardEvent): HTMLElement | undefined => {
      const key = event.key
      const {disableWeekends, minDate, maxDate} = configuration
      const fromDate = from?.getAttribute('data-date')
      const focusDate = fromDate ? new Date(fromDate) : new Date()

      let newDate = sanitizeDate(focusDate)
      switch (key) {
        case 'ArrowRight': {
          // Increase selection by 1 day
          newDate = sanitizeDate(addDays(focusDate, 1))
          if (maxDate && isAfter(newDate, maxDate)) newDate = maxDate
          if (disableWeekends && isWeekend(newDate)) {
            const monday = nextMonday(newDate)
            newDate = maxDate && isAfter(monday, maxDate) ? maxDate : monday
          }
          setFocusDate(newDate)
          onDateHover(newDate)
          break
        }
        case 'ArrowLeft': {
          // Decrease selection by 1 day
          newDate = sanitizeDate(subDays(focusDate, 1))
          if (minDate && isBefore(newDate, minDate)) newDate = minDate
          if (disableWeekends && isWeekend(newDate)) {
            const friday = previousFriday(newDate)
            newDate = minDate && isBefore(friday, minDate) ? minDate : friday
          }
          setFocusDate(newDate)
          onDateHover(newDate)
          break
        }
        case 'ArrowUp': {
          // Decrease selection by 1 week
          newDate = sanitizeDate(subWeeks(focusDate, 1))
          if (minDate && isBefore(newDate, minDate)) newDate = minDate
          setFocusDate(newDate)
          onDateHover(newDate)
          break
        }
        case 'ArrowDown': {
          // Increase selection by 1 week
          newDate = sanitizeDate(addWeeks(focusDate, 1))
          if (maxDate && isAfter(newDate, maxDate)) newDate = maxDate
          setFocusDate(newDate)
          onDateHover(newDate)
          break
        }
        case 'Home': {
          // Go to beginning of the week
          newDate = focusDate
          if (disableWeekends) {
            newDate = sanitizeDate(isMonday(focusDate) ? focusDate : previousMonday(focusDate))
          } else {
            newDate = sanitizeDate(isSunday(focusDate) ? focusDate : previousSunday(focusDate))
          }

          if (minDate && isBefore(newDate, minDate)) newDate = minDate
          setFocusDate(newDate)
          onDateHover(newDate)
          break
        }
        case 'End': {
          // Go to end of the week
          newDate = focusDate
          if (disableWeekends) {
            newDate = sanitizeDate(isFriday(focusDate) ? focusDate : nextFriday(focusDate))
          } else {
            newDate = sanitizeDate(isSaturday(focusDate) ? focusDate : nextSaturday(focusDate))
          }

          if (maxDate && isAfter(newDate, maxDate)) newDate = maxDate
          setFocusDate(newDate)
          onDateHover(newDate)
          break
        }
        case 'PageUp': {
          // Decrease 1 Month, or with Shift, 1 year
          newDate = sanitizeDate(event.shiftKey ? subYears(focusDate, 1) : subMonths(focusDate, 1))
          if (minDate && isBefore(newDate, minDate)) newDate = minDate
          setFocusDate(newDate)
          onDateHover(newDate)
          break
        }
        case 'PageDown': {
          // Increase 1 Month, or with Shift, 1 year
          newDate = sanitizeDate(event.shiftKey ? addYears(focusDate, 1) : addMonths(focusDate, 1))
          if (maxDate && isAfter(newDate, maxDate)) newDate = maxDate
          setFocusDate(newDate)
          onDateHover(newDate)
          break
        }
        default: {
          break
        }
      }

      return datePanelRef.current?.querySelector(`[data-date="${format(newDate, 'MM/dd/yyyy')}"]`) ?? undefined
    },
    [configuration, onDateHover, setFocusDate]
  )

  // Configure FocusZones
  useFocusZone({
    containerRef: headerRef,
    bindKeys: FocusKeys.Tab,
    focusInStrategy: 'closest'
  })

  useFocusZone(
    {
      containerRef: datePanelRef,
      bindKeys: FocusKeys.ArrowAll | FocusKeys.HomeAndEnd | FocusKeys.PageUpDown,
      focusInStrategy: 'previous',
      getNextFocusable
    },
    [getNextFocusable]
  )

  useFocusZone({
    containerRef: footerRef,
    bindKeys: FocusKeys.Tab,
    focusInStrategy: 'closest'
  })
  // #endregion

  const previousDisabled = useMemo(() => {
    const {minDate} = configuration
    if (!minDate) return false

    const previous = subMonths(currentViewingDate, 1)
    if (minDate.getFullYear() >= previous.getFullYear() && minDate.getMonth() > previous.getMonth()) {
      return true
    }

    return false
  }, [configuration, currentViewingDate])

  const nextDisabled = useMemo(() => {
    const {maxDate, view} = configuration
    if (!maxDate) return false

    const next = addMonths(currentViewingDate, view === '2-month' ? 2 : 1)
    if (maxDate.getFullYear() <= next.getFullYear() && maxDate.getMonth() < next.getMonth()) {
      return true
    }

    return false
  }, [configuration, currentViewingDate])

  const currentMonth = useMemo(() => currentViewingDate.getMonth(), [currentViewingDate])
  const currentYear = useMemo(() => currentViewingDate.getFullYear(), [currentViewingDate])

  const headerSelectionHandler = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selection = parseInt(e.currentTarget.value, 10)
      if (e.currentTarget.id === 'picker-header-year') {
        goToMonth(new Date(selection, currentMonth))
      } else {
        goToMonth(new Date(currentYear, selection))
      }
    },
    [currentMonth, currentYear, goToMonth]
  )

  const getMonthPicker = useMemo(() => {
    const {minDate, maxDate} = configuration
    let filteredMonths = months
    const monthElements = []
    if (minDate && currentYear === minDate.getFullYear()) {
      filteredMonths = filteredMonths.slice(minDate.getMonth())
    }
    if (maxDate && currentYear === maxDate.getFullYear()) {
      filteredMonths = filteredMonths.slice(-(12 - maxDate.getMonth()))
    }
    for (let i = 0; i < filteredMonths.length; i++) {
      monthElements.push(
        <Option key={i} value={months.indexOf(filteredMonths[i])}>
          {filteredMonths[i]}
        </Option>
      )
    }

    return (
      <Select id="picker-header-month" onChange={headerSelectionHandler} sx={{mr: '6px'}} value={currentMonth}>
        {monthElements}
      </Select>
    )
  }, [configuration, currentMonth, currentYear, headerSelectionHandler])
  const getYearPicker = useMemo(() => {
    const {minDate, maxDate} = configuration
    const years = []
    const todaysYear = sanitizeDate(new Date()).getFullYear()
    const minYear = minDate ? minDate.getFullYear() : todaysYear - 200
    const maxYear = maxDate ? maxDate.getFullYear() : todaysYear + 200
    for (let i = minYear; i <= maxYear; i++) {
      years.push(
        <Option key={i} value={i}>
          {i}
        </Option>
      )
    }

    return (
      <Select id="picker-header-year" onChange={headerSelectionHandler} value={currentYear}>
        {years}
      </Select>
    )
  }, [configuration, currentYear, headerSelectionHandler])

  return (
    <DatePickerPanelContainer ref={panelRef} data-testId="datepicker-panel">
      <DatePickerTopNav ref={headerRef}>
        {configuration.compressedHeader && (
          <Box data-testId="datepicker-compressed-header" sx={{flex: 1}}>
            {getMonthPicker}
            {getYearPicker}
          </Box>
        )}
        <ArrowButton
          variant="small"
          sx={{mr: 1}}
          onClick={previousMonth}
          disabled={previousDisabled}
          aria-label="Previous Month"
          aria-live="polite"
          data-testId="previous-button"
        >
          <StyledOcticon icon={ChevronLeftIcon} color="fg.muted" />
        </ArrowButton>
        <ArrowButton
          variant="small"
          onClick={nextMonth}
          disabled={nextDisabled}
          aria-label="Next Month"
          aria-live="polite"
          data-testId="next-button"
        >
          <StyledOcticon icon={ChevronRightIcon} color="fg.muted" />
        </ArrowButton>
      </DatePickerTopNav>
      <DatePickerPanelMonths ref={datePanelRef}>
        <Month date={currentViewingDate} />
        {viewMode === '2-month' && <Month date={addMonths(currentViewingDate, 1)} />}
      </DatePickerPanelMonths>
      <DatePickerPanelFooter ref={footerRef}>
        <Box>
          <Button
            variant="small"
            sx={{mr: 1}}
            onClick={() => revertValue()}
            aria-label="Reset Selection"
            aria-live="polite"
          >
            Reset
          </Button>
          <Button variant="small" onClick={() => goToMonth(new Date())} aria-label="Go to Today" aria-live="polite">
            Today
          </Button>
        </Box>
        {(configuration.confirmation || configuration.confirmUnsavedClose) && (
          <ButtonPrimary
            variant="small"
            onClick={() => saveValue()}
            aria-label="Apply Selection"
            aria-live="polite"
            data-testId="datepicker-apply"
          >
            Apply
          </ButtonPrimary>
        )}
      </DatePickerPanelFooter>
    </DatePickerPanelContainer>
  )
}

import React from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, ThemeProvider} from '..'
import {DatePicker, DatePickerProps} from '../DatePicker'
import {Day, DayProps} from '../DatePicker/Day'
import {Month, MonthProps} from '../DatePicker/Month'
import {DatePickerAnchor, DatePickerAnchorProps} from '../DatePicker/DatePickerAnchor'
import {addDays} from 'date-fns'

export default {
  title: 'Composite components/DatePicker',
  parameters: {
    layout: 'centered'
  },
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <div style={{display: 'flex'}}>
              <Story />
            </div>
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  argTypes: {
    as: {
      table: {
        disable: true
      }
    },
    theme: {
      table: {
        disable: true
      }
    },
    sx: {
      table: {
        disable: true
      }
    },
    dateFormat: {
      control: {
        type: 'select',
        options: ['short', 'long']
      }
    }
  }
} as Meta

export const defaultDatePicker = (args: DatePickerProps) => <DatePicker {...args} />

export const DatePickerAnchorControl = (args: DatePickerAnchorProps) => <DatePickerAnchor {...args} />
DatePickerAnchorControl.args = {
  iconOnly: false,
  fromDate: new Date(),
  toDate: addDays(new Date(), 7),
  dateFormat: 'short'
}

export const DayControl = (args: DayProps) => <Day {...args} />
DayControl.args = {date: new Date(), disabled: false, blocked: false, selected: false}

export const MonthControl = (args: MonthProps) => <Month {...args} />
MonthControl.args = {month: new Date().getMonth(), year: new Date().getFullYear()}

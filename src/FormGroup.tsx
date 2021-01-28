import styled from 'styled-components'
import {COMMON, get, TYPOGRAPHY, SystemCommonProps, SystemTypographyProps} from './constants'
import theme from './theme'
import sx, {SxProp} from './sx'
import type {FunctionComponent} from 'react'

type FormGroupProps = SystemCommonProps & SxProp;
type FormGroupLabelProps = SystemTypographyProps & SystemCommonProps & SxProp

const _FormGroup = styled.div<FormGroupProps>`
  margin: ${get('space.3')} 0;
  font-weight: ${get('fontWeights.normal')};
  ${COMMON};
  ${sx};
`
_FormGroup.defaultProps = {theme}

const Label = styled.label<FormGroupLabelProps>`
  display: block;
  margin: 0 0 ${get('space.2')};
  font-size: ${get('fontSizes.1')};
  font-weight: ${get('fontWeights.bold')};
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`
Label.defaultProps = {theme}

const FormGroup: FunctionComponent<FormGroupProps> & Partial<{
  Label: FunctionComponent<FormGroupLabelProps>
}> = _FormGroup
FormGroup.Label = Label;

export default FormGroup as Required<typeof FormGroup>;
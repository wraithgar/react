import styled from 'styled-components'
import {COMMON, get, TYPOGRAPHY, SystemCommonProps, SystemTypographyProps} from './constants'
import theme from './theme'
import sx, {SxProp} from './sx'
import type {FunctionComponent} from 'react'

type FormGroupProps = SystemCommonProps & SxProp;
type FormGroupLabelProps = SystemTypographyProps & SystemCommonProps & SxProp

const formGroupDefaultProps = {theme}
const FormGroup: FunctionComponent<FormGroupProps & typeof formGroupDefaultProps> & Partial<{
  Label: FunctionComponent<FormGroupLabelProps & typeof labelDefaultProps>
}> = styled.div<FormGroupProps>`
  margin: ${get('space.3')} 0;
  font-weight: ${get('fontWeights.normal')};
  ${COMMON};
  ${sx};
`
FormGroup.defaultProps = formGroupDefaultProps

const labelDefaultProps = {theme}
FormGroup.Label = styled.label<FormGroupLabelProps>`
  display: block;
  margin: 0 0 ${get('space.2')};
  font-size: ${get('fontSizes.1')};
  font-weight: ${get('fontWeights.bold')};
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`
FormGroup.Label.defaultProps = labelDefaultProps

export default FormGroup as Required<typeof FormGroup>;
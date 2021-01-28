import styled from "styled-components";
import sx, { SxProp } from "../sx";

export interface StyledSpanProps extends SxProp {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export const StyledSpan = styled.span<StyledSpanProps>`${sx}`
/// <reference path="../typings/@styled-system/prop-types/index.d.ts" />

import systemPropTypes from '@styled-system/prop-types';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import {ColorProps, SpaceProps, space} from 'styled-system';

import {get} from './constants';
import theme from './theme';

interface BaseProps extends React.Props<any> {
  as?: React.ReactType;
  className?: string;
  css?: string;
  title?: string;
  theme?: {[key: string]: any};
}

interface CommonProps extends BaseProps, ColorProps, SpaceProps {}

function borderRadius({size}: {size: number}) {
  return {
    borderRadius: size <= 24 ? '2px' : '3px'
  };
}

export interface AvatarProps extends CommonProps, Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'color'> {
  isChild?: boolean;
  size?: number;
}
const Avatar: React.FunctionComponent<AvatarProps> = styled.img.attrs((props: AvatarProps) => ({
  height: props.size,
  width: props.size,
  alt: props.alt
}))`
  display: inline-block;
  overflow: hidden; // Ensure page layout in Firefox should images fail to load
  line-height: ${get('lineHeights.condensedUltra')};
  vertical-align: middle;
  ${borderRadius};
  ${space};
`;

Avatar.defaultProps = {
  theme,
  size: 20,
  alt: ''
};

Avatar.propTypes = {
  alt: PropTypes.string.isRequired,
  size: PropTypes.number,
  src: PropTypes.string,
  ...systemPropTypes.space,
  theme: PropTypes.object
};

export default Avatar;

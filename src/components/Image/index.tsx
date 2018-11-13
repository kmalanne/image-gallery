import React, { SFC } from 'react';
import { classNames } from '../../utils/classNames';
import './index.css';

export const Image: SFC<IImage> = props => {
  const { header, thumbnailUrl } = props;

  const className = classNames([['gallery-image', true], ['header', header]]);

  return (
    <div className={className}>
      <img src={thumbnailUrl} />
    </div>
  );
};

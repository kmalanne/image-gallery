import React, { SFC } from 'react';

export const Image: SFC<IImage> = props => {
  const { className, thumbnailUrl } = props;

  return (
    <React.Fragment>
      <img className={className} src={thumbnailUrl} />
    </React.Fragment>
  );
};

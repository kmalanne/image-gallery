import React, { Component } from 'react';

export interface ImageProps {
  className: string;
  id: number;
  onClick?: (id: number) => void;
  src?: string;
  url?: string;
  thumbnailUrl?: string;
}

export class Image extends Component<ImageProps, {}> {
  handleClick = (
    event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  ) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.props.onClick) {
      this.props.onClick(this.props.id);
    }
  };

  render() {
    const { className, src } = this.props;

    return (
      <React.Fragment>
        <img className={className} src={src} onClick={this.handleClick} />
      </React.Fragment>
    );
  }
}

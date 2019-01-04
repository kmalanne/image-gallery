import React, { Component } from 'react';

export interface ImageProps {
  className: string;
  id: number;
  onClick?: (id: number) => void;
  src?: string;
  url?: string;
  thumbnailUrl?: string;
}

export interface ImageState {
  imageLoaded: boolean;
  dimensions: {
    width: number;
    height: number;
  };
}

const initialState = {
  imageLoaded: false,
  dimensions: {
    width: 0,
    height: 0,
  },
};
type State = Readonly<typeof initialState>;

export class Image extends Component<ImageProps, ImageState> {
  readonly state: State = initialState;
  private containerRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    if (!this.containerRef.current) {
      return;
    }

    this.setState({
      dimensions: {
        width: this.containerRef.current.offsetWidth,
        height: this.containerRef.current.offsetHeight,
      },
    });
  }

  handleImageLoaded = () => {
    this.setState({ imageLoaded: true });
  };

  handleClick = (
    event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  ) => {
    const { id, onClick } = this.props;

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (onClick) {
      onClick(id);
    }
  };

  render() {
    const { className, src } = this.props;
    const width = this.state.dimensions.width;
    const height = this.state.dimensions.height;

    return (
      <React.Fragment>
        {!this.state.imageLoaded && (
          <div ref={this.containerRef}>
            <svg width={width} height={height} viewBox="0 0 50 50">
              <rect width={width} height={height} fill="#bdc3c7" />
            </svg>
          </div>
        )}
        <img
          className={className}
          src={src}
          onClick={this.handleClick}
          onLoad={this.handleImageLoaded}
        />
      </React.Fragment>
    );
  }
}

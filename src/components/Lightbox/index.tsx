import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Image, ImageProps } from '../Image';

export interface LightboxProps {
  currentImage: number;
  images: Array<ImageProps>;
  onClose: () => void;
}

export interface LightboxState {
  imageLoaded: boolean;
}

const initialState = {
  imageLoaded: false,
};
type State = Readonly<typeof initialState>;

export class Lightbox extends Component<LightboxProps, LightboxState> {
  readonly state: State = initialState;

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }

  handleKeyDown = (event: KeyboardEvent): void => {
    switch (event.keyCode) {
      case 13:
      case 27:
      // close
      case 37:
      // left
      case 39:
      // right
      default:
        return;
    }
  };

  handleClose = (
    event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  ): void => {
    event.preventDefault();

    if ((event.target as HTMLElement).id === 'lightbox-backdrop') {
      this.props.onClose();
    }
  };

  handleClickImage = () => {};

  renderImages = () => {
    const { currentImage, images } = this.props;

    const image = images[currentImage];

    return (
      <Image
        className="lightbox-image"
        id={currentImage}
        onClick={this.handleClickImage}
        src={image.url}
      />
    );
  };

  render() {
    return ReactDOM.createPortal(
      <div
        id="lightbox-backdrop"
        className="lightbox-backdrop"
        onClick={this.handleClose}
      >
        <div className="lightbox">
          {/* <button className="lightbox-close-button" aria-label="Close Modal" onClick={this.handleClose}>
            <span className="lightbox-close-hide">Close</span>
            <svg className="lightbox-close-icon" viewBox="0 0 40 40">
              <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
            </svg>
          </button> */}
          <div className="lightbox-content">{this.renderImages()}</div>
        </div>
      </div>,
      document.body
    );
  }
}

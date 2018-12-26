import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Image, ImageProps } from '../Image';
import { Icon } from '../Icon';
import { ICONS } from '../../utils/constants';

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
        this.props.onClose();
      case 37:
        this.goToPreviousImage();
      case 39:
        this.goToNextImage();
      default:
        return;
    }
  };

  handleClose = (
    event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  ): void => {
    event.preventDefault();

    if ((event.target as HTMLElement).id === 'lightbox') {
      this.props.onClose();
    }
  };

  handleClickImage = () => {};

  goToPreviousImage = () => {};

  goToNextImage = () => {};

  renderImage = () => {
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

  renderPreviousArrow = () => {
    if (this.props.currentImage === 0) {
      return null;
    }

    return (
      <button
        className="lightbox-button"
        aria-label="Previous"
        onClick={this.goToPreviousImage}
      >
        <Icon icon={ICONS.ARROW_LEFT} size={48} />
      </button>
    );
  };

  renderNextArrow = () => {
    const { currentImage, images } = this.props;

    if (currentImage === images.length - 1) {
      return null;
    }

    return (
      <button
        className="lightbox-button"
        aria-label="Next"
        onClick={this.goToNextImage}
      >
        <Icon icon={ICONS.ARROW_RIGHT} size={48} />
      </button>
    );
  };

  render() {
    return ReactDOM.createPortal(
      <div className="lightbox-backdrop">
        <div id="lightbox" className="lightbox" onClick={this.handleClose}>
          <button
            className="lightbox-button lightbox-close-button"
            aria-label="Close Modal"
            onClick={this.handleClose}
          >
            <span className="lightbox-close-text">Close</span>
            <Icon icon={ICONS.CLOSE} />
          </button>
          <div className="lightbox-content">
            {this.renderPreviousArrow()}
            {this.renderImage()}
            {this.renderNextArrow()}
          </div>
        </div>
      </div>,
      document.body
    );
  }
}

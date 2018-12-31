import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Image as LightboxImage, ImageProps } from '../Image';
import { Icon } from '../Icon';
import { ICONS } from '../../utils/constants';

export interface LightboxProps {
  currentImage: number;
  images: Array<ImageProps>;
  onClickImage: () => void;
  onClickNext: () => void;
  onClickPrevious: () => void;
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

    this.preloadImage(this.props.currentImage, this.handleImageLoaded);
  }

  componentDidUpdate(prevProps: LightboxProps) {
    const { currentImage, images } = this.props;
    const currentIndex = currentImage;
    const nextIndex = currentImage + 1;
    const prevIndex = currentImage - 1;

    let preloadIndex;
    if (currentIndex && prevProps.currentImage < currentIndex) {
      preloadIndex = nextIndex;
    } else if (currentIndex && prevProps.currentImage > currentIndex) {
      preloadIndex = prevIndex;
    }

    if (preloadIndex) {
      this.preloadImage(preloadIndex);
    } else {
      this.preloadImage(prevIndex);
      this.preloadImage(nextIndex);
    }

    if (this.props.currentImage !== prevProps.currentImage) {
      const image = this.preloadImageData(
        images[currentImage],
        this.handleImageLoaded
      );

      if (image) {
        this.setState({ imageLoaded: image.complete });
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }

  handleKeyDown = (event: KeyboardEvent): boolean => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    switch (event.keyCode) {
      case 13: // enter
      case 27: // esc
        this.close();
        return true;
      case 37: // left
        this.goToPreviousImage();
        return true;
      case 39: // right
        this.goToNextImage();
        return true;
      default:
        return false;
    }
  };

  handleClose = (
    event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  ): void => {
    event.preventDefault();

    this.close();
  };

  handleClickBackdrop = (
    event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  ): void => {
    event.preventDefault();

    if ((event.target as HTMLElement).id === 'lightbox') {
      this.close();
    }
  };

  handleClickImage = () => {
    this.props.onClickImage();
  };

  close = () => {
    this.props.onClose();
  };

  preloadImage(index: number, onload?: () => void) {
    return this.preloadImageData(this.props.images[index], onload);
  }

  preloadImageData(imageData: ImageProps, onload?: () => void) {
    if (!imageData) {
      return;
    }

    const image = new Image();
    //image.onerror = onload as ErrorEventHandler;
    image.onload = onload ? onload : null;
    image.src = imageData.url ? imageData.url : '';

    return image;
  }

  handleImageLoaded = () => {
    this.setState({ imageLoaded: true });
  };

  goToPreviousImage = (
    event?: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  ) => {
    const { currentImage } = this.props;

    if (currentImage === 0) {
      return;
    }

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.props.onClickPrevious();
  };

  goToNextImage = (
    event?: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  ) => {
    const { currentImage, images } = this.props;

    if (currentImage === images.length - 1) {
      return;
    }

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.props.onClickNext();
  };

  renderImage = () => {
    const { currentImage, images } = this.props;
    const image = images[currentImage];

    return (
      <figure>
        <LightboxImage
          className="lightbox-image"
          id={currentImage}
          onClick={this.handleClickImage}
          src={image.url}
        />
      </figure>
    );
  };

  renderPreviousArrow = () => {
    if (this.props.currentImage === 0) {
      return null;
    }

    return (
      <button
        className="lightbox-button lightbox-button-previous"
        aria-label="Previous"
        onClick={this.goToPreviousImage}
      >
        <Icon icon={ICONS.ARROW_LEFT} size={72} />
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
        className="lightbox-button lightbox-button-next"
        aria-label="Next"
        onClick={this.goToNextImage}
      >
        <Icon icon={ICONS.ARROW_RIGHT} size={72} />
      </button>
    );
  };

  render() {
    const { imageLoaded } = this.state;

    return ReactDOM.createPortal(
      <div className="lightbox-backdrop">
        <div
          id="lightbox"
          className="lightbox"
          onClick={this.handleClickBackdrop}
        >
          <button
            className="lightbox-button lightbox-button-close"
            aria-label="Close Modal"
            onClick={this.handleClose}
          >
            <span className="lightbox-close-text">Close</span>
            <Icon icon={ICONS.CLOSE} />
          </button>
          <div className="lightbox-content">{this.renderImage()}</div>
          {imageLoaded && this.renderPreviousArrow()}
          {imageLoaded && this.renderNextArrow()}
        </div>
      </div>,
      document.body
    );
  }
}

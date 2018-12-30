import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Image, ImageProps } from '../Image';
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

export class Lightbox extends Component<LightboxProps, {}> {
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false);
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

  handleClickBackdrop = (
    event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  ): void => {
    event.preventDefault();

    if ((event.target as HTMLElement).id === 'lightbox') {
      this.close();
    }
  };

  close = () => this.props.onClose();

  handleClickImage = () => this.props.onClickImage();

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
        <Image
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
            onClick={this.close}
          >
            <span className="lightbox-close-text">Close</span>
            <Icon icon={ICONS.CLOSE} />
          </button>
          <div className="lightbox-content">{this.renderImage()}</div>
          {this.renderPreviousArrow()}
          {this.renderNextArrow()}
        </div>
      </div>,
      document.body
    );
  }
}

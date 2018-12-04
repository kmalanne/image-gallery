import React, { Component } from 'react';
import { Image } from '../Image';

export class Lightbox extends Component {
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

  closeModal = (
    event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  ): void => {
    event.preventDefault();

    if ((event.target as HTMLElement).id === 'modal') {
      // close
    }
  };

  render() {
    return (
      <React.Fragment>
        <div
          id="modal"
          className="modal_container"
          onClick={this.closeModal}
          onTouchEnd={this.closeModal}
        >
          <div className="modal_content">
            <Image
              id="modal-image"
              className="modal-image"
              thumbnailUrl={''}
              url={''}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

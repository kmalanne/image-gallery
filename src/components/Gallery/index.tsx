import React, { Component } from 'react';
import './index.css';
import { Image, ImageProps } from '../Image';
import { Lightbox } from '../Lightbox';
import { LoadingIndicator } from '../LoadingIndicator';
import { classNames } from '../../utils/classNames';

export interface GalleryState {
  currentImage?: number;
  error: boolean;
  hasMore: boolean;
  images: Array<ImageProps>;
  loading: boolean;
  modalOpen: boolean;
}

const initialState = {
  currentImage: -1,
  error: false,
  hasMore: true,
  images: [],
  loading: false,
  modalOpen: false,
};
type State = Readonly<typeof initialState>;

const styleClasses = ['', 'big', 'horizontal', 'vertical'];

export class Gallery extends Component<{}, GalleryState> {
  readonly state: State = initialState;

  constructor(props: any) {
    super(props);

    window.onscroll = () => {
      const { error, loading, hasMore } = this.state;

      if (error || loading || !hasMore) {
        return;
      }

      if (
        document.documentElement &&
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 60
      ) {
        this.fetchImages();
      }
    };
  }

  componentDidMount() {
    this.fetchImages();
  }

  fetchImages = async (): Promise<void> => {
    this.setState({ loading: true });

    try {
      // const response: any = await fetch(
      //   'https://jsonplaceholder.typicode.com/albums/1/photos'
      // );
      // const json = await response.json();

      // const nextImages = json.map((image: ImageProps, index: number) => ({
      //   className: this.getImageClass(index),
      //   id: this.state.images.length + index,
      //   thumbnailUrl: image.thumbnailUrl,
      //   url: image.url,
      // }));

      let nextImages: Array<ImageProps> = [];
      for (let i = 0; i < 50; i++) {
        nextImages.push({
          className: this.getImageClass(i),
          id: this.state.images.length + i,
          thumbnailUrl: 'https://source.unsplash.com/random/400x200',
          url: 'https://source.unsplash.com/random/800x600',
        });
      }

      this.setState({
        hasMore: true,
        loading: false,
        images: [...this.state.images, ...nextImages],
      });
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  };

  getImageClass = (index: number) => {
    const style =
      styleClasses[Math.floor(Math.random() * Math.floor(styleClasses.length))];

    return classNames([
      ['gallery-image', true],
      [style, index !== 0 && index % 4 === 0 && true],
    ]);
  };

  goToNextImage = () => {
    this.setState({
      currentImage: this.state.currentImage + 1,
    });
  };

  goToPreviousImage = () => {
    this.setState({
      currentImage: this.state.currentImage - 1,
    });
  };

  openLightbox = (imageId?: number) => {
    if (document.documentElement) {
      document.documentElement.style.overflow = 'hidden';
    }

    this.setState({ modalOpen: true, currentImage: imageId });
  };

  closeLightbox = () => {
    if (document.documentElement) {
      document.documentElement.style.overflow = 'scroll';
    }

    this.setState({ modalOpen: false, currentImage: -1 });
  };

  handleClickImage = (imageId?: number) => {
    this.openLightbox(imageId);
  };

  handleClickLightboxImage = () => {
    const { currentImage, images } = this.state;

    if (currentImage === images.length - 1) {
      return;
    }

    this.goToNextImage();
  };

  handleLightboxClose = () => {
    this.closeLightbox();
  };

  handleClickLightboxNext = () => {
    this.goToNextImage();
  };

  handleClickLightboxPrevious = () => {
    this.goToPreviousImage();
  };

  render() {
    const { currentImage, error, images, loading, modalOpen } = this.state;

    return (
      <React.Fragment>
        <div className="gallery">
          {images.map((image: ImageProps) => (
            <Image
              key={image.id}
              className={image.className}
              id={image.id}
              onClick={this.handleClickImage}
              src={image.thumbnailUrl}
            />
          ))}
        </div>
        {loading && (
          <div className="gallery-loading-indicator">
            <LoadingIndicator />
          </div>
        )}
        {error && <div className="gallery-error">{error}</div>}
        {modalOpen && (
          <Lightbox
            currentImage={currentImage}
            images={images}
            onClickImage={this.handleClickLightboxImage}
            onClickNext={this.handleClickLightboxNext}
            onClickPrevious={this.handleClickLightboxPrevious}
            onClose={this.handleLightboxClose}
          />
        )}
      </React.Fragment>
    );
  }
}

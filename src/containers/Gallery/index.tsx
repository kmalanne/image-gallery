import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './index.css';
import { Image, ImageProps } from '../../components/Image';
import { Lightbox } from '../../components/Lightbox';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { classNames } from '../../utils/classNames';

export interface GalleryProps {
  album: string;
}

export interface GalleryState {
  albumId: number;
  currentImage?: number;
  error: boolean;
  hasMore: boolean;
  images: Array<ImageProps>;
  lastId: number;
  loading: boolean;
  modalOpen: boolean;
}

const initialState = {
  albumId: 0,
  currentImage: -1,
  error: false,
  hasMore: true,
  images: [],
  lastId: 0,
  loading: false,
  modalOpen: false,
};
type State = Readonly<typeof initialState>;

const LIMIT = 50;

const styleClasses = ['', 'big', 'horizontal', 'vertical'];

export class Gallery extends Component<
  RouteComponentProps<GalleryProps>,
  GalleryState
> {
  readonly state: State = initialState;

  constructor(props: RouteComponentProps<GalleryProps>) {
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
    this.fetchAlbum();
    this.fetchImages();
  }

  fetchAlbum = async (): Promise<number> => {
    const { params } = this.props.match;

    try {
      const response: any = await fetch(
        `${process.env.REACT_APP_API_URL}/albums?uuid=${params.album}`
      );
      const json = await response.json();

      if (json.length !== 0) {
        const albumId = json[0].id;
        this.setState({ albumId });
        return albumId;
      }
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }

    return 0;
  };

  fetchImages = async (): Promise<void> => {
    this.setState({ loading: true });

    const { images, lastId } = this.state;

    try {
      let albumId = this.state.albumId;
      if (albumId === 0) {
        albumId = await this.fetchAlbum();
      }

      const response: any = await fetch(
        `${
          process.env.REACT_APP_API_URL
        }/albums/${albumId}/images?cursor=${lastId}&limit=${LIMIT}`
      );
      const json = await response.json();

      const nextImages = json.map((image: ImageProps, index: number) => ({
        className: this.getImageClass(index),
        id: images.length + index,
        thumbnailURL: image.thumbnailURL,
        previewURL: image.previewURL,
      }));

      this.setState({
        hasMore: nextImages.length === LIMIT,
        lastId: json[json.length - 1].id,
        loading: false,
        images: [...images, ...nextImages],
      });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  };

  getImageClass = (index: number) => {
    if (this.state.images.length < 20) {
      return 'gallery-image';
    }

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
              src={image.thumbnailURL}
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

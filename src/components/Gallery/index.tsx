import React, { Component } from 'react';
import './index.css';
import { Image } from '../Image';
import { LoadingIndicator } from '../LoadingIndicator';
import { classNames } from '../../utils/classNames';

const initialState = {
  error: false,
  hasMore: true,
  isLoading: false,
  images: [],
};
type State = Readonly<typeof initialState>;

const styleClasses = ['horizontal', 'vertical', 'big'];

export class Gallery extends Component<{}, IGalleryState> {
  readonly state: State = initialState;

  constructor(props: any) {
    super(props);

    window.onscroll = () => {
      const { error, isLoading, hasMore } = this.state;

      if (error || isLoading || !hasMore) {
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
    this.setState({ isLoading: true });

    try {
      const response: any = await fetch(
        'https://jsonplaceholder.typicode.com/album/1/photos'
      );
      const json = await response.json();
      const nextImages = json.map((image: IImage) => ({
        id: image.id,
        thumbnailUrl: image.thumbnailUrl,
        url: image.url,
      }));

      this.setState({
        hasMore: true,
        isLoading: false,
        images: [...this.state.images, ...nextImages],
      });
    } catch (err) {
      this.setState({
        error: err.message,
        isLoading: false,
      });
    }
  };

  getImageClass = (index: number) => {
    const style =
      styleClasses[Math.floor(Math.random() * Math.floor(styleClasses.length))];

    return classNames([
      ['gallery-image', true],
      [style, index !== 0 && index % 5 === 0 && true],
    ]);
  };

  render() {
    return (
      <React.Fragment>
        <div className="gallery">
          {this.state.images.map((image: IImage, index: number) => (
            <Image
              key={image.id}
              className={this.getImageClass(index)}
              id={image.id}
              thumbnailUrl={image.thumbnailUrl}
              url={image.url}
            />
          ))}
        </div>
        {this.state.isLoading && (
          <div className={'gallery-loading-indicator'}>
            <LoadingIndicator />
          </div>
        )}
      </React.Fragment>
    );
  }
}

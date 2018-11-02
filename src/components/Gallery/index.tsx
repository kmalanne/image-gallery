import React, { Component } from 'react';
import './index.css';

const initialState = {
  error: false,
  hasMore: true,
  isLoading: false,
  images: [],
};
type State = Readonly<typeof initialState>;

class Gallery extends Component {
  readonly state: State = initialState;

  componentDidMount() {
    this.fetchImages();
  }

  fetchImages = async (): Promise<void> => {
    this.setState({ isLoading: true });

    try {
      const response: any = fetch(
        'https://jsonplaceholder.typicode.com/photos'
      );
      const nextImages = response.map((image: any) => ({
        thumbnailUrl: image.thumbnailUrl,
        url: image.url,
      }));

      this.setState({
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

  render() {
    return <div className="gallery-container" />;
  }
}

export default Gallery;

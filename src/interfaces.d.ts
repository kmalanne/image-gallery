interface IGalleryState {
  error: boolean;
  hasMore: boolean;
  isLoading: boolean;
  images: Array<IImage>;
}

interface IImage {
  className: string;
  id: string;
  url: string;
  thumbnailUrl: string;
}

interface ILightbox {
  images: Array<IImage>;
  currentImage: string;
}

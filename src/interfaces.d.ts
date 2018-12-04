interface IImage {
  className: string;
  id: number | string;
  url: string;
  thumbnailUrl: string;
}

interface IGalleryState {
  error: boolean;
  hasMore: boolean;
  isLoading: boolean;
  images: Array<IImage>;
}

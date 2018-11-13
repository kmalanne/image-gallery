interface IImage {
  header: boolean;
  id: number;
  url: string;
  thumbnailUrl: string;
}

interface IGalleryState {
  error: boolean;
  hasMore: boolean;
  isLoading: boolean;
  images: Array<IImage>;
}

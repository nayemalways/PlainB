export interface IReview {
  _id: string;
  des: string;
  rating: string;
  profile: {
    cus_name: string;
  };
}

export interface ICreateReview {
  productID: string;
  des: string;
  rating: string | number;
}

export interface IReviewApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

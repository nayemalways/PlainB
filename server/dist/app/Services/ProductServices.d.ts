export declare const BrandListService: () => Promise<{
    status: string;
    data: any;
    message?: undefined;
} | {
    status: string;
    message: string;
    data?: undefined;
}>;
export declare const CategoryListService: () => Promise<{
    status: string;
    data: any;
    message?: undefined;
} | {
    status: string;
    message: string;
    data?: undefined;
}>;
export declare const SliderListService: () => Promise<{
    status: string;
    data: any;
    message?: undefined;
} | {
    status: string;
    message: string;
    data?: undefined;
}>;
export declare const ListByBrandService: (req: any) => Promise<{
    status: string;
    data: any;
    message?: undefined;
} | {
    status: string;
    message: string;
    data?: undefined;
}>;
export declare const ListByCategoryService: (req: any) => Promise<{
    status: string;
    data: any;
    message?: undefined;
} | {
    status: string;
    message: string;
    data?: undefined;
}>;
export declare const ListByRemarkService: (req: any) => Promise<{
    status: string;
    data: any;
    Status?: undefined;
    message?: undefined;
} | {
    Status: string;
    message: string;
    status?: undefined;
    data?: undefined;
}>;
export declare const ListBySimilarService: (req: any) => Promise<{
    status: string;
    data: any;
    message?: undefined;
} | {
    status: string;
    message: string;
    data?: undefined;
}>;
export declare const DetailsService: (req: any) => Promise<{
    status: string;
    data: any;
    message?: undefined;
} | {
    status: string;
    message: string;
    data?: undefined;
}>;
export declare const ListByKeywordService: (req: any) => Promise<{
    status: string;
    data: any;
    message?: undefined;
} | {
    status: string;
    message: string;
    data?: undefined;
}>;
export declare const ProductFilterService: (req: any) => Promise<{
    status: string;
    data: any;
    message?: undefined;
} | {
    status: string;
    message: string;
    data?: undefined;
}>;
export declare const ReviewsListService: (req: any) => Promise<{
    status: string;
    data: any;
    message?: undefined;
} | {
    status: string;
    message: string;
    data?: undefined;
}>;
export declare const ProductReviewCreateService: (req: any) => Promise<{
    status: string;
    message: string;
}>;

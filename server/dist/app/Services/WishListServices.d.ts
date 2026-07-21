export declare const WishListService: (req: any) => Promise<{
    status: string;
    data: any;
    message?: undefined;
} | {
    status: string;
    message: string;
    data?: undefined;
}>;
export declare const SaveWishListService: (req: any) => Promise<{
    status: string;
    message: any;
}>;
export declare const WishListRemoveService: (req: any) => Promise<{
    status: string;
    message: string;
}>;

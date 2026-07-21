export declare const SaveProductToCartService: (req: any) => Promise<{
    status: string;
    message: any;
}>;
export declare const UpdateProductOfCartService: (req: any) => Promise<{
    status: string;
    message: any;
}>;
export declare const RemoveProductFromCartService: (req: any) => Promise<{
    status: string;
    message: string;
    d: any;
} | {
    status: string;
    message: any;
    d?: undefined;
}>;
export declare const SelectCartListProductService: (req: any) => Promise<{
    status: string;
    data: any;
    message?: undefined;
} | {
    status: string;
    message: string;
    data?: undefined;
}>;

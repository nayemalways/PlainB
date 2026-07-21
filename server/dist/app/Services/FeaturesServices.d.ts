export declare const FeaturesListService: () => Promise<{
    status: string;
    data: any;
    message?: undefined;
} | {
    status: string;
    message: string;
    data?: undefined;
}>;
export declare const LegalDetailsService: (req: any) => Promise<{
    status: string;
    data: any;
    message?: undefined;
} | {
    status: string;
    message: string;
    data?: undefined;
}>;

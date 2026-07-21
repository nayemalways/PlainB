export declare const UserOTPService: (req: any) => Promise<{
    status: string;
    message: string;
}>;
export declare const VerifyOTPService: (req: any) => Promise<{
    status: string;
    message: string;
    Token?: undefined;
} | {
    status: string;
    message: string;
    Token: never;
}>;
export declare const SaveProfileService: (req: any) => Promise<{
    status: string;
    message: string;
}>;
export declare const ReadProfileService: (req: any) => Promise<{
    status: string;
    data: any;
    message?: undefined;
} | {
    status: string;
    message: string;
    data?: undefined;
}>;

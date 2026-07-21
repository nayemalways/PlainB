export declare const authService: {
    loginService: (email: any) => Promise<{
        status: string;
        message: any;
    }>;
    VerifyLoginOTP: (email: any, otp: any) => Promise<{
        status: string;
        message: string;
        token?: undefined;
    } | {
        token: never;
        status?: undefined;
        message?: undefined;
    }>;
};

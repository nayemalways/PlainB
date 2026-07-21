export declare const CreateInvoiceService: (req: any) => Promise<{
    status: string;
    data: any;
    message?: undefined;
} | {
    status: string;
    message: string;
    data?: undefined;
}>;
export declare const PaymentSuccessService: (req: any) => Promise<{
    status: string;
    tran_id: any;
    payment_status: string;
    message?: undefined;
} | {
    status: string;
    message: string;
    tran_id?: undefined;
    payment_status?: undefined;
}>;
export declare const PaymentFailService: (req: any) => Promise<{
    status: string;
    tran_id: any;
    payment_status: string;
    message?: undefined;
} | {
    status: string;
    message: string;
    tran_id?: undefined;
    payment_status?: undefined;
}>;
export declare const PaymentCancelService: (req: any) => Promise<{
    status: string;
    tran_id: any;
    payment_status: string;
    message?: undefined;
} | {
    status: string;
    message: string;
    tran_id?: undefined;
    payment_status?: undefined;
}>;
export declare const PaymentIPNService: (req: any) => Promise<{
    status: string;
    message: string;
}>;
export declare const InvoiceListService: (req: any) => Promise<{
    status: string;
    data: any;
}>;
export declare const InvoiceProductListService: (req: any) => Promise<{
    status: string;
    data: {
        invoice_id: any;
        order_date: any;
        data: any;
    };
}>;

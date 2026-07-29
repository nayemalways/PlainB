/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../../utility/CatchAsync.ts";
import { dashboardServices } from "./dashboard.service.ts";
import { SendResponse } from "../../utility/sendResponse.ts";
import { StatusCodes } from "http-status-codes";


const dashboardAnalytics = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await dashboardServices.dashboardAnalytics();

    SendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Dashboard analytics fetched",
        data: result
    })
});



export const dashboardControllers = {
    dashboardAnalytics
}
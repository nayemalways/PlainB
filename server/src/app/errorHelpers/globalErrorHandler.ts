import { SendResponse } from '../utility/SendResponse.ts';

export const globalError = (err, req, res, _next) => {
  console.error(err.stack); // Log the error stack for debugging

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  SendResponse(res, {
    success: false,
    statusCode,
    message,
    data: null,
  });
};

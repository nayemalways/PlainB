import express from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { globalRouter } from './app/routes/index.ts';
import { SendResponse } from './app/utility/sendResponse.ts';
import { globalErrorHandler } from './app/errorHelpers/globalErrorHandler.ts';
import { stripeWebhookHandler } from './app/modules/payment/payment.route.ts';
import { csrfProtection } from './app/middlewares/csrfProtection.ts';
import { env } from './app/config/config.ts';

/*------APP INSTANCE-------*/
const app = express();

/*-------------APPLICATION GLOBAL MIDDLEWARES-----------*/
// app.set('etag', 'strong');
app.use(
  cors({
    origin: ['https://plainb.vercel.app', 'http://localhost:5173'],
    credentials: true,
  }),
);
app.use(helmet());
app.use(hpp());
app.use(cookieParser());
// Stripe signature verification requires the exact, unparsed request body.
app.post(
  ['/webhook', '/api/v2/payment/webhook'],
  express.raw({ type: 'application/json' }),
  stripeWebhookHandler,
);
app.use(express.json({ limit: env.MAX_JSON_SIZE }));
app.use(express.urlencoded({ extended: env.URL_ENCODED }));
app.use(csrfProtection);

/*-------------RATE LIMIT-----------*/
const limiter = rateLimit({ windowMs: env.REQUEST_LIMIT_TIME, max: env.REQUEST_LIMIT_NUMBER });
app.use(limiter);

/*---------WEB CACHE-------*/
if (env.WEB_CACHE) {
  app.set('etag', 'strong');
} else {
  app.disable('etag');
}

/*--------PUBLIC STORAGE---------*/
app.use(express.static('src/storage'));

app.get('/', (req, res) => {
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Welcome to the universe',
    data: null,
  });
});



/*------API ROUTES------*/
app.use('/api/v2', globalRouter);

app.use(globalErrorHandler);

export default app;

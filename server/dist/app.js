/*-------------DEPENDENCIES-----------*/
import express from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import router from "./routes/api.js";
import { REQUEST_LIMIT_NUMBER, REQUEST_LIMIT_TIME, WEB_CACHE, URL_ENCODED, MAX_JSON_SIZE } from "./app/config/config.js";
import { globalError } from "./app/errorHelpers/globalErrorHandler.js";
import { globalRouter } from "./app/routes/index.js";
/*------APP INSTANCE-------*/
const app = express();
/*-------------APPLICATION GLOBAL MIDDLEWARES-----------*/
app.use(cors({
    origin: ["https://plainb.vercel.app", "http://localhost:5173"]
}));
app.use(helmet());
app.use(hpp());
app.use(cookieParser());
app.use(express.json({ limit: MAX_JSON_SIZE }));
app.use(express.urlencoded({ extended: URL_ENCODED }));
app.use(fileUpload());
/*-------------RATE LIMIT-----------*/
const limiter = rateLimit({ windowMs: REQUEST_LIMIT_TIME, max: REQUEST_LIMIT_NUMBER });
app.use(limiter);
/*---------WEB CACHE-------*/
app.set('etag', WEB_CACHE);
/*--------PUBLIC STORAGE---------*/
app.use(express.static('src/storage'));
app.get('/', (req, res) => {
    res.send("Welcome to the show");
});
/*------API ROUTES------*/
app.use('/api', router);
app.use('/api/v2', globalRouter);
app.use(globalError);
export default app;
//# sourceMappingURL=app.js.map
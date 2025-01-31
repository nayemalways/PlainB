
/*-------------DEPENDENCIES-----------*/
import express from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import router from './routes/api.js'
import {DATABASE_URL, DATABASE_PASSWORD, DATABASE_USERNAME, REQUEST_LIMIT_NUMBER, REQUEST_LIMIT_TIME, WEB_CACHE, URL_ENCODED,MAX_JSON_SIZE, PORT} from './app/config/config.js'
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
    
const __dirname = dirname(fileURLToPath(import.meta.url));



/*------APP INSTANCE-------*/
const app = express();


/*-------------APPLICATION GLOBAL MIDDLEWARES-----------*/
app.use(cors({
    origin:["http://localhost:5173"]
}));
app.use(helmet());
app.use(hpp());
app.use(cookieParser());
app.use(express.json({limit: MAX_JSON_SIZE}));
app.use(express.urlencoded({extended: URL_ENCODED}));
app.use(fileUpload());

/*-------------RATE LIMIT-----------*/
const limitter = rateLimit({windowMs: REQUEST_LIMIT_TIME, max: REQUEST_LIMIT_NUMBER});
app.use(limitter);

/*---------WEB CACHE-------*/
app.set('etag', WEB_CACHE);

/*-------DATABASE CONNECTION-----*/
const options = {
    user: DATABASE_USERNAME,
    pass: DATABASE_PASSWORD,
    autoIndex: true,
    serverSelectionTimeoutMS: 30000
}

mongoose.connect(DATABASE_URL, options)
    .then(() => console.log("Database connected"))
    .catch((e) => console.log(e));



/*--------PUBLIC STORAGE---------*/
app.use(express.static('storage'));

/*------API ROUTES------*/
app.use('/api', router);


app.use(express.static('client/dist'));

/*-------Add react frontend routing---------- */
app.use('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
})


/*-------------APPLICATION RUNNER-----------*/
app.listen(PORT, () => console.log(`App running on https://localhost:${PORT}`))
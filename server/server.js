import mongoose from 'mongoose';
import { DATABASE_URL, PORT } from './app/config/config.js';
import app from './app.js';

const bootstrap = async () => {
    console.log("Hello")
    await mongoose.connect(DATABASE_URL);
    console.log("Database Connected!");
    app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));
    console.log("Server started");
}

bootstrap();
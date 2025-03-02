// Import các thư viện cần thiết
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import RootRouter from './routes/index.js';
// import PayPalServices from './services/paypal.js';
dotenv.config();

// Utiles
import connectDB from './config/mongodb.js';


connectDB();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://e-com-system.netlify.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});
// app.use(cors({
//     origin: '*',
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: [
//         "Content-Type",
//         "Authorization",
//         "Cache-Control",
//         "Expires",
//         "Pragma",
//     ],
//     credentials: true,
// }));
// app.options("*", cors());


// Route mặc định
app.get("/", async (req, res) => {
    res.send('API Working');


});

app.use(RootRouter);
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port: ${port}`);

});





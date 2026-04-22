// import express from 'express';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import cors from 'cors'
// import connectDB from './database/dbConnect.js';
// import userRoute from './routes/userRoutes.js';
// import courseRoute from './routes/courseRoutes.js';
// import mediaRoute from "./routes/mediaRoutes.js";
// import purchaseRoute from  "./routes/purchaseCourseRoutes.js"
// import courseProgressRoute from "./routes/courseProgressRoutes.js";


// dotenv.config({});

// connectDB();

// const app=express();

// const PORT=process.env.PORT|| 3000;

// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "https://lms-kohl-psi.vercel.app"
//   ],
//   credentials: true
// }));

// // webhook FIRST (raw body)
// app.use('/api/v1/purchase/webhook', express.raw({ type: 'application/json' }));
// app.use(express.json());
// app.use(cookieParser());




// //APIs
// app.use("/api/v1/media",mediaRoute)
// app.use('/api/v1/user',userRoute)
// app.use('/api/v1/course',courseRoute)
// app.use('/api/v1/purchase',purchaseRoute)
// app.use("/api/v1/progress",courseProgressRoute);

// app.get('/home',(_,res)=>{
//     res.status(200).json({
//         success:true,
//         message:"Hello i am coming from backend"
//     })
// })

// app.listen(PORT,()=>{
//     console.log(`server listen at port ${PORT}`);
// }) 



import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './database/dbConnect.js';
import userRoute from './routes/userRoutes.js';
import courseRoute from './routes/courseRoutes.js';
import mediaRoute from "./routes/mediaRoutes.js";
import purchaseRoute from "./routes/purchaseCourseRoutes.js";
import courseProgressRoute from "./routes/courseProgressRoutes.js";

dotenv.config({});
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Dynamic CORS setup
const configuredOrigins = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [
  "http://localhost:5173",
  "https://lms-kohl-psi.vercel.app",
  ...configuredOrigins,
];

// ✅ FIX: Proper cors() wrapper
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow Postman / mobile apps

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// webhook FIRST (raw body)
app.use('/api/v1/purchase/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cookieParser());

// APIs
app.use("/api/v1/media", mediaRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/course', courseRoute);
app.use('/api/v1/purchase', purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);

app.get('/home', (_, res) => {
  res.status(200).json({
    success: true,
    message: "Hello i am coming from backend"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
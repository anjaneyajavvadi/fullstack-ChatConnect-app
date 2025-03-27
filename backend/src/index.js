import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import {app,server} from './lib/socket.js';
import path from 'path';
dotenv.config();


const PORT=process.env.PORT;
const __dirname=path.resolve();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "https://your-deployed-frontend.com"],
    credentials: true,
}));

app.use("/api/auth",authRoutes);
app.use('/api/messages',messageRoutes);

if(process.env.NODE_ENV==="production")
{
    const frontendPath = path.join(__dirname, "../frontend/chat-app/dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});
}

server.listen(PORT,()=>{
    console.log(`app is listening on http://localhost:${PORT}`);
    connectDB();
});

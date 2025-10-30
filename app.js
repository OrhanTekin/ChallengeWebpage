import express from 'express';
import { PORT, SERVER_URL } from './config/env.js'

import challengeRouter from './routes/challenge.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';

// Socket.io
import { createServer } from 'http';
import { Server } from 'socket.io';

//ES6 cant import __dirname normally
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer);

//Standard Middleware
app.use(express.json()); 
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

//Serve static files like style.css + index.js
app.use(express.static(path.join(__dirname, 'views')));


//Routes registration (can be more))
app.use('/api/v1/challenges', challengeRouter)

//Custom Middleware registration (can be more)
app.use(errorMiddleware);


app.get('/', (req, res) => {
  //Hier benutze sendFile für html Seiten
  res.sendFile(path.join(__dirname, '/views/main/index.html'));
});


// START ONLY HTTP SERVER -> Live sync 
httpServer.listen(PORT, async () => {
  console.log(`Challenge API is running on ${SERVER_URL}:${PORT}`)
  await connectToDatabase();
});


io.on("connection", (socket) => {
  socket.on("showWinGif", (data) => {
    io.emit("showWinGif", { index: data.index });
  });
});

export default app;
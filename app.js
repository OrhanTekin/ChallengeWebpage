import express from 'express';
import { PORT } from './config/env.js'

import challengeRouter from './routes/challenge.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';

//ES6 cant import __dirname normally
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
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

app.listen(PORT, async () => {
  console.log(`Challenge API is running on ${PORT}`)

  await connectToDatabase() 
});

export default app;
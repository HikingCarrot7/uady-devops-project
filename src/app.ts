import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';

const app = express();

/* Middlewares */
app.use(json());

app.use(cors());

export { app };

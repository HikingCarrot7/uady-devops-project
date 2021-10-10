import { json } from 'body-parser';
import express from 'express';

const app = express();

/* Middlewares */
app.use(json());

export { app };

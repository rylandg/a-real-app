import express from 'express';
import { defaultHandler } from '@reshuffle/server-function';
import { authHandler } from '@reshuffle/passport';

const app = express();
app.use(authHandler);

app.use(defaultHandler)

export default app;

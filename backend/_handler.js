import express from 'express';
import { defaultHandler } from '@reshuffle/server-function';
import { authRouter } from '@reshuffle/passport';
import { createFileUploadHandler } from '@reshuffle/storage';

const app = express();
app.use(authRouter());
app.use(createFileUploadHandler({ accept: /^image\/.*/ }));
app.use(defaultHandler)

export default app;

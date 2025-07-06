import express, { Request, Response } from 'express'
import notelistRouter from './router/notelist'
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors())

app.use('/api/notelist', notelistRouter)

export default app;
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as dotenv from "dotenv";
import { connect } from 'mongoose';
import routes from './routes/api';
import middleware from './tools/middleware';
import logger from 'morgan';

dotenv.config();

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Mongodb Atlas Connection Starts
const mongoURL = process.env.MONGODB_URI || 'faild'
connect(mongoURL).then(() => {
	//don't show the log when it is test
	if(process.env.NODE_ENV !== "test") {
		console.log("Connected to %s", process.env.MONGODB_URI);
		console.log("App is running ... \n");
		console.log("Press CTRL + C to stop the process. \n");
	}
}).catch(err => {
	console.log(err)
		console.error("App starting error:", err.message);
		process.exit(1);
});
// Mongodb Atlas Connection Ends

//if you want only your frontend to connect
app.use(cors({ origin: "http://localhost:3000" }))
//Logs of the server
app.use(logger('dev'))

app.get('/', (req: Request, res: Response) => {
    res.send('Healthy')
})

const PORT = process.env.PORT || 8000;


app.use('/api',middleware.verifyUser, routes)

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
});



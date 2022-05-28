import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import productsRoute from './handlers/products';
import usersRoute from './handlers/users';
import ordersRoute from './handlers/orders';
import dotenv from 'dotenv';
import { Users } from './models/users';

const app: express.Application = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', function (req: Request, res: Response) {
	res.send('<h1>The is the Store Front api main page</h1>');
});

// Routes
productsRoute(app);
usersRoute(app);
ordersRoute(app);

dotenv.config();

const user_name = process.env.ROOT_USERNAME as string,
	password = process.env.ROOT_PASSWORD as string;

const user = new Users();
user.add({
	id: 1,
	user_name: user_name,
	first_name: 'admin',
	second_name: 'admin',
	password: password,
}).then();

app.listen(3000, function () {
	console.log(`starting app on port: ${port}`);
});
export default app;

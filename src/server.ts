import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import productsRoute from './handlers/products';
import usersRoute from './handlers/users';
import ordersRoute from './handlers/orders';
import dotenv from 'dotenv';
import ordersProductsRoute from './handlers/ordersProducts';

const app: express.Application = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', function (_req: Request, res: Response) {
	res.send('<h1>The is the Store Front api main page</h1>');
});

// Routes
productsRoute(app);
usersRoute(app);
ordersRoute(app);
ordersProductsRoute(app);

dotenv.config();

app.listen(3000, function () {
	console.log(`starting app on port: ${port}`);
});
export default app;

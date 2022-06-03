import express, { Response, Request } from 'express';
import jwtAuth from '../middleWares/jwtAuth';
import { Order } from '../models/orders';

const ord = new Order();

const getCurrentOrder = async (req: Request, res: Response) => {
	try {
		res.status(200).json(
			await ord.getCurrentOrder(parseInt(req.params.id))
		);
	} catch (e) {
		res.json({ Error: `${e}` });
	}
};
const getFinishedOrders = async (req: Request, res: Response) => {
	try {
		res.status(200).json(
			await ord.getCompletedOrders(parseInt(req.params.id))
		);
	} catch (e) {
		res.json({ Error: `${e}` });
	}
};
const newOrder = async (req: Request, res: Response) => {
	try {
		const result = await ord.newOrder({
			id: 1,
			user_id: parseInt(req.params.id),
			status: true,
		});
		res.json(result);
	} catch (e) {
		res.status(500).json({ Error: `${e}` });
	}
};

const ordersRoute = (app: express.Application) => {
	app.get('/orders/:id', jwtAuth, getCurrentOrder);
	app.get('/orders/Completed/:id', jwtAuth, getFinishedOrders);
	app.post('/orders/:id', jwtAuth, newOrder);
};
export default ordersRoute;

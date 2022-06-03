import express, { Response, Request } from 'express';
import jwtAuth from '../middleWares/jwtAuth';
import OrdersProducts from '../models/ordersProducts';

const ordersProducts = new OrdersProducts();

const getCurrentCart = async (req: Request, res: Response) => {
	try {
		res.status(200).json(
			await ordersProducts.getCurrentCart(parseInt(req.params.id))
		);
	} catch (e) {
		res.json({ Error: `${e}` });
	}
};

const getCart = async (req: Request, res: Response) => {
	try {
		res.status(200).json(
			await ordersProducts.getCart(parseInt(req.params.cartId))
		);
	} catch (e) {
		res.json({ Error: `${e}` });
	}
};

const addProduct = async (req: Request, res: Response) => {
	try {
		const {
			product_id,
			quantity,
		} = req.body;
		const user_id = parseInt(req.params.id);
		res.status(200).json(
			await ordersProducts.addProduct(user_id, product_id, quantity)
		);
	} catch (e) {
		res.json({ Error: `${e}` });
	}
};


const ordersProductsRoute = (app: express.Application) => {
	app.get('/cart/user/:id', jwtAuth, getCurrentCart);
	app.get('/cart/:cartId', jwtAuth, getCart);
	app.post('/cart/user/:id', jwtAuth, addProduct);
};
export default ordersProductsRoute;

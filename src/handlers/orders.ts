import express, {Response, Request, application} from 'express';
import jwtAuth from '../middleWares/jwtAuth';
import { Order } from '../models/orders';

const ord = new Order();

const getCurrentOrder = async (req:Request, res:Response) =>{
	try{
		res.status(200).json(await ord.getCurrentOrder(parseInt(req.params.id)));
	}catch(e){
		res.json({"Error":`${e}`});
	}
}
const getFinishedOrders = async (req:Request, res:Response) =>{
	try{
		res.status(200).json(await ord.getCompletedOrders(parseInt(req.params.id)));
	}catch(e){
		res.json({"Error":`${e}`});
	}
}
const addOrder = async (req:Request, res:Response) =>{
	try{
		const {
			product_id,
			quantity,
		} = req.body;
	if (product_id == undefined|| quantity == undefined)
		res.status(400).json({"massage":"the data is incomplete"});
		const result = await ord.addOrder({ id: 1, user_id: parseInt(req.params.id), product_id: product_id, quantity: quantity, status: true });
		res.json(result);
	}catch(e){
		res.status(500).json({"Error":`${e}`});
	}
}

const ordersRoute = (app:express.Application)=>{
	app.get('/orders/:id', jwtAuth, getCurrentOrder);
	app.get('/orders/Completed/:id', jwtAuth, getFinishedOrders);
	app.post('/orders/:id', jwtAuth, addOrder);
}
export default ordersRoute;
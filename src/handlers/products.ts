import express, {Response, Request, application} from 'express';
import jwtAuth from '../middleWares/jwtAuth';
import Product from '../models/products';

const prod = new Product();

const index = async(req:Request,res:Response) =>{
	try{
	res.json(await prod.index());
	}
	catch(e){
		res.status(400).json({"massage":`${e}`});
	}
}

const show = async(req:Request,res:Response) =>{
	try{
	res.json(await prod.show(parseInt(req.params.id)));
	}catch(e){
		res.status(400).json({"massage":`${e}`});
	}
}
const get_by_category = async(req:Request, res:Response)=>{
	try {
		res.json(await prod.get_by_category(req.params.id));
	}
	catch (err) {
		res.json({"Error":`${err}`});
	}

}



const create = async(req:Request, res:Response) => {
	try{
	const  namePar :string = req.body.name, 
	pricePar:number = req.body.price, categoryPar:string = req.body.category;
	if (namePar == undefined || pricePar == undefined|| categoryPar == undefined)
		res.status(400).json({"massage":"the data is incomplete"});
	else
		res.json(await prod.add({ id: 1, product_name: namePar, price: pricePar, category: categoryPar }));
	}
	catch(e){
		res.status(400).json({"massage":`${e}`});
	}
}

const del = async(req:Request, res:Response)=>{
	try{
		res.json(await prod.delete(parseInt(req.params.id)));
	}catch(e){
		res.status(400).json({"massage":`${e}`});
	}
}
const update = async(req:Request, res:Response) =>{
	if (JSON.stringify(req.body) === JSON.stringify({})){ 
		res.status(400).json({"massage":"please provide property to change"})	;
		return;
	}
	const id:number = parseInt(req.params.id) ;
	try {
		for (let key in req.body) {
			await prod.update(id, key, req.body[key]);
		}
	}catch(err){
		res.status(400).json(
			{ "Error": "probery provided is not exist or value don't match the required" });
	}
	res.json(await prod.show(id));
}


const productsRoute = (app:express.Application)=>{
	app.get('/products', index);
	app.get('/products/:id', show);
	app.get('/products/category/:id', get_by_category);
	app.post('/products',jwtAuth, create);
	app.delete('/products/:id', del);
	app.delete('/products/', (res:Response, req:Request)=>{
		res.status(400).json({"massage":"Please provide the id"});
	});
	app.put('/products/:id', update);
	app.put('/products/', (res:Response, req:Request)=>{
		res.status(400).json({"massage":"Please provide the id"});
	});
}


export default productsRoute;
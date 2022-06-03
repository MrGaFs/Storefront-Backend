import express, { Response, Request } from 'express';
import { Users } from '../models/users';
import dotenv from 'dotenv';
import jwtAuth from '../middleWares/jwtAuth';

const usr = new Users();

dotenv.config();

const index = async (_req: Request, res: Response) => {
	res.json(await usr.index());
};

const show = async (req: Request, res: Response) => {
	if (isNaN(parseInt(req.params.id)))
		res.json(await usr.show_by_user_name(req.params.id));
	else res.json(await usr.show_by_id(parseInt(req.params.id)));
};

const create = async (req: Request, res: Response) => {
	try {
		const userName: string = req.body.user_name,
			firstName: string = req.body.first_name,
			secondName: string = req.body.second_name,
			password: string = req.body.password;

		if (
			userName == undefined ||
			firstName == undefined ||
			secondName == undefined ||
			password == undefined
		)
			res.status(400).json({ massage: 'the data is incomplete' });
		else {
			await usr.add({
				id: 1,
				user_name: userName,
				first_name: firstName,
				second_name: secondName,
				password: password,
			});
			res.json({'jwt token':await usr.auth(userName, password)});
		}
	} catch (err) {
		res.json({ 'Error': `${err}` });
	}
};

const login = async (req: Request, res: Response) => {
	const userName: string = req.body.user_name,
		password: string = req.body.password;

	if (userName == undefined || password == undefined) {
		res.status(400).json({ massage: 'the data is incomplete' });
		return;
	}
	try {
		res.json({'jwt token':await usr.auth(userName, password)});
	} catch (err) {
		res.status(400).json({ Error: `${err}` });
	}
};

const del = async (req: Request, res: Response) => {
	res.json(await usr.delete(parseInt(req.params.id)));
};

const update = async (req: Request, res: Response) => {
	if (JSON.stringify(req.body) === JSON.stringify({})) {
		res.status(400).json({ massage: 'please provide property to change' });
		return;
	}
	const id: number = parseInt(req.params.id);
	try {
		for (const key in req.body) {
			await usr.update(id, key, req.body[key]);
		}
	} catch (err) {
		res.status(400).json({
			Error: 'probery provided is not exist or value don\'t match the required',
		});
	}
	res.json(await usr.show_by_id(id));
};

const usersRoute = (app: express.Application) => {
	app.get('/users', jwtAuth, index);
	app.get('/users/:id', jwtAuth, show);
	app.post('/users', create);
	app.post('/users/login', login);
	app.delete('/users/:id', jwtAuth, del);
	app.delete('/users/', jwtAuth, (_req: Request, res: Response) => {
		res.status(400).json({ massage: 'Please provide the id' });
	});
	app.put('/users/:id', jwtAuth, update);
	app.put('/users/', jwtAuth, (_req: Request, res: Response) => {
		res.status(400).json({ massage: 'Please provide the id' });
	});
};

export default usersRoute;

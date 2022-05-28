import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const jwtAuth = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	try {
		const authorizationHeader = req.headers.authorization as string;
		if (authorizationHeader == undefined)
			throw new Error(
				'please provide token in the header to be able to access this end point'
			);
		const token = authorizationHeader.split(' ')[1];
		jwt.verify(token, process.env.JWT_SECRET as string);
	} catch (err) {
		res.status(401).json({ Error: `${err}` });
		return;
	}
	next();
};
export default jwtAuth;

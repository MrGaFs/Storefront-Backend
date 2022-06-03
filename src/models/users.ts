import db from '../database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

type user_info = {
	id: number;
	user_name: string;
	first_name: string;
	second_name: string;
	password: string;
};
type s_user_info = {
	id: number;
	first_name: string;
	second_name: string;
};

dotenv.config();

const BCRYPT_PASSWORD = process.env.BCRYPT_PASSWORD,
	SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS as string);

const hashing_password = async (prePass: string): Promise<string> => {
	return await bcrypt.hash(prePass + BCRYPT_PASSWORD, SALT_ROUNDS);
};
export class Users {
	async index(): Promise<s_user_info[]> {
		try {
			const conn = await db.connect();
			const sql =
				'SELECT id, user_name, first_name, second_name FROM users;';
			const result = await conn.query(sql);
			conn.release();
			return result.rows;
		} catch (err) {
			throw new Error(`Cannot connect to database ${err}`);
		}
	}

	async show_by_id(id: number): Promise<s_user_info | unknown> {
		try {
			const conn = await db.connect();
			const sql =
				'SELECT id, user_name, first_name, second_name FROM users WHERE id =($1);';
			const result = await conn.query(sql, [id]);
			conn.release();
			const ret = result.rows[0];
			return ret ? ret : {};
		} catch (err) {
			throw new Error(`Cannot show the item ${err}`);
		}
	}
	async show_by_user_name(user_name: string): Promise<s_user_info | unknown> {
		try {
			const conn = await db.connect();
			const sql =
				'SELECT id, user_name, first_name, second_name FROM users WHERE user_name=($1);';
			const result = await conn.query(sql, [user_name]);
			conn.release();
			const ret = result.rows[0];
			return ret ? ret : {};
		} catch (err) {
			throw new Error(`Cannot show the item ${err}`);
		}
	}

	async add(p: user_info): Promise<s_user_info | unknown> {
		try {
			const conn = await db.connect();
			const sql = `INSERT INTO users(user_name, first_name, second_name, password) 
				values($1, $2, $3, $4) RETURNING id, user_name, first_name, second_name;`;
			p.password = await hashing_password(p.password);
			const result = await conn.query(sql, [
				p.user_name,
				p.first_name,
				p.second_name,
				p.password,
			]);
			conn.release();
			const ret = result.rows[0];
			return ret ? ret : {};
		} catch (err) {
			throw new Error(`Cannot add the item ${err}`);
		}
	}
	async delete(id: number): Promise<s_user_info | unknown> {
		try {
			const conn = await db.connect();
			const sql = `DELETE FROM users where id=($1) RETURNING id,
			 user_name, first_name, second_name;`;
			const result = await conn.query(sql, [id]);
			conn.release();
			const ret = result.rows[0];
			return ret ? ret : {};
		} catch (err) {
			throw new Error(`Cannot add the item ${err}`);
		}
	}

	async auth(user_name: string, password: string): Promise<string | unknown> {
		try {
			const conn = await db.connect();
			const sql =
				'SELECT id, user_name, first_name, second_name, password FROM users WHERE user_name=($1);';
			const result = await conn.query(sql, [user_name]);
			conn.release();
			const ret = result.rows[0];
			if (await bcrypt.compare(password + BCRYPT_PASSWORD, ret.password))
				return jwt.sign(
					{ user: result },
					process.env.JWT_SECRET as string
				);
			return {};
		} catch (err) {
			throw new Error(`Cannot auth the user ${err}`);
		}
	}

	async update(
		id: number,
		property: string,
		value: string
	): Promise<s_user_info | unknown> {
		try {
			if (property == 'user_name')
				throw new Error('You can\'t change user_name');
			const conn = await db.connect();
			const sql = `UPDATE users SET ${property}='${value}' WHERE id=(${id})
			 RETURNING id, user_name, first_name, second_name;`;
			const result = await conn.query(sql);
			conn.release();
			const ret = result.rows[0];
			return ret ? ret : {};
		} catch (err) {
			throw new Error(`Cannot add the item ${err}`);
		}
	}
}

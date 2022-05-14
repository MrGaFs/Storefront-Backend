import db from "../database"

type user_info = {
	id: Number,
	first_name: string,
	second_name: string,
	password:string

}

export class Users {
	async index(): Promise<user_info[]> {
		try {
			const conn = await db.connect();
			const sql = `SELECT * FROM users;`;
			const result = await conn.query(sql);
			conn.release();
			return result.rows;
		}
		catch (err) {
			throw new Error(`Cannot connect to database ${err}`);
		}
	}

	async show(id: Number): Promise<user_info|{}> {
		try {
			const conn = await db.connect();
			const sql = `SELECT * FROM users WHERE id =($1);`;
			const result = await conn.query(sql, [id]);
			conn.release();
			const ret = result.rows[0];
			return (ret)?ret:{};
		} catch (err) {
			throw new Error(`Cannot show the item ${err}`);
		}
	}

	async add(p: user_info): Promise<user_info|{}> {
		try {
			const conn = await db.connect();
			const sql =
				`INSERT INTO users(first_name, second_name, password) values($1, $2, $3) RETURNING *;`;
			const result = await conn.query(sql, [p.first_name, p.second_name, p.password]);
			conn.release();
			const ret = result.rows[0];
			return (ret)?ret:{};
		} catch (err) {
			throw new Error(`Cannot add the item ${err}`);
		}
	}
	async delete(id:Number): Promise<user_info|{}> {
		try {
			const conn = await db.connect();
			const sql = `DELETE FROM users where id=($1) RETURNING *;`;
			const result = await conn.query(sql, [id]);
			conn.release();
			const ret = result.rows[0];
			return (ret)?ret:{};
		} catch (err) {
			throw new Error(`Cannot add the item ${err}`);
		}
	}
	async update(id:Number, property:string, value:string): Promise<user_info|{}> {
		try {
			const conn = await db.connect();
			const sql = `UPDATE users SET ${property}='${value}' WHERE id=(${id}) RETURNING *;`;
			const result = await conn.query(sql);
			conn.release();
			const ret = result.rows[0];
			return (ret)?ret:{};
		} catch (err) {
			throw new Error(`Cannot add the item ${err}`);
		}
	}
}
import db from "../database"

type order = {
	id: Number,
	user_id: Number,
}

export class Order {
	async index(): Promise<order[]> {
		try {
			const conn = await db.connect();
			const sql = `SELECT * FROM orders;`;
			const result = await conn.query(sql);
			conn.release();
			return result.rows;
		}
		catch (err) {
			throw new Error(`Cannot connect to database ${err}`);
		}
	}

	async show(id: Number): Promise<order|{}> {
		try {
			const conn = await db.connect();
			const sql = `SELECT * FROM orders WHERE id =($1);`;
			const result = await conn.query(sql, [id]);
			conn.release();
			const ret = result.rows[0];
			return (ret)?ret:{};
		} catch (err) {
			throw new Error(`Cannot show the item ${err}`);
		}
	}

	async add(ord: order): Promise<order|{}> {
		try {
			const conn = await db.connect();
			const sql = `INSERT INTO orders (user_id) values(${ord.user_id}) RETURNING *;`;
			const result = await conn.query(sql);
			conn.release();
			const ret = result.rows[0];
			return (ret)?ret:{};
		} catch (err) {
			throw new Error(`Cannot add the item ${err}`);
		}
	}
	async delete(id:Number): Promise<order> {
		try {
			const conn = await db.connect();
			const sql = `DELETE FROM orders where id=($1) RETURNING *;`;
			const result = await conn.query(sql, [id]);
			conn.release();
			const ret = result.rows[0];
			return (ret)?ret:{};
		} catch (err) {
			throw new Error(`Cannot add the item ${err}`);
		}
	}
	async update(id:Number, property:string, value:number): Promise<order> {
		try {
			const conn = await db.connect();
			const sql = `UPDATE orders SET ${property}=${value} WHERE id=${id} RETURNING *;`;
			const result = await conn.query(sql);
			conn.release();
			const ret = result.rows[0];
			return (ret)?ret:{};
		} catch (err) {
			throw new Error(`Cannot add the item ${err}`);
		}
	}
}
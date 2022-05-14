import db from "../database"

type cartItem = {
	id: Number,
	order_id: Number,
	quantity:Number,
	product_id:Number
}

export class Cart {
	async index(): Promise<cartItem[]> {
		try {
			const conn = await db.connect();
			const sql = `SELECT * FROM orders_products;`;
			const result = await conn.query(sql);
			conn.release();
			return result.rows;
		}
		catch (err) {
			throw new Error(`Cannot connect to database ${err}`);
		}
	}

	async show(id: Number): Promise<cartItem|{}> {
		try {
			const conn = await db.connect();
			const sql = `SELECT * FROM orders_products WHERE id =($1);`;
			const result = await conn.query(sql, [id]);
			conn.release();
			const ret = result.rows[0];
			return (ret)?ret:{};
		} catch (err) {
			throw new Error(`Cannot show the item ${err}`);
		}
	}

	async add(cart: cartItem): Promise<cartItem|{}> {
		try {
			const conn = await db.connect();
			const sql = `INSERT INTO orders_products (product_id, order_id, quantity) values($1,$2,$3) RETURNING *;`;
			const result = await conn.query(sql, [cart.product_id,cart.order_id, cart.quantity]);
			conn.release();
			const ret = result.rows[0];
			return (ret)?ret:{};
		} catch (err) {
			throw new Error(`Cannot add the item ${err}`);
		}
	}
	async delete(id:Number): Promise<cartItem|{}> {
		try {
			const conn = await db.connect();
			const sql = `DELETE FROM orders_products where id=($1) RETURNING *; `;
			const result = await conn.query(sql, [id]);
			conn.release();
			const ret = result.rows[0];
			return (ret)?ret:{};
		} catch (err) {
			throw new Error(`Cannot add the item ${err}`);
		}
	}
	async update(id:Number, property:string, value:number): Promise<cartItem|{}> {
		try {
			const conn = await db.connect();
			const sql = `UPDATE orders_products SET ${property}=${value} WHERE id=${id} RETURNING *;`;
			const result = await conn.query(sql);
			conn.release();
			const ret = result.rows[0];
			return (ret)?ret:{};
		} catch (err) {
			throw new Error(`Cannot add the item ${err}`);
		}
	}
}
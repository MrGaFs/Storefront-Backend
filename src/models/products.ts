import db from "../database"

export type product = {
	id: Number,
	name: string,
	price: Number,
	category: string
}

class Product {
	public async index(): Promise<product[]> {
		try {
			const conn = await db.connect();
			const sql = `SELECT * FROM products;`;
			const result = await conn.query(sql);
			conn.release();
			return result.rows;
		}
		catch (err) {
			throw new Error(`Cannot connect to database ${err}`);
		}
	}

	public async show(id: Number): Promise<product | {}> {
		try {
			const conn = await db.connect();
			const sql = `SELECT * FROM products WHERE id=($1);`;
			const result = await conn.query(sql, [id]);
			conn.release();
			const ret = result.rows[0];
			return ret ? ret : {};
		} catch (err) {
			throw new Error(`Cannot show the item ${err}`);
		}
	}

	public async add(p: product): Promise<product | {}> {
		try {
			const conn = await db.connect();
			const sql = `INSERT INTO products (name, price, category) values($1, $2, $3) RETURNING *`;
			const result = await conn.query(sql, [p.name, p.price, p.category]);
			conn.release();
			const ret = result.rows[0];
			return ret ? ret : {};
		} catch (err) {
			throw new Error(`Cannot add the record ${err}`);
		}
	}
	public async delete(id: Number): Promise<product | {}> {
		try {
			const conn = await db.connect();
			const sql = `DELETE FROM products where id=($1) RETURNING *;`;
			const result = await conn.query(sql, [id]);
			conn.release();
			const ret = result.rows[0];
			return ret ? ret : {};
		} catch (err) {
			throw new Error(`Cannot delete the record ${err}`);
		}
	}
	public async update(id: Number, property: string, value: string | number): Promise<product | {}> {
		try {
			const conn = await db.connect();
			const sql =(typeof(value) =='string')?
			 `UPDATE products SET ${property}='${value}' WHERE id=${id} RETURNING *;`:
			 `UPDATE products SET ${property}=${value} WHERE id=${id} RETURNING *;`;
			const result = await conn.query(sql);
			conn.release();
			const ret = result.rows[0];
			return ret ? ret : {};
		}
		catch (err) {
			throw new Error(`Cannot modify the record ${err}`);
		}
	}
}

export default Product;
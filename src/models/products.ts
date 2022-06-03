import db from '../database';

export type product = {
	id: number;
	product_name: string;
	price: number;
	category: string;
};

class Product {
	public async index(): Promise<product[]> {
		try {
			const conn = await db.connect();
			const sql = 'SELECT * FROM products;';
			const result = await conn.query(sql);
			conn.release();
			return result.rows;
		} catch (err) {
			throw new Error(`Cannot connect to database ${err}`);
		}
	}

	public async show(id: number): Promise<product | unknown> {
		try {
			const conn = await db.connect();
			const sql = 'SELECT * FROM products WHERE id=($1);';
			const result = await conn.query(sql, [id]);
			conn.release();
			const ret = result.rows[0];
			return ret ? ret : {};
		} catch (err) {
			throw new Error(`Cannot show the item ${err}`);
		}
	}

	public async get_by_category(category: string): Promise<product | unknown> {
		try {
			const conn = await db.connect();
			const sql = `SELECT * FROM products WHERE category = '${category}';`;
			const result = await conn.query(sql);
			conn.release();
			const ret = result.rows;
			return ret ? ret : {};
		} catch (err) {
			throw new Error(`Cannot show the item ${err}`);
		}
	}

	public async add(p: product): Promise<product | unknown> {
		try {
			const conn = await db.connect();
			const sql =
				'INSERT INTO products (product_name, price, category) values($1, $2, $3) RETURNING *';
			const result = await conn.query(sql, [
				p.product_name,
				p.price,
				p.category,
			]);
			conn.release();
			const ret = result.rows[0];
			return ret ? ret : {};
		} catch (err) {
			throw new Error(`Cannot add the Product ${err}`);
		}
	}
	public async delete(id: number): Promise<product | unknown> {
		try {
			const conn = await db.connect();
			const sql = 'DELETE FROM products where id=($1) RETURNING *;';
			const result = await conn.query(sql, [id]);
			conn.release();
			const ret = result.rows[0];
			return ret ? ret : {};
		} catch (err) {
			throw new Error(`Cannot delete the record ${err}`);
		}
	}
	public async getTopProducts(): Promise<product[]> {
		try {
			const conn = await db.connect();
			const sql = `select product_name, sum(quantity) from orders 
			o inner join products p on p.id=o.product_id  group BY product_name 
			 order by sum(quantity) desc limit 5;`;
			const result = await conn.query(sql);
			conn.release();
			return result.rows;
		} catch (err) {
			throw new Error(`Cannot get the top 5 products ${err}`);
		}
	}
	public async update(
		id: number,
		property: string,
		value: string | number
	): Promise<product | unknown> {
		try {
			const conn = await db.connect();
			const sql =
				typeof value == 'string'
					? `UPDATE products SET ${property}='${value}' WHERE id=${id} RETURNING *;`
					: `UPDATE products SET ${property}=${value} WHERE id=${id} RETURNING *;`;
			const result = await conn.query(sql);
			conn.release();
			const ret = result.rows[0];
			return ret ? ret : {};
		} catch (err) {
			throw new Error(`Cannot modify the record ${err}`);
		}
	}
}

export default Product;

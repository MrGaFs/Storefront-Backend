import db from '../database';
import order, { Order } from './orders';

type orders_product = {
	id: number;
	order_id: number;
	product_id: number;
	quantity: number;
};

type Cart = {
	id: number;
	user_id: number;
	status: boolean;
	products: [product_id: number, product_name: string, quantity: number];
};

const ord = new Order();

class OrdersProducts {
	public async addProduct(
		user_id: number,
		product_id: number,
		quantity: number
	): Promise<orders_product | unknown> {
		try {
			const order = await ord.getCurrentOrder(user_id);
			const order_id = (order as order).id;
			const conn = await db.connect();
			const result = await conn.query(
				`INSERT INTO orders_products (order_id, product_id, quantity) 
			VALUES (${order_id}, ${product_id}, ${quantity}) RETURNING *`
			);
			conn.release();
			return result.rows[0];
		} catch (err) {
			throw new Error(`Cannot add product to cart ${err}`);
		}
	}
	public async getCart(
		order_id: number
	): Promise<Cart | unknown> {
		try {
			const conn = await db.connect();
			let result = await conn.query(`
				SELECT id, user_id, status from orders  WHERE id=${order_id}; `);
			const productsList = await conn.query(
				`SELECT p.id, p.product_name, op.quantity FROM orders_products op 
				INNER JOIN products p ON op.product_id = p.id WHERE op.order_id = ${order_id}`
			);
			if (result.rows[0] == undefined) return {};
			result = result.rows[0];
			return {
				...result,
				products: productsList.rows,
			};
		} catch (e) {
			throw new Error(`Cannot get cart ${e}`);
		}
	}

	public async getCurrentCart(
		user_id: number
	): Promise<Cart | unknown> {
		try {
			const curOrder = await ord.getCurrentOrder(user_id);
			return this.getCart((curOrder as order).id);
		} catch (e) {
			throw new Error(`Cannot get current cart ${e}`);
		}
	}
}
export default OrdersProducts;

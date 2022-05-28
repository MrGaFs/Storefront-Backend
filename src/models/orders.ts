import db from '../database';

type order = {
	id: number;
	user_id: number;
	product_id: number;
	quantity: number;
	status: boolean;
};
type returnedOrder = {
	id: number;
	user_name: string;
	product_name: string;
	quantity: number;
	status: boolean;
};

export class Order {
	async getCurrentOrder(user_id: number): Promise<returnedOrder | unknown> {
		try {
			const result =
				await db.query(`SELECT o.id, user_name, product_name, quantity, status
			FROM orders o INNER JOIN users u ON u.id = o.user_id
			INNER JOIN products p ON p.id = o.product_id WHERE o.user_id = ${user_id} AND o.status = 't';`);
			return result.rows[0] == undefined ? {} : result.rows[0];
		} catch (e) {
			throw new Error(e as string);
		}
	}
	async addOrder(order: order): Promise<returnedOrder | unknown> {
		try {
			const curOrder = await this.getCurrentOrder(order.user_id);
			if (JSON.stringify(curOrder) !== JSON.stringify({}))
				this.setStatus((curOrder as returnedOrder).id, false);
			await db.query(
				'INSERT INTO orders (user_id, product_id, quantity, status) values($1, $2, $3, $4) ',
				[order.user_id, order.product_id, order.quantity, order.status]
			);
			const result = await this.getCurrentOrder(order.user_id);
			return result;
		} catch (e) {
			throw new Error(e as string);
		}
	}
	async getCompletedOrders(user_id: number): Promise<returnedOrder[]> {
		try {
			const result =
				await db.query(`SELECT o.id, user_name, product_name, quantity, status
			FROM orders o INNER JOIN users u ON u.id = o.user_id
			INNER JOIN products p ON p.id = o.product_id WHERE o.user_id = ${user_id} AND o.status = 'f';`);
			return result.rows;
		} catch (e) {
			throw new Error(e as string);
		}
	}
	async setStatus(
		order_id: number,
		status: boolean
	): Promise<returnedOrder | unknown> {
		try {
			const result = await db.query(
				`UPDATE orders SET status = ${status} WHERE id = ${order_id} RETURNING *`
			);
			return result.rows[0];
		} catch (e) {
			throw new Error(e as string);
		}
	}
}
export default order;

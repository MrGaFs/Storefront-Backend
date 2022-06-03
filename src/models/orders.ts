import db from '../database';

type order = {
	id: number;
	user_id: number;
	status: boolean;
};

export class Order {
	async getCurrentOrder(user_id: number): Promise<order | unknown> {
		try {
			const conn = await db.connect();
			const result = await conn.query(`SELECT id, user_id, status
				FROM orders WHERE user_id = ${user_id} AND status = 'yes';`);
			conn.release();
			return result.rows[0] == undefined ? {} : result.rows[0];
		} catch (e) {
			throw new Error(e as string);
		}
	}
	async newOrder(order: order): Promise<order | unknown> {
		try {
			const curOrder = await this.getCurrentOrder(order.user_id);

			if (JSON.stringify(curOrder) !== JSON.stringify({}))
				this.setStatus((curOrder as order).id, false);

			const conn = await db.connect();
			await conn.query(
				'INSERT INTO orders (user_id, status) values($1, $2)',
				[order.user_id, order.status]
			);
			conn.release();
			const result = await this.getCurrentOrder(order.user_id);
			return result;
		} catch (e) {
			throw new Error(e as string);
		}
	}
	async getCompletedOrders(user_id: number): Promise<order[]> {
		try {
			const conn = await db.connect();
			const result = await conn.query(`SELECT id, user_id, status
			FROM orders WHERE user_id = ${user_id} AND status = 'f';`);
			conn.release();
			return result.rows;
		} catch (e) {
			throw new Error(e as string);
		}
	}
	async setStatus(
		order_id: number,
		status: boolean
	): Promise<order | unknown> {
		try {
			const conn = await db.connect();
			const result = await conn.query(
				`UPDATE orders SET status = ${status} WHERE id = ${order_id} RETURNING *`
			);
			conn.release();
			return result.rows[0];
		} catch (e) {
			throw new Error(e as string);
		}
	}
}
export default order;

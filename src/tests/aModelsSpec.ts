import { Order } from '../models/orders';
import dotenv from 'dotenv';
import Product from '../models/products';
import { Users } from '../models/users';
describe('Testing Models', (): void => {
	describe('Testing Products model', (): void => {
		const prod = new Product();
		const items = [
			{
				id: 1,
				product_name: 'testProduct 1',
				price: 10,
				category: 'testCategory 1',
			},
			{
				id: 2,
				product_name: 'testProduct 2',
				price: 10,
				category: 'testCategory 2',
			},
		];

		it('test listing with no item', async (): Promise<void> => {
			const result = await prod.show(1);
			expect(result).toEqual({});
		});

		it('Creating record 1st', async (): Promise<void> => {
			const result = await prod.add(items[0]);
			expect(result).toEqual(items[0]);
		});

		it('Creating record 2nd', async (): Promise<void> => {
			const result = await prod.add(items[1]);
			expect(result).toEqual(items[1]);
		});
		it('listing record', async (): Promise<void> => {
			const result = await prod.show(1);
			expect(result).toEqual(items[0]);
		});
		it('Testing Listing all records', async () => {
			const result = await prod.index();
			expect(result).toEqual(items);
		});

		it('Deleting a record from database', async () => {
			const result = await prod.delete(1);
			expect(result).toEqual(items[0]);
		});

		it('Updating a record in database', async () => {
			const result = await prod.update(2, 'product_name', 'Updated');
			items[1].product_name = 'Updated';
			expect(result).toEqual(items[1]);
		});
	});

	dotenv.config();

	describe('Testing Users model', (): void => {
		const usr = new Users();
		const items = [
			{
				id: 2,
				user_name: 'mrgafs',
				first_name: 'George',
				second_name: 'Azmy',
				password: 'testpassword1',
			},
			{
				id: 3,
				user_name: 'udacity',
				first_name: 'Udacity',
				second_name: 'FWD',
				password: 'testpassword2',
			},
		];
		const sItems = [
			{
				id: 1,
				user_name: process.env.ROOT_USERNAME,
				first_name: 'admin',
				second_name: 'admin',
			},
			{
				id: 2,
				user_name: 'mrgafs',
				first_name: 'George',
				second_name: 'Azmy',
			},
			{
				id: 3,
				user_name: 'udacity',
				first_name: 'Udacity',
				second_name: 'FWD',
			},
		];

		it('test listing with no item', async (): Promise<void> => {
			const result = await usr.show_by_id(2);
			expect(result).toEqual({});
		});

		it('Creating record 1st', async (): Promise<void> => {
			const result = await usr.add(items[0]);
			expect(result).toEqual(sItems[1]);
		});

		it('Creating record 2nd', async (): Promise<void> => {
			const result = await usr.add(items[1]);
			expect(result).toEqual(sItems[2]);
		});

		it('listing record', async (): Promise<void> => {
			const result = await usr.show_by_id(2);
			expect(result).toEqual(sItems[1]);
		});
		it('Testing Listing all records', async () => {
			const result = await usr.index();
			expect(result).toEqual(sItems);
		});

		it('Deleting a record from database', async () => {
			const result = await usr.delete(2);
			expect(result).toEqual(sItems[1]);
		});

		it('Updating a record in database', async () => {
			const result = await usr.update(3, 'second_name', 'Hello');
			sItems[2].second_name = 'Hello';
			expect(result).toEqual(sItems[2]);
		});
		afterAll(async () => {
			const usr = new Users();
			const prod = new Product();
			let calls = [];
			for (let i = 0; i < 5; ++i) {
				calls.push(
					usr.add({
						id: i,
						user_name: `testuser${i}`,
						first_name: `testname${i}`,
						second_name: `testsecond${i}`,
						password: `testpassword${i}`,
					})
				);
			}
			await Promise.all(calls);
			calls = [];
			for (let i = 0; i < 5; ++i) {
				calls.push(
					prod.add({
						id: i,
						product_name: `testproduct${i}`,
						price: i,
						category: `testcategory${i}`,
					})
				);
			}
			await Promise.all(calls);
		});
	});

	describe('Testing Orders model', (): void => {
		const ord = new Order();
		const items = [
			{ id: 1, user_id: 3, product_id: 3, quantity: 10, status: true },
			{ id: 2, user_id: 3, product_id: 4, quantity: 4, status: true },
		];
		it('test listing with no item', async (): Promise<void> => {
			const result = await ord.getCurrentOrder(2);
			expect(result).toEqual({});
		});
		it('Creating record 1st', async (): Promise<void> => {
			const result = await ord.addOrder(items[0]);
			expect(result).toEqual({
				id: 1,
				user_name: 'udacity',
				product_name: 'testproduct0',
				quantity: 10,
				status: true,
			});
		});

		it('Creating record 2st', async (): Promise<void> => {
			const result = await ord.addOrder(items[1]);
			expect(result).toEqual({
				id: 2,
				user_name: 'udacity',
				product_name: 'testproduct1',
				quantity: 4,
				status: true,
			});
		});
		it('Checking The completed Products', async (): Promise<void> => {
			const result = await ord.getCompletedOrders(3);
			expect(result).toEqual([
				{
					id: 1,
					user_name: 'udacity',
					product_name: 'testproduct0',
					quantity: 10,
					status: false,
				},
			]);
		});
	});
});

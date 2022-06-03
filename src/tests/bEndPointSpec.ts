import supertest from 'supertest';
import app from '../server';
const request = supertest(app);
let jwtToken: string;
describe('EndPoint Testing', () => {

	describe('Testing Users Endpoint', () => {
		it('Testing POST /users', async () => {
			const response = await request.post('/users').send({
				user_name: 'test',
				first_name: 'test1',
				second_name: 'testdaddy',
				password: 'test1234',
			});
			expect(response.status).toBe(200);
			jwtToken = response.body.token;
		});
		it('Testing POST /users/login', async () => {
			const response = await request.post('/users/login').send({
				user_name: 'test',
				password: 'test1234',
			});
			expect(response.body.token).toEqual(jwtToken);
		});
		it('Testing GET /users', async () => {
			const response = await request.get('/users').set('Authorization', `Bearer ${jwtToken}`);
			expect(response.body[6]).toEqual({
				id: 8,
				user_name: 'test',
				first_name: 'test1',
				second_name: 'testdaddy'
			}
			);

		});
		it('Testing GET /users/:id', async () => {
			const response = await request.get('/users/8').set('Authorization', `Bearer ${jwtToken}`);
			expect(response.body).toEqual({
				id: 8,
				user_name: 'test',
				first_name: 'test1',
				second_name: 'testdaddy'
			});
		});
		it('Testing DELETE /users/:id', async () => {
			const response = await request.delete('/users/7').set('Authorization', `Bearer ${jwtToken}`);
			expect(response.status).toBe(200);
		});
		it('Testing PUT /users/:id', async () => {
			const response = await request.put('/users/3')
				.set('Authorization', `Bearer ${jwtToken}`)
				.send({ 'first_name': 'hello' });
			expect(response.body['first_name']).toBe('hello');
		});
	});

	describe('Testing Products EndPoint', () => {

		it('Testing POST /products', async () => {
			const response = await request
				.post('/products')
				.set('Authorization', `Bearer ${jwtToken}`)
				.send({
					'product_name': 'testItem',
					'price': 100,
					'category': 'testCategory',
				});
			expect(response.body).toEqual({
				id: 8,
				product_name: 'testItem',
				price: 100,
				category: 'testCategory',
			});
		});

		it('Testing GET /products', async () => {
			const response = await request.get('/products').set('Authorization', `Bearer ${jwtToken}`);
			expect(response.body[6]).toEqual({
				id: 8,
				product_name: 'testItem',
				price: 100,
				category: 'testCategory',
			});
		});

		it('Testing GET /products/:id', async () => {
			const response = await request.get('/products/8').set('Authorization', `Bearer ${jwtToken}`);
			expect(response.body).toEqual({
				id: 8,
				product_name: 'testItem',
				price: 100,
				category: 'testCategory',
			});
		});

		it('Testing GET /products/category/:id', async () => {

			const response = await request.get('/products/category/testCategory').set('Authorization', `Bearer ${jwtToken}`);
			expect(response.body[0]).toEqual({
				id: 8,
				product_name: 'testItem',
				price: 100,
				category: 'testCategory'
			});
		});

		it('Testing DELETE /products/:id', async () => {
			const response = await request.delete('/products/7').set('Authorization', `Bearer ${jwtToken}`);
			expect(response.status).toBe(200);
		});
		it('Testing PUT /products/:id', async () => {
			const response = await request.put('/products/8').set('Authorization', `Bearer ${jwtToken}`)
				.send({ price: 150 });
			expect(response.body.price)
				.toEqual(150);
		});
		it('Testing GET /products/top', async () => {
			const response = await request.get('/products/top');
			expect(response.body).toEqual([
				{ product_name: 'Updated', sum: '5' },
				{ product_name: 'testproduct0', sum: '5' }
			]);
		});
	});

	describe('Testing Orders EndPoint', () => {
		it('Testing POST /orders', async () => {
			const response = await request
				.post('/orders/2').set('Authorization', `Bearer ${jwtToken}`);
			expect(response.body).toEqual({
				id: 3,
				user_id: 2,
				status: true
			});
		});

		it('Testing GET /orders/:id', async () => {
			const response = await request
				.get('/orders/2').set('Authorization', `Bearer ${jwtToken}`);
			expect(response.body).toEqual({
				id: 3,
				user_id: 2,
				status: true
			});
		});

		it('Testing GET /orders/:id', async () => {
			const response = await request
				.get('/orders/completed/2').set('Authorization', `Bearer ${jwtToken}`);
			expect(response.body).toEqual([
				{ id: 1, user_id: 2, status: false }
				, { id: 2, user_id: 2, status: false }
			]);
		});
	});

	describe('Testing Cart EndPoint', () => {
		it('Testing POST /cart/user/:id', async () => {
			const response = await request.post('/cart/user/2').set('Authorization', `Bearer ${jwtToken}`)
				.send({ product_id: 2, quantity: 3 });
			expect(response.body).toEqual({ id: 3, order_id: 3, product_id: 2, quantity: 3 });
		});

		it('Testing GET /cart/user/:id', async () => {
			const response = await request.get('/cart/user/2')
				.set('Authorization', `Bearer ${jwtToken}`);
			expect(response.body).toEqual({
				id: 3,
				user_id: 2,
				status: true,
				products: [
					{
						id: 2,
						product_name: 'Updated',
						quantity: 3
					}
				]
			});
		});

		it('Testing GET /cart/:id', async () => {
			const response = await request.get('/cart/3')
				.set('Authorization', `Bearer ${jwtToken}`);
			expect(response.body).toEqual({
				id: 3,
				user_id: 2,
				status: true,
				products: [
					{
						id: 2,
						product_name: 'Updated',
						quantity: 3
					}
				]
			});
		});
	});
});
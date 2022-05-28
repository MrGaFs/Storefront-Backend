import supertest from 'supertest';
import app from '../server';
const request = supertest(app);
describe('EndPoint Testing', () => {
	it('should return a 200 response', async () => {
		const response = await request.get('/products/5');
		expect(response.status).toBe(200);
	});
	it('checking if the json value is right', async () => {
		const response = await request.get('/products/5');
		expect(response.body).toEqual({
			id: 5,
			product_name: 'testproduct2',
			price: 2,
			category: 'testcategory2',
		});
	});
});

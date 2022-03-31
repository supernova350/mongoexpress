import { MongoExpress } from '../src/index';
import path from 'path';
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

jest.setTimeout(15000);

describe('mongoExpress testing', () => {
	it('should be able to create a new instance', async () => {
		console.log(process.env.ATLAS_URI);
		const mongoExpress = new MongoExpress({
			connectionString: process.env.ATLAS_URI,
		});

		await mongoExpress.connect();

		let val = await mongoExpress.get('store');

		if (!val) {
			await mongoExpress.set('store', 31);
			val = await mongoExpress.get('store');
		}

		expect(val).toBe(31);
	});
});

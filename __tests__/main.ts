import { MongoExpress } from '../src/index';
import {config} from 'dotenv';

jest.setTimeout(15000);

describe('mongoExpress testing', () => {
	it('should be able to create a new instance', async () => {
		config();
		console.log(process.env.ATLAS_URI.length)
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

import { EventEmitter } from 'events';
import { connect, connection, model, type Model, Schema, SchemaTypes } from 'mongoose';

interface IMongoExpressSchema {
	key: string;
	value: any;
}

export interface IMongoExpressOptions {
	connectionString: string;
}

export class MongoExpress extends EventEmitter {
	private readonly connectionString: string;
	private _ready = false;
	public readonly store = new Map<string, any>();
	private readonly model: Model<IMongoExpressSchema> = model<IMongoExpressSchema>(
		'mongoexpress', // collection name
		new Schema({
			key: String,
			value: SchemaTypes.Mixed,
		}),
	);

	public constructor(options: IMongoExpressOptions) {
		super();

		this.connectionString = options.connectionString;
	}

	public async connect(): Promise<void> {
		if (this._ready || connection.readyState !== 0) {
			throw new Error('[mongoexpress] a mongoexpress connection already exists!');
		}

		await connect(this.connectionString);

		await this.onReady();
	}

	private async onReady(): Promise<void> {
		const data = await this.model.find({});
		for (const { key, value } of data) {
			this.store.set(key, value);
		}

		this._ready = true;
		this.emit('ready');
	}

	/**
	 * @function set
	 * @param {string} key
	 * @param {any} value
	 * @returns {Promise<Map<string, any> | void>}
	 * @description Set key to value
	 * @example MongoExpress#set('key', 'value')
	 */
	public async set(key: string, value: any): Promise<Map<string, any> | void> {
		let data = await this.model.findOne({ key });

		if (data) {
			data.value = value;
		} else {
			data = await this.model.create({ key, value });
		}

		await data.save();

		return this.store.set(key, value);
	}

	/**
	 * @function get
	 * @param {string} key
	 * @returns {any} value
	 * @description Get value from key
	 * @example MongoExpress#get('key')
	 */
	public get(key: string): any {
		return this.store.get(key);
	}

	/**
	 * @function
	 * @param {string} key
	 * @description Delete value from key
	 * @example MongoExpress#delete('key')
	 */
	public async delete(key: string): Promise<boolean | void> {
		const data = await this.model.findOne({ key });

		if (!data) {
			return;
		}

		await data.delete();

		return this.store.delete(key);
	}

	/**
	 * @function
	 * @param {string} key
	 * @param {...any} pushValue
	 * @description Push value(s) to an array
	 * @example
	 */
	public async push(key: string, ...pushValue: any): Promise<number | void> {
		const value = this.store.get(key);
		const values = pushValue.flat();

		if (!Array.isArray(value)) {
			throw new Error(`key ${key} is not an array. Cannot push.`);
		}

		let data = await this.model.findOne({ key });

		if (!data) {
			return;
		}

		data.value = [...data.value, ...values];
		await data.save();

		return value.push(pushValue);
	}

	/**
	 * @property
	 * @description Whether the connection is established
	 */
	get ready(): boolean {
		return this._ready;
	}
}

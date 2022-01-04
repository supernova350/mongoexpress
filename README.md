# mongoexpress

## Example

```ts
// initialize a MongoExpress instance
const mongoexpress = new MongoExpress({ connectionString: '' });

// log 'ready' when connected
mongoexpress.on('ready', () => console.log('[mongoexpress] connected'));

// IIFE to use await
(async () => {
    // connect to database
    await mongoexpress.connect();

    // set value of key 'x' to 5
    await mongoexpress.set('x', 5);
    // get value of key 'x' and log
    console.log(await mongoexpress.get('x')); // => 5
})(); 
```

# mongoexpress

[![DeepScan grade](https://deepscan.io/api/teams/16505/projects/19783/branches/520192/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16505&pid=19783&bid=520192)
[![npm shield](https://img.shields.io/npm/v/@supernova350/mongoexpress.svg)](https://www.npmjs.com/package/@supernova350/mongoexpress)

Key-value MongoDB store written in TypeScript.

## Importing

#### [!] Only supports ES Modules

```ts
import MongoExpress from "@supernova350/mongoexpress";
```

## Example Usage

```ts
// initialize a MongoExpress instance
const mongoexpress = new MongoExpress({ connectionString: "" });

// log 'ready' when connected
mongoexpress.on("ready", () => console.log("[mongoexpress] connected"));

// IIFE to use await
(async () => {
  // connect to database
  await mongoexpress.connect();

  // set value of key 'x' to 5
  await mongoexpress.set("x", 5);
  // get value of key 'x' and log
  console.log(await mongoexpress.get("x")); // => 5
})();
```

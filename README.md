## ORM Random instance get/find [![](https://badge.fury.io/js/orm-random.png)](https://npmjs.org/package/orm-random)

This plugin adds random support find for any [ORM](http://dresende.github.io/node-orm2) driver.

## Dependencies

Of course you need `orm` to use it. Other than that, no more dependencies.

## Install

```sh
npm install orm-random
```

## Usage

```js
Model.getRandom([ conditions ], callback);
Model.findRandom([ conditions ], [ limit = 1 ], callback);
```

## Example

```js
var orm = require("orm");

orm.connect("mysql://username:password@host/database", function (err, db) {
    if (err) throw err;

    db.use(fts);

    db.use(require("orm-random"));

    var Person = db.define("person", {
        name      : String,
        surname   : String,
        age       : Number
    });

    Person.findRandom(10, { age: orm.gte(18) }, function (err, people) {
        // returns 10 random people (might have dups) with age at least 18
    });
});
```

# @moirei/complex-pricing

This package is a port of the [laravel-pricing](https://github.com/moirei/laravel-pricing) package with typescript support for the frontend and node.js.

## Installation

```bash
$ npm i @moirei/complex-pricing
# or
$ yarn add @moirei/complex-pricing
```



## Usage

```typescript
import Pricing from '@moirei/complex-pricing'

const pricing = new Pricing({
    model: "package",
    unit_amount: 25,
    units: 5,
});
// or
const pricing = Pricing.make(...)

const price = pricing.price(4); // returns 25.0
```

### Get export content

To export/save and re-instantiate the underlying data, use the `get` method.

```typescript
const content = pricing.get();

pricing = pricing.make(content);
```



## Pricing Models

In large applications, pricing for provided goods or service are often not straight forward. For instance, you might want to charge $10 on an item for every 5 units purchased in AU, while at the same time, for your customers in US, regressively charge $50, $40, $30 for every quantity ranged between 0-30, 31-40, 50-infinity respectively.

This package has the concept of `standard`, `package`, `volume`, and `graduated` pricing intended to cover most (if not all) complex pricing scenarios. It also allows naming for multi-currency and multi-region use cases.



### Standard

This is the classic pricing model where your price result is a linear multiple of the unit price.

```typescript
const pricing = Pricing.make({
    model: "standard",
    unit_amount: 25,
});
// or
const pricing = Pricing.make().standard(25)

const price = pricing.price(4); // returns 100.0
```



### Package

`Package` pricing computes the total result in package groups. For example, an amount of $25.0 for every 5 units. Results are rounded up such that 8 units returns $50.0.

```typescript
const pricing = Pricing.make({
    model: "package",
    unit_amount: 25,
    units: 5,
});
// or
const pricing = Pricing.make().package(25, 5)

const price = pricing.price(4); // returns 25.0
const price = pricing.price(8); // returns 100.0
```



### Volume

Use `volume` pricing to apply charges based on tier of the `quantity`. For example, with the tiers below; charges on 1-5 units fall in the first tier, 6-10 within the second tier, and within the third for 11 units and above.

```typescript
const tiers = [
    {
        max: 5,
        unit_amount: => 3,
    },
    {
        max: 10,
        unit_amount: => 2,
    },
    {
        max: 'infinity',
        unit_amount: 1,
        flat_amount: 0.3,
    }
];
const pricing = Pricing.make({
    model: "volume",
    tiers: tiers,
});
// or
const pricing = Pricing.make().volume(tiers)

const price = pricing.price(4); // returns 4 x 3 = 12.0
const price = pricing.price(8); // returns 8 x 2 = 16.0
const price = pricing.price(12); // returns (12 x 1) + 0.3 = 12.3
```



## Graduated

Use `graduated` pricing to progressively calculate a charge based on all applicable tiers. For example, with the tiers below, a unit of 6 falls between tiers 0-1, 12 falls between 0-2, and so on.

```typescript
const tiers = [
    {
        max: 5,
        unit_amount: => 4,
    },
    {
        max: 10,
        unit_amount: => 3,
        flat_amount: => 0.1,
    },
    {
        max: 15,
        unit_amount: => 2,
        flat_amount: => 0.2,
    },
    {
        max: 'infinity',
        unit_amount: 1,
        flat_amount: 0.3,
    }
];
const pricing = Pricing.make({
    model: "graduated",
    tiers: tiers,
});
// or
const pricing = Pricing.make().graduated(tiers)

const price = pricing.price(4);  // returns 4 x 4 = 16.0
const price = pricing.price(8);  // returns (5 x 4) + (3 x 3 + 0.1) = 29.1
const price = pricing.price(12); // returns (5 x 4) + (5 x 3 + 0.1) + (2 x 2 + 0.2) = 39.3
```



##  Flat Fees

For `volume` and `graduated` pricing, use `flat_amount` for the provided tiers to include a flat fee for every charge.



## Miscellaneous Data

Use the `data` method to update or get the content miscellaneous data.

```typescript
// set data
pricing.data({
    currency: 'AUD'
}) // returns the instance so it may be chainable
pricing.data('meta.tiers_count', 4); // returns 4

const currency = pricing.data('currency') // returns 'AUD'
const tiers_count = pricing.data('meta.tiers_count') // returns 4

const data = pricing.data(); // dump all
```





## Contribution Guidelines

Any pull requests or discussions are welcome.
Note that every pull request providing new feature or correcting a bug should be created with appropriate unit tests.



## Changelog

Please see [CHANGELOG](./CHANGELOG.md).
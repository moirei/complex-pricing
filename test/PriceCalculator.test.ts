/**
 * @moirei/complex-pricing
 *
 * @license MIT
 * @copyright MOIREI - Augustus Okoye<augustusokoye@moirei.com>
 */

import { PriceCalculator } from "../src";
import { PriceTier } from "../src/types";
// @ts-ignore
const { expect } = require("chai");

const tiers: PriceTier[] = [
  {
    max: 5,
    unit_amount: 5,
  },
  {
    max: 10,
    unit_amount: 4,
  },
  {
    max: 15,
    unit_amount: 3,
  },
  {
    max: 20,
    unit_amount: 2,
  },
  {
    max: "infinity",
    unit_amount: 1,
  },
];

describe("Price Calculator", async () => {
  it("standard calculation", async () => {
    expect(25.0).to.equal(PriceCalculator.standard(1, 25));
    expect(100.0).to.equal(PriceCalculator.standard(4, 25));
  });

  it("package calculation", async () => {
    // $25 for every 5 units
    // 4 units should be $25
    expect(25.0).to.equal(PriceCalculator.package(4, 25, 5));

    // $25 for every 5 units
    // 8 units should be $50
    expect(50.0).to.equal(PriceCalculator.package(8, 25, 5));
  });

  it("volume calculation", async () => {
    expect(5.0).to.equal(PriceCalculator.volume(1, tiers));
    expect(25.0).to.equal(PriceCalculator.volume(5, tiers));
    expect(24.0).to.equal(PriceCalculator.volume(6, tiers));
    expect(40.0).to.equal(PriceCalculator.volume(20, tiers));
    expect(25.0).to.equal(PriceCalculator.volume(25, tiers));
  });

  it("graduated calculation", async () => {
    expect(5.0).to.equal(PriceCalculator.graduated(1, tiers));
    expect(25.0).to.equal(PriceCalculator.graduated(5, tiers));
    expect(29.0).to.equal(PriceCalculator.graduated(6, tiers));
    expect(70.0).to.equal(PriceCalculator.graduated(20, tiers));
    expect(75.0).to.equal(PriceCalculator.graduated(25, tiers));
  });
});

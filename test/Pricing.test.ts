/**
 * @moirei/complex-pricing
 *
 * @license MIT
 * @copyright MOIREI - Augustus Okoye<augustusokoye@moirei.com>
 */

import Pricing from "../src";
import { PriceTier, STANDARD } from "../src/types";
import { expect } from "chai";

const tiers: PriceTier[] = [
  {
    max: 5,
    unit_amount: 5,
    flat_amount: undefined,
  },
  {
    max: 10,
    unit_amount: 4,
    flat_amount: undefined,
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

describe("Pricing", async () => {
  it("make standard pricing", async () => {
    const pricing = Pricing.make({
      model: "standard",
      unit_amount: 25,
    });
    expect(100.0).to.equal(pricing.price(4));
  });

  it("make package pricing", async () => {
    const pricing = Pricing.make({
      model: "package",
      unit_amount: 25,
      units: 5,
    });
    expect(25.0).to.equal(pricing.price(4));
    expect(50.0).to.equal(pricing.price(8));
  });

  it("make volume pricing", async () => {
    const pricing = Pricing.make({
      model: "volume",
      tiers,
    });
    expect(5.0).to.equal(pricing.price());
    expect(25.0).to.equal(pricing.price(5));
    expect(24.0).to.equal(pricing.price(6));
  });

  it("make graduated pricing", async () => {
    const pricing = Pricing.make({
      model: "graduated",
      tiers,
    });
    expect(5.0).to.equal(pricing.price());
    expect(25.0).to.equal(pricing.price(5));
    expect(29.0).to.equal(pricing.price(6));
  });

  it("make pricing from instance", async () => {
    const pricing = Pricing.make(
      Pricing.make({
        model: "package",
        unit_amount: 25,
        units: 3,
      })
    ).units(5);

    expect(25.0).to.equal(pricing.price(4));
    expect(50.0).to.equal(pricing.price(8));
  });

  it("should be model name case-insensitive", async () => {
    const pricing = Pricing.make({
      model: "STANDARd" as STANDARD,
      unit_amount: 25,
    });
    expect(pricing.model()).to.equal("standard");
  });
});

describe("Validity", async () => {
  it("should have valid standard pricing", async () => {
    const pricing = Pricing.make({
      model: "standard",
      unit_amount: 0,
    });
    expect(pricing.isValid()).to.equal(true);
  });
  it("should have valid package pricing", async () => {
    const pricing = Pricing.make({
      model: "package",
      unit_amount: 10,
      units: undefined,
    });
    expect(pricing.isValid()).to.equal(true);
  });
  it("should have invalid volume pricing", async () => {
    const pricing = Pricing.make({
      model: "volume",
      tiers: [
        {
          max: 5,
          unit_amount: undefined,
          flat_amount: undefined,
        },
        {
          max: "infinity",
          unit_amount: 1,
        },
      ],
    });
    expect(pricing.isValid()).to.equal(false);
  });
});

describe("Miscellaneous Data", async () => {
  const pricing = Pricing.make();

  it("set data", async () => {
    const x = pricing.data({
      currency: "AUD",
    });
    pricing.data("meta.tiers_count", 4);

    expect("AUD").to.equal(pricing.data("currency"));
    expect(4).to.equal(pricing.data("meta.tiers_count"));
    expect(x).to.be.instanceOf(Pricing);
  });

  it("dump data should return content objects", async () => {
    const data = pricing.data();

    expect("AUD").to.equal(data.currency);
    expect(4).to.equal(data.meta.tiers_count);
  });
});

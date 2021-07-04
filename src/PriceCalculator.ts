import { Infinity, PriceTier } from "./types";
import { data_get, max } from "./utils";

export default class PriceCalculator {
  public static INFINITY: Infinity = -1;

  static get infinitValues(): Infinity[] {
    return [this.INFINITY, "infinity", "inf"];
  }

  /**
   * Get standard pricing
   *
   * @param {number} quantity
   * @param {number} amount
   * @return float
   */
  public static standard(quantity: number, amount: number): number {
    return quantity * amount;
  }

  /**
   * Get package pricing
   *
   * @param {number} quantity
   * @param {number} amount
   * @param {number} units
   * @return float
   */
  public static package(
    quantity: number,
    amount: number,
    units: number
  ): number {
    const count = Math.ceil(quantity / units);
    return amount * count;
  }

  /**
   * Get volume pricing
   *
   * @param {number} quantity
   * @param {PriceTier[]} tiers
   * @return {number}
   */
  public static volume(quantity: number, tiers: PriceTier[]): number {
    const tier = this.getTier(quantity, tiers);
    if (!tier) return 0;
    return (
      quantity * data_get(tier, "unit_amount", 0) +
      data_get(tier, "flat_amount", 0)
    );
  }

  /**
   * Get graduated pricing
   *
   * @param {number} quantity
   * @param {PriceTier[]} tiers
   * @return {number}
   */
  public static graduated(quantity: number, tiers: PriceTier[]): number {
    tiers = this.getTiers(quantity, tiers);

    let price = 0;
    let last = 0;
    let index = 0;
    let m = 0;
    let x = 0;
    const max_tier_value = max(
      tiers.map(
        (tier) =>
          (this.isInfinite(tier.max) ? this.INFINITY : tier.max) as number
      )
    );

    tiers.forEach((tier) => {
      m = data_get(tier, "max");
      m = (this.isInfinite(m) ? this.INFINITY : m) as number;
      if (index++ == 0) {
        x = quantity < m ? quantity : m;
      } else if (this.isInfinite(m)) {
        x = quantity - max_tier_value;
      } else {
        x = (quantity < m ? quantity : m) - last;
      }

      last = m;
      price +=
        x * data_get(tier, "unit_amount", 0) + data_get(tier, "flat_amount", 0);
    });

    return price;
  }

  /**
   * Get the tier of a given amount
   *
   * @param {number} quantity
   * @param {PriceTier[]} tiers
   * @return {PriceTier|undefined}
   */
  protected static getTier(
    quantity: number,
    tiers: PriceTier[]
  ): PriceTier | undefined {
    tiers = this.sortTiers(tiers);
    let tier = tiers.find(
      (tier) =>
        quantity <= (this.isInfinite(tier.max) ? this.INFINITY : tier.max)
    );
    if (!tier) {
      return tiers.find((tier) => this.isInfinite(tier.max));
    }

    return tier;
  }

  /**
   * Get the tiers of a given amount
   *
   * @param {number} quantity
   * @param {PriceTier[]} tiers
   * @return {PriceTier[]}
   */
  protected static getTiers(quantity: number, tiers: PriceTier[]): PriceTier[] {
    tiers = this.sortTiers(tiers);
    const t: PriceTier[] = [];

    const max_tier_value = max(
      tiers.map(
        (tier) =>
          (this.isInfinite(tier.max) ? this.INFINITY : tier.max) as number
      )
    );
    let last = 0;

    tiers.forEach((tier) => {
      const is_infinite = this.isInfinite(tier.max);
      const m = is_infinite ? this.INFINITY : tier.max;
      if (
        (!is_infinite && quantity >= m) ||
        (!is_infinite && quantity <= m && quantity >= last) ||
        (is_infinite && quantity > max_tier_value)
      ) {
        t.push(tier);
      }
      last = m as number;
    });

    return t;
  }

  /**
   * Sort the tiers according to their limit
   * Transform numeric values
   *
   * @param {PriceTier[]} tiers
   * @return {PriceTier[]}
   */
  protected static sortTiers(tiers: PriceTier[]): PriceTier[] {
    return tiers
      .sort((a, b) => {
        if (this.isInfinite(a.max)) return 1;
        if (this.isInfinite(b.max)) return -1;

        return Number(a.max) - Number(b.max);
      })
      .map((tier) => ({
        unit_amount: data_get(tier, "unit_amount", 0),
        flat_amount: data_get(tier, "flat_amount", 0),
        max: data_get(tier, "max", this.INFINITY),
      }));
  }

  /**
   * Check if the given value is Infinite type
   *
   * @param {any} value
   * @return {boolean}
   */
  protected static isInfinite(value: any): boolean {
    return this.infinitValues.includes(value);
  }
}

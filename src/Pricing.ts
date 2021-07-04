import PriceCalculator from "./PriceCalculator";
import { ModelType, PriceTier, PricingData } from "./types";
import { data_get, data_set } from "./utils";

export default class Pricing {
  public static MODEL_STANDARD: ModelType = "standard";
  public static MODEL_PACKAGE: ModelType = "package";
  public static MODEL_VOLUME: ModelType = "volume";
  public static MODEL_GRADUATED: ModelType = "graduated";

  /**
   * The pricing model
   *
   * @var {string}
   */
  protected $model?: ModelType;

  /**
   * The pricing tier factors
   *
   * @var {PriceTier[]}
   */
  protected $tiers?: PriceTier[];

  /**
   * Unit amount for standard and package pricing
   *
   * @var {number}
   */
  protected $unit_amount?: number;

  /**
   * Unit range for package pricing
   *
   * @var {number}
   */
  protected $units?: number;

  /**
   * Miscellaneous data
   *
   * @var any
   */
  protected $data?: any;

  /**
   * Construct a new instance
   *
   * @param {Pricing|PricingData} attributes
   */
  public constructor(attributes?: Pricing | PricingData) {
    if (attributes instanceof Pricing) {
      attributes = attributes.get();
    }
    this.$tiers = [];
    this.model(data_get(attributes, "model", Pricing.MODEL_STANDARD));
    this.tiers(data_get(attributes, "tiers", []));
    this.data(data_get(attributes, "data", []));
    this.unitAmount(data_get(attributes, "unit_amount", 0));
    this.units(data_get(attributes, "units", 1));
  }

  /**
   * Make a new instance
   *
   * @param Pricing|array attributes
   * @return Pricing
   */
  public static make(attributes?: Pricing | PricingData) {
    return new Pricing(attributes);
  }

  /**
   * Get or set model
   *
   * @param string|null $model
   * @return {Pricing|ModelType|undefined}
   */
  public model(model?: ModelType): Pricing | ModelType | undefined {
    if (!model) return this.$model;

    const types: ModelType[] = [
      Pricing.MODEL_STANDARD,
      Pricing.MODEL_PACKAGE,
      Pricing.MODEL_VOLUME,
      Pricing.MODEL_GRADUATED,
    ];

    if (!types.includes(model)) {
      throw new Error("Invalid pricing model '$model'.");
    }

    this.$model = model;

    return this;
  }

  /**
   * Get or set tiers
   *
   * @param {PriceTier[]} tiers
   * @return {Pricing|PriceTier[]}
   */
  public tiers(): PriceTier[];
  public tiers(tiers: PriceTier[]): Pricing;
  public tiers(tiers?: PriceTier[]): PriceTier[] | Pricing {
    if (!tiers) return this.$tiers || [];
    this.$tiers = tiers;
    return this;
  }

  /**
   * Add a tier
   *
   * @param {PriceTier} tiers
   * @return {Pricing}
   */
  public tier(tier: PriceTier) {
    if (!this.$tiers) {
      this.$tiers = [];
    }
    this.$tiers.push(tier);
    return this;
  }

  /**
   * Set the units amount value
   *
   * @param {number} unit_amount
   * @return {Pricing|number|undefined}
   */
  public unitAmount(): number | undefined;
  public unitAmount(unit_amount: number): Pricing;
  public unitAmount(unit_amount?: number): Pricing | number | undefined {
    if (!unit_amount) return this.$unit_amount;

    this.$unit_amount = unit_amount;

    return this;
  }

  /**
   * Set the units value
   *
   * @param {number} units
   * @return {Pricing|number|undefined}
   */
  public units(): number | undefined;
  public units(units: number): Pricing;
  public units(units?: number): Pricing | number | undefined {
    if (!units) return this.$units;
    this.$units = units;

    return this;
  }

  /**
   * Set standard pricing
   *
   * @param {number} unit_amount
   * @return {Pricing}
   */
  public standard(unit_amount: number): Pricing {
    this.model(Pricing.MODEL_STANDARD);
    this.$unit_amount = unit_amount;
    return this;
  }

  /**
   * Set package pricing
   *
   * @param {number} unit_amount
   * @param {number} units
   * @return {Pricing}
   */
  public package(unit_amount: number, units: number): Pricing {
    this.model(Pricing.MODEL_PACKAGE);
    this.$unit_amount = unit_amount;
    this.$units = units;
    return this;
  }

  /**
   * Set volume pricing
   *
   * @param {PriceTier[]} tiers
   * @return {Pricing}
   */
  public volume(tiers: PriceTier[]) {
    this.model(Pricing.MODEL_VOLUME);
    this.$tiers = tiers;
    return this;
  }

  /**
   * Set graduated pricing
   *
   * @param {PriceTier[]} tiers
   * @return {Pricing}
   */
  public graduated(tiers: PriceTier[]) {
    this.model(Pricing.MODEL_GRADUATED);
    this.$tiers = tiers;
    return this;
  }

  /**
   * Get the pricing value
   *
   * @param {number} amount
   * @return {number}
   */
  public price(amount: number = 1): number {
    if (this.$model === Pricing.MODEL_STANDARD) {
      return PriceCalculator.standard(amount, this.$unit_amount || 0);
    } else if (this.$model === Pricing.MODEL_PACKAGE) {
      return PriceCalculator.package(
        amount,
        this.$unit_amount || 0,
        this.$units || 0
      );
    } else if (this.$model === Pricing.MODEL_VOLUME) {
      return PriceCalculator.volume(amount, this.$tiers || []);
    } else if (this.$model === Pricing.MODEL_GRADUATED) {
      return PriceCalculator.graduated(amount, this.$tiers || []);
    }

    return 0;
  }

  /**
   * Get or set miscellaneous data
   *
   * @param {any} data
   * @return {Pricing|any}
   */
  public data(): any;
  public data<T extends string | Record<string, any>>(
    data: T
  ): T extends string ? any : Pricing;
  public data<T>(key: string, data: T): T;
  public data(key?: any, value?: any): any {
    if (value) {
      if (!this.$data) this.$data = {};
      data_set(this.$data, key, value);
      return value;
    }
    if (!key) return this.$data;

    if (typeof key !== "string") {
      this.$data = key;
      return this;
    }

    return data_get(this.$data, key);
  }

  /**
   * Get the result array data.
   *
   * @return {PricingData}
   */
  public get(): PricingData {
    return {
      model: this.$model,
      tiers: this.$tiers,
      unit_amount: this.$unit_amount,
      units: this.$units,
      data: this.$data,
    };
  }
}

/**
 * @moirei/complex-pricing
 *
 * @license MIT
 * @copyright MOIREI - Augustus Okoye<augustusokoye@moirei.com>
 */

export type Infinity = -1 | "inf" | "infinity";

export type STANDARD = "standard";
export type PACKAGE = "package";
export type VOLUME = "volume";
export type GRADUATED = "graduated";

export type ModelType = STANDARD | PACKAGE | VOLUME | GRADUATED;

export type PriceTier = {
  unit_amount?: number;
  flat_amount?: number;
  max: number | Infinity;
};

export type PricingData = {
  model?: ModelType;
  tiers?: PriceTier[];
  unit_amount?: number;
  units?: number;
  data?: any;
};

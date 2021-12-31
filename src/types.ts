/**
 * @moirei/complex-pricing
 *
 * @license MIT
 * @copyright MOIREI - Augustus Okoye<augustusokoye@moirei.com>
 */

export type Infinity = -1 | "inf" | "infinity";

export type STANDARD = "standard" | "STANDARD";
export type PACKAGE = "package" | "PACKAGE";
export type VOLUME = "volume" | "VOLUME";
export type GRADUATED = "graduated" | "GRADUATED";

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

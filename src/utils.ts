export function max(input: number[]): number {
  return Math.max(...input);
}

/**
 * Get a value based on a dot-notation key.
 *
 * @param {any} data - Object to be read from
 * @param {string | string[]} keys - data access key or the dot-notation key.
 * @param {any} def - default value
 * @returns {any} - Value sought OR undefined if key does not exist in obj
 */
export function data_get(data: any, keys: string | string[], def?: any): any {
  if (!data) return def;
  keys = typeof keys === "string" ? keys.split(".") : keys;
  const key = keys.shift();
  if (data.hasOwnProperty(key) && keys.length === 0) {
    if (key && !isNil(data[key])) return data[key];
    return def;
  } else if (!data.hasOwnProperty(key)) return def;
  else return key ? data_get(data[key], keys) : def;
}

/**
 * Set a value based on a dot-notation key.
 *
 * @param {Record<string, any>} data
 * @param {string|string[]} keys
 * @param {any} value
 */
export function data_set(
  data: Record<string, any>,
  k: string | string[],
  value: any
) {
  const keys: string[] = typeof k === "string" ? k.split(".") : k;
  const key: string = keys.shift() || "";

  if (keys.length === 0) {
    data[key] = value;
    return;
  } else if (!data.hasOwnProperty(key)) {
    data[key] = {};
  }

  data_set(data[key], keys, value);
}

/**
 * Checks if `value` is `null` or `undefined`.
 *
 * @param {any} value
 * @returns {boolean}
 */
export function isNil(value: any): value is null | undefined {
  if (value === undefined) return true;
  if (value === null) return true;
  return false;
}

/**
 * @throws {Error}
 * @param {string} message
 */
export function error(message: string): never {
  throw new Error("[Complex Pricing] " + message);
}

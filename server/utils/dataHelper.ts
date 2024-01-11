/**
 * Converts a array to a map.
 *
 * @param array A array to convert
 * @param key A key of value of @param array which will become a key of the map.
 * @return A map of objects with selected attribute as key from @param array.
 */
export const indexToMap = <T, K extends keyof T>(
  array: T[] = [],
  key: K,
): Map<T[K], T> =>
  array.reduce((acc, value) => acc.set(value[key], value), new Map<T[K], T>());

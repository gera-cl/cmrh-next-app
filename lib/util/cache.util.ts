import {
  unstable_cache,
  revalidateTag as unstable_revalidateTag
} from "next/cache";
import { parse, stringify } from "superjson";

// ! Date fields are not serializable
export const cache = <T, P extends unknown[]>(
  fn: (...params: P) => Promise<T>,
  keys: Parameters<typeof unstable_cache>[1],
  opts: Parameters<typeof unstable_cache>[2],
) => {
  const wrap = async (params: unknown[]): Promise<string> => {
    const result = await fn(...(params as P));
    return stringify(result);
  };

  const cachedFn = unstable_cache(wrap, keys, opts);

  return async (...params: P): Promise<T> => {
    const result = await cachedFn(params);
    return parse(result);
  };
}

// ! the revalidation closes the delete confirmation modal
export function revalidateTag(tag: string): void {
  unstable_revalidateTag(tag);
}
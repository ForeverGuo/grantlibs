/**
 * Checks if given string is a valid URL
 *
 * @example
 * isUrl('https://google.com')
 * // => true
 * isUrl('google.com')
 * // => false
 * @param str url string
 * @returns boolean
 */
export function isUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch (err) {
    return false;
  }
}
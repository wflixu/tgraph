
export class ThUtils {
    /**
   * Function: mod
   *
   * Returns the remainder of division of n by m. You should use this instead
   * of the built-in operation as the built-in operation does not properly
   * handle negative numbers.
   */
    public static mod(n: number, m: number) {
        return ((n % m) + m) % m;
    }
}
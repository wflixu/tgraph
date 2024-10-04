export declare class ThUtils {
    /**
   * Function: mod
   *
   * Returns the remainder of division of n by m. You should use this instead
   * of the built-in operation as the built-in operation does not properly
   * handle negative numbers.
   */
    static mod(n: number, m: number): number;
    /**
     * Function: clone
     *
     * Recursively clones the specified object ignoring all fieldnames in the
     * given array of transient fields. <mxObjectIdentity.FIELD_NAME> is always
     * ignored by this function.
     *
     * Parameters:
     *
     * obj - Object to be cloned.
     * transients - Optional array of strings representing the fieldname to be
     * ignored.
     * shallow - Optional boolean argument to specify if a shallow clone should
     * be created, that is, one where all object references are not cloned or,
     * in other words, one where only atomic (strings, numbers) values are
     * cloned. Default is false.
     */
    static clone(obj: any, transients?: string[], shallow?: boolean): any;
    /**
     * Function: isNumeric
     *
     * Returns true if the specified value is numeric, that is, if it is not
     * null, not an empty string, not a HEX number and isNaN returns false.
     *
     * Parameters:
     *
     * n - String representing the possibly numeric value.
    */
    static isNumeric(n: string): boolean;
}

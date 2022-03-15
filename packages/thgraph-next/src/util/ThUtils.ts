import { ThObjectIdentity } from "./ThObjectIdentity";

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
    public static clone(obj: any, transients: string[] = [], shallow = false) {

        let clone = null;

        if (obj != null && typeof obj.constructor == 'function') {
            clone = new obj.constructor();

            for (var i in obj) {
                if (
                    i != ThObjectIdentity.FIELD_NAME && !transients.includes(i)
                ) {
                    if (!shallow && typeof obj[i] == 'object') {
                        clone[i] = ThUtils.clone(obj[i]);
                    } else {
                        clone[i] = obj[i];
                    }
                }
            }
        }

        return clone;
    }

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
    public static isNumeric(n:string) {
    return (
        !isNaN(parseFloat(n)) &&
        isFinite(n as unknown as number) &&
        (typeof n != 'string' || n.toLowerCase().indexOf('0x') < 0)
    );
},
}
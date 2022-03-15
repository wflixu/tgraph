export class ThObjectIdentity {
    /**
     * Class: mxObjectIdentity
     *
     * Identity for JavaScript objects and functions. This is implemented using
     * a simple incrementing counter which is stored in each object under
     * <FIELD_NAME>.
     *
     * The identity for an object does not change during its lifecycle.
     *
     * Variable: FIELD_NAME
     *
     * Name of the field to be used to store the object ID. Default is
     * <code>mxObjectId</code>.
     */
    public static FIELD_NAME: string = 'mxObjectId';

}
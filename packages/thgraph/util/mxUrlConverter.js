
/**
 *
 * Class: mxUrlConverter
 * 
 * Converts relative and absolute URLs to absolute URLs with protocol and domain.
 */
export class mxUrlConverter {


	/**
	 * Variable: enabled
	 * 
	 * Specifies if the converter is enabled. Default is true.
	 */
	enabled = true;

	/**
	 * Variable: baseUrl
	 * 
	 * Specifies the base URL to be used as a prefix for relative URLs.
	 */
	baseUrl = null;

	/**
	 * Variable: baseDomain
	 * 
	 * Specifies the base domain to be used as a prefix for absolute URLs.
	 */
	baseDomain = null;

	/**
	 * Function: updateBaseUrl
	 * 
	 * Private helper function to update the base URL.
	 */
	updateBaseUrl() {
		this.baseDomain = location.protocol + '//' + location.host;
		this.baseUrl = this.baseDomain + location.pathname;
		var tmp = this.baseUrl.lastIndexOf('/');

		// Strips filename etc
		if (tmp > 0) {
			this.baseUrl = this.baseUrl.substring(0, tmp + 1);
		}
	};

	/**
	 * Function: isEnabled
	 * 
	 * Returns <enabled>.
	 */
	isEnabled() {
		return this.enabled;
	};

	/**
	 * Function: setEnabled
	 * 
	 * Sets <enabled>.
	 */
	setEnabled(value) {
		this.enabled = value;
	};

	/**
	 * Function: getBaseUrl
	 * 
	 * Returns <baseUrl>.
	 */
	getBaseUrl() {
		return this.baseUrl;
	};

	/**
	 * Function: setBaseUrl
	 * 
	 * Sets <baseUrl>.
	 */
	setBaseUrl(value) {
		this.baseUrl = value;
	};

	/**
	 * Function: getBaseDomain
	 * 
	 * Returns <baseDomain>.
	 */
	getBaseDomain() {
		return this.baseDomain;
	};

	/**
	 * Function: setBaseDomain
	 * 
	 * Sets <baseDomain>.
	 */
	setBaseDomain(value) {
		this.baseDomain = value;
	};

	/**
	 * Function: isRelativeUrl
	 * 
	 * Returns true if the given URL is relative.
	 */
	isRelativeUrl(url) {
		return url != null && url.substring(0, 2) != '//' && url.substring(0, 7) != 'http://' &&
			url.substring(0, 8) != 'https://' && url.substring(0, 10) != 'data:image' &&
			url.substring(0, 7) != 'file://';
	};

	/**
	 * Function: convert
	 * 
	 * Converts the given URL to an absolute URL with protol and domain.
	 * Relative URLs are first converted to absolute URLs.
	 */
	convert(url) {
		if (this.isEnabled() && this.isRelativeUrl(url)) {
			if (this.getBaseUrl() == null) {
				this.updateBaseUrl();
			}

			if (url.charAt(0) == '/') {
				url = this.getBaseDomain() + url;
			}
			else {
				url = this.getBaseUrl() + url;
			}
		}

		return url;
	};

}

console.log('graph/util/mxUrlConverter.js');
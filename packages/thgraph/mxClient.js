let navigator = window?.navigator ?? {};
import {detect} from 'detect-browser'

const browser = detect();

// 检查是否在浏览器环境中
if (typeof window === 'undefined') {
  throw new Error('This module is only available in the browser environment.');
}

export const mxClient = {
  /**
   * Class: mxClient
   *
   * Bootstrapping mechanism for the mxGraph thin client. The production version
   * of this file contains all code required to run the mxGraph thin client, as
   * well as global constants to identify the browser and operating system in
   * use. You may have to load chrome://global/content/contentAreaUtils.js in
   * your page to disable certain security restrictions in Mozilla.
   *
   * Variable: VERSION
   *
   * Contains the current version of the mxGraph library. The strings that
   * communicate versions of mxGraph use the following format.
   *
   * versionMajor.versionMinor.buildNumber.revisionNumber
   *
   * Current version is 4.2.2.
   */
  VERSION: '4.2.2',
  imageBasePath: '/graph/assets/',
 

  /**
   * Variable: IS_IE11
   *
   * True if the current browser is Internet Explorer 11.x.
   */
  IS_IE11:
    navigator.userAgent != null && !!navigator.userAgent.match(/Trident\/7\./),

  /**
   * Variable: IS_EDGE
   *
   * True if the current browser is Microsoft Edge.
   */
  IS_EDGE: navigator.userAgent != null && !!navigator.userAgent.match(/Edge\//),

  /**
   * Variable: VML_PREFIX
   *
   * Prefix for VML namespace in node names. Default is 'v'.
   */
  VML_PREFIX: 'v',

  /**
   * Variable: OFFICE_PREFIX
   *
   * Prefix for VML office namespace in node names. Default is 'o'.
   */
  OFFICE_PREFIX: 'o',

  /**
   * Variable: IS_NS
   *
   * True if the current browser is Netscape (including Firefox).
   */
  IS_NS:
    navigator.userAgent != null &&
    navigator.userAgent.indexOf('Mozilla/') >= 0 &&
    navigator.userAgent.indexOf('MSIE') < 0 &&
    navigator.userAgent.indexOf('Edge/') < 0,

  /**
   * Variable: IS_OP
   *
   * True if the current browser is Opera.
   */
  IS_OP:
    navigator.userAgent != null &&
    (navigator.userAgent.indexOf('Opera/') >= 0 ||
      navigator.userAgent.indexOf('OPR/') >= 0),

  /**
   * Variable: IS_OT
   *
   * True if -o-transform is available as a CSS style, ie for Opera browsers
   * based on a Presto engine with version 2.5 or later.
   */
  IS_OT:
    navigator.userAgent != null &&
    navigator.userAgent.indexOf('Presto/') >= 0 &&
    navigator.userAgent.indexOf('Presto/2.4.') < 0 &&
    navigator.userAgent.indexOf('Presto/2.3.') < 0 &&
    navigator.userAgent.indexOf('Presto/2.2.') < 0 &&
    navigator.userAgent.indexOf('Presto/2.1.') < 0 &&
    navigator.userAgent.indexOf('Presto/2.0.') < 0 &&
    navigator.userAgent.indexOf('Presto/1.') < 0,

  /**
   * Variable: IS_SF
   *
   * True if the current browser is Safari.
   */
  IS_SF: /Apple Computer, Inc/.test(navigator.vendor),

  /**
   * Variable: IS_ANDROID
   *
   * Returns true if the user agent contains Android.
   */
  IS_ANDROID: navigator.appVersion.indexOf('Android') >= 0,

  /**
   * Variable: IS_IOS
   *
   * Returns true if the user agent is an iPad, iPhone or iPod.
   */
  IS_IOS: /iP(hone|od|ad)/.test(navigator.platform),

  /**
   * Variable: IS_GC
   *
   * True if the current browser is Google Chrome.
   */
  IS_GC: /Google Inc/.test(navigator.vendor),

  /**
   * Variable: IS_CHROMEAPP
   *
   * True if the this is running inside a Chrome App.
   */
  IS_CHROMEAPP:
    window?.chrome != null && chrome.app != null && chrome.app.runtime != null,

  /**
   * Variable: IS_FF
   *
   * True if the current browser is Firefox.
   */
  IS_FF: typeof InstallTrigger !== 'undefined',

  /**
   * Variable: IS_MT
   *
   * True if -moz-transform is available as a CSS style. This is the case
   * for all Firefox-based browsers newer than or equal 3, such as Camino,
   * Iceweasel, Seamonkey and Iceape.
   */
  IS_MT:
    (navigator.userAgent.indexOf('Firefox/') >= 0 &&
      navigator.userAgent.indexOf('Firefox/1.') < 0 &&
      navigator.userAgent.indexOf('Firefox/2.') < 0) ||
    (navigator.userAgent.indexOf('Iceweasel/') >= 0 &&
      navigator.userAgent.indexOf('Iceweasel/1.') < 0 &&
      navigator.userAgent.indexOf('Iceweasel/2.') < 0) ||
    (navigator.userAgent.indexOf('SeaMonkey/') >= 0 &&
      navigator.userAgent.indexOf('SeaMonkey/1.') < 0) ||
    (navigator.userAgent.indexOf('Iceape/') >= 0 &&
      navigator.userAgent.indexOf('Iceape/1.') < 0),

  /**
   * Variable: IS_VML
   *
   * True if the browser supports VML.
   */
  IS_VML: navigator.appName.toUpperCase() == 'MICROSOFT INTERNET EXPLORER',

  /**
   * Variable: IS_SVG
   *
   * True if the browser supports SVG.
   */
  IS_SVG: navigator.appName.toUpperCase() != 'MICROSOFT INTERNET EXPLORER',

  /**
   * Variable: NO_FO
   *
   * True if foreignObject support is not available. This is the case for
   * Opera, older SVG-based browsers and all versions of IE.
   */
  NO_FO:
    !document.createElementNS ||
    document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject') !=
      '[object SVGForeignObjectElement]' ||
    navigator.userAgent.indexOf('Opera/') >= 0,

  /**
   * Variable: IS_WIN
   *
   * True if the client is a Windows.
   */
  IS_WIN: navigator.appVersion.indexOf('Win') > 0,

  /**
   * Variable: IS_MAC
   *
   * True if the client is a Mac.
   */
  IS_MAC: navigator.appVersion.indexOf('Mac') > 0,

  /**
   * Variable: IS_CHROMEOS
   *
   * True if the client is a Chrome OS.
   */
  IS_CHROMEOS: /\bCrOS\b/.test(navigator.appVersion),

  /**
   * Variable: IS_TOUCH
   *
   * True if this device supports touchstart/-move/-end events (Apple iOS,
   * Android, Chromebook and Chrome Browser on touch-enabled devices).
   */
  IS_TOUCH: 'ontouchstart' in document.documentElement,

  /**
   * Variable: IS_POINTER
   *
   * True if this device supports Microsoft pointer events (always false on Macs).
   */
  IS_POINTER:
    window?.PointerEvent != null && !(navigator.appVersion.indexOf('Mac') > 0),

  /**
   * Variable: IS_LOCAL
   *
   * True if the documents location does not start with http:// or https://.
   */
  IS_LOCAL:
    document.location.href.indexOf('http://') < 0 &&
    document.location.href.indexOf('https://') < 0,

  /**
   * Variable: defaultBundles
   *
   * Contains the base names of the default bundles if mxLoadResources is false.
   */
  defaultBundles: [],

  /**
   * Function: isBrowserSupported
   *
   * Returns true if the current browser is supported, that is, if
   *  <mxClient.IS_SVG> is true.
   *
   * Example:
   *
   * (code)
   * if (!mxClient.isBrowserSupported())
   * {
   *   mxUtils.error('Browser is not supported!', 200, false);
   * }
   * (end)
   */
  isBrowserSupported: function () {
    return mxClient.IS_SVG;
  },

  /**
   * Function: link
   *
   * Adds a link node to the head of the document. Use this
   * to add a stylesheet to the page as follows:
   *
   * (code)
   * mxClient.link('stylesheet', filename);
   * (end)
   *
   * where filename is the (relative) URL of the stylesheet. The charset
   * is hardcoded to ISO-8859-1 and the type is text/css.
   *
   * Parameters:
   *
   * rel - String that represents the rel attribute of the link node.
   * href - String that represents the href attribute of the link node.
   * doc - Optional parent document of the link node.
   * id - unique id for the link element to check if it already exists
   */
  link: function (rel, href, doc, id) {
    doc = doc || document;

    var link = doc.createElement('link');

    link.setAttribute('rel', rel);
    link.setAttribute('href', href);
    link.setAttribute('charset', 'UTF-8');
    link.setAttribute('type', 'text/css');

    if (id) {
      link.setAttribute('id', id);
    }

    var head = doc.getElementsByTagName('head')[0];
    head.appendChild(link);
  },

  /**
   * Function: loadResources
   *
   * Helper method to load the default bundles if mxLoadResources is false.
   *
   * Parameters:
   *
   * fn - Function to call after all resources have been loaded.
   * lan - Optional string to pass to <mxResources.add>.
   */
  loadResources: function (fn, lan) {
    var pending = mxClient.defaultBundles.length;

    function callback() {
      if (--pending == 0) {
        fn();
      }
    }

    for (var i = 0; i < mxClient.defaultBundles.length; i++) {
      mxResources.add(mxClient.defaultBundles[i], lan, callback);
    }
  },
};
console.log('graph/mxClient.js');

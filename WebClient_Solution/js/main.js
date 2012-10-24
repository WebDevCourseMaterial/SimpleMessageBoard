
/**
 * @fileoverview Simple main method.
 *
 * @author fisherds@gmail.com (Dave Fisher)
 */

goog.provide('simplemb.main');

goog.require('goog.debug.Console');
goog.require('goog.debug.Logger');
goog.require('goog.debug.LogManager');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('simplemb.MainController');


/**
 * Entry point for JavaScript code.
 */
goog.events.listen(goog.dom.getDocument(), "DOMContentLoaded", function(e) {
  goog.debug.LogManager.getRoot().setLevel(goog.debug.Logger.Level.ALL);
  var logconsole = new goog.debug.Console();
  logconsole.setCapturing(true);

  new simplemb.MainController(/** @type {!Element} */
      (window.document.body));  
});

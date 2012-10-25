
/**
 * @fileoverview Controls the display of rose-message-baord messages.
 *
 * @author fisherds@gmail.com (Dave Fisher)
 */

goog.provide('simplemb.MessageListController');

goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.debug.Logger');
goog.require('goog.json');
goog.require('goog.net.XhrIo');
goog.require('goog.style');

/**
 * Populates a list with a rose-message-board response.
 *
 * @param {Element} container The element for this controller's content.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
simplemb.MessageListController = function(container) {
  goog.base(this);
  
  /**
   * Container element for this controller's content.
   * @type {Element}
   * @private
   */
  this.container_ = container;

  /**
   * Holds events that should only be removed when the controller is disposed.
   * @type {goog.events.EventHandler}
   * @private
   */
  this.eventHandler_ = new goog.events.EventHandler(this);
  
  this.init_();
};
goog.inherits(simplemb.MessageListController, goog.events.EventTarget);


/**
 * Logger for this class.
 * @type {goog.debug.Logger}
 */
simplemb.MessageListController.prototype.logger =
    goog.debug.Logger.getLogger('simplemb.MessageListController');


/**
 * Initialize the message viewer controller.
 */
simplemb.MessageListController.prototype.init_ = function() {
  this.fetchMessages();
};


/**
 * Updates the messages displayed in the UI.  Starts the process by doing a new
 * request from the AppEngine server for messages.
 */
simplemb.MessageListController.prototype.fetchMessages = function() {
  // TODO: Implement this method.
};


/**
 * Individual message from the backend.  Note this typedef is for documentation.
 * @typedef {{
 *   'comment': string,
 *   'author': string}}
 */
simplemb.Message;

/**
 * Message from the backend.  Note this typedef is for documentation.
 * @typedef {{'messages': Array.<simplemb.Message>}}
 */
simplemb.MessageResponse;


/**
 * Handles the JSON reply from AppEngine with the list of messages.
 * @param {goog.events.BrowserEvent} e Xhr event.
 * @private
 */
simplemb.MessageListController.prototype.handleMessagesResponse_ =
    function(e) {
  var xhr = /** @type {goog.net.XhrIo} */ (e.target);  
  if (!xhr.isSuccess()) {
    this.logger.warning('Xhr GET requested failed with status ' +
        xhr.getStatus());
    return;
  }
  // TODO: Send the response to the render method.
};


/**
 * Handles the JSON reply from AppEngine with the list of messages.
 *
 * @param {Array.<simplemb.Message>} messages  Array of messages from the
 *     AppEngine backend.
 * @private
 */
simplemb.MessageListController.prototype.renderUiForMessages_ =
    function(messages) {
  var messageEls = goog.dom.getElementsByClass('message');
  var nameEls = window.document.querySelectorAll('.author h4');
  var commentEls = window.document.querySelectorAll('.comment p');
  for (var i = 0; i < 20; i++) {
    if (i >= messageEls.length) {
      continue;
    }
    if (i < messages.length) {
      // TODO: Fill the message and make it visible.

    } else {
      // TODO: Make the message hidden.
    }
  }
};


/** inheritDoc */
simplemb.MessageListController.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  // Remove listeners added.
  this.eventHandler_.removeAll();
  goog.dispose(this.eventHandler_);
  delete this.eventHandler_;
  
  // Remove the DOM elements.
  goog.dom.removeChildren(this.container_);
};

/**
 * @fileoverview Controls the display of rose-message-baord messages.
 *
 * @author fisherds@gmail.com (Dave Fisher)
 */

goog.provide('simplemb.MainController');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.debug.Logger');
goog.require('simplemb.PostController');
goog.require('simplemb.MessageListController');

/**
 * Top level controller for the message board.
 *
 * @param {!Element} container The element for this controller's content.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
simplemb.MainController = function(container) {
  goog.base(this);

  /**
   * Container element for this controller's content.
   * @type {!Element}
   * @private
   */
  this.container_ = container;

  /**
   * View controller for the display of messages.
   * @type {simplemb.MessageListController}
   * @private
   */
  this.messageListController_ = null;

  /**
   * View controller for the creation of new messages.
   * @type {simplemb.PostController}
   * @private
   */
  this.postController_ = null;

  /**
   * Holds events that should only be removed when the controller is disposed.
   * @type {goog.events.EventHandler}
   * @private
   */
  this.eventHandler_ = new goog.events.EventHandler(this);

  this.init_();

};
goog.inherits(simplemb.MainController, goog.events.EventTarget);

/**
 * Logger for this class.
 * @type {goog.debug.Logger}
 */
simplemb.MainController.prototype.logger = goog.debug.Logger
    .getLogger('simplemb.MainController');

/**
 * Initialize the message board.
 * @private 
 */
simplemb.MainController.prototype.init_ = function() {
  this.messageListController_ = new simplemb.MessageListController(
      goog.dom.getElement('message-viewer'));
  this.postController_ = new simplemb.PostController(
      goog.dom.getElement('message-post'));

  this.eventHandler_.listen(this.postController_,
      simplemb.PostController.EventType.NEW_MESSAGE_POSTED, function(e) {
        this.messageListController_.fetchMessages();
      });
};

/** inheritDoc */
simplemb.MainController.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  // Remove listeners added.
  this.eventHandler_.removeAll();
  goog.dispose(this.eventHandler_);
  delete this.eventHandler_;

  // Dispose of instance variables (view controllers and oauth helper).
  goog.dispose(this.messageListController_);
  delete this.messageListController_;
  goog.dispose(this.postController_);
  delete this.postController_;
};

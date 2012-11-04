/**
 * @fileoverview Controls the display of rose-message-baord messages.
 *
 * @author fisherds@gmail.com (Dave Fisher)
 */

goog.provide('simplemb.SimpleMBController');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.events.KeyHandler');
goog.require('goog.debug.Logger');
goog.require('goog.ui.LabelInput');

/**
 * Top level controller for the message board.
 *
 * @param {!Element} container The element for this controller's content.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
simplemb.SimpleMBController = function(container) {
  goog.base(this);

  /**
   * Container element for this controller's content.
   * @type {!Element}
   * @private
   */
  this.container_ = container;
  
  /**
   * Decorative label for the input boxes.
   * @type {goog.ui.LabelInput}
   * @private
   */
  this.authorLabelInput_ = null;

  /**
   * Decorative label for the input boxes.
   * @type {goog.ui.LabelInput}
   * @private
   */
  this.commentLabelInput_ = null;

  /**
   * Holds events that should only be removed when the controller is disposed.
   * @type {goog.events.EventHandler}
   * @private
   */
  this.eventHandler_ = new goog.events.EventHandler(this);

  this.init_();

};
goog.inherits(simplemb.SimpleMBController, goog.events.EventTarget);


/**
 * Key used for local storage for the author name.
 * @type {string}
 * @const
 */
simplemb.SimpleMBController.KEY_AUTHOR_NAME = 'author-name';


/**
 * Logger for this class.
 * @type {goog.debug.Logger}
 */
simplemb.SimpleMBController.prototype.logger = goog.debug.Logger
    .getLogger('simplemb.SimpleMBController');

/**
 * Initialize the message board.
 * @private 
 */
simplemb.SimpleMBController.prototype.init_ = function() {
  // Add label inputs (hints) to the input elements.
	var authorInputEl = window.document.querySelector('input[name=author]');
	this.authorLabelInput_ = new goog.ui.LabelInput(' name');
	this.authorLabelInput_.decorate(authorInputEl);
	var commentInputEl = window.document.querySelector('input[name=comment]');
	this.commentLabelInput_ = new goog.ui.LabelInput(' say something');
	this.commentLabelInput_.decorate(commentInputEl);

	// Add a key listener to the author input text.
	this.eventHandler_.listen(authorInputEl,
	    goog.events.EventType.KEYUP, this.onKeyEvent_);
	
	// Fill the author field if known.
  var nameInLocalStorage = goog.global.localStorage.getItem(
      simplemb.SimpleMBController.KEY_AUTHOR_NAME);
  if (nameInLocalStorage) {
    authorInputEl.value = nameInLocalStorage;
  }
};



/**
 * Listener for key press events.
 * @param {goog.events.KeyEvent} e Key event.
 * @private
 */
simplemb.SimpleMBController.prototype.onKeyEvent_ = function(e) {
  var currentName = this.authorLabelInput_.getElement().value;
  goog.global.localStorage.setItem(
      simplemb.SimpleMBController.KEY_AUTHOR_NAME,
      currentName);
  this.logger.info("Saved = " + currentName);
};


/** inheritDoc */
simplemb.SimpleMBController.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  // Remove listeners added.
  this.eventHandler_.removeAll();
  goog.dispose(this.eventHandler_);
  delete this.eventHandler_;

  // Remove components that add listeners.
  goog.dispose(this.authorLabelInput_);
  delete this.authorLabelInput_;
  goog.dispose(this.commentLabelInput_);
  delete this.commentLabelInput_;
};

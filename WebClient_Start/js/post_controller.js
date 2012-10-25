
/**
 * @fileoverview Controls the authoring of rose-message-baord messages.
 *
 * @author fisherds@gmail.com (Dave Fisher)
 */

goog.provide('simplemb.PostController');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.json');
goog.require('goog.net.XhrIo');
goog.require('goog.ui.LabelInput');



/**
 * Controller used author messages sent to the rose-message-board.
 *
 * @param {Element} container The element for this controller's content.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
simplemb.PostController = function(container) {
  goog.base(this);
  
  /**
   * Container element for this controller's content.
   * @type {Element}
   * @private
   */
  this.container_ = container;

  /**
   * Key handler to listen for the Enter button on the comments.
   * @type {goog.events.KeyHandler}
   * @private
   */
  this.keyHandler_ = null;
  
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
goog.inherits(simplemb.PostController, goog.events.EventTarget);


/**
 * Events that can be fired by instances of this class.
 * @enum {string}
 */
simplemb.PostController.EventType = {
  NEW_MESSAGE_POSTED: goog.events.getUniqueId('new-message')
};


/**
 * Key used for local storage for the author name.
 * @type {string}
 * @const
 */
simplemb.PostController.KEY_AUTHOR_NAME = 'author-name';


/**
 * Logger for this class.
 * @type {goog.debug.Logger}
 */
simplemb.PostController.prototype.logger =
    goog.debug.Logger.getLogger('simplemb.PostController');


/**
 * Initialize the post controller.  Before adding UI elements check the OAuth
 * state.
 */
simplemb.PostController.prototype.init_ = function() {
  
  //this.logger.info("Listeners before = " + goog.events.getTotalListenerCount());
  var authorInputEl = goog.dom.getElement('author-input');
  this.authorLabelInput_ = new goog.ui.LabelInput;
  this.authorLabelInput_.decorate(authorInputEl);
  this.commentLabelInput_ = new goog.ui.LabelInput;
  this.commentLabelInput_.decorate(goog.dom.getElement('comment-input'));
  //this.logger.info("Listeners after = " + goog.events.getTotalListenerCount());
  
  // Add a listener to the comment input text.
  this.keyHandler_ = new goog.events.KeyHandler(
      goog.dom.getElement('comment-input'));
  this.eventHandler_.listen(this.keyHandler_,
      goog.events.KeyHandler.EventType.KEY, this.onKeyEvent_);

  // Fill the author field if known.
  var nameInLocalStorage = window.localStorage.getItem(
      simplemb.PostController.KEY_AUTHOR_NAME);
  if (nameInLocalStorage) {
    authorInputEl.value = nameInLocalStorage;
  }
};


/**
 * Listener for key press events.
 * @param {goog.events.KeyEvent} e Key event.
 * @private
 */
simplemb.PostController.prototype.onKeyEvent_ = function(e) {
  switch (e.keyCode) {
    case goog.events.KeyCodes.ENTER:
      this.submitMessage_();
      break;
  }
};


/**
 * Submits the message to the backend.
 */
simplemb.PostController.prototype.submitMessage_ = function() {
  this.logger.info('Submit the new message.');  
  var authorText = goog.dom.getElement('author-input').value;
  var commentText = goog.dom.getElement('comment-input').value;
  var newMessage = {'author': authorText, 'comment': commentText};
  goog.dom.getElement('comment-input').value = '';
  var postBodyJson = goog.json.serialize(newMessage);
  goog.net.XhrIo.send(
      '/api',
      goog.bind(this.handleXhrResponse_, this),
      'POST',
      postBodyJson,
      {
        'Content-Type': 'application/json'
      });
  
  var currentName = this.authorLabelInput_.getElement().value;
  window.localStorage.setItem(
      simplemb.PostController.KEY_AUTHOR_NAME,
      currentName);
};


/**
 * Processed the backend response to make sure there were no errors.  Fires
 * an event if the message was successfully added.
 *
 * @param {goog.events.BrowserEvent} e Event for XHR response.
 */
simplemb.PostController.prototype.handleXhrResponse_ = function(e) {
  var xhr = /** @type {goog.net.XhrIo} */ (e.target);  
  if (!xhr.isSuccess()) {
    this.logger.warning('Xhr POST requested failed with status ' +
        xhr.getStatus());
    return;
  }
  var messageResponse = xhr.getResponseJson();

  // CONSIDER: Could check the return message.
  
  // Fire an event that a new message has been successfully added.
  this.dispatchEvent(
      simplemb.PostController.EventType.NEW_MESSAGE_POSTED);
};


/** inheritDoc */
simplemb.PostController.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  // Remove listeners added.
  this.eventHandler_.removeAll();
  goog.dispose(this.eventHandler_);
  delete this.eventHandler_;

  // Remove components that add listeners.
  goog.dispose(this.keyHandler_);
  delete this.keyHandler_;
  goog.dispose(this.authorLabelInput_);
  delete this.authorLabelInput_;
  goog.dispose(this.commentLabelInput_);
  delete this.commentLabelInput_;
  
  // Remove the DOM elements.
  //goog.dom.removeChildren(this.container_);
};

/**
 * @class
 */
var Mojito = (function() {
  "use strict";

  /**
   * Constructor function
   * @param  {object} options
   * @param  {string} [selector]
   */
  var Mojito = function(options, selector, store) {
    // Return if no options provided
    if (!options) return;

    // Save options, selector and store data
    this.selector = selector || null;
    this.element = null;
    this.data = options.data || {};
    this.template = options.template || null;
    this.created = options.created;
    this.store = store || {};
    this.attributes = {};
  };

  Mojito.version = "0.4.0";

  /**
   * Registered Mojito components
   */
  Mojito.components = {};

  /**
   * All kinds of utilities and helper functions. Accessible from every component.
   */
  Mojito.utils = {};

  /**
   * Debug info.
   */
  Mojito.debug = Boolean(
    JSON.parse(window.sessionStorage.getItem("MojitoDebug"))
  );

  /**
   * Render all
   */
  Mojito.prototype.render = function() {
    this.renderComponent();
    this.createChildComponents(this.getChildComponentElements());
  };

  /**
   * Render only if the component itself has changed.
   * Note: Child components will be always re-created.
   */
  Mojito.prototype.renderComponent = function() {
    if (Mojito.debug) {
      var colorR = Math.round(Math.random() * 255);
      var colorG = Math.round(Math.random() * 255);
      var colorB = Math.round(Math.random() * 255);
      this.element.style.border =
        "3px solid rgb(" + colorR + ", " + colorG + ", " + colorB + ")";
    }
    this.attributes = this.element.dataset;
    this.getChildComponentElements().forEach(function(child) {
      child.innerHTML = "";

      // Delete all event listeners
      var clone = child.cloneNode(true);
      child.parentNode.replaceChild(clone, child);
    });
    var generatedHTML = this.template(this.data, this.attributes);
    if (this.element.innerHTML === generatedHTML) return;
    if (Mojito.debug) console.log("Render component " + this.selector);
    this.element.innerHTML = generatedHTML;
  };

  /**
   * Get all child components
   */
  Mojito.prototype.getChildComponentElements = function() {
    var childComponentElements = this.element.querySelectorAll(
      "[data-mojito-comp]"
    );
    childComponentElements = Array.prototype.slice.call(childComponentElements); // IE workaround
    return childComponentElements;
  };

  /**
   * Create child components.
   */
  Mojito.prototype.createChildComponents = function(childComponentElements) {
    var _this = this;
    childComponentElements.forEach(function(element) {
      var componentName = element.dataset.mojitoComp || "";
      var componentId = element.dataset.mojitoId || null;
      var compontentSelector = '[data-mojito-comp="' + componentName + '"]';
      if (componentId)
        compontentSelector += '[data-mojito-id="' + componentId + '"]';
      if (Mojito.debug)
        console.log(
          _this.selector + " creates child component " + compontentSelector
        );

      // Create child component
      var component = Mojito.components[componentName];
      if (typeof component !== "function")
        throw new Error("Mojito Component '" + componentName + "' not found");
      component(compontentSelector, _this.store).create(_this.data);
    });
  };

  /**
   * Create component flow
   */
  Mojito.prototype.create = function(parentData) {
    // 1. Add parents data to own data
    this.data._parent = parentData;

    // 2. Grab element from DOM
    this.element = document.querySelector(this.selector);

    // 3. Render the component and save the next child components
    this.renderComponent();
    var childComponentElements = this.getChildComponentElements();

    // 4. Call created function of the component
    this.created(
      this.data,
      this.attributes,
      this.render.bind(this),
      document.querySelector(this.selector)
    );

    // 5. Create child components
    this.createChildComponents(childComponentElements);
  };

  return Mojito;
})();

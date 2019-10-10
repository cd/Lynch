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
    this.created = options.created || null;
    this.beforeDestroy = options.beforeDestroy || null;
    this.store = store || {};
    this.childComponents = [];
  };

  Mojito.version = "0.13.0";

  /**
   * Registered Mojito components
   */
  Mojito.components = {};

  /**
   * All kinds of utilities and helper functions. Accessible from every component.
   */
  Mojito.utils = {};

  /**
   * Debug info
   */
  Mojito.debug = false;

  /**
   * Disable the render function (for debugging purposes)
   */
  Mojito.disableRender = false;

  /**
   * Render all
   */
  Mojito.prototype.render = function() {
    if(Mojito.disableRender) return;

    // Do nothing if the element is no longer part of the DOM
    if (!this.element.parentNode) return;

    this.destroyChildComponents(true);
    this.renderComponent();
    this.createChildComponents();
  };

  /**
   * Destroy all child components
   */
  Mojito.prototype.destroyChildComponents = function(rootCalled) {
    this.childComponents.forEach(function(element) {
      element.destroyChildComponents(false);
      element.destroy(rootCalled);
    });
    this.childComponents = [];
  };

  /**
   * Destroy component
   */
  Mojito.prototype.destroy = function(rootCalled) {
    // Call 'beforeDestroy' hook (e.g. to clear timer)
    if (this.beforeDestroy) {
      this.beforeDestroy.call({
        data: this.data
      });
    }

    // The element does not need to be removed from the DOM
    // if the parent item is also removed soon.
    if (!rootCalled) return;

    // Do nothing if the element is no longer part of the DOM
    if (!this.element.parentNode) return;

    // Remove all elements
    this.element.innerHTML = "";

    // Remove border style that was later added by debug mode.
    if (Mojito.debug) this.element.removeAttribute("style");

    // Delete all event listeners (clone and replace element)
    var clone = this.element.cloneNode(true);
    this.element.parentNode.replaceChild(clone, this.element);

    if (Mojito.debug) console.log("Component destroyed: " + this.selector);
  };

  /**
   * Render only if the component itself has changed.
   * Note: Child components will be always re-created.
   */
  Mojito.prototype.renderComponent = function() {
    // Generate new HTML
    var generatedHTML = this.template.call({ data: this.data });

    // If the generated HTML is equal to the current rendered HTML, do nothing.
    if (this.element.innerHTML === generatedHTML) return;

    // If debug mode is enabled, add a random colored border to the component.
    if (Mojito.debug) {
      console.log("Render component " + this.selector);
      var colorR = Math.round(Math.random() * 255);
      var colorG = Math.round(Math.random() * 255);
      var colorB = Math.round(Math.random() * 255);
      this.element.style.border =
        "3px solid rgb(" + colorR + ", " + colorG + ", " + colorB + ")";
    }

    // Replace the current HTML
    this.element.innerHTML = generatedHTML;
  };

  /**
   * Create child components.
   */
  Mojito.prototype.createChildComponents = function() {
    var childComponentElements = this.element.querySelectorAll(
      "[data-mojito-comp]"
    );
    childComponentElements = Array.prototype.slice.call(childComponentElements); // IE workaround
    var _this = this;
    this.childComponents = [];
    childComponentElements.forEach(function(element) {
      var componentName = element.dataset.mojitoComp || "";
      var componentId = element.dataset.mojitoId || null;
      var compontentSelector = '[data-mojito-comp="' + componentName + '"]';
      if (componentId)
        compontentSelector += '[data-mojito-id="' + componentId + '"]';

      // Prevent duplicate components (due to recursive render and build calls)
      var duplicates = _this.childComponents.filter(function(childComponent) {
        return childComponent.selector === compontentSelector;
      }).length;
      if (duplicates) return;

      if (Mojito.debug)
        console.log(
          _this.selector + " creates child component " + compontentSelector
        );

      // Create child component
      var component = Mojito.components[componentName];
      if (typeof component !== "function")
        throw new Error("Mojito Component '" + componentName + "' not found");
      _this.childComponents.push(
        component(compontentSelector, _this.store).create(_this)
      );
    });
  };

  /**
   * Create component flow
   */
  Mojito.prototype.create = function(parentComponent) {
    parentComponent = parentComponent || { element: document, data: null };

    // 1. Grab element from DOM
    this.element = parentComponent.element.querySelector(this.selector);

    // 2. Add parents data, DOM element and selector name to own data
    this.data._data = parentComponent.data;
    this.data._el = this.element;
    this.data._selector = this.selector;

    // 3. Call created function of the component
    this.created.call({
      data: this.data,
      render: this.render.bind(this)
    });

    return this;
  };

  return Mojito;
})();

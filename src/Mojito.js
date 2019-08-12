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

  /**
   * Registered Mojito components
   */
  Mojito.components = {};

  /**
   * All kinds of utilities and helper functions. Accessible from every component.
   */
  Mojito.utils = {};

  /**
   * Render all
   */
  Mojito.prototype.render = function() {
    this.renderComponent();
    this.createComponents();
  };

  /**
   * Render only the component itself
   */
  Mojito.prototype.renderComponent = function() {
    this.attributes = this.element.dataset;
    this.element.innerHTML = this.template(this.data, this.attributes);
  };

  /**
   * Create all direct child components
   */
  Mojito.prototype.createComponents = function() {
    var elements = this.element.querySelectorAll("[data-mojito-comp]");
    elements = Array.prototype.slice.call(elements); // IE workaround
    var _this = this;

    elements.forEach(function(element) {
      var componentName = element.dataset.mojitoComp || "";
      var componentId = element.dataset.mojitoId || null;
      var compontentSelector = '[data-mojito-comp="' + componentName + '"]';
      if (componentId) compontentSelector += '[data-mojito-id="' + componentId + '"]';

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

    // 3. Render the components
    this.renderComponent();

    // 4. Call created function of the component
    this.created(
      this.data,
      this.attributes,
      this.render.bind(this),
      document.querySelector(this.selector)
    );

    // 5. Create child components
    this.createComponents();
  };

  return Mojito;
})();

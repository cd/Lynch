/**
 * Class
 * @class
 */
var Mojito = (function() {
  "use strict";

  /**
   * Constructor function
   * @param  {object} options
   * @param  {string} [selector] Selector only for root instance
   */
  var Mojito = function(options, selector, store) {
    // Return if no options provided
    if (!options) return;

    // Store options data
    this.selector = selector || null;
    this.element = null;
    this.data = options.data || {};
    this.template = options.template || null;
    this.created = options.created;
    // this.components = options.components || {};
    this.store = store || {};
    this.attributes = {};
  };

  // Registered mojito components
  Mojito.components = {};

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
    // var domElement = document.querySelector(this.selector);
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

      // Initiate child component creation flow
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

    // 2. Render the components
    this.renderComponent();

    // 3. Call created function of the component
    this.created(
      this.data,
      this.attributes,
      this.render.bind(this),
      document.querySelector(this.selector)
    );

    // 4. Create child components like the came way
    this.createComponents();
  };

  return Mojito;
})();

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

  Mojito.version = "0.16.1";

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
   * Disable the render and bump function (for debugging purposes)
   */
  Mojito.disableRender = false;

  /**
   * Render all
   */
  Mojito.prototype.render = function(properties) {
    if (Mojito.disableRender) return;

    this.destroyChildComponents(true);

    // Do nothing if the element is no longer part of the DOM
    if (!this.element || !this.element.parentNode) return;

    var rebuilt = this.renderComponent();

    this.createChildComponents(properties);

    return rebuilt;
  };

  /**
   * Destroy all child components
   */
  Mojito.prototype.destroyChildComponents = function(rootCalled) {
    this.childComponents.forEach(function(element) {
      element.destroy(rootCalled);
    });
    this.childComponents = [];
  };

  /**
   * Destroy component
   */
  Mojito.prototype.destroy = function(rootCalled) {
    // Destroy all child components
    this.destroyChildComponents(false);

    // Call 'beforeDestroy' hook (e.g. to clear timer)
    if (this.beforeDestroy) {
      this.beforeDestroy.call({
        data: this.data
      });
    }

    if (Mojito.debug) console.log(this.selector + " destroyed");

    // The element does not need to be removed from the DOM
    // because a parent item will be removed in a higher level.
    if (!rootCalled) return;

    // Do nothing if the element is no longer part of the DOM
    if (!this.element || !this.element.parentNode) return;

    // Remove all elements
    this.element.innerHTML = "";

    // Delete all event listeners (clone and replace element)
    var clone = this.element.cloneNode(true);
    this.element.parentNode.replaceChild(clone, this.element);

    if (Mojito.debug) console.log(this.selector + " removed from DOM");
  };

  /**
   * Render only if the component itself has changed.
   * Note: Child components will be always re-created.
   */
  Mojito.prototype.renderComponent = function() {
    // Generate new HTML
    var generatedHTML = this.template.call({ data: this.data });

    // If the generated HTML is equal to the current rendered HTML, do nothing.
    if (this.element.innerHTML === generatedHTML) return false;

    // Replace the current HTML
    this.element.innerHTML = generatedHTML;

    if (Mojito.debug) console.log(this.selector + " rendered");
    return true;
  };

  /**
   * Create child components.
   */
  Mojito.prototype.createChildComponents = function(properties) {
    properties = properties || [];
    var childComponentElements = this.element.querySelectorAll(
      "[data-mojito-comp]"
    );

    // IE workaround
    childComponentElements = Array.prototype.slice.call(childComponentElements);

    var _this = this;
    this.childComponents = [];
    childComponentElements.forEach(function(element) {
      var componentName = element.dataset.mojitoComp || "";
      var componentId = element.dataset.mojitoId || null;
      var property = null;
      properties.forEach(function(el) {
        if (componentName === el.component && componentId === (el.id || null))
          property = el.prop;
      });
      _this.createChildComponent(property, componentName, componentId);
    });
  };

  Mojito.prototype.createChildComponent = function(
    property,
    componentName,
    componentId
  ) {
    var compontentSelector = '[data-mojito-comp="' + componentName + '"]';
    if (componentId)
      compontentSelector += '[data-mojito-id="' + componentId + '"]';

    // Prevent duplicate components
    var duplicates = this.childComponents.filter(function(childComponent) {
      return childComponent.selector === compontentSelector;
    }).length;
    if (duplicates) return;

    if (Mojito.debug)
      console.log(
        this.selector + " creates child component " + compontentSelector
      );

    // Get component constructor
    var componentConstructor = Mojito.components[componentName];
    if (typeof componentConstructor !== "function")
      throw new Error("Mojito Component '" + componentName + "' not found");

    // Prepare child component
    var component = componentConstructor(compontentSelector, this.store);
    this.childComponents.push(component);

    // Create component
    component.create(this, property);
  };

  /**
   * Re-create component
   */
  Mojito.prototype.bump = function(property, componentName, componentId) {
    if (Mojito.disableRender) return;

    var compontentSelector = '[data-mojito-comp="' + componentName + '"]';
    if (componentId)
      compontentSelector += '[data-mojito-id="' + componentId + '"]';

    for (var i = 0; i < this.childComponents.length; i++) {
      if (this.childComponents[i].selector === compontentSelector) {
        this.childComponents[i].destroy(true);
        this.childComponents.splice(i, 1);
      }
    }

    this.createChildComponent(property, componentName, componentId);
  };

  /**
   * Create component flow
   */
  Mojito.prototype.create = function(parentComponent, prop) {
    parentComponent = parentComponent || { element: document, data: null };

    // 1. Grab element from DOM
    this.element = parentComponent.element.querySelector(this.selector);

    // 2. Add parents data, DOM element and selector name to own data
    this.data._data = parentComponent.data;
    this.data._el = this.element;
    this.data._selector = this.selector;
    this.data._prop = prop;

    // 3. Call created function of the component
    this.created.call({
      data: this.data,
      render: this.render.bind(this),
      bump: this.bump.bind(this)
    });

    return this;
  };

  return Mojito;
})();

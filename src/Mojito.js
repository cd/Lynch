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
    this.styles = options.styles || [];
    this.styleElements = [];
    this.created = options.created || null;
    this.beforeDestroy = options.beforeDestroy || null;
    this.store = store || {};
    this.childComponents = [];
  };

  /**
   * Mojito version
   */
  Mojito.version = "0.17.0";

  /**
   * Registered Mojito components
   */
  Mojito.components = {};

  /**
   * All kinds of utilities and helper functions. Accessible from every component
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

    // Remove style elements from DOM
    this.removeStyleElements()

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
   * Create all child components
   */
  Mojito.prototype.createChildComponents = function(properties) {
    properties = properties || [];
    var childComponentElements = this.element.querySelectorAll(
      "[data-mojito-comp]"
    );

    // IE workaround
    childComponentElements = Array.prototype.slice.call(childComponentElements);

    this.childComponents = [];
    for (let i = 0; i < childComponentElements.length; i++) {
      var componentName = childComponentElements[i].dataset.mojitoComp || "";
      var componentId = childComponentElements[i].dataset.mojitoId || null;
      var property = null;
      properties.forEach(function(el) {
        if (componentName === el.component && componentId === (el.id || null))
          property = el.prop;
      });
      this.createChildComponent(property, componentName, componentId);
    }
  };

  /**
   * Create single child component
   */
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
   * Re-create child component
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
   * Create and add style elements to the DOM.
   * Styling rules are subject to the scope of the component.
   */
  Mojito.prototype.addStyleElements = function() {
    var selector = this.selector;
    for (let i = 0; i < this.styles.length; i++) {
      var styleElement = window.document.createElement("style");

      // Consider optional style attributes.
      if (Array.isArray(this.styles[i].attributes)) {
        this.styles[i].attributes.forEach(function(attribute) {
          styleElement.setAttribute(attribute[0], attribute[1]);
        });
      }

      // Add style element to DOM
      window.document.head.appendChild(styleElement);

      // Add rules
      this.styles[i].rules.forEach(function(rule) {
        // Set own selector at the beginning to create a styling scope.
        styleElement.sheet.insertRule(selector + " " + rule);
      });
      this.styleElements.push(styleElement);
    }
  };

  /**
   * Remove all style elements from the DOM.
   */
  Mojito.prototype.removeStyleElements = function() {
    for (var i = 0; i < this.styleElements.length; i++) {
      window.document.head.removeChild(this.styleElements[i]);
    }
    this.styleElements = [];
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

    // 3. Create and add (scoped) CSS styling
    this.addStyleElements();

    // 4. Call created function of the component
    this.created.call({
      data: this.data,
      render: this.render.bind(this),
      bump: this.bump.bind(this)
    });

    return this;
  };

  return Mojito;
})();

# Lynch

A very minimalistic JavaScript front-end framework for web apps. It's just 1.1 kb minified and gzipped!

## Live Demo

[👉 **Check out the Live Demo!**](https://cd.github.io/Lynch/examples/todo-list/)

In this simple example you can see the full power of Lynch and pure JavaScript:

- Nested and reusable components
- Isolated and shared data
- Reuseable functions
- Events / Reactivity
- Routing
- Scoped CSS

## Getting Started

Just add Lynch to your HTML file, define the main component and call the `create()` method of the component definition object:

```html
<body>
  <!-- Render the component inside this element -->
  <div data-lynch-app></div>

  <!-- Add Lynch -->
  <script src="https://cdn.jsdelivr.net/gh/cd/Lynch/src/Lynch.min.js"></script>

  <script>
    // Define main component
    var myApp = new Lynch(
      {
        // Returns an HTML string which will be rendered
        // inside the selected DOM element.
        template: function() {
          return "<strong>" + this.data.myText + "</strong>";
        },

        // Component's data
        data: {
          myText: "Hello Lynch!"
        },

        // Created hook. This is where most things happen.
        created: function() {
          // Edit the data object
          this.data.myText += " Love it ❤️";

          // Render the component
          this.render()
        }
      },
      "[data-lynch-app]", // DOM element selector
    );

    // Create the component
    myApp.create();
  </script>
</body>
```

Result:

```html
<body>
  <div data-mojoto-app>
    <strong>Hello Lynch! Love it ❤️</strong>
  </div>
</body>
```

And this is what happens: When you call the `create()` method of the component definition object, the component will be created and the `created` hook will be called. The `created` hook contains the most logic of your app (add or listen to events, set timers, do XHR and so on). In this example, it modifies the data object and renders the component.

To render a component means, the template function will be called. The function returns an HTML string based on the data object. The returned string will be parsed and included inside the DOM element of the component.

You can also create components inside other components. You just have to register the component definition object to Lynch and put it in parents HTML template with the special `[data-lynch-comp]` attribute:

```javascript
// Child component definitions have to be wrapped in a function like this
Lynch.components.myChildComponent = function(selector) {
  return (
    new Lynch(
      {
        template: function() {
          return "Hello from child component!";
        },
        created: function() {
          this.render();
        }
      },
      selector
	  )
  );
};

// Main component
return new Lynch(
  {
    template: function() {
      var html =
        "<h1>Component inside a component</h1>" +
        '<div data-lynch-comp="myChildComponent"></div>';
      return html;
    },
    created: function() {
      this.render();
    }
  },
  "[data-lynch-app]"
).create();
```

And that's going on: The `create` method of the main component definition is called immediately. The main component is also created immediately. The created hook of the main component is called and renders the component to the DOM. After the component is rendered, there is an empty DOM element inside: `<div data-lynch-comp="myChildComponent"></div>`. Lynch detects this element because of the special `data` attribute. It is looking for a component definition object with a name like the value of the attribute. Then the `create()` method will be called and the child component can render itself.

If you want to add the same component multiple times, you need to make them unique with the `data-lynch-id`:

```javascript
// Main component
return new Lynch(
  {
    template: function() {
      var html =
        "<h1>Component inside a component</h1>" +
        '<div data-lynch-comp="myChildComponent" data-lynch-id="1"></div>' +
        '<div data-lynch-comp="myChildComponent" data-lynch-id="2"></div>' +
        '<div data-lynch-comp="myChildComponent" data-lynch-id="three"></div>';
      return html;
    },
    created: function() {
      this.render();
    }
  },
  "[data-lynch-app]"
).create();
```

There are several ways to supply the child component with data:

1. Inside a child component, you can access the parent's data object as a property of the own data object with `this.data._data`. Attention: This is a reference to the parent data object. Any changes here affect the parent's data object (bad practice).

2. You can add data to the DOM element of the child component (e.g. with the data-attribute). Within the child component you can access the data: `this.data._el.dataset`

3. You can use properties to add data to the component. If you render the parent component, you have to pass a property object to the `render()` method:
    ```javascript
    // Main component
    return new Lynch(
      {
        template: function() {
          var html =
            "<h1>Component inside a component</h1>" +
            '<div data-lynch-comp="myChildComponent" data-lynch-id="1"></div>' +
            '<div data-lynch-comp="myChildComponent" data-lynch-id="2"></div>' +
            '<div data-lynch-comp="myChildComponent" data-lynch-id="three"></div>';
          return html;
        },
        created: function() {
          // Pass an array of properties
          this.render([
            {
              // Component name
              component: "myChildComponent",

              // Component ID (not necessary as soon as there is only one component)
              id: "2",

              // Component's data
              prop: "Special child data"
            },
            {
              component: "myChildComponent",
              id: "three",
              prop: {
                special: "data",
                superSpecial: ["some", "thing"]
              }
            }
          ]);
        }
      },
      "[data-lynch-app]"
    ).create();
    ```
    Inside the child component you can access the data via `this.data._prop`.

If you want to style a component with CSS, make use of the `styles` property. In this case, all CSS rules affect only the component itself and its child components:
```javascript
// ...
    template: function() {
      return '<div class="wrapper">CSS Style <strong>only</strong> in this component!</div>';
    },

    // Add an array of stylesheets
    styles: [
      {
        // Two rules in the first stylesheet
        rules: [
          '.wrapper { font-weight: bold; border: 5px solid black; }',
          '.wrapper > strong:hover { color: red; }'
        ]
      },
      {
        // Just one rule in the seconds stylesheet
        rules: ['.wrapper { font-size: 0.9em; }'],

        // Add a set of attributes if you want
        attributes: [
          // In this case just one attribute
          ['media', 'only screen and (max-width: 50em)']
        ]
      }
    ],

    data: { /* ... */ },

    created: function() { /* ... */ }
// ...
```

## Lifecycle of a component

1. The lifecycle starts with the `create()` call of the component definition object.

2. Lynch grabs the element from DOM with the specified selector.

3. Add parent's data, the DOM element, the selector name and the property to components data (accessible via `this.data._data`, `this.data._el`, `this.data._selector` and `this.data._prop`).

4. Call the `created` hook of the component.

5. The `destroy()` method destroys the component. This happens in most cases under the hood when the parent component does a `this.render()`. First, the `beforeDestroy` hook will be called. Then, the component element will be removed from the DOM.

## Best Practice and Tips

To avoid unwanted side effects or performance issues, it's very important to know, how Lynch works. Here are some hints:

- Ensure, that the component calls `this.render()`. Otherwise, nothing happens.
- If a child component needs parent's data to work, render the child component when the data is available.
- If a component has a lot of child components, try to minimize the use of `this.render()`. Every time, a component renders, all child components will be destroyed and recreated (and their child components too, etc.).
- If a part of your app needs a render many times, wrap it inside an extra component to avoid a re-render of static content and unnecessary re-creations of child components.
- If a component has many child components and you want to update just one child component, make use of the `this.bump()` method:
    ```javascript
    this.bump(myPropertyObj, 'myChildComponent');
    ```
    or
    ```javascript
    this.bump(myPropertyObj, 'myChildComponent', 'componentId');
    ```
  This initiates a re-creation of the component and passes a property object to the child component.
- If you hold a DOM reference in your data, be aware that after each `this.render()` the DOM _could_ be rebuilt and the reference leads nowhere anymore. In this case, check the return value of the `render` method:
    ```javascript
    var domIsRebuild = this.render();
    if (domIsRebuild) {
      // all references are lost
    }
    ```
- Clear timers and DOM references in the `beforeDestroy` hook:
  ```javascript
  // ...
  created: function() {
    // ...
    this.data.myTimerId = window.setInterval(myFnc, 1000);
    this.data.myElement = this.data._el.querySelector('canvas');
    // ...
  },
  beforeDestroy: function() {
    window.clearInterval(this.data.myTimerId);
    this.data.myElement = null;
  }
  // ...
  ```
- Make use of the Lynch debug mode and watch to the web console. You can activate the debug mode like this:
  ```javascript
  Lynch.debug = true;
  ```
- You shouldn't manipulate parents object. Use e.g. Custom Events to send data to the parent.
- Use the [scaffords](https://github.com/cd/Lynch/tree/master/scaffold).
- Study the [examples](https://github.com/cd/Lynch/tree/master/examples).
- If you want to inspect the DOM, it may be helpful to globally disable the render function. All you have to do is type `Lynch.disableRender = true` into the console or place it in your code.

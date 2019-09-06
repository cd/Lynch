# Mojito

A super tiny JavaScript framework for web apps. It's just 0.8 kb minified and gzipped!

## Live Demo

[👉 **Check out the Live Demo!**](https://cd.github.io/mojito/examples/todo-list/)

In this simple example you can see the full power of Mojito and vanilla JavaScript:

- Nested and reusable components
- Isolated and shared data
- Reuseable functions
- Events / Reactivity
- Routing

## Getting Started

Just add Mojito to your HTML file, define the main component and call the `create()` method of the component definition object:

```html
<body>
  <!-- Render the component inside this element -->
  <div data-mojito-app></div>

  <!-- Add Mojito -->
  <script src="https://cdn.jsdelivr.net/gh/cd/mojito/src/Mojito.js"></script>

  <script>
    // Define main component
    var myApp = new Mojito(
      {
        // Returns an HTML string which will be rendered
        // inside the selected DOM element.
        template: function() {
          return "<strong>" + this.data.myText + "</strong>";
        },

        // Component's data
        data: {
          myText: "Hello Mojito!"
        },

        // Created hook. This is where most things happen.
        created: function() {
          // Edit the data object
          this.data.myText += " Love it ❤️";

          // Render the component
          this.render()
        }
      },
      "[data-mojito-app]", // DOM element selector
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
    <strong>Hello Mojito! Love it ❤️</strong>
  </div>
</body>
```

And this is what happens: When you call the `create()` method of the component definition object, the component will be created and the `created` hook will be called. The `created` hook contains the most logic of your app (add or listen to events, set timers, do XHR requests and so on). In this example, it modifies the data object and renders the component.

To render a component means, the template function will be called. The function returns an HTML string based on the data object. The returned string will be parsed and included inside the DOM element of the component.

You can also create components inside other components. You just have to register the component definition object to Mojito and put it in parents HTML template with the special `[data-mojito-comp]` attribute:

```javascript
// Child component definitions have to wrapped in a function like this
Mojito.components.myChildComponent = function(selector) {
  return (
    new Mojito({
      template: function() {
        return "Hello from child component!";
      },
      created: function() {
        this.render();
      }
    }),
    selector
  );
};

// Main component
return new Mojito(
  {
    template: function() {
      var html =
        "<h1>Component inside a component</h1>" +
        '<div data-mojito-comp="myChildComponent"></div>';
      return html;
    },
    created: function() {
      this.render();
    }
  },
  "[data-mojito-app]"
).create();
```

And that's going on: The `create` method of the main component definition is called immediately. The main component is also created immediately. The created hook of the main component is called and renders the component to the DOM. After the component is rendered, there is an empty DOM element inside: `<div data-mojito-comp="myChildComponent"></div>`. Mojito detects this element because of the special `data` attribute. It is looking for a component definition object with a name like the value of the attribute. Then the `create()` method will be called and the child component can render itself.

If you want to add the same component multiple times, you need to make them unique with the `data-mojito-id`:

```javascript
// Main component
return new Mojito(
  {
    template: function() {
      var html =
        "<h1>Component inside a component</h1>" +
        '<div data-mojito-comp="myChildComponent" data-mojito-id="1"></div>' +
        '<div data-mojito-comp="myChildComponent" data-mojito-id="2"></div>' +
        '<div data-mojito-comp="myChildComponent" data-mojito-id="three"></div>';
      return html;
    }
  },
  "[data-mojito-app]"
).create();
```

Inside a child's component, you can access the parent's data object as a property of the own data object with `this.data._data`. Attention: This is a reference to the parent data object. Any changes here affect the parent's data object (this is bad practice).

## Lifecycle of a component

1. The lifecycle starts with the `create()` call of the component definition object.

2. Mojito grabs the element from DOM with the specified selector.

3. Add parent's data and the DOM element to components data (accessible via `this.data._data` and `this.data._el`).

4. Call the `created` hook of the component.

5. The `destroy()` method destroys the component. This happens in most cases under the hood when the parent component does a `this.render()`. First, the `beforeDestroy` hook will be called. Then, the component element will be removed from the DOM.

## Best Practice and Tips

To avoid unwanted side effects or performance issues, it's very important to know, how Mojito works. Here are some hints:

- Ensure, that the component calls `this.render()`. Otherwise, nothing happens.
- If a child component needs parent's data to work, render the child component when the data is available.
- If a component has a lot of child components, try to minimize the use of `this.render()`. Every time, a component renders, all child components will be destroyed and recreated (and their child components too, etc.).
- If a part of your app needs a render many times, wrap it inside an extra component to avoid a re-render of static content and unnecessary re-creations of child components.
- Clear timers in the `beforeDestroy` hook:
  ```javascript
  // ...
  created: function() {
    // ...
    this.data.myTimerId = window.setInterval(myFnc, 1000);
    // ...
  },
  beforeDestroy: function() {
    window.clearInterval(this.data.myTimerId);
  }
  // ...
  ```
- Make use of the Mojito debug mode. It adds a random colored border to each component element. You can see the structure of the app and you can also see when a component is rendered. Further information is also output via `console.log`. You can activate the debug mode like this:
  ```javascript
  Mojito.debug = true;
  ```
  It's recommended to set the flag before the root component is rendered. If you use this feature, make sure that the component element has no inline styles.
- You shouldn't manipulate parents object. Use e.g. Custom Events to send data to the parent.
- If you want to send specific information to a child component, use the data attribute of the DOM element:
  ```javascript
  return new Mojito({
    template: function() {
      return '<div data-mojito-comp="myChildComponent" data-my-info-message="super component 123"></div>';
    }
  });
  ```
- Use the [scaffords](https://github.com/cd/mojito/tree/master/scaffold).
- Study the [examples](https://github.com/cd/mojito/tree/master/examples).

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

Just add Mojito to your HTML file, define a main component and call the components `create()` method:

```html
<body>
  <!-- Render the component inside the element -->
  <div data-mojoto-app></div>

  <!-- Add Mojito -->
  <script src="https://cdn.jsdelivr.net/gh/cd/mojito/src/Mojito.js"></script>

  <script>
    // Define main component
    var myApp = new Mojito(
      {
        // Returns a HTML string which will be rendered
        // inside the selected DOM element.
        template: function() {
          return "<strong>" + this.data.myText + "</strong>";
        },

        // Component's data
        data: {
          myText: "Hello Mojito!";
        }
      },
      "[data-mojito-app]", // DOM element selector
    );

    // Create the component and render it
    myApp.create();
  </script>
</body>
```

Result:

```html
<body>
  <div data-mojoto-app><strong>Hello Mojito!</strong></div>
</body>
```

And this is what happens: When you call the `create()` method, the following steps are taken:

1. The component grabs the element with the `[data-mojito-app]` selector.
2. The template function will be called. Within the function, the data object is accessible via `this.data`.
3. The returned string will be parsed and included inside the element.

This is a very static example, I grant, so let's add a little bit more dynamic:

```javascript
new Mojito(
  {
    template: function() {
      return "<strong>" + this.data.myText + "</strong>";
    },
    data: {
      myText: "Hello Mojito!";
    },

    created: function() {
      // Add additional text after 1 seconds und render it again (implemented as arrow function, no IE support in this example)
      window.setTimeout(() => {
        this.data.myText += " Love it ❤️";
        this.render();
      }, 1000);
    }
  },
  "[data-mojito-app]", // DOM element selector
).create();
```

This example continues the above steps:

4. After the component rendered with initial data, the `created` hook will be called. The data object is accessible with `this.data` and can be manipulated. To force a re-render, use `this.render()`.

You can also create components inside other components. You just have to register it to Mojito and put it in parents html template with the special `[data-mojito-comp]` attribute:

```javascript
// Child components have to wrapped in a function like this
Mojito.components.myChildComponent = function(selector) {
  return (
    new Mojito({
      template: function() {
        return "Hello from child component!";
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
    }
  },
  "[data-mojito-app]"
).create();
```

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

Inside childs component you can access parents data object as a property of your data object. Example:

```javascript
Mojito.components.myChildComponent = function(selector) {
  return (
    new Mojito({
      template: function() {
        return "I can see parents data object: " + JSON.stringify(this.data._data);
      },

      created: function() {
        // Access parent data in 'created' hook like this:
        console.log(this.data._data);
      }
    }),
    selector
  );
};
```

## Insights under the hood
### Creating a component

1. Grab the element from DOM.

2. Add parents data and the DOM element to components data.

3. Render the component:

   1. First, remove all child component elements from DOM.
   2. Call the components template function.
   3. The returned html will be compared with the actual DOM. If there are changes, replace the real DOM with the new one.

4. Call components `created` hook (at this time the whole steps are processed again recursively).

5. Call the create function of all child components. At this time the whole steps are processed again recursively.

### Calling `render()` inside `created` hook

You can call `this.render()` inside the created hook to force a re-render. If you do so, the above steps 3 and 5 are processed.

### Best Practice and Tips

To avoid unwanted side effects or performance issues, it's very important to know, how the creation of a component and a re-render inside the `created` hook work. Here are some hints:

- Ensure, that the component can render with the initial data.
- If child components need parents data to work, render the child components when the data is available.
- If a component has a lot of child components, try to minimize the use of `this.render()`. Explanation: Every time, a component re-renders, all child components will be destroyed and recreated (and their child components too, etc.).
- Make use of the Mojito debug mode. It adds a random colored border to each component element. You can **see** the structure of the app and you can also see **when** a component is rendered. In addition, more information will be output via `console.log`. You can activate the debug mode like this:
  ```javascript
  Mojito.debug = true;
  ```
  It's recommended to set the flag before the root component is rendered. If you use this feature, make sure that the component element has no inline styles.
- You shouldn't manipulate parents object. Use e.g. Custom Events to send data to the parent.
- If you want to send specific information to a child component, use the data attribute of the DOM element:
  ```javascript
  return new Mojito({
    template: function() {
      return '<div data-mojito-comp="myChildComponent" data-class="special"></div>';
    }
  });
  ```
- Use the [scaffords](https://github.com/cd/mojito/tree/master/scaffold).
- Study the [examples](https://github.com/cd/mojito/tree/master/examples).

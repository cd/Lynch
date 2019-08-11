(function() {
  "use strict";

  // No further execution if Mojio is not available
  if (typeof Mojito !== "function" || !Mojito.components)
    throw new Error("Mojito not found");

  // Register 'comp' component to Mojito
  Mojito.components.viewTasks = function(selector, store) {
    return new Mojito(
      {
        template: function(data, attributes) {
          var html = '<div class="box" data-mojito-comp="todoForm"></div>';
          html +=
            '<div class="box" data-mojito-comp="todoList" data-mojito-id="todo"></div>';
          html +=
            '<div class="box" data-mojito-comp="todoList" data-mojito-id="done"></div>';
          return html;
        },

        data: {
          items: [
            {
              class: "todo",
              text: "Test Item"
            },
            {
              class: "todo",
              text: "Another Item..."
            },
            {
              class: "done",
              text: "Make Sport"
            }
          ]
        },

        created: function(data, attributes, render, element) {
          element.addEventListener("done", function(event) {
            data.items[data.items.indexOf(event.detail.item)].class = 'done';
            window.sessionStorage.setItem("items", JSON.stringify(data.items));
            render();
          });
          element.addEventListener("remove", function(event) {
            data.items.splice(data.items.indexOf(event.detail.item), 1);
            window.sessionStorage.setItem("items", JSON.stringify(data.items));
            render();
          });
          element.addEventListener("add", function(event) {
            data.items.push({
              text: event.detail.itemText,
              class: 'todo'
            });
            window.sessionStorage.setItem("items", JSON.stringify(data.items));
            render();
          });
          var storage = window.sessionStorage.getItem("items");
          if (storage) data.items = JSON.parse(storage);
        }
      },
      selector,
      store
    );
  };
})();

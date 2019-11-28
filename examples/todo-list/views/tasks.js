(function() {
  "use strict";

  // No further execution if Mojio is not available
  if (typeof Lynch !== "function" || !Lynch.components)
    throw new Error("Lynch not found");

  // Register 'viewTasks' component to Lynch
  Lynch.components.viewTasks = function(selector, store) {
    return new Lynch(
      {
        template: function() {
          var html = '<div class="box" data-lynch-comp="todoForm"></div>';
          html +=
            '<div class="box" data-lynch-comp="todoList" data-lynch-id="1"></div>';
          html +=
            '<div class="box" data-lynch-comp="todoList" data-lynch-id="2"></div>';
          return html;
        },

        data: {
          // Inital (dummy) items
          items: [
            {
              id: 0,
              class: "todo",
              text: "Write documentation"
            },
            {
              id: 1,
              class: "todo",
              text: "Create more examples"
            },
            {
              id: 2,
              class: "done",
              text: "Create a super tiny framework"
            }
          ]
        },

        created: function() {
          // IE 11 support (no arrow functions)
          var _this = this;

          /**
           * Create property object
           */
          var createProperties = function() {
            return [
              {
                component: "todoList",
                id: "1",
                prop: {
                  class: "todo",
                  items: _this.data.items.filter(function(item) {
                    return item.class === "todo";
                  })
                }
              },
              {
                component: "todoList",
                id: "2",
                prop: {
                  class: "done",
                  items: _this.data.items.filter(function(item) {
                    return item.class === "done";
                  })
                }
              }
            ];
          };

          // For new items by component 'todo-list.js'
          this.data._el.addEventListener("add", function(event) {
            _this.data.items.push({
              text: event.detail.itemText,
              class: "todo",
              id: _this.data.items[_this.data.items.length - 1].id + 1
            });
            window.sessionStorage.setItem(
              "items",
              JSON.stringify(_this.data.items)
            );

            // Re-Render
            _this.render(createProperties());
          });

          // For items to be moved to "done" section by component "toto-list.js"
          this.data._el.addEventListener("done", function(event) {
            var item = _this.data.items.find(function(item) {
              return item.id === event.detail.itemId;
            });
            item.class = "done";
            window.sessionStorage.setItem(
              "items",
              JSON.stringify(_this.data.items)
            );

            // Re-Render
            _this.render(createProperties());
          });

          // For items to be "deleted" by component "todo-list.js"
          this.data._el.addEventListener("remove", function(event) {
            var item = _this.data.items.find(function(item) {
              return item.id === event.detail.itemId;
            });
            item.class = "";
            window.sessionStorage.setItem(
              "items",
              JSON.stringify(_this.data.items)
            );
            // Only re-create the done list component.
            // A full re-render is also possible,
            // but this way is more precise and therefore more performant.
            _this.bump(createProperties()[1].prop, "todoList", "2");
          });

          // Load items from session storage
          var storage = window.sessionStorage.getItem("items");
          if (storage) this.data.items = JSON.parse(storage);

          this.render(createProperties());
        }
      },
      selector,
      store
    );
  };
})();

(function() {
  "use strict";

  // No further execution if Mojio is not available
  if (typeof Mojito !== "function" || !Mojito.components)
    throw new Error("Mojito not found");

  // Register 'viewTasks' component to Mojito
  Mojito.components.viewTasks = function(selector, store) {
    return new Mojito(
      {
        template: function() {
          var html = '<div class="box" data-mojito-comp="todoForm"></div>';
          html +=
            '<div class="box" data-mojito-comp="todoList" data-mojito-id="todo"></div>';
          html +=
            '<div class="box" data-mojito-comp="todoList" data-mojito-id="done"></div>';
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

          // For new items by component 'todo-list.js'
          this.data._el.addEventListener("add", function(event) {
            _this.data.items.push({
              text: event.detail.itemText,
              class: "todo",
              id: _this.data.items[_this.data.items.length - 1].id + 1
            });
            window.sessionStorage.setItem("items", JSON.stringify(_this.data.items));
            _this.render();
          });

          // For items to be moved to "done" section by component "toto-list.js"
          this.data._el.addEventListener("done", function(event) {
            var item = _this.data.items.find(function(item) {
              return item.id === event.detail.itemId;
            });
            item.class = "done";
            window.sessionStorage.setItem("items", JSON.stringify(_this.data.items));
            _this.render();
          });

          // For items to be "deleted" by component "todo-list.js"
          this.data._el.addEventListener("remove", function(event) {
            var item = _this.data.items.find(function(item) {
              return item.id === event.detail.itemId;
            });
            item.class = "";
            window.sessionStorage.setItem("items", JSON.stringify(_this.data.items));
            _this.render();
          });

          // Load items from session storage
          var storage = window.sessionStorage.getItem("items");
          if (storage) this.data.items = JSON.parse(storage);

          this.render();
        }
      },
      selector,
      store
    );
  };
})();

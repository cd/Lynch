(function() {
  "use strict";

  // No further execution if Mojio is not available
  if (typeof Mojito !== "function" || !Mojito.components)
    throw new Error("Mojito not found");

  // Register 'todoList' component to Mojito
  Mojito.components.todoList = function(selector, store) {
    return new Mojito(
      {
        template: function() {
          var html = "";
          if (this.data.class === "todo")
            html +=
              "<h2>" +
              store.translations.tasks[store.currentLanguage] +
              "</h2>";
          if (this.data.class === "done")
            html +=
              "<h2>" + store.translations.done[store.currentLanguage] + "</h2>";
          html += "<ul>";

          // List all items by loop
          for (var index = 0; index < this.data.items.length; index++) {
            html += "<li>";
            html += this.data.items[index].text;
            html += "<button data-button-id='" + this.data.items[index].id + "'>";
            html += this.data.class === "todo" ? "✔" : "❌";
            html += "️</button>";
            html += "</li>";
          }

          html += "</ul>";
          return html;
        },

        data: {
          items: [],
          class: null
        },

        created: function() {
          // IE 11 support (no arrow functions)
          var _this = this;

          /**
           * Dispatch event of user clicks on a button
           */
          var buttonHandler = function(event) {
            var itemId = event.target.dataset.buttonId;
            if (!itemId) return;
            _this.data._el.dispatchEvent(
              new CustomEvent(_this.data.class === "todo" ? "done" : "remove", {
                bubbles: true,
                detail: {
                  itemId: Number(itemId)
                }
              })
            );
          };

          this.data._el.addEventListener("click", buttonHandler);

          // Get class of component (todo list or done list)
          this.data.class = this.data._el.dataset.mojitoId;

          // Get specific items from parent component
          this.data.items = this.data._data.items.filter(function(item) {
            return item.class === _this.data._el.dataset.mojitoId;
          });

          this.render();
        }
      },
      selector,
      store
    );
  };
})();

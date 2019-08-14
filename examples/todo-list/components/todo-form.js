(function() {
  "use strict";

  // No further execution if Mojio is not available
  if (typeof Mojito !== "function" || !Mojito.components)
    throw new Error("Mojito not found");

  // Register 'todoForm' component to Mojito
  Mojito.components.todoForm = function(selector, store) {
    return new Mojito(
      {
        template: function(data, attributes) {
          var html =
            "<h2>" +
            store.translations.add[store.currentLanguage] +
            "</h2>" +
            '<input type="text" required></input>' +
            "<button>➕</button>";
          return html;
        },

        data: {},

        created: function(data, attributes, render, element) {
          // Dispatch add event if user clicks on button
          var buttonHandler = function(event) {
            if (event.target.localName !== "button") return;
            var itemText = element.querySelector('input[type="text"').value;
            if (!itemText.trim()) return;
            element.dispatchEvent(
              new CustomEvent("add", {
                bubbles: true,
                detail: {
                  itemText: itemText
                }
              })
            );
          };

          element.addEventListener("click", buttonHandler);
        }
      },
      selector,
      store
    );
  };
})();

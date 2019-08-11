(function() {
  "use strict";

  // No further execution if Mojio is not available
  if (typeof Mojito !== "function" || !Mojito.components)
    throw new Error("Mojito not found");

  // Register 'viewSettings' component to Mojito
  Mojito.components.viewSettings = function(selector, store) {
    return new Mojito(
      {
        template: function(data, attributes) {
          var html = '<div class="box"><h2>';
          html +=
            store.translations.selectLanguage[store.currentLanguage] +
            "</h2>" +
            "<label>" +
            '<input type="radio" id="en" name="language" value="0"';
          if (store.currentLanguage === 0) {
            html += " checked";
          }
          html +=
            ">" +
            " English</label>" +
            "<label>" +
            '<input type="radio" id="de" name="language" value="1"';
          if (store.currentLanguage === 1) {
            html += " checked";
          }
          html += ">" + " Deutsch</label>" + "</div>";
          return html;
        },

        data: {},

        created: function(data, attributes, render, element) {
          element.addEventListener("click", function(event) {
            if (event.target.name !== "language") return;
            element.dispatchEvent(
              new CustomEvent("changeLanguage", {
                bubbles: true,
                detail: {
                  language: Number(event.target.value)
                }
              })
            );
          });
        }
      },
      selector,
      store
    );
  };
})();

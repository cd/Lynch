(function() {
  "use strict";

  // No further execution if Mojio is not available
  if (typeof Lynch !== "function" || !Lynch.components)
    throw new Error("Lynch not found");

  // Register 'viewSettings' component to Lynch
  Lynch.components.viewSettings = function(selector, store) {
    return new Lynch(
      {
        template: function() {
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

          html +=
            '<div class="box attention"><h2>' +
            store.translations.reset[store.currentLanguage] +
            '</h2><button id="reset">' +
            store.translations.resetToDefault[store.currentLanguage] +
            "</button></div>";
          return html;
        },

        // Special styling only within this component
        styles: [
          {
            rules: ["div.attention { border: 2px solid red; }"],
            attributes: [["media", "only screen"]]
          }
        ],

        data: {},

        created: function() {
          // IE 11 support (no arrow functions)
          var _this = this;

          // Dispatch event if user clicks on radio element
          this.data._el.addEventListener("click", function(event) {
            if (event.target.name === "language") {
              _this.data._el.dispatchEvent(
                new CustomEvent("changeLanguage", {
                  bubbles: true,
                  detail: {
                    language: Number(event.target.value)
                  }
                })
              );
            } else if (event.target.id === "reset") {
              _this.data._el.dispatchEvent(
                new CustomEvent("reset", {
                  bubbles: true
                })
              );
            }
          });

          this.render();
        }
      },
      selector,
      store
    );
  };
})();

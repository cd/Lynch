(function() {
  "use strict";

  if (typeof Mojito !== "function" || !Mojito.components)
    throw new Error("Mojito not found");

  var store = {
    availableLanguages: ["en", "de"],
    currentLanguage: 0, // Array index
    translations: {
      settings: ["Settings", "Einstellungen"],
      tasks: ["Tasks", "Aufgaben"],
      done: ["Done", "Erledigt"],
      add: ["Add Task", "Aufgabe hinzufügen"],
      selectLanguage: ["Select language", "Sprache auswählen"]
    },
    title: "To-Do-List (Mojito Demo)"
  };

  return new Mojito(
    {
      template: function() {
        var html = '<div data-mojito-comp="header"></div>';

        // No further rendering if main component name
        // is not defined yet.
        if (!this.componentName) return html;

        html += "<main>";
        html += '  <div data-mojito-comp="' + this.componentName + '"></div>';
        html += "</main>";
        return html;
      },

      data: {
        componentName: null
      },

      created: function() {
        // IE 11 support (no arrow functions)
          var _this = this;

        // Register event listener
        this.data._el.addEventListener("changeLanguage", function(event) {
          store.currentLanguage = event.detail.language;
          window.sessionStorage.setItem("lang", store.currentLanguage);
          _this.render();
        });

        // Set inital language
        store.currentLanguage =
          Number(window.sessionStorage.getItem("lang")) || 0;

        // Set main component by routing function. Finally, re-render app.
        _this.data.componentName = Mojito.utils.helper.getComponentNameByURL();
        _this.render();
      }
    },
    "[data-mojito-app]",
    store
  ).create();
})();

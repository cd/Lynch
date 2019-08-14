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
      template: function(data, attributes) {
        var html = '<div data-mojito-comp="header"></div>';

        // No further rendering if main component name
        // is not defined yet.
        if (!data.componentName) return html;

        html += "<main>";
        html += '  <div data-mojito-comp="' + data.componentName + '"></div>';
        html += "</main>";
        return html;
      },

      data: {
        componentName: null
      },

      created: function(data, attributes, render, element) {
        // Register event listener
        element.addEventListener("changeLanguage", function(event) {
          store.currentLanguage = event.detail.language;
          window.sessionStorage.setItem("lang", store.currentLanguage);
          render();
        });

        // Set inital language
        store.currentLanguage =
          Number(window.sessionStorage.getItem("lang")) || 0;

        // Set main component by routing function. Finally, re-render app.
        data.componentName = Mojito.utils.helper.getComponentNameByURL();
        render();
      }
    },
    "[data-mojito-app]",
    store
  ).create();
})();

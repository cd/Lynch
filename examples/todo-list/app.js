(function() {
  "use strict";

  if (typeof Lynch !== "function" || !Lynch.components)
    throw new Error("Lynch not found");

  var store = {
    availableLanguages: ["en", "de"],
    currentLanguage: 0, // Array index
    translations: {
      settings: ["Settings", "Einstellungen"],
      tasks: ["Tasks", "Aufgaben"],
      done: ["Done", "Erledigt"],
      add: ["Add Task", "Aufgabe hinzufügen"],
      selectLanguage: ["Select language", "Sprache auswählen"],
      reset: ["Reset", "Zurücksetzen"],
      resetToDefault: ["Reset to default", "Zurücksetzen auf Ursprung"]
    },
    title: "To-Do-List (Lynch Demo)"
  };

  return new Lynch(
    {
      template: function() {
        var html = '<div data-lynch-comp="header"></div>';

        // No further rendering if main component name
        // is not defined yet.
        if (!this.data.componentName) return html;

        html += "<main>";
        html +=
          '  <div data-lynch-comp="' + this.data.componentName + '"></div>';
        html += "</main>";
        return html;
      },

      data: {
        componentName: null
      },

      created: function() {
        // Register event listener
        this.data._el.addEventListener("changeLanguage", function(event) {
          store.currentLanguage = event.detail.language;
          window.sessionStorage.setItem("lang", store.currentLanguage);
          window.location.reload();
        });
        this.data._el.addEventListener("reset", function() {
          window.sessionStorage.removeItem("lang");
          window.sessionStorage.removeItem("items");
          window.location.href = "index.html";
        });

        // Set inital language
        store.currentLanguage =
          Number(window.sessionStorage.getItem("lang")) || 0;

        // Set main component by routing function. Finally, render all.
        this.data.componentName = Lynch.utils.helper.getComponentNameByURL();
        this.render();
      }
    },
    "[data-lynch-app]",
    store
  ).create();
})();

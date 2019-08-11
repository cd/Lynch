(function() {
  "use strict";

  if (typeof Mojito !== "function" || !Mojito.components)
    throw new Error("Mojito not found");

  var store = {
    availableLanguages: ["en", "de"],
    currentLanguage: 0,
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
        html += "<main>";
        if (attributes.mojitoView === "tasks") {
          html += '<div data-mojito-comp="viewTasks"></div>';
        } else if (attributes.mojitoView === "settings") {
          html += '<div data-mojito-comp="viewSettings"></div>';
        }
        html += "</main>";
        return html;
      },

      data: {},

      created: function(data, attributes, render, element) {
        element.addEventListener("changeLanguage", function(event) {
          store.currentLanguage = event.detail.language;
          window.sessionStorage.setItem("lang", store.currentLanguage);
          render();
        });
        store.currentLanguage = Number(window.sessionStorage.getItem("lang")) || 0;
      }
    },
    "[data-mojito-app]",
    store
  ).create();
})();

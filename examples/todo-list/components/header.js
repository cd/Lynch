(function() {
  "use strict";

  // No further execution if Mojio is not available
  if (typeof Lynch !== "function" || !Lynch.components)
    throw new Error("Lynch not found");

  // Register 'header' component to Lynch
  Lynch.components.header = function(selector, store) {
    return new Lynch(
      {
        template: function() {
          var html = "<header>";
          html += "<h1>" + store.title + "</h1>";
          html += "<nav>";
          html +=
            '<a href="index.html">' +
            store.translations.tasks[store.currentLanguage] +
            "</a>";
          html +=
            '<a href="settings.html">' +
            store.translations.settings[store.currentLanguage] +
            "</a>";
          return html;
        },

        data: {},

        created: function() {
          this.render();
        }
      },
      selector,
      store
    );
  };
})();

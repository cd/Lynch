(function() {
  "use strict";

  if (typeof Mojito !== "function" || !Mojito.components)
    throw new Error("Mojito not found");

  Mojito.components.header = function(selector, store) {
    return new Mojito(
      {
        template: function(data, attributes) {
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

        data: {
          // my data
        },

        created: function(data, attributes, render, element) {
          // main function
        }
      },
      selector,
      store
    );
  };
})();

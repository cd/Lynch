(function() {
  "use strict";

  if (typeof Mojito !== "function" || !Mojito.components)
    throw new Error("Mojito not found");

  var store = {};

  return new Mojito(
    {
      template: function(data, attributes) {},

      data: {},

      created: function(data, attributes, render, element) {}
    },
    "[data-mojito-app]",
    store
  ).create();
})();

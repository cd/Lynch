(function() {
  "use strict";

  if (typeof Mojito !== "function" || !Mojito.components)
    throw new Error("Mojito not found");

  var store = {};

  return new Mojito(
    {
      template: function() {},

      data: {},

      created: function() {},

      beforeDestroy: function() {}
    },
    "[data-mojito-app]",
    store
  ).create();
})();

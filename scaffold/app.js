(function() {
  "use strict";

  if (typeof Lynch !== "function" || !Lynch.components)
    throw new Error("Lynch not found");

  var store = {};

  return new Lynch(
    {
      template: function() {},

      data: {},

      created: function() {},

      beforeDestroy: function() {}
    },
    "[data-lynch-app]",
    store
  ).create();
})();

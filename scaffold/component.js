(function() {
  "use strict";

  if (typeof Lynch !== "function" || !Lynch.components)
    throw new Error("Lynch not found");

  Lynch.components.myComp = function(selector, store) {
    return new Lynch(
      {
        template: function() {},

        data: {},

        created: function() {},

        beforeDestroy: function() {}
      },
      selector,
      store
    );
  };
})();

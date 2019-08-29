(function() {
  "use strict";

  if (typeof Mojito !== "function" || !Mojito.components)
    throw new Error("Mojito not found");

  Mojito.components.myComp = function(selector, store) {
    return new Mojito(
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

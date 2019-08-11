(function() {
  "use strict";

  if (typeof Mojito !== "function" || !Mojito.components)
    throw new Error("Mojito not found");

  Mojito.components.myComp = function(selector, store) {
    return new Mojito(
      {
        template: function(data, attributes) {},

        data: {},

        created: function(data, attributes, render, element) {}
      },
      selector,
      store
    );
  };
})();

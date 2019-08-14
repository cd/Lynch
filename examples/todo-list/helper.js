(function() {
  "use strict";

  // No further execution if Mojio is not available
  if (typeof Mojito !== "function" || !Mojito.components)
    throw new Error("Mojito not found");

  // Register 'helper' utility to Mojito
  Mojito.utils.helper = {
    /**
     * Super simple routing function.
     * @returns {string} Name of component to render.
     */
    getComponentNameByURL: function() {
      if (window.location.pathname.indexOf("settings") >= 0)
        return "viewSettings";
      return "viewTasks";
    }
  };
})();

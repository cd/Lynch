(function() {
  "use strict";

  // No further execution if Mojio is not available
  if (typeof Lynch !== "function" || !Lynch.components)
    throw new Error("Lynch not found");

  // Register 'helper' utility to Lynch
  Lynch.utils.helper = {
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

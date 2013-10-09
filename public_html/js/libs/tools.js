(function(tools, undefined) {

    tools.canExecute = function(obj, method) {
        return obj[method] && typeof obj[method] === 'function';
    };

})(de.cismet.namespace.create('de.cismet.tools'));
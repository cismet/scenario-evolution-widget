(function(Tools, undefined) {

    Tools.canExecute = function(obj, method) {
        return obj[method] && typeof obj[method] === 'function';
    };

})(de.cismet.Namespace.create('de.cismet.Tools'));
"use strict";

(function(se, undefined) {
    se.createWidget = function(dom, defaultDomain) {
        var tools = de.cismet.tools;
        var DOM = dom;
        var defDomain = defaultDomain;

        var domain;
        var backend;
        var ws;

        var createDOM = function() {
            if(!ws){
                throw {
                    name: 'IllegalStateException',
                    message: 'worldstate not set'
                };
            }
            
            var root = document.createElement("div");
            
            var wsPath = [ws];
            var cur = ws.parentworldstate;
            var pString = ws.name;
            while(cur !== undefined){
                wsPath.push(cur);
                pString = cur.name + ' -> ' + pString;
                cur = cur.parentWorldstate;
            }
            
            root.appendChild(document.createTextNode('WS Path: ' + pString))

            return root;
        };

        var getDefaultDomain = function() {
            return defDomain;
        };

        var setDomain = function(d) {
            domain = d;
        };

        var getDomain = function() {
            return domain;
        };

        var setBackend = function(b) {
            if (tools.canExecute(b, 'getObject')) {
                backend = b;
            } else {
                throw {
                    name: 'IllegalArgumentException',
                    message: 'provided backend does not support getObject'
                }
            }

        };
        var getBackend = function() {
            return backend;
        };

        var getWorldstate = function() {
            if (ws) {
                return ws.id;
            } else {
                return null;
            }
        };

        var setWorldstate = function(id) {
            if (!backend) {
                throw {
                    name: 'IllegalStateException',
                    message: 'backend is not properly set'
                }
            }

            var dom = domain ? domain : defDomain;

            if (!dom) {
                throw {
                    name: 'IllegalStateException',
                    message: 'neither domain nor default domain is set'
                }
            }

            backend.getObject(dom, 'worldstates', id).done(function(worldstate){
                ws = worldstate;
                DOM.appendChild(createDOM());
            });
        };

        return {
            getDomain: getDomain,
            setDomain: setDomain,
            getBackend: getBackend,
            setBackend: setBackend,
            getWorldstate: getWorldstate,
            setWorldstate: setWorldstate,
            getDefaultDomain: getDefaultDomain
        };
    };
})(de.cismet.namespace.create("de.cismet.crisma.scenario_evolution_widget"));
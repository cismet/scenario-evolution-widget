"use strict";

(function(se, undefined) {
    se.createWidget = function(dom, defaultDomain) {
        var nonce = 'obj' + Math.floor((Math.random() * 100000000) + 1);
        var Tools = de.cismet.Tools;
        var DOM = dom;
        var defDomain = defaultDomain;
        var listeners = [];

        var domain;
        var backend;
        var ws;
        
        var createButton = function(worldstate){
            var button = document.createElement("input");
            
            button.setAttribute("type", "button");
            button.setAttribute("name", "wsButton" + worldstate.id);
            button.setAttribute("value", worldstate.name);
            button.setAttribute("onclick", "de.cismet.crisma.Scenario_evolution_widget."+nonce+".setWorldstate(" + worldstate.id + ")");
            
            return button;
        };
        
        var createDOM = function() {
            if (!ws) {
                throw {
                    name: 'IllegalStateException',
                    message: 'worldstate not set'
                };
            }
            
            var root = document.createElement("div");
            root.setAttribute("id", nonce);
            
            var wsPath = [ws];
            var cur = ws.parentworldstate;
            while (cur !== undefined && cur !== null) {
                wsPath.push(cur);
                cur = cur.parentworldstate;
            }
            
            while(wsPath.length > 0){
                root.appendChild(createButton(wsPath.pop()));
                if(wsPath.length > 0){
                    root.appendChild(document.createTextNode("->"));
                }
            }

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
            if (Tools.canExecute(b, 'getObject')) {
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

            backend.getObject(dom, 'worldstates', id).done(function(worldstate) {
                var oldId = undefined;
                if(ws){
                    oldId = ws.id;
                }
                ws = worldstate;
                if(document.getElementById(nonce)){
                    var nuu = createDOM();
                    var old = document.getElementById(nonce);
                    old.parentNode.replaceChild(nuu, old);                    
                } else {
                    DOM.appendChild(createDOM());
                }
                
                if(oldId && oldId !== id){
                    fireWorldstateChanged(id);
                }
            });
        };
        
        var addWorldstateChangedListener = function(callback){
            if(typeof callback === 'function'){
                for(var i = 0; i < listeners.length; ++i){
                    if(!listeners[i]){
                        listeners[i] = callback;
                        
                        // everything done, bail out
                        return;
                    }
                }
                
                // no free spaces in the array, add to end
                listeners.push(callback);
            }
        };
        
        var removeWorldstateChangedListener = function(callback){
            for(var i = 0; i < listeners.length; ++i){
                if(listeners[i] === callback){
                    listeners[i] = undefined;
                }
            }
        };
        
        var fireWorldstateChanged = function(wsId) {
            for(var i = 0; i < listeners.length; ++i){
                if(listeners[i]){
                    listeners[i](wsId);
                }
            }
        };
        
        var self = {
            getDomain: getDomain,
            setDomain: setDomain,
            getBackend: getBackend,
            setBackend: setBackend,
            getWorldstate: getWorldstate,
            setWorldstate: setWorldstate,
            getDefaultDomain: getDefaultDomain,
            addWorldstateChangedListener: addWorldstateChangedListener,
            removeWorldstateChangedListener: removeWorldstateChangedListener,
            dispose: dispose
        };
        
        var dispose = function(){
            var selfDom = document.getElementById(nonce);
            selfDom.parentNode.removeChild(selfDom);
            listeners = undefined;
            se[nonce] = undefined;
        };
        
        se[nonce] = self;
        
        return self;
    };
})(de.cismet.Namespace.create("de.cismet.crisma.Scenario_evolution_widget"));
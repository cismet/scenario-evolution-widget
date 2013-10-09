// Cismet Default Code....

(function (window) {
    "use strict";
    var Interface = function (name, methods) {
        var i, len;
        if (arguments.length !== 2) {
            throw new Error("Interface constructor called with " + arguments.length +
                    "arguments, but expected exactly 2.");
        }

        this.name = name;
        this.methods = [];
        for (i = 0, len = methods.length; i < len; i++) {
            if (typeof methods[i] !== 'string') {
                throw new Error("Interface constructor expects method names to be "
                        + "passed in as a string.");
            }
            this.methods.push(methods[i]);
        }
    };
    Interface.ensureImplements = function (object) {
        var i, j, len, methodsLen, iFace, method;
        if (arguments.length < 2) {
            throw new Error("Function Interface.ensureImplements called with " +
                    arguments.length + "arguments, but expected at least 2.");
        }
        for (i = 1, len = arguments.length; i < len; i++) {
            iFace = arguments[i];
            if (iFace.constructor !== Interface) {
                throw new Error("Function Interface.ensureImplements expects arguments" + "two and above to be instances of Interface.");
            }

            for (j = 0, methodsLen = iFace.methods.length; j < methodsLen; j++) {
                method = iFace.methods[j];
                if (!object[method] || typeof object[method] !== 'function') {
                    throw new Error("Function Interface.ensureImplements: object " + "does not implement the " + iFace.name + " interface. Method " + method + " was not found.");
                }
            }
        }
    };
    var Backend = new Interface('Backend', ['getClass', 'getAllClasses', 'getAttribute',
        'getEmptyInstanceOfClass', 'getAllObjectsOfClass', 'createNewObject', 'updateOrCreateObject',
        'deleteObject', 'getObject']);
    var BackendProxy = function () { //implements Backend
        this.backend = null;
        this.defaultDomain = "crisma";
        this.setBackend = function (newBackendObj) {
            Interface.ensureImplements(newBackendObj, Backend);
            this.backend = newBackendObj;
        };
    };
    BackendProxy.prototype = {
        _init: function () {
//if the bridge object is set, we assume that the bridge object is the backend...
            if (ci.jBridge) {
//brdige object must implement the Backend Interface
                Interface.ensureImplements(ci.jBridge, Backend);
                this.backend = ci.jBridge;
            }

            if (!this.backend) {
                throw new Error("no backend is set, proxy cannot work without");
            }
        },
        //###########################################################
        //
        //  methods belonging to /searches resource of cids rest api
        //  
        //###########################################################
        getAllSearches: function (options) {
        },
        getSearch: function (domain, searchKey, options) {
        },
        getSearchResults: function (domain, searchKey, options) {
            var requestUrl;
            requestUrl = this.searches_base_url + "/" + domain + "." + searchKey + "/results";
            //ToDo: options can contain list of search paramters: how to handle these?
            requestUrl += createOptionsString(options);
            this.requestOptions.method = "GET";
            return $.ajax(requestUrl, this.requestOptions);
        },
        //###########################################################
        //
        //methods belonging to /permissions resource of cids rest api
        //  
        //###########################################################
        getAllPermissions: function (options) {
            this._init();
            return this.backend.getAllPermissions(options);
        },
        getPermission: function (permissionKey, options) {
            this._init();
            return this.backend.getPermission(permissionKey, options);
        },
        //###########################################################
        //
        //methods belonging to /configattributes resource of cids rest api
        getAllConfigAttributes: function (options) {
            this._init();
            return this.backend.getAllConfigAttributes(options);
        },
        getConfigAttribute: function (configAttrKey, options) {
            this._init();
            return this.backend.getConfigAttribute(configAttrKey, options);
        },
        //###########################################################
        //
        //methods belonging to /subscriptions resource of cids rest api
        //  
        //###########################################################
        getAllSubscriptions: function (domain, options) {
            this._init();
            return this.backend.getAllSubscriptions(domain, options);
        },
        //###########################################################
        //
        //methods belonging to /classes resource of cids rest api
        //  
        //###########################################################
        getClass: function (domain, classKey, options) {
            this._init();
            return this.backend.getClass(domain, classKey, options);
        },
        getAllClasses: function (domain, options) {
            this._init();
            return this.backend.getAllClasses(domain, options);
        },
        getAttribute: function (domain, classKey, attributeKey, options) {
            this._init();
//            return this.backend.getClassForAttributeKey(domain, classKey, attributeKey, options);
            return this.backend.getAttribute(domain, classKey, attributeKey, options);
        },
        //###########################################################
        //
        //methods belonging to /node resource of cids rest api
        //  
        //###########################################################
        addNode: function (nodeQuery, domain, options) {
            this._init();
            return this.backend.addNode(nodeQuery, domain, options);
        },
        getAllRootNodes: function (domain, options) {
            this._init();
            return this.backend.getAllRootNodes(domain, options);
        },
        getChildrenOfNode: function (nodeKey, domain, options) {
            this._init();
            return this.backend.getChildrenOfNode(nodeKey, domain, options);
        },
        getNode: function (nodeKey, domain, options) {
            this._init();
            return this.backend.getNode(nodeKey, domain, options);
        },
        //###########################################################
        //
        //methods belonging to /users resource of cids rest api
        //  
        //###########################################################
        
        validateUser: function(options){
            this._init();
            return this.backend.validateUser();
        },
        getAllRoles: function (options) {
            this._init();
            return this.backend.getAllRoles(options);
        },
        getRole: function (roleKey, options) {
            this._init();
            return this.backend.getRole(roleKey, options);
        },
//        TODO : implement this.validateUser

        //###########################################################
        //
        // methods of /enitities resource of cids rest api
        //  
        //###########################################################
        // methods of /enitities resource of cids rest api
        getEmptyInstanceOfClass: function (domain, classKey, options) {
            this._init();
            return this.backend.getEmptyInstanceOfClass(domain, classKey, options);
        },
        getAllObjectsOfClass: function (domain, classKey, options) {
            // NOTE: why always check if backend implements all the necessary operations and not just the one needed,
            // additionally why not using a simple getter to ensure that this.backend is set or even better don't care
            // at all and require the backend to be provided during construction time, is a runtime check if something
            // interfered with the really a good idea (because it may be useless, keyword multi threading).
            this._init();
            console.log(JSON.stringify(options));
            var beanArr;
            // NOTE: doesn't every operation deliver promises? and shouldn't the backend take care of parsing the data?
            //backend delivers difference things (promise, array with data)
            // we need to defer the the result and return a promise
            var deferred = $.Deferred();
            
            console.log('getallobjs: [dom=' + domain + '|classKey=' + classKey + ']')

            beanArr = this.backend.getAllObjectsOfClass(domain, classKey, options);
            if (beanArr.done) {
                return beanArr;
            } else {
                deferred.resolve(JSON.parse(beanArr));
                return deferred.promise();
            }
//            console.log("result of getAllObjectsOfClass: " + beanArr);
        },
        createNewObject: function (objectString, domain, classKey, options) {
            this._init();
            return this.backend.createNewObject(objectString, domain, classKey, options);
        },
        updateOrCreateObject: function (objectString, domain, classKey, objectId, options) {
            this._init();
            return this.backend.updateOrCreateObject(objectString, domain, classKey, objectId, options);
        },
        deleteObject: function (domain, classKey, objectId, options) {
            this._init();
            return this.backend.deleteObject(domain, classKey, objectId, options);
        },
        getObject: function (domain, classKey, objectId, options) {
            this._init();
            return this.backend.getObject(domain, classKey, objectId, options);
        },
        //###########################################################
        //
        //methods belonging to the /action api
        //  
        //###########################################################
        createNewTask: function (domain, actionKey, actionTask, options) {
            this._init();
            return this.backend.createNewTask(domain, actionKey, actionTask, options);
        },
        getAllRunningTasks: function (domain, actionKey, options) {
            this._init();
            return this.backend.getAllRunningTasks(domain, actionKey, options);
        },
        getTaskStatus: function (domain, actionKey, taskKey, options) {
            this._init();
            return this.backend.getTaskStatus(domain, actionKey, taskKey, options);
        },
        cancelTask: function (domain, actionKey, taskKey, options) {
            this._init();
            return this.backend.cancelTask(domain, actionKey, taskKey, options);
        },
        getAllTaskResults: function (domain, actionKey, taskKey, options) {
            this._init();
            return this.backend.getAllTaskResults(domain, actionKey, taskKey, options);
        },
        getTaskResult: function (domain, actionKey, taskKey, resultKey, options) {
            this._init();
            return this.backend.getTaskResult(domain, actionKey, taskKey, resultKey, options);
        },
        getAction: function (domain, actionKey, options) {
            this._init();
            return this.backend.getAction(domain, actionKey, options);
        },
        getAllActions: function (options) {
            this._init();
            return this.backend.getAllActions(options);
        },
        //###########################################################
        //
        //other helper methods for navigator backend
        //  
        //###########################################################  

        updateCidsBean: function (jsonBean) {
            this._init();
            return this.backend.updateCidsBean(jsonBean);
        },
        setChangeFlag: function () {
            this._init();
//            console.log("backend proxy setChangeFlag invoked"+ this.backend.setChangeFlag);
            return this.backend.setChangeFlag();
        },
        fireIsReady: function () {
            this._init();
            return this.backend.showHTMLComponent();
        }


    };
    var CidsJS = function () {

//public variables
        this.isInitialised = false;
        this.editableMode = false;
        this.defaultDomain = "crisma";
        //private variable 
        var that = this;
        var deregisterFunctions = [];
        var backendProxy = new BackendProxy();
        //private functions
        var deregisterAllWatches = function () {
            var i;
            for (i = 0; i < deregisterFunctions.length; i++) {
                deregisterFunctions[i]();
            }
        };


        var removeAngularProperties = function (object) {
            var s, obj, propKey;
//            console.log(object);
            if (object) {
//                console.log(that.typeOf);
                s = that.typeOf(object);
//                console.log(this.typeOf);
                if (s === 'object') {
                    //iterate through all properties and remove the $$hashKey property
                    for (propKey in object) {
//                        console.log("property Key: " + propKey);
                        if (propKey === '$$hashKey') {
//                            console.log("###################### found one! kill it ###############");
                            delete object[propKey];
                        } else {
//                            console.log("new object: " + object[propKey]);
                            var type = that.typeOf(object[propKey]);
                            if (type === 'object') {
                                removeAngularProperties(object[propKey]);
                            } else if (type === 'array') {
                                for (obj in object) {
                                    removeAngularProperties(object[obj]);
                                }
                            }
                        }
                    }
                } else if (s === 'array') {
                    //iterate through all elements and properties and remove the $$hashKey property
                    for (var i = 0; i < object.length; i++) {
                        removeAngularProperties(object[i]);
                    }
                }
            }
        };
        var extractSelfReference = function (cidsBean) {
            console.log(cidsBean);
//            if (cidsBean) {
//                console.log(cidsBean.$self);
//            }
            return (cidsBean && cidsBean.$self) ? cidsBean.$self : null;
        };
        var getInfoObjectFromSelfReference = function (cidsBean) {
            var selfReference, splittedName, domain, className;
            selfReference = extractSelfReference(cidsBean);
            if (!selfReference) {
                console.log("Could not extract self reference from bean: " + cidsBean);
                return {};
            }
            splittedName = selfReference.split(".");
            domain = splittedName[0].replace(/\//g, '');
            className = splittedName[splittedName.length - 1].split("/")[0];
            return {
                className: className,
                domain: domain
            };
        };


        //priviliged methods that needs acces to private variables

        this.setChangeFlag = function () {
//            console.log("ci.setChangeFlag invoked");
//            console.log(backendProxy);
            backendProxy.setChangeFlag();
        };

        this.registerWatch = function (propName) {
            var foo = 'cidsBean.' + propName;
            var that = this;
            console.log("registering watch for: " + foo);
            var deregisterWatch = this.gs().$watch(
                    'cidsBean.' + propName,
                    function (newValue, oldValue, scope) {
                        console.log("watch has fired for property: " + foo + " oldValue: " + oldValue + " newValue: " + newValue);
                        that.setChangeFlag();
                        deregisterAllWatches();
                    }, true);
            deregisterFunctions.push(deregisterWatch);
        };

        this.registerWatchCollection = function (propName) {
            var foo = 'cidsBean.' + propName;
            console.log("registering watch for: " + foo);
            var deregisterWatch = this.gs().$watchCollection(
                    'cidsBean.' + propName,
                    function (newValue, oldValue, scope) {

                        console.log("watch has fired for property: " + foo + " oldValue: " + oldValue + " newValue: " + newValue);
                        console.log(this.setChangeFlag);
                        console.log(this.deregisterAllWatches);
                        this.setChangeFlag();
                        //deregistering all watches improves performance
                        this.deregisterAllWatches();
                    });
            deregisterFunctions.push(deregisterWatch);
        };

        this.registerWatches = function (cidsBean) {
//            this.gs().$watchCollection('cidsBean', function (newValue, oldValue, scope) {
//                console.log("watch has fired! oldValue: " + oldValue + " newValue: " + newValue);
////                            ci.setChangeFlag();
////                            deregisterAllWatches();
//            });
            var property;
            console.log("registering watches to get notified about changes " + cidsBean);
            for (property in cidsBean) {
                var type = this.typeOf(cidsBean[property]);
//                console.log("type: " + type+" / "+cidsBean[property]);
                if (cidsBean[property]) {
                    if (type === 'object') {
                        this.registerWatchCollection(property);
                    } else if (type === 'array') {
                        this.registerWatchCollection(property);
                    } else if (type === 'function') {
                        //do nothing....
                    } else {
                        this.registerWatch(property);
                    }
                } else {
                    this.registerWatch(property);
                }
            }
        };

        this.getMode = function () {
            return this.editableMode;
        };

        this.setBackend = function (newBackend) {
            backendProxy.setBackend(newBackend);
        };
        this.getBackend = function () {
            return backendProxy;
        };
        
        this.setUserRealms = function(){
            
        };
        
        this.validateUser = function (options){
            return backendProxy.validateUser(options);
        };
        
        this.getAllSiblingBeans = function (cidsBean) {
            var domain, className, selfInfos;
            selfInfos = getInfoObjectFromSelfReference(cidsBean);
            console.log(selfInfos);
            domain = selfInfos.domain || "";
            className = selfInfos.className || "";
            //here we need to return a defer
            return backendProxy.getAllObjectsOfClass(domain, className);
        };
        this.getClassOfBean = function (cidsBean) {
            var options, selfRefInfo, domain, classKey;
            selfRefInfo = getInfoObjectFromSelfReference(cidsBean);
            domain = selfRefInfo.domain;
            classKey = selfRefInfo.className;
            if (typeof arguments[1] === 'object') {
                options = arguments[1];
            } else {
                options = {};
            }
            return backendProxy.getClass(domain, classKey, options);
        };
        this.getAllClasses = function (domain) {
            var options;
            if (!domain) {
                console.log("missing mandatory parameter domain for request getAllClasses! Using default domain: " + this.defaultDomain);
                domain = this.defaultDomain;
            }
            if (typeof arguments[1] === 'object') {
                options = arguments[1];
            } else {
                options = {};
            }
            //Problem can be a promise of an xhr call (pure rest backend) or the result directly (navigator backend)
            return backendProxy.getAllClasses(domain, options);
        };
        this.getClass = function (classKey, domain) {
            var options;
            if (!classKey) {
                console.log("missing mandatory parameter classKey for request getClass!");
                return null;
            }
            if (!domain) {
                console.log("missing mandatory parameter domain for request getAllClasses! Using default domain: " + this.defaultDomain);
                domain = this.defaultDomain;
            }
            if (typeof arguments[1] === 'object') {
                options = arguments[1];
            } else {
                options = {};
            }
            return backendProxy.getClass(domain, classKey, options);
        };
        this.getAttribute = function (classKey, attributeKey, domain) {
            var options;
            if (!classKey) {
                console.log("missing mandatory parameter classKey for request getClass!");
                return null;
            }
            if (!attributeKey) {
                console.log("missing mandatory parameter attributeKey for request getClass!");
                return null;
            }
            if (!domain) {
                console.log("missing mandatory parameter domain for request getAllClasses! Using default domain: " + this.defaultDomain);
                domain = this.defaultDomain;
            }
            if (typeof arguments[1] === 'object') {
                options = arguments[1];
            } else {
                options = {};
            }
            return backendProxy.getAttribute(domain, classKey, attributeKey, options);
        };
        this.getAllObjectsOfClass = function (domain, classKey) {
            var options;
            if (!classKey) {
                console.log("missing mandatory parameter classKey for request getClass!");
                return null;
            }
            if (!domain) {
                console.log("missing mandatory parameter domain for request getAllClasses! Using default domain: " + this.defaultDomain);
                domain = this.defaultDomain;
            }
            console.log(arguments[2]);
            if (typeof arguments[2] === 'object') {
                options = arguments[2];
            } else {
                options = {};
            }
            return backendProxy.getAllObjectsOfClass(domain, classKey, options);
        };
        this.getObject = function (domain, classKey, objectKey) {
            var options;
            if (!classKey) {
                console.log("missing mandatory parameter classKey for request getObject!");
                return null;
            }
            if (!classKey) {
                console.log("missing mandatory parameter objectKey for request getObject!");
                return null;
            }
            if (!domain) {
                console.log("missing mandatory parameter domain for request getObject! Using default domain: " + this.defaultDomain);
                domain = this.defaultDomain;
            }
            console.log(arguments[3]);
            if (typeof arguments[3] === 'object') {
                options = arguments[3];
            } else {
                options = {};
            }
            return backendProxy.getObject(domain, classKey, objectKey, options);
        };

        //    corrects the wrong typeof function of java script. returns the following:
//Object -> 'object'
//Array -> 'array' (instead of 'object')
//Function _> 'function'
//String -> 'string'
//Number -> 'number'
//Boolean -> 'boolean'
//null -> null (instead of  'object')
//undefined -> 'undefined'
        this.typeOf = function (value) {
            var s;
//            console.log("started CidsJS.typeOf for value ");
            s = typeof value;
//            console.log("normal typeof for value: " + s);
            if (s === 'object') {
                if (value) {
                    if (value instanceof Array) {
                        s = 'array';
                    }
                } else {
                    s = 'null';
                }
            }
//            console.log("CidsJS.typeOf result: " + s + " for value " + value);
            return s;
        };

        this.toJson = function (object, prettyPrint) {
//            console.log("started CidsJS.toJSON for object: " + object);
            removeAngularProperties(object);
//            console.log("newObject " + object);
            return JSON.stringify(object, undefined, prettyPrint);
        };

        this.updateCidsBean = function () {
            var bean = this.retrieveBean();
            backendProxy.updateCidsBean(bean);
        };

        this.fireIsReady = function () {
            backendProxy.fireIsReady();
        };

    };
    //public methods of CidsJS => don't have access to backend

    CidsJS.prototype.injectBean = function (jsonBean, editable) {
        var cidsBean;
        this.editableMode = editable || false;
//        console.log("editable param : " + editable + " / editable field :" + this.mode);
        console.log("injecting bean");
//        console.log("bean as JSON before parsing: " + jsonBean);
        cidsBean = JSON.parse(jsonBean);
//        console.log("Beans after parsing: " + cidsBean);
//        console.log("Beans as json after parsing: " + JSON.stringify(cidsBean, null, 2));
        if (!this.isInitialised) 
        {
            this.renderer.initRenderer(cidsBean);
            this.isInitialised = true;
            // register a watch to scope.cidsBean to get notifies about changes...
            console.log(this.registerWatches);
            this.registerWatches(ci.gs().cidsBean);
//            var deregisterWatch = ci.gs().$watch(function () {
////                return ci.toJson(ci.gs().cidsBean);
//                return JSON.stringify(ci.gs().cidsBean);
//            }, function () {
//                console.log("####### change in cidsBean notify navigator!!! ######");
//                ci.updateCidsBean();
//                deregisterWatch();
//            });
        } 
        else {
            this.renderer.updateBean(cidsBean);
        }
//        ci.fireIsReady();
    };

    CidsJS.prototype.retrieveBean = function () {
//        return angular.toJson(this.renderer.getCidsBean());
        var bean = this.renderer.getCidsBean();
//        console.log(bean);
        return this.toJson(bean, 2);
    };

    CidsJS.prototype.findIndex = function (searchArray, searchObj) {

        for (var i = 0; i < searchArray.length; i++)
        {
            if (JSON.stringify(searchArray[i]) === JSON.stringify(searchObj))
                return i;
        }
    };
    CidsJS.prototype.getSelectedOptionForSelectElement = function (optionsArray, selectedOption) {
        var index = this.findIndex(optionsArray, selectedOption);
        selectedOption = optionsArray[index];
        return selectedOption;
    };

    CidsJS.prototype.gs = function () {
        return angular.element(document.body).scope();
    };
    if (window.cids && window.ci) {
        throw new Error('cidsJs already defined');
    } else {
        window.cids = window.ci = new CidsJS();
    }
})(window);

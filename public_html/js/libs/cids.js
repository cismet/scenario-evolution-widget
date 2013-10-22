(function (window) {
    "use strict";
    function initCids ($q) {
        window.cids = window.ci = new CidsJS($q);
    }
    ;

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

    var Backend = new Interface('Backend', [
        'getAllSearches', 'getSearch', 'getSearchResults',
        'getAllPermissions', 'getPermission',
        'getAllConfigAttributes', 'getConfigAttribute',
        'getAllSubscriptions',
        'getClass', 'getAllClasses', 'getAttribute',
        'addNode', 'getAllRootNodes', 'getChildrenOfNode', 'getNode',
        'validateUser', 'getAllRoles', 'getRole',
        'getEmptyInstanceOfClass', 'getAllObjectsOfClass', 'createNewObject', 'updateOrCreateObject', 'deleteObject',
        'getObject',
        'createNewTask', 'getAllRunningTasks', 'getTaskStatus', 'cancelTask', 'getAllTaskResults', 'getTaskResult',
        'getAction', 'getAllActions'
    ]);

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
        getAllSearches: function (params, options) {
            this._init();
            return this.backend.getAllSearches(params, options);
        },
        getSearch: function (domain, searchKey, params, options) {
            this._init();
            return this.backend.getSearch(domain, searchKey, params, options);
        },
        getSearchResults: function (domain, searchKey, params, options) {
            this._init();
            return this.backend.getSearchResults(domain, searchKey, params, options);
        },
        //###########################################################
        //
        //methods belonging to /permissions resource of cids rest api
        //  
        //###########################################################
        getAllPermissions: function (params, options) {
            this._init();
            return this.backend.getAllPermissions(params, options);
        },
        getPermission: function (permissionKey, params, options) {
            this._init();
            return this.backend.getPermission(permissionKey, params, options);
        },
        //###########################################################
        //
        //methods belonging to /configattributes resource of cids rest api
        getAllConfigAttributes: function (params, options) {
            this._init();
            return this.backend.getAllConfigAttributes(params, options);
        },
        getConfigAttribute: function (configAttrKey, params, options) {
            this._init();
            return this.backend.getConfigAttribute(configAttrKey, params, options);
        },
        //###########################################################
        //
        //methods belonging to /subscriptions resource of cids rest api
        //  
        //###########################################################
        getAllSubscriptions: function (params, options) {
            this._init();
            return this.backend.getAllSubscriptions(params, options);
        },
        //###########################################################
        //
        //methods belonging to /classes resource of cids rest api
        //  
        //###########################################################
        getClass: function (domain, classKey, params, options) {
            this._init();
            return this.backend.getClass(domain, classKey, params, options);
        },
        getAllClasses: function (params, options) {
            this._init();
            return this.backend.getAllClasses(params, options);
        },
        getAttribute: function (domain, classKey, attributeKey, params, options) {
            this._init();
//            return this.backend.getClassForAttributeKey(domain, classKey, attributeKey, options);
            return this.backend.getAttribute(domain, classKey, attributeKey, params, options);
        },
        //###########################################################
        //
        //methods belonging to /node resource of cids rest api
        //  
        //###########################################################
        addNode: function (domain, nodeQuery, params, options) {
            this._init();
            return this.backend.addNode(domain, nodeQuery, params, options);
        },
        getAllRootNodes: function (params, options) {
            this._init();
            return this.backend.getAllRootNodes(params, options);
        },
        getChildrenOfNode: function (domain, nodeKey, params, options) {
            this._init();
            return this.backend.getChildrenOfNode(domain, nodeKey, params, options);
        },
        getNode: function (domain, nodeKey, params, options) {
            this._init();
            return this.backend.getNode(domain, nodeKey, params, options);
        },
        //###########################################################
        //
        //methods belonging to /users resource of cids rest api
        //  
        //###########################################################

        validateUser: function (options) {
            this._init();
            return this.backend.validateUser(options);
        },
        getAllRoles: function (options) {
            this._init();
            return this.backend.getAllRoles(options);
        },
        getRole: function (roleKey, options) {
            this._init();
            return this.backend.getRole(roleKey, options);
        },
        //###########################################################
        //
        // methods of /enitities resource of cids rest api
        //  
        //###########################################################
        getEmptyInstanceOfClass: function (domain, classKey, params, options) {
            this._init();
            return this.backend.getEmptyInstanceOfClass(domain, classKey, params, options);
        },
        getAllObjectsOfClass: function (domain, classKey, params, options) {
            this._init();
            return this.backend.getAllObjectsOfClass(domain, classKey, params, options);
        },
        createNewObject: function (domain, classKey, objectString, params, options) {
            this._init();
            return this.backend.createNewObject(domain, classKey, objectString, params, options);
        },
        updateOrCreateObject: function (domain, classKey, objectId, objectString, params, options) {
            this._init();
            return this.backend.updateOrCreateObject(domain, classKey, objectId, objectString, params, options);
        },
        deleteObject: function (domain, classKey, objectId, params, options) {
            this._init();
            return this.backend.deleteObject(domain, classKey, objectId, params, options);
        },
        getObject: function (domain, classKey, objectId, params, options) {
            this._init();
            return this.backend.getObject(domain, classKey, objectId, params, options);
        },
        //###########################################################
        //
        //methods belonging to the /action api
        //  
        //###########################################################
        createNewTask: function (domain, actionKey, actionTask, params, options) {
            this._init();
            return this.backend.createNewTask(domain, actionKey, actionTask, params, options);
        },
        getAllRunningTasks: function (domain, actionKey, params, options) {
            this._init();
            return this.backend.getAllRunningTasks(domain, actionKey, params, options);
        },
        getTaskStatus: function (domain, actionKey, taskKey, params, options) {
            this._init();
            return this.backend.getTaskStatus(domain, actionKey, taskKey, params, options);
        },
        cancelTask: function (domain, actionKey, taskKey, params, options) {
            this._init();
            return this.backend.cancelTask(domain, actionKey, taskKey, params, options);
        },
        getAllTaskResults: function (domain, actionKey, taskKey, params, options) {
            this._init();
            return this.backend.getAllTaskResults(domain, actionKey, taskKey, params, options);
        },
        getTaskResult: function (domain, actionKey, taskKey, resultKey, params, options) {
            this._init();
            return this.backend.getTaskResult(domain, actionKey, taskKey, resultKey, params, options);
        },
        getAction: function (domain, actionKey, params, options) {
            this._init();
            return this.backend.getAction(domain, actionKey, params, options);
        },
        getAllActions: function (params, options) {
            this._init();
            return this.backend.getAllActions(params, options);
        },
        //###########################################################
        //
        //other helper methods 
        //  
        //###########################################################  

        setDefaultAuthentication: function (username, password, options) {
            this._init();
            return this.backend.setDefaultAuthentication(username, password, options);
        },
        setDefaultAuthenticationString: function (authString) {
            this._init();
            return this.backend.setDefaultAuthenticationString(authString);
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


    var CidsJS = function ($q) {

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
        // sets the domain property to one of the following:
        // if the property is already set, this 
        var setDomainInfoOnRequestParams = function (paramsObject) {
            if (!paramsObject.domain && this.defaultDomain) {
                paramsObject.domain = this.defaultDomain;
            }
        };

        var wrapBackendCallInPromise = function (resultOfBackendCall) {
            var parsedObj;
            var def = $q.defer();
//            return def.when(resultOfBackendCall);
//            console.log("wrapping result in $q promise. result is "+resultOfBackendCall);
            if (resultOfBackendCall.then && that.typeOf(resultOfBackendCall.then) === 'function') {
                resultOfBackendCall.then(function (data) {
                    def.resolve(data.data);
                });
            } else {
                //this is only relevant for the navigator backend
                if (that.typeOf(resultOfBackendCall) === 'string') {
                    parsedObj = JSON.parse(resultOfBackendCall);
                    def.resolve(parsedObj);
                    console.log("registering callback to ensure new digest");
                    setTimeout(function () {
                        def.promise. finally(function () {
                            console.log("cidsJS wrapping digest callback");
                            ci.gs().$apply();
                        });
                    }, 0);
                }

            }
            def.promise.done = def.promise.then;
            def.promise.fail = def.promise['catch'];
            return def.promise;
        };

        //priviliged methods that needs acces to private variables

        this.setChangeFlag = function () {
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
        this.setUserRealms = function () {

        };
        this.validateUser = function (options) {
            return backendProxy.validateUser(options);
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

        //###########################################################
        //
        //  methods belonging to /searches resource of cids rest api
        //  
        //###########################################################
        this.getAllSearches = function (params, options) {
//            setDomainInfoOnRequestParams(params);
            return wrapBackendCallInPromise(backendProxy.getAllSearches(params, options));
        };

        this.getSearch = function (domain, searchKey, params, options) {
            if (!domain || !searchKey) {
                console.log("Missing mandatory parameter. Mandatory Parameters for getSearch are domain: "
                        + domain + " and searchKey: " + searchkey);
            }
            return wrapBackendCallInPromise(backendProxy.getSearch(domain, searchKey, params, options));
        };
        this.getSearchResults = function (domain, searchKey, params, options) {
            return wrapBackendCallInPromise(backendProxy.getSearchResults(domain, searchKey, params, options));
        };
        //###########################################################
        //
        //methods belonging to /permissions resource of cids rest api
        //  
        //###########################################################
        this.getAllPermissions = function (params, options) {
            return wrapBackendCallInPromise(backendProxy.getAllPermissions(params, options));
        };
        this.getPermission = function (permissionKey, params, options) {
            return wrapBackendCallInPromise(backendProxy.getPermission(permissionKey, params, options));
        };
        //###########################################################
        //
        //methods belonging to /configattributes resource of cids rest api
        this.getAllConfigAttributes = function (params, options) {
            return wrapBackendCallInPromise(backendProxy.getAllConfigAttributes(params, options));
        };
        this.getConfigAttribute = function (configAttrKey, params, options) {
            return wrapBackendCallInPromise(backendProxy.getConfigAttribute(configAttrKey, params, options));
        };
        //###########################################################
        //
        //methods belonging to /subscriptions resource of cids rest api
        //  
        //###########################################################
        this.getAllSubscriptions = function (params, options) {
            return wrapBackendCallInPromise(backendProxy.getAllSubscriptions(params, options));
        };
        //###########################################################
        //
        //methods belonging to /classes resource of cids rest api
        //  
        //###########################################################
        this.getAllClasses = function (params, options) {
            return wrapBackendCallInPromise(backendProxy.getAllClasses(params, options));
        };

        this.getClass = function (domain, classKey, params, options) {
            var options;
            if (!classKey) {
                console.log("missing mandatory parameter classKey for request getClass!");
                return null;
            }
            if (!domain) {
                console.log("missing mandatory parameter domain for request getAllClasses! Using default domain: " + this.defaultDomain);
                domain = this.defaultDomain;
            }
            return wrapBackendCallInPromise(backendProxy.getClass(domain, classKey, params, options));
        };

        this.getAttribute = function (domain, classKey, attributeKey, params, options) {
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
            return wrapBackendCallInPromise(backendProxy.getAttribute(domain, classKey, attributeKey, params, options));
        };
        //###########################################################
        //
        //methods belonging to /node resource of cids rest api
        //  
        //###########################################################
        this.addNode = function (domain, nodeQuery, params, options) {
            return wrapBackendCallInPromise(backendProxy.addNode(nodeQuery, domain, params, options));
        };
        this.getAllRootNodes = function (params, options) {
            return wrapBackendCallInPromise(backendProxy.getAllRootNodes(params, options));
        };
        this.getChildrenOfNode = function (domain, nodeKey, params, options) {
            return wrapBackendCallInPromise(backendProxy.getChildrenOfNode(domain, nodeKey, params, options));
        };
        this.getNode = function (domain, nodeKey, params, options) {
            return wrapBackendCallInPromise(backendProxy.getNode(domain, nodeKey, params, options));
        };
        //###########################################################
        //
        //methods belonging to /users resource of cids rest api
        //  
        //###########################################################

        this.validateUser = function (options) {
            return wrapBackendCallInPromise(backendProxy.validateUser(options));
        };
        this.getAllRoles = function (options) {
            return wrapBackendCallInPromise(backendProxy.getAllRoles(options));
        };
        this.getRole = function (roleKey, options) {
            return wrapBackendCallInPromise(backendProxy.getRole(roleKey, options));
        };

        //###########################################################
        //
        // methods of /enitities resource of cids rest api
        //  
        //###########################################################
        // methods of /enitities resource of cids rest api
        this.getEmptyInstanceOfClass = function (domain, classKey, params, options) {
            return wrapBackendCallInPromise(backendProxy.getEmptyInstanceOfClass(domain, classKey, params, options));
        };
        this.getAllObjectsOfClass = function (domain, classKey, params, options) {
            var beanArr;
            beanArr = backendProxy.getAllObjectsOfClass(domain, classKey, params, options);
            return wrapBackendCallInPromise(beanArr);
        };
        this.createNewObject = function (domain, classKey, objectString, params, options) {
            return wrapBackendCallInPromise(backendProxy.createNewObject(domain, classKey, objectString, params, options));
        };
        this.updateOrCreateObject = function (domain, classKey, objectId, objectString, params, options) {
            return wrapBackendCallInPromise(backendProxy.updateOrCreateObject(domain, classKey, objectId, objectString, params, options));
        };
        this.deleteObject = function (domain, classKey, objectId, params, options) {
            return wrapBackendCallInPromise(backendProxy.deleteObject(domain, classKey, objectId, params, options));
        };
        this.getObject = function (domain, classKey, objectId, params, options) {
            return wrapBackendCallInPromise(backendProxy.getObject(domain, classKey, objectId, params, options));
        };

        this.getAllSiblingBeans = function (cidsBean) {
            var domain, className, selfInfos;
            selfInfos = getInfoObjectFromSelfReference(cidsBean);
            console.log(selfInfos);
            domain = selfInfos.domain || "";
            className = selfInfos.className || "";
            return wrapBackendCallInPromise(backendProxy.getAllObjectsOfClass(domain, className));
        };
        //###########################################################
        //
        //methods belonging to the /action api
        //  
        //###########################################################
        this.createNewTask = function (domain, actionKey, actionTask, params, options) {
            return wrapBackendCallInPromise(backendProxy.createNewTask(domain, actionKey, actionTask, params, options));
        };
        this.getAllRunningTasks = function (domain, actionKey, params, options) {
            return wrapBackendCallInPromise(backendProxy.getAllRunningTasks(domain, actionKey, params, options));
        },
                this.getTaskStatus = function (domain, actionKey, taskKey, params, options) {
            return wrapBackendCallInPromise(backendProxy.getTaskStatus(domain, actionKey, taskKey, params, options));
        };
        this.cancelTask = function (domain, actionKey, taskKey, params, options) {
            return wrapBackendCallInPromise(backendProxy.cancelTask(domain, actionKey, taskKey, params, options));
        };
        this.getAllTaskResults = function (domain, actionKey, taskKey, params, options) {
            return wrapBackendCallInPromise(backendProxy.getAllTaskResults(domain, actionKey, taskKey, params, options));
        };
        this.getTaskResult = function (domain, actionKey, taskKey, resultKey, params, options) {
            return wrapBackendCallInPromise(backendProxy.getTaskResult(domain, actionKey, taskKey, resultKey, params, options));
        };
        this.getAction = function (domain, actionKey, params, options) {
            return wrapBackendCallInPromise(backendProxy.getAction(domain, actionKey, params, options));
        };
        this.getAllActions = function (params, options) {
            return wrapBackendCallInPromise(backendProxy.getAllActions(params, options));
        };
    };
    //public methods of CidsJS => don't have access to backend

    CidsJS.prototype.injectBean = function (jsonBean, editable) {
        var cidsBean;
        this.editableMode = editable || false;
//        console.log("injecting bean");
        cidsBean = JSON.parse(jsonBean);
        if (!this.isInitialised) {
            this.renderer.initRenderer(cidsBean);
            this.isInitialised = true;
            // register a watch to scope.cidsBean to get notifies about changes...
            console.log(this.registerWatches);
            this.registerWatches(ci.gs().cidsBean);
        } else {
            this.renderer.updateBean(cidsBean);
        }
    };

    CidsJS.prototype.retrieveBean = function () {
        var bean = this.renderer.getCidsBean();
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
        initCids.$inject = ['$q'];
        var injector = angular.element('html').injector();
        if (!injector) {
            injector = angular.injector(['ng']);
        }
        injector.invoke(initCids);
    }
})(window);

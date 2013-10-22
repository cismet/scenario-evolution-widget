//(function (window) {
"use strict";
//the ng-rest-backend is implemented as an angular service to participate form angulars DI 
//the service itself registers itself as backend for cidsJS
//var serviceModule = angular.module('ng-cids-rest', []).run(function ($http) {
//    var backend = new NgHttpBackend($http);
//    ci.setBackend(backend);
//    return backend;
//});
function initBackend ($http) {
    var backend = new NgHttpBackend($http);

    ci.setBackend(backend);
}
;

//with this annotaion we tell angular to inject the $http service
initBackend.$inject = ['$http'];
var NgHttpBackend = function ($http) {

    //private members
    var that = this;

    // creates a new object with this.requestOptionsDefault as prototype and augments the new object with the object 
    // from the param list
    var augmentDefaultRequestOptions = function (optionsAugmenter) {
        var prop;
//        console.log("default options: " + JSON.stringify(that.requestOptionsDefaults));
        var augmentedOptions = Object.create(that.requestOptionsDefaults);
        for (prop in optionsAugmenter) {
            if (prop === 'data') {
                augmentedOptions.data = optionsAugmenter[prop];
            } else if (prop === 'headers') {
                augmentedOptions.headers = optionsAugmenter[prop];
            } else if (prop === 'transformRequest') {
                augmentedOptions.transformRequest = optionsAugmenter[prop];
            } else if (prop === 'transformResponse') {
                augmentedOptions.transformResponse = optionsAugmenter[prop];
            } else if (prop === 'cache') {
                augmentedOptions.cache = optionsAugmenter[prop];
            } else if (prop === 'timeout') {
                augmentedOptions.timeout = optionsAugmenter[prop];
            } else if (prop === 'responseType') {
                augmentedOptions.responseType = optionsAugmenter[prop];
            }
        }
        return augmentedOptions;
    };

    //public members
    this.service_base_url = "http://crisma.cismet.de/icmm_api";
//    this.service_base_url = "http://localhost:8890";
    this.action_base_url = this.service_base_url + "/actions";
    this.users_base_url = this.service_base_url + "/users";
    this.nodes_base_url = this.service_base_url + "/nodes";
    this.searches_base_url = this.service_base_url + "/searches";
    this.permission_base_url = this.service_base_url + "/permissions";
    this.config_attr_base_url = this.service_base_url + "/configattributes";
    this.defaultDomain = "crisma";

    this.requestOptionsDefaults = {
        responseType: 'json'
    };

    this.setDefaultAuthentication = function (username, password) {
        if (username && password) {
            var authString = btoa(username + ':' + password);
            this.setDefaultAuthenticationString(authString);
        }
    };
    this.setDefaultAuthenticationString = function (authString) {
        $http.defaults.headers.common.Authorization = 'Basic ' + authString;
    };

    this.setDefaultDomain = function (domain) {
        this.defaultDomain = domain;

    };

    this.setServiceBaseUrl = function (baseUrl) {
        this.service_base_url = baseUrl;
    };

    this.test = function () {
        var config = {
            method: 'GET'
        };
        var prom = this.validateUser(config);
        prom.success(function (data, status) {
            console.log("Testcall succesfull: " + data + " / " + status);
        });
        prom.error(function (data, status) {
            console.log("testcall failed: " + data + " / " + status);
        });
    };

    //###########################################################
    //
    //  methods belonging to /searches resource of cids rest api
    //  
    //###########################################################
    this.getAllSearches = function (params, requestOptions) {
        var requestUrl;
        var options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.searches_base_url;
        return $http.get(requestUrl, options);
    };

    this.getSearch = function (domain, searchKey, params, requestOptions) {
        var requestUrl;
        var options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.searches_base_url + "/" + domain + "." + searchKey;
        return $http.get(requestUrl, options);
    };

    this.getSearchResults = function (domain, searchKey, params, requestOptions) {
        var requestUrl;
        var options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.searches_base_url + "/" + domain + "." + searchKey + "/results";
        //ToDo: options can contain list of search paramters: how to handle these?
        return $http.get(requestUrl, options);
    };

    //###########################################################
    //
    //methods belonging to /permissions resource of cids rest api
    //  
    //###########################################################
    this.getAllPermissions = function (params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.permission_base_url;
        return $http.get(requestUrl, options);
    };

    this.getPermission = function (permissionKey, params, requestOptions) {
        var requesturl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requesturl = this.searches_base_url + "/" + permissionKey;
        return $http.get(requesturl, options);
    };

    //###########################################################
    //
    //methods belonging to /configattributes resource of cids rest api
    this.getAllConfigAttributes = function (params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.config_attr_base_url;
        return $http.get(requestUrl, options);
    };

    this.getConfigAttribute = function (configAttrKey, params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.searches_base_url + "/" + configAttrKey;
        return $http.get(requestUrl, options);
    };

    //###########################################################
    //
    //methods belonging to /subscriptions resource of cids rest api
    //  
    //###########################################################
    this.getAllSubscriptions = function (params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.service_base_url + "/subscriptions";
        return $http.get(requestUrl, options);
    };

    //###########################################################
    //
    //methods belonging to /classes resource of cids rest api
    //  
    //###########################################################
    this.getClass = function (domain, classKey, params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.service_base_url + "/classes/" + domain + "." + classKey;
        return $http.get(requestUrl, options);
    };

    this.getAllClasses = function (params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.service_base_url + "/classes";
        return $http.get(requestUrl, options);
    };

    this.getAttribute = function (domain, classKey, attributeKey, params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.service_base_url + "/classes/" + domain + "." + classKey + "/" + attributeKey + "?";
        return $http.get(requestUrl, options);
    };

    //###########################################################
    //
    //methods belonging to /users resource of cids rest api
    //  
    //###########################################################
    this.addNode = function (nodeQuery, domain, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        requestUrl = this.node_base_url + "/" + domain + "." + nodeKey + "/chidlren";
        options.method = "POST";
        options.data = nodeQuery;
        return  $http.post(requestUrl, options);
    };

    this.getAllRootNodes = function (params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.node_base_url;
        return $http.get(requestUrl, options);
    };

    this.getChildrenOfNode = function (domain, nodeKey, params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.node_base_url + "/" + domain + "." + nodeKey + "/children";
        return $http.get(requestUrl, options);
    };

    this.getNode = function (domain, nodeKey, params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.node_base_url + "/" + domain + "." + nodeKey;
        return $http.get(requestUrl, options);
    };

    //###########################################################
    //
    //methods belonging to /users resource of cids rest api
    //  
    //###########################################################

    this.getAllRoles = function (requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        requestUrl = this.users_base_url + "/roles";
        return $http.get(requestUrl, options);
    };

    this.getRole = function (roleKey, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        requestUrl = this.users_base_url + "/roles/" + roleKey;
        return $http.get(requestUrl, options);
    };

    this.validateUser = function (requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        requestUrl = this.users_base_url;
        var promise = $http.get(requestUrl, options);
        return promise;
    };

    //###########################################################
    //
    // methods of /enitities resource of cids rest api
    //  
    //###########################################################
    this.getAllObjectsOfClass = function (domain, classKey, params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.service_base_url + "/" + domain + "." + classKey;
        return  $http.get(requestUrl, options);
    };

    this.getEmptyInstanceOfClass = function (domain, classKey, params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.service_base_url + "/" + domain + "." + classKey + "/emptyInstance";
        return $http.get(requestUrl, options);
    };
    this.createNewObject = function (domain, classKey, object, params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.service_base_url + "/" + domain + "." + classKey;
        console.log("requestUrl: " + requestUrl);
        return $http.post(requestUrl, object, options);
    };

    this.updateOrCreateObject = function (domain, classKey, objectId, data, params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.service_base_url + "/" + domain + "." + classKey + "/" + objectId;
        return $http.put(requestUrl, data, options);
    };

    this.deleteObject = function (domain, classKey, objectId, params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.service_base_url + "/" + domain + "." + classKey + "/" + objectId;
        return $http.delete(requestUrl, options);
    };

    this.getObject = function (domain, classKey, objectId, params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.service_base_url + "/" + domain + "." + classKey + "/" + objectId;
        return $http.get(requestUrl, options);
    };

    //###########################################################
    //
    //methods belonging to the /action api
    //  
    //###########################################################
    this.createNewTask = function (domain, actionKey, actionTask, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        requestUrl = this.action_base_url + domain + "." + actionKey + "/tasks";
        options.data = JSON.stringify(actionTask);
        console.log("requestUrl: " + requestUrl);
        return $http.post(requestUrl, options);
    };

    this.getAllRunningTasks = function (domain, actionKey, params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.action_base_url + "/" + domain + "." + actionKey + "/tasks";
        return $http.get(requestUrl, options);
    };

    this.getTaskStatus = function (domain, actionKey, taskKey, params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.action_base_url + "/" + domain + "." + actionKey + "/tasks/" + taskKey;
        return $http.get(requestUrl, options);
    };

    this.cancelTask = function (domain, actionKey, taskKey, params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.action_base_url + "/" + domain + "." + actionKey + "/tasks/" + taskKey;
        return $http.delete(requestUrl, options);
    };

    this.getAllTaskResults = function (domain, actionKey, taskKey, params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        requestOptions.params = params;
        requestUrl = this.action_base_url + "/" + domain + "." + actionKey + "/tasks/" + taskKey + "/results";
        return $http.get(requestUrl, options);
    };

    this.getTaskResult = function (domain, actionKey, taskKey, resultKey, params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.action_base_url + "/" + domain + "." + actionKey + "/tasks/" + taskKey + "/results/" + resultKey;
        return $http.get(requestUrl, options);
    };

    this.getAction = function (domain, actionKey, params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.action_base_url + "/" + domain + "." + actionKey;
        return $http.get(requestUrl, options);
    };

    this.getAllActions = function (params, requestOptions) {
        var requestUrl, options;
        options = augmentDefaultRequestOptions(requestOptions);
        options.params = params;
        requestUrl = this.action_base_url;
        return $http.get(requestUrl, options);
    };

};


setTimeout(function () {
    var tick = function () {
        console.log("checking if injector is already defined");
        var injector = angular.element('html').injector();
        if (!injector) {
            setTimeout(tick,200);
        } else {
            console.log("injector is already defined");
        }
        injector.invoke(initBackend);
    };
    tick();
}, 0);

//})(window);
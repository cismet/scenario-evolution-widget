(function (window) {
    "use strict";
    var PureRestBackend = function () {

        //private members
        var that = this;
        var createOptionsString = function (option) {
            var prop, optString = "";
            var firstOption = true;
            console.log("getAllObjectsOfClass -> options: " + JSON.stringify(option));
            var leadingAmpersandNeeded = true;
            for (prop in option) {
                console.log("################" + prop + "################");
                if (option[prop]) {
                    if (firstOption) {
                        optString += "?";
                        firstOption = false;
                        leadingAmpersandNeeded = false;
                    }
                    if (leadingAmpersandNeeded) {
                        optString += "&";
                    }
                    optString += new String(prop) + "=" + option[prop];
                    leadingAmpersandNeeded = true;
                }
            }
            return optString;
        };

        var augmentRequestOptions = function (optionsAugmenter) {
            var prop;
            console.log("default options: "+JSON.stringify(that.requestOptionsDefaults));
            var augmentedOptions = Object.create(that.requestOptionsDefaults);
            for (prop in optionsAugmenter) {
                if (prop === '') {
                    
                }else if (prop === '') {

                }
            }
            return augmentedOptions;
        };



        //public members
        this.service_base_url = "http://localhost:8890";
        this.action_base_url = this.service_base_url + "/actions";
        this.users_base_url = this.service_base_url + "/users";
        this.nodes_base_url = this.service_base_url + "/nodes";
        this.searches_base_url = this.service_base_url + "/searches";
        this.permission_base_url = this.service_base_url + "/permissions";
        this.config_attr_base_url = this.service_base_url + "/configattributes";
        this.defaultDomain = "crisma";

        this.requestOptionsDefaults = {
            cache: false,
            dataType: 'json',
            method: 'GET',
            error: function (jqXHR) {
                console.log("ajax error " + jqXHR.status);
            }
        };

        this.setDefaultDomain = function (domain) {
            this.defaultDomain = domain;
        };

        this.setServiceBaseUrl = function (baseUrl) {
            this.service_base_url = baseUrl;
        };

        //###########################################################
        //
        //  methods belonging to /searches resource of cids rest api
        //  
        //###########################################################
        this.getAllSearches = function (options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.searches_base_url;
            requestUrl += createOptionsString(options);
            return $.ajax(requestUrl, requestOptions);
        };

        this.getSearch = function (domain, searchKey, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.searches_base_url + "/" + domain + "." + searchKey;
            requestUrl += createOptionsString(options);
            return $.ajax(requestUrl, requestOptions);
        };

        this.getSearchResults = function (domain, searchKey, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.searches_base_url + "/" + domain + "." + searchKey + "/results";
            //ToDo: options can contain list of search paramters: how to handle these?
            requestUrl += createOptionsString(options);
            return $.ajax(requestUrl, requestOptions);
        };

        //###########################################################
        //
        //methods belonging to /permissions resource of cids rest api
        //  
        //###########################################################
        this.getAllPermissions = function (options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.permission_base_url;
            requestUrl += createOptionsString(options);
            return $.ajax(requestUrl, requestOptions);
        };

        this.getPermission = function (permissionKey, options) {
            var requesturl;
            var requestOptions = augmentRequestOptions(options);
            requesturl = this.searches_base_url + "/" + permissionKey;
            requesturl += createOptionsString(options);
            return $.ajax(requesturl, requestOptions);
        };

        //###########################################################
        //
        //methods belonging to /configattributes resource of cids rest api
        this.getAllConfigAttributes = function (options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.config_attr_base_url;
            requestUrl += createOptionsString(options);
            return $.ajax(requestUrl, requestOptions);
        };

        this.getConfigAttribute = function (configAttrKey, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.searches_base_url + "/" + configAttrKey;
            requestUrl += createOptionsString(options);
            return $.ajax(requestUrl, requestOptions);
        };

        //###########################################################
        //
        //methods belonging to /subscriptions resource of cids rest api
        //  
        //###########################################################
        this.getAllSubscriptions = function (domain, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.service_base_url + "/subscriptions";
            options.domain = domain;
            requestUrl += createOptionsString(options);
            return $.ajax(requestUrl, requestOptions);
        };

        //###########################################################
        //
        //methods belonging to /classes resource of cids rest api
        //  
        //###########################################################
        this.getClass = function (domain, classKey, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.service_base_url + "/classes/" + domain + "." + classKey;
            if (options) {
                if (options.role) {
                    requestUrl += "?role=";
                    requestUrl += options.role;
                }
            }
            console.log("requestUrl: " + requestUrl);
            return $.ajax(requestUrl, requestOptions);
        };

        this.getAllClasses = function (domain, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            ;

            requestUrl = this.service_base_url + "/classes?domain=" + domain;
            if (options) {
                if (options.limit) {
                    requestUrl += "&limit=";
                    requestUrl += new String(options.limit);
                }
                if (options.offset) {
                    requestUrl += "&offset=";
                    requestUrl += new String(options.offset);
                }
                if (options.role) {
                    requestUrl += "&role=";
                    requestUrl += options.role;
                }
            }
            console.log("requestUrl: " + requestUrl);
            return $.ajax(requestUrl, requestOptions);
        };

        this.getAttribute = function (domain, classKey, attributeKey, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.service_base_url + "/classes/" + domain + "." + classKey + "/" + attributeKey + "?";
            if (options) {
                if (options.role) {
                    requestUrl += "role=";
                    requestUrl += options.role;
                }
            }
            console.log("requestUrl: " + requestUrl);
            return $.ajax(requestUrl, requestOptions);
        };

        //###########################################################
        //
        //methods belonging to /users resource of cids rest api
        //  
        //###########################################################
        this.addNode = function (nodeQuery, domain, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.no_base_url + "/" + domain + "." + nodeKey + "/chidlren";
            requestUrl += createOptionsString(options);
            requestOptions.method = "POST";
            requestOptions.data = nodeQuery;
            console.log("requestUrl: " + requestUrl);
            return  $.ajax(requestUrl, requestOptions);
        };

        this.getAllRootNodes = function (domain, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            options.domain = domain;
            requestUrl = this.no_base_url;
            requestUrl += createOptionsString(options);
            console.log("requestUrl: " + requestUrl);
            return $.ajax(requestUrl, requestOptions);
        };

        this.getChildrenOfNode = function (nodeKey, domain, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.no_base_url + "/" + domain + "." + nodeKey + "/chidlren";
            requestUrl += createOptionsString(options);
            console.log("requestUrl: " + requestUrl);
            return $.ajax(requestUrl, requestOptions);
        };

        this.getNode = function (nodeKey, domain, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.no_base_url + "/" + domain + "." + nodeKey;
            requestUrl += createOptionsString(options);
            console.log("requestUrl: " + requestUrl);
            return $.ajax(requestUrl, requestOptions);
        };

        //###########################################################
        //
        //methods belonging to /users resource of cids rest api
        //  
        //###########################################################

        this.getAllRoles = function (options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.users_base_url + "/roles";
            console.log("requestUrl: " + requestUrl);
            return $.ajax(requestUrl, requestOptions);
        };

        this.getRole = function (roleKey, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.users_base_url + "/roles/" + roleKey;
            console.log("requestUrl: " + requestUrl);
            return $.ajax(requestUrl, requestOptions);
        };

//        this.validateUser

        //###########################################################
        //
        // methods of /enitities resource of cids rest api
        //  
        //###########################################################
        this.getAllObjectsOfClass = function (domain, classKey, options) {
            console.log('getallobjs: [dom=' + domain + '|classKey=' + classKey + ']')
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.service_base_url + "/" + domain + "." + classKey;
            requestUrl += createOptionsString(options);
            console.log("requestUrl: " + requestUrl);
            var promise = $.ajax(requestUrl, requestOptions);
            
            return promise;
        };

        this.getEmptyInstanceOfClass = function (domain, classKey, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.service_base_url + "/" + domain + "." + classKey + "/emptyInstance";
            requestUrl += createOptionsString(options);
            console.log("requestUrl: " + requestUrl);
            return $.ajax(requestUrl, requestOptions);
        };
        this.createNewObject = function (object, domain, classKey, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.service_base_url + "/" + domain + "." + classKey;
            requestUrl += createOptionsString(options);
            requestOptions.method = "POST";
            requestOptions.data = JSON.stringify(object);
            console.log("requestUrl: " + requestUrl);
            return $.ajax(requestUrl, requestOptions);
        };

        this.updateOrCreateObject = function (objectString, domain, classKey, objectId, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.service_base_url + "/" + domain + "." + classKey + "/" + objectId;
            requestUrl += createOptionsString(options);
            requestOptions.method = "PUT";
            requestOptions.data = objectString;
            console.log("requestUrl: " + requestUrl);
            return $.ajax(requestUrl, requestOptions);
        };

        this.deleteObject = function (domain, classKey, objectId, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.service_base_url + "/" + domain + "." + classKey + "/" + objectId;
            requestUrl += createOptionsString(options);
            requestOptions.method = "DELETE";
            console.log("requestUrl: " + requestUrl);
            return $.ajax(requestUrl, requestOptions);
        };

        this.getObject = function (domain, classKey, objectId, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.service_base_url + "/" + domain + "." + classKey + "/" + objectId;
            requestUrl += createOptionsString(options);
            console.log("requestUrl: " + requestUrl);
            return $.ajax(requestUrl, requestOptions);
        };

        //###########################################################
        //
        //methods belonging to the /action api
        //  
        //###########################################################
        this.createNewTask = function (domain, actionKey, actionTask, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.action_base_url + domain + "." + actionKey + "/tasks";
            requestUrl += createOptionsString(options);
            requestOptions.method = "POST";
            requestOptions.data = JSON.stringify(actionTask);
            console.log("requestUrl: " + requestUrl);
            return $.ajax(requestUrl, requestOptions);
        };

        this.getAllRunningTasks = function (domain, actionKey, options) {
            var requestOptions = augmentRequestOptions(options);
            var requestUrl;
            requestUrl = this.action_base_url + "/" + domain + "." + actionKey + "/tasks";
            requestUrl += createOptionsString(options);
            return $.ajax(requestUrl, requestOptions);
        };

        this.getTaskStatus = function (domain, actionKey, taskKey, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.action_base_url + "/" + domain + "." + actionKey + "/tasks/" + taskKey;
            requestUrl += createOptionsString(options);
            return $.ajax(requestUrl, requestOptions);
        };

        this.cancelTask = function (domain, actionKey, taskKey, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.action_base_url + "/" + domain + "." + actionKey + "/tasks/" + taskKey;
            requestUrl += createOptionsString(options);
            requestOptions.method = "DELETE";
            return $.ajax(requestUrl, requestOptions);
        };

        this.getAllTaskResults = function (domain, actionKey, taskKey, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.action_base_url + "/" + domain + "." + actionKey + "/tasks/" + taskKey + "/results";
            requestUrl += createOptionsString(options);
            return $.ajax(requestUrl, requestOptions);
        };

        this.getTaskResult = function (domain, actionKey, taskKey, resultKey, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.action_base_url + "/" + domain + "." + actionKey + "/tasks/" + taskKey + "/results/" + resultKey;
            requestUrl += createOptionsString(options);
            return $.ajax(requestUrl, requestOptions);
        };

        this.getAction = function (domain, actionKey, options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.action_base_url + "/" + domain + "." + actionKey;
            requestUrl += createOptionsString(options);
            return $.ajax(requestUrl, requestOptions);
        };

        this.getAllActions = function (options) {
            var requestUrl;
            var requestOptions = augmentRequestOptions(options);
            requestUrl = this.action_base_url;
            requestUrl += createOptionsString(options);
            return $.ajax(requestUrl, requestOptions);
        };

    };

    ci.setBackend(new PureRestBackend());
})(window);
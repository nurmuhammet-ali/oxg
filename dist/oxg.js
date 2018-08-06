// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"oxg.js":[function(require,module,exports) {
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Create Object
var AjaxHelper = {};

// Making a function
AjaxHelper.createXHR = function (url, options) {
    // Setting xhr object to null because of browser support
    var xhr = false;
    /* Check if browser supports ajax */
    // if browser is IE 8 or Older version
    if (window.ActiveXObject) {
        try {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
            xhr = false;
        }
    }
    // Any other browser that doesn't support ajax
    if (!window.XMLHttpRequest) return false;
    // if browser supports Ajax, then create AjaxRequest
    xhr = new XMLHttpRequest();
    // As it is a function, we have constructor, and we should get values from users
    // Check if user passes options
    options = options || {};
    // Check if user passess request method
    options.method = options.method || "GET";
    // Check if user passes any data for POST requests
    options.data = options.data || null;
    // if post request passed then convert it to the post query 

    if (options.data !== null) {
        var qstring = [];
        // filter through and set values
        for (var key in options.data) {
            qstring.push(encodeURIComponent(key) + "=" + encodeURIComponent(options.data[key]));
        } // as last part join data with & so that POST query can realize
        options.data = qstring.join("&");
    }

    // Check if chacing is enabled or not
    if (options.cache == false && options.method.toUpperCase() == "GET") url = url + "?_=" + new Date().getTime();

    // Parts of ajax request
    xhr.onreadystatechange = function () {
        // if request is loading
        if (xhr.readyState == 1 && options.before) options.before.call(xhr);

        // if ajax request is successefull
        if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
            // Set Content Type That Server Can realize what is that about
            var contentType = xhr.getResponseHeader('Content-Type');
            // If Any Error
            if (!options.complete) return false;

            /* GET REQUEST */
            // Check if GET request == json
            if (contentType == "application/json") return options.complete.call(xhr, JSON.parse(xhr.responseText));
            // Check if GET request == xml
            if (contentType == "text/xml" || contentType == "application/xml") return options.complete.call(xhr, xhr.responseXML);
            // As a default, set GET request file to anyFormat
            return options.complete.call(xhr, xhr.responseText);
        }
    };
    // Open the request
    xhr.open(options.method, url);

    // And return Object
    return xhr;
};

// Now function for user
AjaxHelper.make = function (url, options) {
    try {
        // lets use function we made above
        var xhr = AjaxHelper.createXHR(url, options);
        // if Ajax request is not supported then return false
        if (!xhr) return false;
        // Set default Request Header That Server Can Realize
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        // Check if request type == POST
        if (options.method.toUpperCase() == "POST")
            // if request type == POST, then set content type
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        // Send the data to the server
        xhr.send(options.data);

        // Return request
        return xhr;
    } catch (e) {
        return e;
    }
};

var oxg = function () {
    function oxg(url, data, method) {
        _classCallCheck(this, oxg);

        this.url = url;
        this.data = data;
        this.method = method;
    }

    _createClass(oxg, [{
        key: "cache",
        value: function cache(boolean) {
            if (boolean) {
                return;
            }
            this.cache = true;

            return this;
        }
    }, {
        key: "loading",
        value: function loading(callback) {
            this.loadingCallback = callback;
            return this;
        }
    }, {
        key: "then",
        value: function then(callback) {
            this.ajax = AjaxHelper.make(this.url, {
                method: this.method,
                data: this.data,
                cache: this.cache,
                before: this.loadingCallback,
                complete: callback
            });

            return this;
        }
    }], [{
        key: "get",
        value: function get(url, data) {
            this.url = url;
            this.data = data;
            this.method = "GET";

            return new this(url, data, "GET");
        }
    }, {
        key: "post",
        value: function post(url, data) {
            this.url = url;
            this.data = data;
            this.method = "POST";

            return new this(url, data, "POST");
        }
    }]);

    return oxg;
}();

module.exports = oxg;
},{}]},{},["oxg.js"], null)
//# sourceMappingURL=/oxg.map
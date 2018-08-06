// Create Object
var AjaxHelper = {};

// Making a function
AjaxHelper.createXHR = (url, options) => {
    // Setting xhr object to null because of browser support
    var xhr = false;
    /* Check if browser supports ajax */
    // if browser is IE 8 or Older version
    if ( window.ActiveXObject) {
        try {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }  catch (e) {
            xhr = false;
        }
    }
    // Any other browser that doesn't support ajax
    if ( !window.XMLHttpRequest ) return false;
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
        for (var key in options.data)
            qstring.push(encodeURIComponent(key)+"="+encodeURIComponent(options.data[key]));
        // as last part join data with & so that POST query can realize
        options.data = qstring.join("&");
    }   

    // Check if chacing is enabled or not
    if (options.cache == false && options.method.toUpperCase() == "GET")
        url = url+"?_="+ new Date().getTime()

    // Parts of ajax request
    xhr.onreadystatechange = () => {
        // if request is loading
        if (xhr.readyState == 1 && options.before) 
            options.before.call(xhr);

        // if ajax request is successefull
        if ( (xhr.readyState == 4) && xhr.status == 200 || xhr.status == 304 ) {
            // Set Content Type That Server Can realize what is that about
            var contentType = xhr.getResponseHeader('Content-Type');
            // If Any Error
            if (!options.complete) return false;    
            
            /* GET REQUEST */
            // Check if GET request == json
            if (contentType == "application/json")
                return options.complete.call(xhr, JSON.parse(xhr.responseText));
            // Check if GET request == xml
            if (contentType == "text/xml" || contentType == "application/xml")
                return options.complete.call(xhr, xhr.responseXML);
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
AjaxHelper.make = (url, options) => {
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
    } catch(e) {
        return e;
    }
};

class oxg {
    constructor(url, data, method) {
        this.url = url;
        this.data = data;
        this.method = method;
    }

    static get(url, data) {
        this.url = url;
        this.data = data;
        this.method = "GET";

        return new this(url, data, "GET");
    }

    cache(boolean) {
        if (boolean) {
            return;
        }
        this.cache = true;

        return this;
    }

    loading(callback) {
        this.loadingCallback = callback;   
        return this;
    }

    then(callback) {
        this.ajax = AjaxHelper.make(this.url, {
            method: this.method,
            data: this.data,
            cache: this.cache,
            before: this.loadingCallback,
            complete: callback
        });

        return this;
    }
    
    static post(url, data) {
        this.url = url;
        this.data = data;
        this.method = "POST";

        return new this(url, data, "POST");
    }
}

module.exports = oxg;

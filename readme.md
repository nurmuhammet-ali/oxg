# Oxg, simple ajax library

Oxg is a very simple ajax library with readable api and cross browser support.

## Installation
```js
var oxg = require('./oxg');
```
Works with [webpack](https://webpack.js.org/), [parcel](https://parceljs.org/) and etc.

## Usage, simple get request
```js
var oxg = require('oxg');

oxg.get('/about')
    .then(response => {
        console.log(response);
    });
```
> Tip: oxg comes with headers like `XMLHttpRequest`, so you don't have to define which header you had to use to make that request

## Post requests
```js
var oxg = require('oxg');

oxg.post('/about', {
        email: 'nurmuhammet.ali@mail.com'
    })
    .then(response => {
        console.log(response);
    });
```

## Optional params
### `loading()`
Sometimes ajax requests my take time due to slow server, due to slow internet connection and etc. For those reasons you will to need to show user some type of message so they can realize that requests loads. For triggering any functions when ajax request loads, you can use `loading` method to do that.
```js
    oxg.post('/about', {
        email: 'nurmuhammet.ali@mail.com'
    })
    .loading(() => {
        // do whatever you want to do here while ajax loads, 
        // loaders and etc..
        console.log('Waiting for ajax request to be finished');
    })
    .then(response => {
        console.log(
        'Ajax request has finished and got response: ' + response
        );
    });
```
Some old browser like IE 8 are caching files that has been already requested. Even if that file has been changed, IE 8 will still load old file in which it might be bad. To disable cache, we can add method `cache()` and give false value to it
```js
oxg.get('file.txt')
    .cache(false)
    .then(response => {
        // ajax request has been complete, do whatever you want to do here
        console.log(
        'Ajax request has finished and got response: ' + response
        );
    });
```

> Tip: if you request a `.json` or `.xml` file, oxg will return a parsed  version of the file

## Oxg Instance
If you asssing a variable to oxg, it will return oxg instance, which can be userful to determine datas about ajax request, like: ajax response, ajax timeout and others
```js
let oxgInstance = oxg.post('/to', {
        name: 'Nurmuhammet Ali',
        email: 'nurmuhammet.ali@mail.com',
    }).then(response => {
        console.log(response);
    });

console.log(oxgInstance);
```

### Please, don't hesitate to open an issue.

Contact mail:  [nurmuhammet.ali@mail.com](mailto:nurmuhammet.ali@mail.com)

## [](https://github.com/nurmuhammet-ali/oxg#license)License

The oxg is open-sourced software licensed under the  [MIT license](https://opensource.org/licenses/MIT). 
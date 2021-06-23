# Matterport SDK 2021 Tutorial
@ マーターポートSDKの2021年のチュートリアル（[日本語](https://qiita.com/loic-meister-guild/items/ef58b0ad3c8fdb8fd76c)）

First, create a directory for our Matterport app:

```
mkdir matterport-test
cd matterport-test
```
And, let's set up a simple web server ...
## The Web Server
We will use __Node.js__ with the __Express__ web server to serve our page.
### Install Express
First, let's initialize our empty project `package.json` file:

```
npm init -y
```
Then, install the latest stable version of __Express__:

```
npm install express
```
### Create The Web Server
First, create the JavaScript file for the web server:

```
touch server.js
```
Then, in the file, setup the web server:

```JavaScript:server.js
const express = require('express');
const app = express();
```
Setup __Express__ to serve static assets, such as HTML, CSS, JavaScript and images, from the `public` directory:

```JavaScript:server.js
const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'public')))
```
Create the `public` directory:

```
mkdir public
cd public
```
Create some empty files where we will add the HTML, CSS and JavaScript for our Matterport application:

```
touch app.js
touch index.html
touch styles.css
cd ..
```
Create the route to serve our app HTML file:

```JavaScript:server.js
// ...
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});
```
Finally, let's start the Express web server by setting up a listener on port `8000`

```JavaScript:server.js
// ...
app.listen(8000, () => {
    console.log('Application listening on port 8000!');
});
```
### Launch The Web Server
To launch the web server, run the following command:

```
node server.js
```
Now, we can access the app in a browser at "http://localhost:8000".
## [Matterport SDK for Embeds](https://matterport.github.io/showcase-sdk/sdk_home.html)
On the __Matterport__ website, there are [2 SDKs](https://support.matterport.com/hc/en-us/articles/360061477754) listed which are in fact complementary: 

- [Matterport SDK for Embeds](https://matterport.github.io/showcase-sdk/sdk_home.html): The basic __Matterport 3D Showcase SDK__ allowing web applications to execute actions changing where the end user is and what they see in __3D Showcase__, and to listen to events about where the user is and what they are seeing or doing, and then react appropriately.
- [Matterport SDK Bundle](https://matterport.github.io/showcase-sdk/sdk_home.html): An extension of the __SDK for embeds__ that provides a framework for deep third-party integration with Matterport models and direct access to the 3d engine, renderer, scene graph and more.

To create our first app, we will use the __SDK for Embeds__ in (free) Sandbox access ...
### The Free Tiers
The free subscription plan gives us access to developer tools in sandbox mode and with restrictions:

- SDK keys can only be used in localhost - not on any other domains
- API tokens can only be used against demo models - not customer-created models

Now, let's create our first app.
### First App: The Basics
Let's first create a basic __Matterport__ app ...
##### The HTML
First, let's create a minimal page for our app:

```public/index.html
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <title>Matterport Test</title>
        <script src="/app.js" defer></script>
        <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
    </body>
</html>
```
Then, add the __3D Showcase SDK__ to our web application by including the JavaScript library in the `<head>` tag:

```public/index.html
<html lang="en">
    <head>
        ...
        <script src='https://static.matterport.com/showcase-sdk/2.0.1-0-g64e7e88/sdk.js'></script>
        <script src="/app.js" defer></script>
        <link rel="stylesheet" href="/styles.css">
    </head>
    ...
```
Finally, add an `<iframe>` tag to embed a Matterport Space on our web page:

```public/index.html
...
    <body>
        <iframe id="showcase" width="960" height="480" title="test" frameBorder="0" allowFullScreen allow="vr"></iframe>
    </body>
</html>
```
Let's review some of the `<iframe>` attributes:

- `frameBorder="0"`: prevent a border to be drawn around the `<iframe>`.
- `allowFullScreen`: show the __fullscreen mode__ button.
- `allow="vr"`: found in some code samples but does not seem to do anything.
- `allow="xr-spatial-tracking"`: enable the [__xr immersive mode__](https://matterport.github.io/showcase-sdk/sdkbundle_tutorials_using_xr.html) (SDK Bundle only).

##### The JavaScript
Now, in our application JavaScript code:

- Wait until the `DOMContentLoaded` event.
- Set the Matterport Space source of the `<iframe>`.
- Wait until the `<iframe>` containing the Matterport Space loads.
- Connect the SDK to the to the Matterport Space.

```public/app.js
"use strict";

const sdkKey = "aaaaXaaaXaaaXaaaaXaaaXaaa"
const modelSid = "SxQL3iGyoDo";
const params = `m=${modelSid}&hr=0&play=1&qs=1`;

var iframe = document.getElementById('showcase');

document.addEventListener("DOMContentLoaded", () => {
    iframe.setAttribute('src', `https://my.matterport.com/show/?${params}`);
    iframe.addEventListener('load', () => showcaseLoader(iframe));
});

function showcaseLoader(iframe){
    try{
        window.MP_SDK.connect(iframe, sdkKey, '3.10')
            .then(loadedShowcaseHandler)
            .catch(console.error);
    } catch(e){
        console.error(e);
    }
}

function loadedShowcaseHandler(mpSdk){
    // ...
}
```
The URL parameters inside `params`:

- `applicationKey=aaaaXaaaXaaaXaaaaXaaaXaaa`: the SDK key for our application obtained in our [Matterport Account → Settings → Developer Tools, SDK Key Management](https://my.matterport.com/settings/account/devtools).
- `hr=0`: hide the __open highlights__ button that displays the __highlight reel__ at the bottom of the screen.
- `log=0`: disable logging?
- `m=SxQL3iGyoDo`: SID of the model to display.
- `play=1`: Set to 1 to automatically load the `<iframe>` when the page loads.
- `qs=1`: ?

### Actions
To declare an action for 3D Showcase to execute, declare:

- A callback to do something if the action was successful:

```JavaScript
function successCallback(message) { console.log(message); }
```
- A callback to do something if the action failed:

```JavaScript
function errorCallback(error) { console.error(error); }
```
- call the action with the necessary arguments:

```JavaScript
mpSdk.<moduleName>.<actionName>(<actionArguments>).then(successCallback)
.catch(errorCallback);
```
__Actions__ are listed in the __Functions__ section of the [Reference Docs](https://matterport.github.io/showcase-sdk/sdk_reference_summary) for each module.
##### Example: Adding a Mattertag to a model
To [create a Mattertag](https://matterport.github.io/showcase-sdk/sdk_creating_mattertags.html) with a label, a description, a stem, and an image, let's declare the following object:

```JavaScript
var myMattertag = {
    label: 'A Tool',
    description: 'A cute little vacuum cleaner!',
    media: {
        type: mpSdk.Mattertag.MediaType.PHOTO,
        src: 'https://media.4rgos.it/i/Argos/8086071_R_Z001A',
    },
    anchorPosition: { x: -3.156, y: 0.363, z: 3.082 },
    stemVector: { x: -0.822, y: -0.041, z: 0.568 }
};
```
⚠️ You cannot use local URLs as the media source for your images or videos!
※ To find an anchor position, stemVector and floorId for a Mattertag, the [Creating Mattertags](https://matterport.github.io/showcase-sdk/sdk_creating_mattertags.html) recommend to use the [Intersection Inspector Tool](https://matterport.github.io/showcase-sdk/sdk_intersection_inspector), but a much better and user friendly tool id the [__Transient Tags Editor__](https://matterport.github.io/showcase-sdk/sdk_transient_tags_editor.html)!
※ To present image or video media, Matterport use [embed.ly](https://embed.ly), it is recommended to verify the image or video url with the [embedly explore display tool](https://embed.ly/docs/explore/display/resize) before setting it as a media source.

Then call the [`add`](https://matterport.github.io/showcase-sdk/docs/sdk/reference/current/modules/mattertag.html#add) function from the [`Mattertag`](https://matterport.github.io/showcase-sdk/docs/sdk/reference/current/modules/mattertag.html) module:

```JavaScript
mpSdk.Mattertag.add(myMattertag)
    .then(function(mattertagId) {
        console.log(mattertagId);
        // ...
    })
    .catch(function(error) {
        console.error(error);
        // ...
    });
```
### Events
To listen to events from 3D Showcase, use the the global [`on`](https://matterport.github.io/showcase-sdk/docs/sdk/reference/current/index.html#on) function:

```JavaScript
showcase.on(<eventName>, function (<stateArguments>) {
    // what to do when this event happens
});
```
※ To stop listening to events from 3D Showcase, use the the global [`off`](https://matterport.github.io/showcase-sdk/docs/sdk/reference/current/index.html#off) function.

__Events__ are listed in the __Enumerations__ section of the [Reference Docs](https://matterport.github.io/showcase-sdk/sdk_reference_summary) for each module.
##### Example: Detecting a click event on a Mattertag
Call the global [`on`](https://matterport.github.io/showcase-sdk/docs/sdk/reference/current/index.html#on) function with the [`mpSdk.Mattertag.Event.CLICK`](https://matterport.github.io/showcase-sdk/docs/sdk/reference/current/enums/mattertag.event.html#click) argument and check the argument of the event handler callback:

```JavaScript
mpSdk.on(mpSdk.Mattertag.Event.CLICK,
    function (tagSid) {
        console.log('Mattertag ' + tagSid + ' was selected');
    }
);
```
## Customization
This section is about ways to enhance the interactivity of the Matterport SDK.
### Intercept Click Events on the iframe
When the user clicks on an `<iframe>`, it gets the __focus__ triggering a `blur` event on the current window.

⚠️ Note that after the first `click` event, the focus need to be returned to the `window` or the second `click` event will not trigger a `blur` event!

⚠️ We cannot tell the difference between left, middle, and right clicks!

Now we need to check that the click happened inside Matterport `<iframe>` ...
##### Method 1: the mouseover event
To know if the `click` event occured on our Matterport `<iframe>`, embed it in a `container`:

```HTML
    ...
    <body>
        <div id="container">
            <iframe id="showcase" ...></iframe>
        </div>
    </body>
</html>
```
And listen to the `mouseover` and `mouseout` events to keep track of the position of the mouse pointer in a state object:

```JavaScript
var stateObject = {
    isMouseOverIframe : false
}
window.addEventListener('blur',function(){
    if(stateObject.isMouseOverIframe){
        console.log('Yes! The click happened inside the iframe!');
        window.focus()
    }
});
document.getElementById('container').addEventListener('mouseover',function(){
    stateObject.isMouseOverIframe = true;
});
document.getElementById('container').addEventListener('mouseout',function(){
    stateObject.isMouseOverIframe = false;
});
```
⚠️ For mobile we would have to handle [Touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events) like `touchstart` and `touchend`.
##### Method 2: document.activeElement
To know if the `click` event occured on our Matterport `<iframe>`, check that the `document.activeElement` is the same as the element referenced by the `iframe` variable:

```JavaScript
window.addEventListener('blur',function(){	
    window.setTimeout(function () {	
        if (document.activeElement === iframe) {
            console.log('Yes! The click happened inside the iframe!');
            window.focus()
        }
    }, 0);
});
```
※ the 0 seconds `setTimeout` is used to make this work in __Firefox__.
### Insert Mattertags into the model visually
The source code of the [app](https://rmauldin.github.io/matterport/transient-tag-editor/app/) of the [Transient Tags Editor](https://matterport.github.io/showcase-sdk/sdk_transient_tags_editor.html) is privately hosted on __github__ (Maybe because it doesn't run perfectly on Firefox?), unlike the [source code](http://jsfiddle.net/guillermo_matterport/pftnhkuc) of the [Intersection Inspector](https://matterport.github.io/showcase-sdk/sdk_intersection_inspector.html) which is publicly hosted on __JSFiddle__.

But the user friendliness of the [Transient Tags Editor](https://matterport.github.io/showcase-sdk/sdk_transient_tags_editor.html) intrigued me and I wanted to understand the difference between the two tools Matterport SDK provides to find out Mattertags coordinates.

##### How the Intersection Inspector works
The [Intersection Inspector](https://matterport.github.io/showcase-sdk/sdk_intersection_inspector.html) uses a __timer__ to display a button at the position of the [`Pointer`](https://matterport.github.io/showcase-sdk/docs/sdkbundle/reference/current/modules/camera.html) when the user does not move the pointer for more than one second. The user can then click the button to see the __Mattertag__ coordinates and copy them manually ...

To achieve that, it needs the current [`Camera`](https://matterport.github.io/showcase-sdk/docs/sdkbundle/reference/current/modules/camera.html) position, which it obtains by observing the camera's [`pose`](https://matterport.github.io/showcase-sdk/docs/sdkbundle/reference/current/modules/camera.html#pose-1) property:

```JavaScript
    var poseCache;
    mpSdk.Camera.pose.subscribe(function(pose) {
        poseCache = pose;
    });
```
Also, it needs the current [`Pointer`](https://matterport.github.io/showcase-sdk/docs/sdkbundle/reference/current/modules/camera.html) position, which it obtains by observing the pointer's [`intersection`](https://matterport.github.io/showcase-sdk/docs/sdkbundle/reference/current/modules/pointer.html#intersection-1) property:

```JavaScript
    var intersectionCache;
    mpSdk.Pointer.intersection.subscribe(function(intersection) {
        intersectionCache = intersection;
        intersectionCache.time = new Date().getTime();
        button.style.display = 'none';
        buttonDisplayed = false;
    });
```
※ An `intersection` event is triggered the user moves the pointer, so we hide the button to make sure it is not displayed before the one second delay is over.

Then, a __timer__ is set up using [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) to display the button at the right time:

```JavaScript
    setInterval(() => {
        // ...
    }, 16);
```
In the timer callback, we check wether all the conditions to display the button are met ...

- First, check we have the information we need:

```JavaScript
    setInterval(() => {
        if (!intersectionCache || !poseCache) {
            return;
        }
        // ...
    }, 16);
```
- Then, check one second has elapsed since the last `intersection` event was received, or we wait the next tick to check again:

```JavaScript
    var delayBeforeShow = 1000;
    setInterval(() => {
        if (!intersectionCache || !poseCache) {
            return;
        }
        const nextShow = intersectionCache.time + delayBeforeShow;
        if (new Date().getTime() > nextShow) {
            // ...
        }
    }, 16);
```
- Finally, we check the button is not already being displayed:

```JavaScript
    var delayBeforeShow = 1000;
    var buttonDisplayed = false;
    setInterval(() => {
        if (!intersectionCache || !poseCache) {
            return;
        }
        const nextShow = intersectionCache.time + delayBeforeShow;
        if (new Date().getTime() > nextShow) {
            if (buttonDisplayed) {
                return;
            }
            // ...
        }
    }, 16);
```
Once the conditions are met, we can display the button using [`Conversion.worldToScreen()`](https://matterport.github.io/showcase-sdk/docs/sdkbundle/reference/current/modules/conversion.html#worldtoscreen) to get the screen coordinate of the pointer :

```JavaScript
    // ...
    setInterval(() => {
        // ...
        if (new Date().getTime() > nextShow) {
            // ...
            var size = {
                w: iframe.clientWidth,
                h: iframe.clientHeight,
            };
            var coord = mpSdk.Conversion.worldToScreen(intersectionCache.position, poseCache, size);
            button.style.left = `${coord.x - 25}px`;
            button.style.top = `${coord.y - 22}px`;
            button.style.display = 'block';
            buttonDisplayed = true;
        }
    }, 16);
```
The button is a simple HTML button hidden by default using `display: none;` and positioned relative to the body with `position: absolute;`.

When the user clicks the button, the current coordinates of the pointer are displayed in a `<div>` tag above the `<iframe>` and the button is hidden:

```JavaScript
    button.addEventListener('click', function() {
        text.innerHTML = `position: ${pointToString(intersectionCache.position)}\nnormal: ${pointToString(intersectionCache.normal)}\nfloorId: ${intersectionCache.floorId}`;
        button.style.display = 'none';
        iframe.focus();
    });
```
The coordinates are formatted using the following function:

```JavaScript
function pointToString(point) {
  var x = point.x.toFixed(3);
  var y = point.y.toFixed(3);
  var z = point.z.toFixed(3);

  return `{ x: ${x}, y: ${y}, z: ${z} }`;
}
```
Now, let's see how the easier-to-use and user-friendlier [Transient Tags Editor](https://matterport.github.io/showcase-sdk/sdk_transient_tags_editor.html) interface works ...
##### How the Transient Tag Editor works
The [Intersection Inspector](https://matterport.github.io/showcase-sdk/sdk_intersection_inspector.html) is enough if you just have a few __Mattertag__s to set permanently in a few models in your application. But if you need your users to set tags interactively in models, something like the [Transient Tags Editor](https://matterport.github.io/showcase-sdk/sdk_transient_tags_editor.html)'s GUI is a better starting point.

The main advantage of using the [Transient Tags Editor](https://matterport.github.io/showcase-sdk/sdk_transient_tags_editor.html) is that you can see how the `Mattertag` will be displayed before creating it and! That allows you to place the tag precisely without trial and error ...

To add a tag, you must click on the "Place New Tag" button to enter the "add tag" mode, then you can place one new tag anywhere you want. 

We will only focus on that aspect of the editor and produce a simplified code sample that only add tags:

- As the user move a tag along the pointer when in "add tag" mode, the first step is to create a new tag and place it. Let's create a function for that  using [`Mattertag.add()`](https://matterport.github.io/showcase-sdk/docs/sdkbundle/reference/current/modules/mattertag.html#add):

```JavaScript
    function addTag() {
        if(!tag){
            mpSdk.Mattertag.add([{
                label: "Matterport Tag",
                description: "",
                anchorPosition: {x: 0, y: 0, z: 0},
                stemVector: {x:0, y: 0, z: 0},
                color: {r: 1, g: 0, b: 0},
            }])
            .then((sid) => {
                tag = sid[0];
            })
            .catch( (e) => {
                console.error(e);
            })
        }
    }
```
- Then we will have to place the tag at a position near the pointer, and update its position as the user moves the pointer, so let's create a function for that using [`Mattertag.editPosition()`](https://matterport.github.io/showcase-sdk/docs/sdkbundle/reference/current/modules/mattertag.html#editposition):

```JavaScript
    function updateTagPos(newPos, newNorm=undefined, scale=undefined){
        if(!newPos) return;
        if(!scale) scale = .33;
        if(!newNorm) newNorm = {x: 0, y: 1, z: 0};

        mpSdk.Mattertag.editPosition(tag, {
            anchorPosition: newPos,
            stemVector: {
                x: scale * newNorm.x,
                y: scale * newNorm.y,
                z: scale * newNorm.z,
            }
        })
        .catch(e =>{
            console.error(e);
            tag = null;
        });
    }
```
As you can see the `updateTagPos()` function takes 3 parameters:

1. __newPos__: the new anchor position for the `Mattertag`.
2. __newNorm__: an optional new stem vector for the `Mattertag`.
3. __scale__: an optional new scale for the stem of the `Mattertag`.

- To update the tag position as the user moves the pointer, let's observe the pointer's [`intersection`](https://matterport.github.io/showcase-sdk/docs/sdkbundle/reference/current/modules/pointer.html#intersection-1) property to call `updateTagPos()`:  

```JavaScript
    mpSdk.Pointer.intersection.subscribe(intersectionData => {
        if(tag){
            if(intersectionData.object === 'intersectedobject.model' || intersectionData.object === 'intersectedobject.sweep'){
                updateTagPos(intersectionData.position, intersectionData.normal);
            }
        }
    });
```
- To place the new tag, the user simply clicks their mouse button, the [Transient Tags Editor](https://matterport.github.io/showcase-sdk/sdk_transient_tags_editor.html) provides its own version of the `document.activeElement` method for intercepting clicks on the `<iframe>` _(but does not work with __Firefox__ so the editor use a quite complex workaround)_:

```JavaScript
    function focusDetect(){
        const eventListener = window.addEventListener('blur', function() {
            if (document.activeElement === iframe) {
                placeTag(); //function you want to call on click
                setTimeout(function(){ window.focus(); }, 0);
            }
            window.removeEventListener('blur', eventListener );
        });
    }
```
But, we will use our version which works better with __Firefox__ _(But still stop working after the first click in __Firefox__ for whatever reason)_:

```JavaScript
    window.addEventListener('blur',function(){  
        window.setTimeout(function () { 
            if (document.activeElement === iframe) {
                placeTag(); //function you want to call on click
                window.focus()
                addTag();
            }
        }, 0);
    });
```
- Finally, let's the function that navigates to the new tag and __opens its billboard__, using[`Mattertag.navigateToTag()`](https://matterport.github.io/showcase-sdk/docs/sdkbundle/reference/current/modules/mattertag.html#navigatetotag)

```JavaScript
    function placeTag(){
        if(tag) mpSdk.Mattertag.navigateToTag(tag, mpSdk.Mattertag.Transition.INSTANT);
        tag = null;
    }
```

##### Simple Editor Code Sample
First, the complete JavaScript source code:

```JavaScript
"use strict";

const sdkKey = "aaaaXaaaXaaaXaaaXaaaXaaa"
const modelSid = "iL4RdJqi2yK";

let iframe;
let tag;

document.addEventListener("DOMContentLoaded", () => {
    iframe = document.querySelector('.showcase');
    iframe.setAttribute('src', `https://my.matterport.com/show/?m=${modelSid}&help=0&play=1&qs=1&gt=0&hr=0`);
    iframe.addEventListener('load', () => showcaseLoader(iframe));
});

function showcaseLoader(iframe){
    try{
        window.MP_SDK.connect(iframe, sdkKey, '3.10')
        .then(loadedShowcaseHandler)
        .catch(console.error);
    } catch(e){
        console.error(e);
    }
}

function loadedShowcaseHandler(mpSdk){
    addTag()

    function placeTag(){
        if(tag) mpSdk.Mattertag.navigateToTag(tag, mpSdk.Mattertag.Transition.INSTANT);
        tag = null;
    }

    window.addEventListener('blur',function(){  
        window.setTimeout(function () { 
            if (document.activeElement === iframe) {
                placeTag(); //function you want to call on click
                window.focus()
                addTag();
            }
        }, 0);
    });
    function updateTagPos(newPos, newNorm=undefined, scale=undefined){
        if(!newPos) return;
        if(!scale) scale = .33;
        if(!newNorm) newNorm = {x: 0, y: 1, z: 0};

        mpSdk.Mattertag.editPosition(tag, {
            anchorPosition: newPos,
            stemVector: {
                x: scale * newNorm.x,
                y: scale * newNorm.y,
                z: scale * newNorm.z,
            }
        })
        .catch(e =>{
            console.error(e);
            tag = null;
        });
    }

    mpSdk.Pointer.intersection.subscribe(intersectionData => {
        if(tag){
            if(intersectionData.object === 'intersectedobject.model' || intersectionData.object === 'intersectedobject.sweep'){
                updateTagPos(intersectionData.position, intersectionData.normal);
            }
        }
    });

    function addTag() {
        if(!tag){
            mpSdk.Mattertag.add([{
                label: "Matterport Tag",
                description: "",
                anchorPosition: {x: 0, y: 0, z: 0},
                stemVector: {x:0, y: 0, z: 0},
                color: {r: 1, g: 0, b: 0},
            }])
            .then((sid) => {
                tag = sid[0];
            })
            .catch( (e) => {
                console.error(e);
            })
        }
    }
} // loadedShowcaseHandler
```
The HTML source code:

```HTML
<!DOCTYPE html>
<html>
    <head>
        <title>Transient Tag Editor</title>
        <style>
            #showcase {
                width: 100%;
                height: 100vh;
            }
        </style>
        <script src="https://static.matterport.com/showcase-sdk/2.0.1-0-g64e7e88/sdk.js"></script>
        <script src="/js/app-editor.js" type="text/javascript" defer></script>
    </head>
    <body>
        <iframe id="showcase" frameborder="0"  allowFullScreen allow="xr-spatial-tracking"></iframe>
    </body>
</html>
```
It works!

## [Matterport SDK Bundle](https://matterport.github.io/showcase-sdk/sdkbundle_home.html)
To create our second app, this time we will use the __SDK Bundle__, still in (free) Sandbox access ...

First, download the the latest [SDK Bundle package](https://static.matterport.com/showcase-sdk/bundle/3.1.41.5-19-g5133fdd3e/showcase-bundle.zip).

Then, let's update our server to handle a second route for our second application ...
### The Web Server
Let's add a route for our bundle app:

```JavaScript:server.js
// ...
app.get('/bundle', (req, res) => {
    res.sendFile(`${__dirname}/public/index-bundle.html`);
});
app.listen(8000, () => {
    console.log('Application listening on port 8000!');
});
```
Then, restart the web server ...
### Second App: The Basics
Let's create another basic __Matterport__ app, as it is similar to the first one, we can copy the first app file and rename them ...
##### The HTML
First, let's copy the `index.html` file and rename it to `index-bundle.html`.

Change the filename of the JavaScript to `app-bundle.js`:

```public/index-bundle.html
...
        <script src="/app-bundle.js" defer></script>
...
```
##### The JavaScript
Now, let's copy the `app.js` file and rename it to `app-bundle.js`.

There, change the iframe sourceURL to `/bundle/showcase.html?${params}`:

```public/app-bundle.js
// ...
document.addEventListener("DOMContentLoaded", () => {
    iframe.setAttribute('src', `/bundle/showcase.html?${params}`);
    iframe.addEventListener('load', () => showcaseLoader(iframe));
});
// ...
```
And change the `connect` statement to `iframe.contentWindow.MP_SDK.connect`:

```public/app-bundle.js
// ...
function showcaseLoader(iframe){
    try{
        iframe.contentWindow.MP_SDK.connect(iframe, sdkKey, '3.10')
            .then(loadedShowcaseHandler)
            .catch(console.error);
    } catch(e){
        console.error(e);
    }
}
// ...
```
### The Scene
The __SDK Bundle__ provides an additional module to the standard SDK: the `Scene` module.
##### Lighting
A scene needs lights, otherwise the models are displayed black.

__Matterport__ provide a basic light component called `mp.lights` for this. Let's create a node in the scene using [`Scene.createNode()`](https://matterport.github.io/showcase-sdk/docs/sdkbundle/reference/current/modules/scene.html#createnode) and attach a component to it with [`INode.addComponent()`](https://matterport.github.io/showcase-sdk/docs/sdkbundle/reference/current/interfaces/scene.inode.html#addcomponent):

```JavaScript:loadedShowcaseHandler(mpSdk)
    const lights = await mpSdk.Scene.createNode();
    lights.addComponent('mp.lights');
    lights.start();
```
※ We call [`INode.start()`](https://matterport.github.io/showcase-sdk/docs/sdkbundle/reference/current/interfaces/scene.inode.html#start) on the component, so that it starts operating.
### The Models
The __SDK Bundle__ supports loading the following scene and model asset types:

- __dae__ with `mpSdk.Scene.Component.DAE_LOADER`
- __fbx__ with `mpSdk.Scene.Component.FBX_LOADER `
- __obj__ with `mpSdk.Scene.Component.OBJ_LOADER `
- __gltf__ with `mpSdk.Scene.Component.GLTF_LOADER `

Models are added to the scene as components like the lighting components:

```JavaScript:loadedShowcaseHandler(mpSdk)
    // ...
    const modelNode = await mpSdk.Scene.createNode();
    const fbxComponent = modelNode.addComponent(mpSdk.Scene.Component.DAE_LOADER, {
        url: 'https://gitcdn.link/repo/mrdoob/three.js/dev/examples/models/collada/stormtrooper/stormtrooper.dae',
    });
```
※ A few models are listed in the tutorial [__Working With Models__](https://matterport.github.io/showcase-sdk/sdkbundle_tutorials_models.html#select-a-model) from the __SDK Bundle__ documentation.
##### Scaling
Some models aren’t calibrated to real world units so you may have to adjust the model to be a more realistic size by scaling it:

```JavaScript:loadedShowcaseHandler(mpSdk)
    // ...
    fbxComponent.inputs.localScale = {
        x: 0.3,
        y: 0.3,
        z: 0.3
    };
```
##### Positioning
The default position is (0, 0, 0) but if we don't want our stormtrooper floating in the air, we need to lower it down:

```JavaScript:loadedShowcaseHandler(mpSdk)
    // ...
    modelNode.obj3D.position.set(0,-1.65,0);
```
##### Rotation
Our stormtrooper model faces away from the camera when the angle along the y axis is 0, and toward the camera when the angle is `𝜋`:

```JavaScript:loadedShowcaseHandler(mpSdk)
    // ...
    modelNode.obj3D.rotation.y = Math.PI
```
※ __Matterport__ uses radians to specify angles、 like __Three.js__.

##### Activation
Like for the lighting component we need to activate our model with [`INode.start()`](https://matterport.github.io/showcase-sdk/docs/sdkbundle/reference/current/interfaces/scene.inode.html#start):

```JavaScript:loadedShowcaseHandler(mpSdk)
    // ...
    modelNode.start();
```
### Second App: Wrap up
Let's finish our second app ...
##### Animation
To animate our model simply use the [`requestAnimationFrame()`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) function.

Let's make our stormtrooper slowly rotate while moving back and forth:

```JavaScript:loadedShowcaseHandler(mpSdk)
    // ...
    let step = -0.1
    let zPos = 0
    const tick = function() {
        requestAnimationFrame(tick);
        if (zPos>= 1.8) {
            step = -0.02
        } else if (zPos <= -0.4) {
            step = 0.02
        }
        zPos += step
        modelNode.obj3D.rotation.y += 0.02;
        modelNode.obj3D.position.set(0,-1.65,zPos);
    }
    tick();
```
##### The complete JavaScript code
Let's put it all together in the `app-bundle.js` file:

```JavaScript:app-bundle.js
"use strict";

const sdkKey = "aaaaXaaaXaaaXaaaaXaaaXaaa"
const modelSid = "22Ub5eknCVx";
const params = `m=${modelSid}&play=1&qs=1&log=0&applicationKey=${sdkKey}`;

var iframe = document.getElementById('showcase');

document.addEventListener("DOMContentLoaded", () => {
    iframe.setAttribute('src', `/bundle/showcase.html?${params}`);
    iframe.addEventListener('load', () => showcaseLoader(iframe));
});

function showcaseLoader(iframe){
    try{
        iframe.contentWindow.MP_SDK.connect(iframe, sdkKey, '3.10')
        .then(loadedShowcaseHandler)
        .catch(console.error);
    } catch(e){
        console.error(e);
    }
}

async function loadedShowcaseHandler(mpSdk){
  const lights = await mpSdk.Scene.createNode();
  lights.addComponent('mp.lights');
  lights.start();

  const modelNode = await mpSdk.Scene.createNode();
  const fbxComponent = modelNode.addComponent(mpSdk.Scene.Component.DAE_LOADER, {
    url: 'https://gitcdn.link/repo/mrdoob/three.js/dev/examples/models/collada/stormtrooper/stormtrooper.dae',
  });

  fbxComponent.inputs.localScale = {
    x: 0.3,
    y: 0.3,
    z: 0.3
  };

  modelNode.obj3D.position.set(0,-1.65,0);

  modelNode.obj3D.rotation.y = Math.PI

  modelNode.start();

  let step = -0.1
  let zPos = 0
  const tick = function() {
    requestAnimationFrame(tick);
    if (zPos>= 1.8) {
      step = -0.02
    } else if (zPos <= -0.4) {
      step = 0.02
    }
    zPos += step
    modelNode.obj3D.rotation.y += 0.02;
    modelNode.obj3D.position.set(0,-1.65,zPos);
  }
  tick();
}
```
## [Matterport Model API](https://support.matterport.com/hc/en-us/articles/360041976053)
In addition to the 2 SDKs we explored in this tutorial, __Matterport__ also provides a [__GraphQL API__ called __Model API__](https://support.matterport.com/hc/en-us/articles/360041976053) which use the __API Token__ and the differences with the SDKs are explained in the [__FAQ__](https://support.matterport.com/hc/en-us/articles/360041976053#faqs-0-5)

For people logged in Matterport Cloud (my.matterport.com) with admin credentials, an __interactive console__ allowing to experiment with the __GraphQL API__ on a limited basis is available along with the [__reference documentation__](https://api.matterport.com/docs/reference) 
## Complete Code
The complete code for all the samples is available on __github__:
[github.com/loic-meister-guild/pj-matterport-sdk-2021-tutorial](https://github.com/loic-meister-guild/pj-matterport-sdk-2021-tutorial)
## See Also
- [Node.js + Express Tutorial for 2021](https://catalins.tech/nodejs-express-tutorial-for-2021-getting-started-with-the-javascript-web-server-framework)
- [How to detect a click event on a cross domain iframe](https://gist.github.com/jaydson/1780598)

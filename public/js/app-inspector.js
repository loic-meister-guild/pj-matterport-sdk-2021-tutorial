"use strict";

const sdkKey = "PUT_YOUR_SDK_KEY_HERE"
const modelSid = "JGPnGQ6hosj";
const params = `m=${modelSid}&hr=0&play=1&title=0&qs=1`;

var iframe = document.getElementById('showcase');
var text = document.getElementById('text');
var button = document.getElementById('button');

document.addEventListener("DOMContentLoaded", () => {
    iframe.setAttribute('src', `https://my.matterport.com/show/?${params}`);
    iframe.addEventListener('load', () => showcaseLoader(iframe))
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

function pointToString(point) {
    var x = point.x.toFixed(3);
    var y = point.y.toFixed(3);
    var z = point.z.toFixed(3);

    return `{ x: ${x}, y: ${y}, z: ${z} }`;
}

function loadedShowcaseHandler(mpSdk) {
    var poseCache;
    mpSdk.Camera.pose.subscribe(function(pose) {
        poseCache = pose;
    });
  
    var intersectionCache;
    mpSdk.Pointer.intersection.subscribe(function(intersection) {
        intersectionCache = intersection;
        intersectionCache.time = new Date().getTime();
        button.style.display = 'none';
        buttonDisplayed = false;
    });
  
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
  
    button.addEventListener('click', function() {
        text.innerHTML = `position: ${pointToString(intersectionCache.position)}\nnormal: ${pointToString(intersectionCache.normal)}\nfloorId: ${intersectionCache.floorId}`;
        button.style.display = 'none';
        iframe.focus();
    });
}

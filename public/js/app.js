"use strict";

const sdkKey = "PUT_YOUR_SDK_KEY_HERE"
const modelSid = "SxQL3iGyoDo";
const params = `m=${modelSid}&hr=0&play=1&qs=0`;

var iframe = document.getElementById('showcase');
var container = document.getElementById('container')

document.addEventListener("DOMContentLoaded", () => {
    iframe.setAttribute('src', `https://my.matterport.com/show/?${params}`);
    iframe.addEventListener('load', () => showcaseLoader(iframe));
    var myConfObj = {
      iframeMouseOver : false
    }
    window.addEventListener('blur',function(){	
      window.setTimeout(function () {	
          if (document.activeElement === iframe) {
              console.log("click on iframe");
              window.focus()
          }
      }, 0);
  });
    
  container.addEventListener('mouseover',function(){
       myConfObj.iframeMouseOver = true;
    });
    container.addEventListener('mouseout',function(){
      myConfObj.iframeMouseOver = false;
  });
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
  var mattertags = [{
      label: 'A package',
      anchorPosition: { x: -7.074, y: 1.141, z: 5.439 },
      stemVector: { x: 0.038, y: 0.048, z: -0.998 }
    },{
      label: 'A Tool',
      description: 'A vacuum cleaner!',
      media: {
          type: mpSdk.Mattertag.MediaType.PHOTO,
          src: 'https://media.4rgos.it/i/Argos/8086071_R_Z001A',
        },
      anchorPosition: { x: -3.156, y: 0.363, z: 3.082 },
      stemVector: { x: -0.822, y: -0.041, z: 0.568 }
    }];
    
    mpSdk.Mattertag.add(mattertags).then(function(mattertagIds) {
      console.log(mattertagIds);
    });
}

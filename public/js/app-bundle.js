"use strict";

const sdkKey = "PUT_YOUR_SDK_KEY_HERE"
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


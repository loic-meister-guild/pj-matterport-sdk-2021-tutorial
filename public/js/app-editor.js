"use strict";

const sdkKey = "PUT_YOUR_SDK_KEY_HERE"
const modelSid = "iL4RdJqi2yK";

let iframe;
let tag;

document.addEventListener("DOMContentLoaded", () => {
    iframe = document.getElementById('showcase');
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
        //console.log(`intersectionData`,intersectionData)
        console.log(`sdk`,mpSdk.Model.getData())
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
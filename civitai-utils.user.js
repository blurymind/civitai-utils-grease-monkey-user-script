// ==UserScript==
// @name         Civitai Utils
// @namespace    blurymind
// @version      2025-12-10
// @description  copies to clipboard all loaded video and image src links
// @author       blurymind
// @match        https://civitai.com/*
// @include      https://civitai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=civitai.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant    GM_setClipboard
// ==/UserScript==

class Toast {
  constructor(message,color,time){
    this.message = message;
    this.color = color;
    this.time = time;
    this.element = null;
    var element = document.createElement('div');
    element.className = "toast-notification";
    this.element = element;
    var countElements = document.getElementsByClassName("toast-notification");
      element.style = `
   min-width: 400px;
  height:80px;
  background-color:white;
  border-radius: 10px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  top:0;
  left: 50%;
  margin-top:100px;
  margin-left:0;
  position:fixed;
  z-index:1;
  display:flex;
  flex-direction:row;
  margin-top: ${(countElements.length *100)}px;
  background-color:${this.color};
  z-index: 999999;
      `
    var mess = document.createElement("div");
    mess.className = "message-container";
    mess.style = `
      width:80%;
  padding-top:13px;
  padding-left: 20px;
  font-family:'Roboto';
  color:white;
    `
    mess.textContent = this.message;
    element.appendChild(mess);
    var close = document.createElement("div");
    close.className = "close-notification";
      close.style = `
      width:20%;
      `
    var icon = document.createElement("i");
    icon.className = "lni lni-close";
    icon.style = `
      padding-top:15px;
  padding-left:5px;
  font-weight:900;
  color:white;
  cursor:pointer;
    `
    close.appendChild(icon);
    element.append(close);
    document.body.appendChild(element);
    setTimeout(function() {
      element.remove();
    }, this.time);
    close.addEventListener("click",()=>{
      element.remove();
    })
  }
}
const ToastType = {
  Danger : "#eb3b5a",
  Warning: "#fdcb6e",
  Succes : "#00b894",
}

const copyLinks = (type='video/mp4')=>{
    if(type.startsWith('video')){
        const sources = [...document.querySelectorAll('source')]
        .filter(item=>item.type.startsWith('video/mp4'))
        .map(item=> item.src);
        console.log({sources})
        navigator.clipboard.writeText(sources.join(' ')).then(
            () => {
                 new Toast(`Copied visible ${type}: ${sources.length} links`,ToastType.Succes,2000);
                //alert(`Copied ${type} ${sources.length}`)
                /* clipboard successfully set */
            },
            () => {
                /* clipboard write failed */
            },
        );
    } else {
        const sources = [...document.querySelectorAll('img')]
        .map(item=> item.src);
        console.log({sources})
        navigator.clipboard.writeText(sources.join(' ')).then(
            () => {
                new Toast(`Copied visible ${type}: ${sources.length} links`,ToastType.Succes,2000);
                //alert(`Copied ${type} ${sources.length}`)
                /* clipboard successfully set */
            },
            () => {
                /* clipboard write failed */
            },
        );
    }
    //GM_setClipboard (sources.join(' '));
}

const createButton = (name='Copy src', type='video', offset = 10) => {
    const button = document.createElement('button');
    button.innerText = name;
    button.id = name;
    button.style = `
    position: absolute;
    z-index: 999;
    background: #000000e0;
    padding: 2px;
    border-radius: 3px;
    right: 10px;
    opacity: 0.7;
    top: ${100 + (offset|| 0)}px;
    `;

    button.addEventListener('click', ()=> {
        copyLinks(type)
    })
    document.getElementById('main').appendChild(button);
}

setTimeout(()=>{
    createButton('copy mp4 urls', 'video/mp4', 0)
    createButton('copy webm urls', 'video/webm', 30)
    createButton('copy image urls', 'image', 60)
}, 5000)

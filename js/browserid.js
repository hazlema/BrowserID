(function(){function c(a){var b=a.createElement("iframe");b.style.display="none",a.body.appendChild(b),b.src=d+"/communication_iframe";return b}var a=function(){function e(a){return Array.isArray?Array.isArray(a):a.constructor.toString().indexOf("Array")!=-1}function d(a,c,d){var e=b[c][d];for(var f=0;f<e.length;f++)e[f].win===a&&e.splice(f,1);b[c][d].length===0&&delete b[c][d]}function c(a,c,d,e){function f(b){for(var c=0;c<b.length;c++)if(b[c].win===a)return!0;return!1}var g=!1;if(c==="*")for(var h in b){if(!b.hasOwnProperty(h))continue;if(h==="*")continue;if(typeof b[h][d]=="object"){g=f(b[h][d]);if(g)break}}else b["*"]&&b["*"][d]&&(g=f(b["*"][d])),!g&&b[c]&&b[c][d]&&(g=f(b[c][d]));if(g)throw"A channel is already bound to the same window which overlaps with origin '"+c+"' and has scope '"+d+"'";typeof b[c]!="object"&&(b[c]={}),typeof b[c][d]!="object"&&(b[c][d]=[]),b[c][d].push({win:a,handler:e})}"use strict";var a=Math.floor(Math.random()*1000001),b={},f={},g=function(a){try{var c=JSON.parse(a.data);if(typeof c!="object"||c===null)throw"malformed"}catch(a){return}var d=a.source,e=a.origin,g,h,i;if(typeof c.method=="string"){var j=c.method.split("::");j.length==2?(g=j[0],i=j[1]):i=c.method}typeof c.id!="undefined"&&(h=c.id);if(typeof i=="string"){var k=!1;if(b[e]&&b[e][g])for(var h=0;h<b[e][g].length;h++)if(b[e][g][h].win===d){b[e][g][h].handler(e,i,c),k=!0;break}if(!k&&b["*"]&&b["*"][g])for(var h=0;h<b["*"][g].length;h++)if(b["*"][g][h].win===d){b["*"][g][h].handler(e,i,c);break}}else typeof h!="undefined"&&f[h]&&f[h](e,i,c)};window.addEventListener?window.addEventListener("message",g,!1):window.attachEvent&&window.attachEvent("onmessage",g);return{build:function(b){var g=function(a){if(b.debugOutput&&window.console&&window.console.log){try{typeof a!="string"&&(a=JSON.stringify(a))}catch(c){}console.log("["+j+"] "+a)}};if(!window.postMessage)throw"jschannel cannot run this browser, no postMessage";if(!window.JSON||!window.JSON.stringify||!window.JSON.parse)throw"jschannel cannot run this browser, no JSON parsing/serialization";if(typeof b!="object")throw"Channel build invoked without a proper object argument";if(!b.window||!b.window.postMessage)throw"Channel.build() called without a valid window argument";if(window===b.window)throw"target window is same as present window -- not allowed";var h=!1;if(typeof b.origin=="string"){var i;b.origin==="*"?h=!0:null!==(i=b.origin.match(/^https?:\/\/(?:[-a-zA-Z0-9_\.])+(?::\d+)?/))&&(b.origin=i[0].toLowerCase(),h=!0)}if(!h)throw"Channel.build() called with an invalid origin";if(typeof b.scope!="undefined"){if(typeof b.scope!="string")throw"scope, when specified, must be a string";if(b.scope.split("::").length>1)throw"scope may not contain double colons: '::'"}var j=function(){var a="",b="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";for(var c=0;c<5;c++)a+=b.charAt(Math.floor(Math.random()*b.length));return a}(),k={},l={},m={},n=!1,o=[],p=function(a,b,c){var d=!1,e=!1;return{origin:b,invoke:function(b,d){if(!m[a])throw"attempting to invoke a callback of a nonexistent transaction: "+a;var e=!1;for(var f=0;f<c.length;f++)if(b===c[f]){e=!0;break}if(!e)throw"request supports no such callback '"+b+"'";t({id:a,callback:b,params:d})},error:function(b,c){e=!0;if(!m[a])throw"error called for nonexistent message: "+a;delete m[a],t({id:a,error:b,message:c})},complete:function(b){e=!0;if(!m[a])throw"complete called for nonexistent message: "+a;delete m[a],t({id:a,result:b})},delayReturn:function(a){typeof a=="boolean"&&(d=a===!0);return d},completed:function(){return e}}},q=function(a,b,c){return window.setTimeout(function(){if(l[a]){var d="timeout ("+b+"ms) exceeded on method '"+c+"'";(1,l[a].error)("timeout_error",d),delete l[a],delete f[a]}},b)},r=function(a,c,d){if(typeof b.gotMessageObserver=="function")try{b.gotMessageObserver(a,d)}catch(h){g("gotMessageObserver() raised an exception: "+h.toString())}if(d.id&&c){if(k[c]){var i=p(d.id,a,d.callbacks?d.callbacks:[]);m[d.id]={};try{if(d.callbacks&&e(d.callbacks)&&d.callbacks.length>0)for(var j=0;j<d.callbacks.length;j++){var n=d.callbacks[j],o=d.params,q=n.split("/");for(var r=0;r<q.length-1;r++){var s=q[r];typeof o[s]!="object"&&(o[s]={}),o=o[s]}o[q[q.length-1]]=function(){var a=n;return function(b){return i.invoke(a,b)}}()}var t=k[c](i,d.params);!i.delayReturn()&&!i.completed()&&i.complete(t)}catch(h){var u="runtime_error",v=null;typeof h=="string"?v=h:typeof h=="object"&&(h&&e(h)&&h.length==2?(u=h[0],v=h[1]):typeof h.error=="string"&&(u=h.error,h.message?typeof h.message=="string"?v=h.message:h=h.message:v=""));if(v===null)try{v=JSON.stringify(h),typeof v=="undefined"&&(v=h.toString())}catch(w){v=h.toString()}i.error(u,v)}}}else d.id&&d.callback?!l[d.id]||!l[d.id].callbacks||!l[d.id].callbacks[d.callback]?g("ignoring invalid callback, id:"+d.id+" ("+d.callback+")"):l[d.id].callbacks[d.callback](d.params):d.id?l[d.id]?(d.error?(1,l[d.id].error)(d.error,d.message):d.result!==undefined?(1,l[d.id].success)(d.result):(1,l[d.id].success)(),delete l[d.id],delete f[d.id]):g("ignoring invalid response: "+d.id):c&&k[c]&&k[c](null,d.params)};c(b.window,b.origin,typeof b.scope=="string"?b.scope:"",r);var s=function(a){typeof b.scope=="string"&&b.scope.length&&(a=[b.scope,a].join("::"));return a},t=function(a,c){if(!a)throw"postMessage called with null message";var d=n?"post  ":"queue ";g(d+" message: "+JSON.stringify(a));if(!c&&!n)o.push(a);else{if(typeof b.postMessageObserver=="function")try{b.postMessageObserver(b.origin,a)}catch(e){g("postMessageObserver() raised an exception: "+e.toString())}b.window.postMessage(JSON.stringify(a),b.origin)}},u=function(a,c){g("ready msg received");if(n)throw"received ready message while in ready state.  help!";c==="ping"?j+="-R":j+="-L",v.unbind("__ready"),n=!0,g("ready msg accepted."),c==="ping"&&v.notify({method:"__ready",params:"pong"});while(o.length)t(o.pop());typeof b.onReady=="function"&&b.onReady(v)},v={unbind:function(a){if(k[a]){if(delete k[a])return!0;throw"can't delete method: "+a}return!1},bind:function(a,b){if(!a||typeof a!="string")throw"'method' argument to bind must be string";if(!b||typeof b!="function")throw"callback missing from bind params";if(k[a])throw"method '"+a+"' is already bound!";k[a]=b;return this},call:function(b){if(!b)throw"missing arguments to call function";if(!b.method||typeof b.method!="string")throw"'method' argument to call must be string";if(!b.success||typeof b.success!="function")throw"'success' callback missing from call";var c={},d=[],e=function(a,b){if(typeof b=="object")for(var f in b){if(!b.hasOwnProperty(f))continue;var g=a+(a.length?"/":"")+f;typeof b[f]=="function"?(c[g]=b[f],d.push(g),delete b[f]):typeof b[f]=="object"&&e(g,b[f])}};e("",b.params);var g={id:a,method:s(b.method),params:b.params};d.length&&(g.callbacks=d),b.timeout&&q(a,b.timeout,s(b.method)),l[a]={callbacks:c,error:b.error,success:b.success},f[a]=r,a++,t(g)},notify:function(a){if(!a)throw"missing arguments to notify function";if(!a.method||typeof a.method!="string")throw"'method' argument to notify must be string";t({method:s(a.method),params:a.params})},destroy:function(){d(b.window,b.origin,typeof b.scope=="string"?b.scope:""),window.removeEventListener?window.removeEventListener("message",r,!1):window.detachEvent&&window.detachEvent("onmessage",r),n=!1,k={},m={},l={},b.origin=null,o=[],g("channel destroyed"),j=""}};v.bind("__ready",u),setTimeout(function(){},0);return v}}}();WinChan=function(){function h(){var b=window.location,c=window.opener.frames,d=b.protocol+"//"+b.host;for(i=c.length-1;i>=0;i++)try{if(c[i].location.href.indexOf(d)===0&&c[i].name===a)return c[i]}catch(e){}return}function g(a){/^https?:\/\//.test(a)||(a=window.location.href);var b=/^(https?:\/\/[-_a-zA-Z\.0-9:]+)/.exec(a);return b?b[1]:a}function f(){return window.JSON&&window.JSON.stringify&&window.JSON.parse&&window.postMessage}function e(){try{return navigator.userAgent.indexOf("Fennec/")!=-1}catch(a){}return!1}function d(){var a=-1;if(navigator.appName=="Microsoft Internet Explorer"){var b=navigator.userAgent,c=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");c.exec(b)!=null&&(a=parseFloat(RegExp.$1))}return a>=8}function c(a,b,c){a.detachEvent?a.detachEvent("on"+b,c):a.removeEventListener&&a.removeEventListener(b,c,!1)}function b(a,b,c){a.attachEvent?a.attachEvent("on"+b,c):a.addEventListener&&a.addEventListener(b,c,!1)}var a="__winchan_relay_frame",j=d();return f()?{open:function(d,f){function p(a){try{var b=JSON.parse(a.data);b.a==="ready"?l.postMessage(n,k):b.a==="error"?f(b.d):b.a==="response"&&(c(window,"message",p),c(window,"unload",o),o(),f(null,b.d))}catch(a){}}function o(){i&&document.body.removeChild(i),i=undefined,m&&m.close(),m=undefined}if(!f)throw"missing required callback argument";var h;d.url||(h="missing required 'url' parameter"),d.relay_url||(h="missing required 'relay_url' parameter"),h&&setTimeout(function(){f(h)},0);if(!d.window_features||e())d.window_features=undefined;var i,k=g(d.url);if(k!==g(d.relay_url))return setTimeout(function(){f("invalid arguments: origin of url and relay_url must match")},0);var l;j&&(i=document.createElement("iframe"),i.setAttribute("src",d.relay_url),i.style.display="none",i.setAttribute("name",a),document.body.appendChild(i),l=i.contentWindow);var m=window.open(d.url,null,d.window_features);l||(l=m);var n=JSON.stringify({a:"request",d:d.params});b(window,"unload",o),b(window,"message",p);return{close:o,focus:function(){if(m)try{m.focus()}catch(a){}}}}}:{open:function(a,b,c,d){setTimeout(function(){d("unsupported browser")},0)}}}();var b=function(){function l(){return c}function k(){c=h()||i()||j()||g();return!c}function j(){if(!(window.JSON&&window.JSON.stringify&&window.JSON.parse))return"JSON"}function i(){if(!a.postMessage)return"POSTMESSAGE"}function h(){var b="localStorage"in a&&a.localStorage!==null;if(!b)return"LOCALSTORAGE"}function g(){return f()}function f(){var a=e(),b=a>-1&&a<8;if(b)return"IE_VERSION"}function e(){var a=-1;if(b.appName=="Microsoft Internet Explorer"){var c=b.userAgent,d=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");d.exec(c)!=null&&(a=parseFloat(RegExp.$1))}return a}function d(c,d){b=c,a=d}var a=window,b=navigator,c;return{setTestEnv:d,isSupported:k,getNoSupportReason:l}}();navigator.id||(navigator.id={});if(!navigator.id.getVerifiedEmail||navigator.id._getVerifiedEmailIsShimmed){var d="https://browserid.org",e=navigator.userAgent.indexOf("Fennec/")!=-1,f=e?undefined:"menubar=0,location=1,resizable=0,scrollbars=0,status=0,dialog=1,width=700,height=375",g;navigator.id.get=function(a,c){if(typeof a!="function")throw"navigator.id.get() requires a callback argument";if(c&&c.silent)h("getPersistentAssertion",{},function(b){a(b)},function(b,c){a(null)});else{if(g){try{g.focus()}catch(e){}return}if(!b.isSupported()){g=window.open(d+"/unsupported_dialog",null,f);return}g=WinChan.open({url:d+"/sign_in",relay_url:d+"/relay",window_features:f,params:{method:"get",params:c}},function(b,c){g=undefined,a(b?null:c?c:null)})}},navigator.id.getVerifiedEmail=function(a,b){if(b)throw"getVerifiedEmail doesn't accept options.  use navigator.id.get() instead.";navigator.id.get(a)},navigator.id.logout=function(a){h("logout",{},function(b){a(b)},function(){a(null)})};var h=function(b,e,f,g){function k(){j.destroy(),j=undefined,h.body.removeChild(i)}var h=window.document,i=c(h),j=a.build({window:i.contentWindow,origin:d,scope:"mozid_ni"});j.call({method:b,params:e,success:function(a){f&&f(a),k()},error:function(a,b){g&&g(a,b),k()}})};navigator.id._getVerifiedEmailIsShimmed=!0}})()
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('C=A I({L:K,6:{k:F.h(\'4\'),x:\'H/G.R\',y:\'C Q\'},T:3(6){7(6)1.N(6);1.B=z;1.8=i;1.M=z;1.D();1.u()},D:3(){1.6.k.O(\'P\',3(){7(1.8){1.5(\'4\');s.q.h.d(3(){})}a{1.5(\'p\');s.q.h.t(3(2){7(2){1.n(2)}a{1.5(\'4\')}}.f(1),{S:g})}}.f(1))},u:3(){1.5(\'p\');s.q.h.t(3(2){7(2){1.n(2)}a{1.5(\'4\')}}.f(1),{J:g})},5:3(m,w){U c=\'\',b=\'\',9=\'\';19(m){j\'p\':c=\'<1a 18="\'+1.6.x+\'">\';b=\'e-16\';9=\'17 1e...\';1.8=i;l;j\'4\':c=1.6.y;b=\'e-4\';9=\'E v 4\';1.8=i;l;j\'d\':c=w;b=\'e-d\';9=\'E v d\';1.8=g;l}1.6.k.r(\'1d\',b).r(\'1b\',9).r(\'1c\',c)},n:3(2){7(2){15=A Y.Z({X:\'e.V\',W:\'13\',14:\'2=\'+2,10:3(o){7(o.m==\'11\'){1.8=g;1.B=0;1.5(\'d\',o.1f)}a{1.5(\'4\')}}.f(1)}).12()}a{1.5(\'4\')}}});',62,78,'|this|assertion|function|login|setStatus|options|if|loggedIn|tooltip|else|css|content|logout|browserid|bind|true|id|false|case|loginElement|break|status|isValid||wait|navigator|set|window|get|isReturnVisitor|to|txt|waitImage|loginText|null|new|loginData|BrowserID|initializeEvents|Click|document|wait16|gfx|Class|silent|Options|Implements|Tip|setOptions|addEvent|click|Login|gif|allowPersistent|initialize|var|php|method|url|Request|JSON|onSuccess|okay|send|post|data|validate|image|Please|src|switch|img|title|html|class|Wait|email'.split('|'),0,{}))

// https://d3js.org/d3-time/ v1.0.11 Copyright 2019 Mike Bostock
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.d3=e.d3||{})}(this,function(e){"use strict";var t=new Date,n=new Date;function u(e,r,i,o){function s(t){return e(t=new Date(+t)),t}return s.floor=s,s.ceil=function(t){return e(t=new Date(t-1)),r(t,1),e(t),t},s.round=function(e){var t=s(e),n=s.ceil(e);return e-t<n-e?t:n},s.offset=function(e,t){return r(e=new Date(+e),null==t?1:Math.floor(t)),e},s.range=function(t,n,u){var i,o=[];if(t=s.ceil(t),u=null==u?1:Math.floor(u),!(t<n&&u>0))return o;do{o.push(i=new Date(+t)),r(t,u),e(t)}while(i<t&&t<n);return o},s.filter=function(t){return u(function(n){if(n>=n)for(;e(n),!t(n);)n.setTime(n-1)},function(e,n){if(e>=e)if(n<0)for(;++n<=0;)for(;r(e,-1),!t(e););else for(;--n>=0;)for(;r(e,1),!t(e););})},i&&(s.count=function(u,r){return t.setTime(+u),n.setTime(+r),e(t),e(n),Math.floor(i(t,n))},s.every=function(e){return e=Math.floor(e),isFinite(e)&&e>0?e>1?s.filter(o?function(t){return o(t)%e==0}:function(t){return s.count(0,t)%e==0}):s:null}),s}var r=u(function(){},function(e,t){e.setTime(+e+t)},function(e,t){return t-e});r.every=function(e){return e=Math.floor(e),isFinite(e)&&e>0?e>1?u(function(t){t.setTime(Math.floor(t/e)*e)},function(t,n){t.setTime(+t+n*e)},function(t,n){return(n-t)/e}):r:null};var i=r.range,o=6e4,s=6048e5,a=u(function(e){e.setTime(e-e.getMilliseconds())},function(e,t){e.setTime(+e+1e3*t)},function(e,t){return(t-e)/1e3},function(e){return e.getUTCSeconds()}),c=a.range,f=u(function(e){e.setTime(e-e.getMilliseconds()-1e3*e.getSeconds())},function(e,t){e.setTime(+e+t*o)},function(e,t){return(t-e)/o},function(e){return e.getMinutes()}),l=f.range,g=u(function(e){e.setTime(e-e.getMilliseconds()-1e3*e.getSeconds()-e.getMinutes()*o)},function(e,t){e.setTime(+e+36e5*t)},function(e,t){return(t-e)/36e5},function(e){return e.getHours()}),T=g.range,d=u(function(e){e.setHours(0,0,0,0)},function(e,t){e.setDate(e.getDate()+t)},function(e,t){return(t-e-(t.getTimezoneOffset()-e.getTimezoneOffset())*o)/864e5},function(e){return e.getDate()-1}),m=d.range;function M(e){return u(function(t){t.setDate(t.getDate()-(t.getDay()+7-e)%7),t.setHours(0,0,0,0)},function(e,t){e.setDate(e.getDate()+7*t)},function(e,t){return(t-e-(t.getTimezoneOffset()-e.getTimezoneOffset())*o)/s})}var y=M(0),C=M(1),U=M(2),h=M(3),F=M(4),D=M(5),Y=M(6),H=y.range,S=C.range,v=U.range,p=h.range,W=F.range,w=D.range,O=Y.range,k=u(function(e){e.setDate(1),e.setHours(0,0,0,0)},function(e,t){e.setMonth(e.getMonth()+t)},function(e,t){return t.getMonth()-e.getMonth()+12*(t.getFullYear()-e.getFullYear())},function(e){return e.getMonth()}),z=k.range,x=u(function(e){e.setMonth(0,1),e.setHours(0,0,0,0)},function(e,t){e.setFullYear(e.getFullYear()+t)},function(e,t){return t.getFullYear()-e.getFullYear()},function(e){return e.getFullYear()});x.every=function(e){return isFinite(e=Math.floor(e))&&e>0?u(function(t){t.setFullYear(Math.floor(t.getFullYear()/e)*e),t.setMonth(0,1),t.setHours(0,0,0,0)},function(t,n){t.setFullYear(t.getFullYear()+n*e)}):null};var b=x.range,j=u(function(e){e.setUTCSeconds(0,0)},function(e,t){e.setTime(+e+t*o)},function(e,t){return(t-e)/o},function(e){return e.getUTCMinutes()}),_=j.range,I=u(function(e){e.setUTCMinutes(0,0,0)},function(e,t){e.setTime(+e+36e5*t)},function(e,t){return(t-e)/36e5},function(e){return e.getUTCHours()}),P=I.range,q=u(function(e){e.setUTCHours(0,0,0,0)},function(e,t){e.setUTCDate(e.getUTCDate()+t)},function(e,t){return(t-e)/864e5},function(e){return e.getUTCDate()-1}),A=q.range;function B(e){return u(function(t){t.setUTCDate(t.getUTCDate()-(t.getUTCDay()+7-e)%7),t.setUTCHours(0,0,0,0)},function(e,t){e.setUTCDate(e.getUTCDate()+7*t)},function(e,t){return(t-e)/s})}var E=B(0),G=B(1),J=B(2),K=B(3),L=B(4),N=B(5),Q=B(6),R=E.range,V=G.range,X=J.range,Z=K.range,$=L.range,ee=N.range,te=Q.range,ne=u(function(e){e.setUTCDate(1),e.setUTCHours(0,0,0,0)},function(e,t){e.setUTCMonth(e.getUTCMonth()+t)},function(e,t){return t.getUTCMonth()-e.getUTCMonth()+12*(t.getUTCFullYear()-e.getUTCFullYear())},function(e){return e.getUTCMonth()}),ue=ne.range,re=u(function(e){e.setUTCMonth(0,1),e.setUTCHours(0,0,0,0)},function(e,t){e.setUTCFullYear(e.getUTCFullYear()+t)},function(e,t){return t.getUTCFullYear()-e.getUTCFullYear()},function(e){return e.getUTCFullYear()});re.every=function(e){return isFinite(e=Math.floor(e))&&e>0?u(function(t){t.setUTCFullYear(Math.floor(t.getUTCFullYear()/e)*e),t.setUTCMonth(0,1),t.setUTCHours(0,0,0,0)},function(t,n){t.setUTCFullYear(t.getUTCFullYear()+n*e)}):null};var ie=re.range;e.timeInterval=u,e.timeMillisecond=r,e.timeMilliseconds=i,e.utcMillisecond=r,e.utcMilliseconds=i,e.timeSecond=a,e.timeSeconds=c,e.utcSecond=a,e.utcSeconds=c,e.timeMinute=f,e.timeMinutes=l,e.timeHour=g,e.timeHours=T,e.timeDay=d,e.timeDays=m,e.timeWeek=y,e.timeWeeks=H,e.timeSunday=y,e.timeSundays=H,e.timeMonday=C,e.timeMondays=S,e.timeTuesday=U,e.timeTuesdays=v,e.timeWednesday=h,e.timeWednesdays=p,e.timeThursday=F,e.timeThursdays=W,e.timeFriday=D,e.timeFridays=w,e.timeSaturday=Y,e.timeSaturdays=O,e.timeMonth=k,e.timeMonths=z,e.timeYear=x,e.timeYears=b,e.utcMinute=j,e.utcMinutes=_,e.utcHour=I,e.utcHours=P,e.utcDay=q,e.utcDays=A,e.utcWeek=E,e.utcWeeks=R,e.utcSunday=E,e.utcSundays=R,e.utcMonday=G,e.utcMondays=V,e.utcTuesday=J,e.utcTuesdays=X,e.utcWednesday=K,e.utcWednesdays=Z,e.utcThursday=L,e.utcThursdays=$,e.utcFriday=N,e.utcFridays=ee,e.utcSaturday=Q,e.utcSaturdays=te,e.utcMonth=ne,e.utcMonths=ue,e.utcYear=re,e.utcYears=ie,Object.defineProperty(e,"__esModule",{value:!0})});
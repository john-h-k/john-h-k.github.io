/*
Fraction.js v4.1.2 23/05/2021
https://www.xarg.org/2014/03/rational-numbers-in-javascript/

Copyright (c) 2021, Robert Eisele (robert@xarg.org)
Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function(A){function n(a,c){var b=0,d=1,f=1,m=0,l=0,r=0,w=1,t=1,g=0,h=1,u=1,p=1;if(void 0!==a&&null!==a)if(void 0!==c)b=a,d=c,f=b*d;else switch(typeof a){case "object":"d"in a&&"n"in a?(b=a.n,d=a.d,"s"in a&&(b*=a.s)):0 in a?(b=a[0],1 in a&&(d=a[1])):x();f=b*d;break;case "number":0>a&&(f=a,a=-a);if(0===a%1)b=a;else if(0<a){1<=a&&(t=Math.pow(10,Math.floor(1+Math.log(a)/Math.LN10)),a/=t);for(;1E7>=h&&1E7>=p;)if(b=(g+u)/(h+p),a===b){1E7>=h+p?(b=g+u,d=h+p):p>h?(b=u,d=p):(b=g,d=h);break}else a>b?(g+=u,
    h+=p):(u+=g,p+=h),1E7<h?(b=u,d=p):(b=g,d=h);b*=t}else if(isNaN(a)||isNaN(c))d=b=NaN;break;case "string":h=a.match(/\d+|./g);null===h&&x();"-"===h[g]?(f=-1,g++):"+"===h[g]&&g++;if(h.length===g+1)l=q(h[g++],f);else if("."===h[g+1]||"."===h[g]){"."!==h[g]&&(m=q(h[g++],f));g++;if(g+1===h.length||"("===h[g+1]&&")"===h[g+3]||"'"===h[g+1]&&"'"===h[g+3])l=q(h[g],f),w=Math.pow(10,h[g].length),g++;if("("===h[g]&&")"===h[g+2]||"'"===h[g]&&"'"===h[g+2])r=q(h[g+1],f),t=Math.pow(10,h[g+1].length)-1,g+=3}else"/"===
    h[g+1]||":"===h[g+1]?(l=q(h[g],f),w=q(h[g+2],1),g+=3):"/"===h[g+3]&&" "===h[g+1]&&(m=q(h[g],f),l=q(h[g+2],f),w=q(h[g+4],1),g+=5);if(h.length<=g){d=w*t;f=b=r+d*m+t*l;break}default:x()}if(0===d)throw new B;e.s=0>f?-1:1;e.n=Math.abs(b);e.d=Math.abs(d)}function y(a){function c(){var d=Error.apply(this,arguments);d.name=this.name=a;this.stack=d.stack;this.message=d.message}function b(){}b.prototype=Error.prototype;c.prototype=new b;return c}function q(a,c){isNaN(a=parseInt(a,10))&&x();return a*c}function x(){throw new C;
    }function z(a){for(var c={},b=a,d=2,f=4;f<=b;){for(;0===b%d;)b/=d,c[d]=(c[d]||0)+1;f+=1+2*d++}b!==a?1<b&&(c[b]=(c[b]||0)+1):c[a]=(c[a]||0)+1;return c}function v(a,c){if(!a)return c;if(!c)return a;for(;;){a%=c;if(!a)return c;c%=a;if(!c)return a}}function k(a,c){if(!(this instanceof k))return new k(a,c);n(a,c);a=v(e.d,e.n);this.s=e.s;this.n=e.n/a;this.d=e.d/a}var e={s:1,n:0,d:1},B=k.DivisionByZero=y("DivisionByZero"),C=k.InvalidParameter=y("InvalidParameter");k.prototype={s:1,n:0,d:1,abs:function(){return new k(this.n,
    this.d)},neg:function(){return new k(-this.s*this.n,this.d)},add:function(a,c){n(a,c);return new k(this.s*this.n*e.d+e.s*this.d*e.n,this.d*e.d)},sub:function(a,c){n(a,c);return new k(this.s*this.n*e.d-e.s*this.d*e.n,this.d*e.d)},mul:function(a,c){n(a,c);return new k(this.s*e.s*this.n*e.n,this.d*e.d)},div:function(a,c){n(a,c);return new k(this.s*e.s*this.n*e.d,this.d*e.n)},clone:function(){return new k(this)},mod:function(a,c){if(isNaN(this.n)||isNaN(this.d))return new k(NaN);if(void 0===a)return new k(this.s*
    this.n%this.d,1);n(a,c);0===e.n&&0===this.d&&k(0,0);return new k(this.s*e.d*this.n%(e.n*this.d),e.d*this.d)},gcd:function(a,c){n(a,c);return new k(v(e.n,this.n)*v(e.d,this.d),e.d*this.d)},lcm:function(a,c){n(a,c);return 0===e.n&&0===this.n?new k:new k(e.n*this.n,v(e.n,this.n)*v(e.d,this.d))},ceil:function(a){a=Math.pow(10,a||0);return isNaN(this.n)||isNaN(this.d)?new k(NaN):new k(Math.ceil(a*this.s*this.n/this.d),a)},floor:function(a){a=Math.pow(10,a||0);return isNaN(this.n)||isNaN(this.d)?new k(NaN):
    new k(Math.floor(a*this.s*this.n/this.d),a)},round:function(a){a=Math.pow(10,a||0);return isNaN(this.n)||isNaN(this.d)?new k(NaN):new k(Math.round(a*this.s*this.n/this.d),a)},inverse:function(){return new k(this.s*this.d,this.n)},pow:function(a,c){n(a,c);if(1===e.d)return 0>e.s?new k(Math.pow(this.s*this.d,e.n),Math.pow(this.n,e.n)):new k(Math.pow(this.s*this.n,e.n),Math.pow(this.d,e.n));if(0>this.s)return null;var b=z(this.n),d=z(this.d),f=1,m=1,l;for(l in b)if("1"!==l){if("0"===l){f=0;break}b[l]*=
    e.n;if(0===b[l]%e.d)b[l]/=e.d;else return null;f*=Math.pow(l,b[l])}for(l in d)if("1"!==l){d[l]*=e.n;if(0===d[l]%e.d)d[l]/=e.d;else return null;m*=Math.pow(l,d[l])}return 0>e.s?new k(m,f):new k(f,m)},equals:function(a,c){n(a,c);return this.s*this.n*e.d===e.s*e.n*this.d},compare:function(a,c){n(a,c);var b=this.s*this.n*e.d-e.s*e.n*this.d;return(0<b)-(0>b)},simplify:function(a){function c(m){return 1===m.length?new k(m[0]):c(m.slice(1)).inverse().add(m[0])}if(isNaN(this.n)||isNaN(this.d))return this;
    var b=this.abs().toContinued();a=a||.001;for(var d=0;d<b.length;d++){var f=c(b.slice(0,d+1));if(f.sub(this.abs()).abs().valueOf()<a)return f.mul(this.s)}return this},divisible:function(a,c){n(a,c);return!(!(e.n*this.d)||this.n*e.d%(e.n*this.d))},valueOf:function(){return this.s*this.n/this.d},toFraction:function(a){var c,b="",d=this.n,f=this.d;0>this.s&&(b+="-");1===f?b+=d:(a&&0<(c=Math.floor(d/f))&&(b=b+c+" ",d%=f),b=b+d+"/",b+=f);return b},toLatex:function(a){var c,b="",d=this.n,f=this.d;0>this.s&&
    (b+="-");1===f?b+=d:(a&&0<(c=Math.floor(d/f))&&(b+=c,d%=f),b=b+"\\frac{"+d+"}{"+f,b+="}");return b},toContinued:function(){var a=this.n,c=this.d,b=[];if(isNaN(a)||isNaN(c))return b;do{b.push(Math.floor(a/c));var d=a%c;a=c;c=d}while(1!==a);return b},toString:function(a){var c=this.n,b=this.d;if(isNaN(c)||isNaN(b))return"NaN";var d;a:{for(d=b;0===d%2;d/=2);for(;0===d%5;d/=5);if(1===d)d=0;else{for(var f=10%d,m=1;1!==f;m++)if(f=10*f%d,2E3<m){d=0;break a}d=m}}a:{f=1;m=10;for(var l=d,r=1;0<l;m=m*m%b,l>>=
    1)l&1&&(r=r*m%b);m=r;for(l=0;300>l;l++){if(f===m){m=l;break a}f=10*f%b;m=10*m%b}m=0}f=-1===this.s?"-":"";f+=c/b|0;(c=c%b*10)&&(f+=".");if(d){for(a=m;a--;)f+=c/b|0,c%=b,c*=10;f+="(";for(a=d;a--;)f+=c/b|0,c%=b,c*=10;f+=")"}else for(a=a||15;c&&a--;)f+=c/b|0,c%=b,c*=10;return f}};"function"===typeof define&&define.amd?define([],function(){return k}):"object"===typeof exports?(Object.defineProperty(k,"__esModule",{value:!0}),k["default"]=k,k.Fraction=k,module.exports=k):A.Fraction=k})(this);
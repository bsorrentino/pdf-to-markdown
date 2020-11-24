parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"FrYy":[function(require,module,exports) {
"use strict";var t=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.globals=void 0;const e=require("assert"),s=t(require("path")),r=t(require("fs")),i=require("util"),o=i.promisify(r.default.access),a=i.promisify(r.default.readFile),n=i.promisify(r.default.writeFile);class c{constructor(){this._fontMap=new Map,this._textHeights=new Map,this.isFillerEnabled=!1,this._stats=null,this.outDir=s.default.join(process.cwd(),"out"),this.imageUrlPrefix=process.env.IMAGE_URL||""}addFont(t,s){e(s,`font ${t} is not valid ${s}`);let r=this._fontMap.get(t)||Object.assign(Object.assign({},s),{occurrence:0});r.occurrence++,this._fontMap.set(t,r)}getFont(t){return this._fontMap.get(t)}addTextHeight(t){let e=this._textHeights.get(t)||0;this._textHeights.set(t,++e)}get stats(){if(!this._stats){const t=()=>{const[t,e]=Array.from(this._fontMap.entries()).reduce(([t,e],[s,r])=>r.occurrence>e.occurrence?[s,r]:[t,e],["",{occurrence:0}]);return t},e=()=>Array.from(this._textHeights.keys()).reduce((t,e)=>e>t?e:t),s=()=>{const[t,e]=Array.from(this._textHeights.entries()).reduce(([t,e],[s,r])=>r>e?[s,r]:[t,e],[0,-1]);return t};this._stats={maxTextHeight:e(),maxHeightFont:null,mostUsedFont:t(),mostUsedTextHeight:s(),textHeigths:Array.from(this._textHeights.keys()).sort((t,e)=>e-t),mostUsedTextDistanceY:-1}}return this._stats}async loadLocalFonts(t){try{await o(t)}catch(e){return void console.warn(`WARN: file ${t} doesn't exists!`)}try{const s=await a(t),r=JSON.parse(s.toString());Object.entries(r).forEach(([t,e])=>this.addFont(t,e))}catch(e){console.warn(`WARN: error loading and evaluating ${t}! - ${e.message}`)}}async saveFonts(t){try{return await o(t),void console.warn(`WARN: file ${t} already exists!`)}catch(e){}try{const s={},r=Array.from(this._fontMap.entries()).sort((t,e)=>t[1].occurrence-e[1].occurrence).reduce((t,e)=>(t[e[0]]=e[1],t),s);await n(t,JSON.stringify(r))}catch(e){console.warn(`WARN: error writing ${t}! - ${e.message}`)}}}exports.globals=new c;
},{}],"K2lX":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.writePageAsImage=exports.writePageImage=void 0;const a=require("canvas"),t=require("console"),r=e(require("fs")),s=e(require("path")),i=require("util"),n=e(require("jimp")),o=require("./pdf2md.global");var c;!function(e){e[e.GRAYSCALE_1BPP=1]="GRAYSCALE_1BPP",e[e.RGB_24BPP=2]="RGB_24BPP",e[e.RGBA_32BPP=3]="RGBA_32BPP"}(c||(c={}));const d=i.promisify(r.default.writeFile);async function u(e,a){try{let u=0;switch(e.kind){case c.RGB_24BPP:u=3;break;case c.RGBA_32BPP:u=4;break;case c.GRAYSCALE_1BPP:t.assert(`kind ${e.kind} is not supported yet!`),u=1;break;default:t.assert(`kind ${e.kind} is not supported at all!`)}const l=new n.default(e.width,e.height),v=e.width*u;for(var r=0;r<e.width;r++)for(var i=0;i<e.height;i++){const a=i*v+r*u,t=e.data[a],s=e.data[a+1],o=e.data[a+2],c=3==u?255:e.data[a+3],d=n.default.rgbaToInt(t,s,o,c);l.setPixelColor(d,r,i)}l.write(s.default.join(o.globals.outDir,`${a}.png`))}catch(d){console.error(`Error:  ${d}`)}}exports.writePageImage=u;class l{create(e,r){t.assert(e>0&&r>0,"Invalid canvas size");var s=a.createCanvas(e,r),i=s.getContext("2d");return{canvas:s,context:i}}reset(e,a,r){t.assert(e.canvas,"Canvas is not specified"),t.assert(a>0&&r>0,"Invalid canvas size"),e.canvas.width=a,e.canvas.height=r}destroy(e){t.assert(e.canvas,"Canvas is not specified"),e.canvas.width=0,e.canvas.height=0}}async function v(e){const a=e.getViewport({scale:1}),t=new l,r=t.create(a.width,a.height),i={canvasContext:r.context,viewport:a,canvasFactory:t};await e.render(i).promise;const n=r.canvas.toBuffer();await d(s.default.join(o.globals.outDir,`page-${e.pageNumber}.png`),n)}exports.writePageAsImage=v;
},{"./pdf2md.global":"FrYy"}],"FCxD":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.EnhancedWord=void 0;const t=require("./pdf2md.global"),e=" ¶ ";class i{constructor(t){this.x=t.x,this.y=t.y,this.width=t.width,this.height=t.height,this.text=t.text,this.font=t.font}appendWord(i,h){let s=!1;const r=this.x+this.width,o=r<i.x,n=this.height===i.height&&this.font===i.font,d=i.x-r,a=0===i.text.trim().length;return n?(o&&!a&&t.globals.isFillerEnabled?(this.text+=e.concat(i.text),this.width+=i.width+d):(this.text+=i.text,this.width+=i.width),s=!0):h&&o&&!a&&t.globals.isFillerEnabled&&(this.text+=e.concat(i.text),this.width+=i.width+d),s}addTransformer(t){if(this._transformer)return!1;this._transformer=t}toMarkdown(){return this._transformer?this._transformer(this.text):this.text}}exports.EnhancedWord=i;
},{"./pdf2md.global":"FrYy"}],"GVVa":[function(require,module,exports) {
"use strict";var t=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.processPage=exports.Page=exports.Row=void 0;const e=t(require("assert")),s=require("pdfjs-dist"),r=require("./pdf2md.global"),n=require("./pdf2md.image"),a=require("./pdf2md.model");class i{constructor(){this.lines=Array()}appendRow(t){var e;if(t.containsImages){null===(e=t.images)||void 0===e||e.map((t,e)=>{this.lines.push({y:null==t?void 0:t.y,width:null==t?void 0:t.width,x:null==t?void 0:t.x,height:null==t?void 0:t.height,image:(null==t?void 0:t.url)||"undefined"})})}if(t.containsWords){const e=t.enhancedText.map((t,e)=>{const s=t.text,r={height:t.height,image:void 0,text:s,font:t.font};return 0==e?Object.assign({y:t.y,width:t.width,x:t.x},r):Object.assign({width:t.width,x:t.x},r)});this.lines.push(...e)}}}class o{constructor(t){this.y=t.y,this._words=t.words,this._images=t.images,this._updateEnhancedText()}get containsWords(){return void 0!==this._words}addWord(t){var e;null===(e=this._words)||void 0===e||e.push(t),this._updateEnhancedText()}get containsImages(){return void 0!==this._images}addImage(t){var e;null===(e=this._images)||void 0===e||e.push(t)}_updateEnhancedText(){if(!this._words||0==this._words.length)return;const t={lastIndex:-1,result:Array()};this._etextArray=this._words.reduce((t,e,s,r)=>{if(t.lastIndex<0)t.result.push(new a.EnhancedWord(e)),t.lastIndex=0;else{const n=s===r.length-1;t.result[t.lastIndex].appendWord(e,n)||(t.result.push(new a.EnhancedWord(e)),t.lastIndex++)}return t},t).result}get enhancedText(){return this._etextArray}get images(){return this._images}containsTextWithHeight(t){return e.default(this._etextArray,"text array is undefined!"),this._etextArray.findIndex(e=>e.height==t)>=0}}exports.Row=o;class d{constructor(){this.rows=Array()}process(t){return"text"in t&&this.processWord(t),"url"in t&&this.processImage(t),this}processImage(t){let e,s=this.rows.findIndex(e=>e.y==t.y);return s<0?(e=new o({y:t.y,images:Array()}),this.rows.push(e)):e=this.rows[s],e.addImage(t),this}processWord(t){let e,s=this.rows.findIndex(e=>e.y===t.y);return s<0?(e=new o({y:t.y,words:Array()}),this.rows.push(e)):e=this.rows[s],e.containsWords&&e.addWord(t),this}consoleLog(){const t=new i;this.rows.forEach(e=>t.appendRow(e)),console.table(t.lines)}}function h(t,e){return t.concat(e)}async function u(t){const a=await t.getOperatorList();let i=null;const o=Array();a.fnArray.forEach(async(d,h)=>{let u=a.argsArray[h];switch(d){case s.OPS.setFont:const l=u[0];let g;try{(g=t.objs.get(l))&&r.globals.addFont(l,g)}catch(c){r.globals.addFont(l,{name:""})}break;case s.OPS.transform:e.default(h<a.argsArray.length,`index ${h} exceed the argsArray size ${a.argsArray.length}`),i=u;break;case s.OPS.paintJpegXObject:case s.OPS.paintImageXObject:const p={x:0,y:0};i&&(p.x=i?Math.round(i[4]):0,p.y=i?Math.round(i[5]):0);const x=u[0],w=t.objs.get(x);w&&(await n.writePageImage(w,x,r.globals),o.push({y:p.y,x:p.x,width:w.width,height:w.height,url:x})),i=null}});const u=t.getViewport({scale:1});return h((await t.getTextContent()).items.map(t=>{const e=s.Util.transform(u.transform,t.transform),n=Math.sqrt(e[2]*e[2]+e[3]*e[3]),a=t.height/n,i={x:Math.round(t.transform[4]),y:Math.round(t.transform[5]),width:Math.round(t.width),height:Math.round(a<=1?t.height:a)};return r.globals.addTextHeight(i.height),Object.assign({text:t.str,font:t.fontName},i)}),o).sort((t,e)=>{const s=e.y-t.y;return 0===s?t.x-e.x:s}).reduce((t,e)=>t.process(e),new d)}exports.Page=d,exports.processPage=u;
},{"./pdf2md.global":"FrYy","./pdf2md.image":"K2lX","./pdf2md.model":"FCxD"}],"WThc":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.toMarkdown=exports.isHeadline=void 0;const e=require("assert"),t=require("enumify"),n=require("./pdf2md.global");class o extends t.Enumify{constructor(e){super(),this.toText=e.toText}}function s(e){return e&&2==e.enumKey.length&&"H"===e.enumKey[0]}o.H1=new o({toText:e=>`# ${e}`}),o.H2=new o({toText:e=>`## ${e}`}),o.H3=new o({toText:e=>`### ${e}`}),o.H4=new o({toText:e=>`#### ${e}`}),o.H5=new o({toText:e=>`##### ${e}`}),o.H6=new o({toText:e=>`###### ${e}`}),o._=o.closeEnum(),exports.isHeadline=s;const r=(e,t,n)=>{n||(n=t);const o=/^(.+[^\s])(\s*)$/.exec(e);return o?`${t}${o[1]}${n}${o[2]}`:"null"};class a extends t.Enumify{constructor(e){super(),this.toText=e}}function c(t){const n=o.enumValues.find(e=>e.enumKey==`H${t}`);return e(n,`Unsupported headline level: ${t} (supported are 1-6)`),n}function d(t){if(1==t.enhancedText.length){const o=n.globals.stats.mostUsedTextHeight,s=t.enhancedText[0];if(s.height!=o||s.font!=n.globals.stats.mostUsedFont){const t=n.globals.stats.textHeigths.findIndex(e=>e==s.height);e(t>=0,`height ${s.height} not present in textHeights stats!`);const o=c(t+1);s.addTransformer(o.toText)}}}function i(e){e.enhancedText.forEach(e=>{const t=e.font,o=n.globals.getFont(t);if(o&&null!=o.name&&t!=n.globals.stats.mostUsedFont){const t=o.name.toLowerCase(),s=()=>t.includes("bold"),r=()=>t.includes("oblique")||t.includes("italic"),c=()=>t.includes("monospace")||t.includes("code");s()&&r()?e.addTransformer(a.BOLD_OBLIQUE.toText):s()?e.addTransformer(a.BOLD.toText):r()?e.addTransformer(a.OBLIQUE.toText):c()?e.addTransformer(a.MONOSPACE.toText):t===n.globals.stats.maxHeightFont&&e.addTransformer(a.BOLD_OBLIQUE.toText)}})}function l(e){return e.rows.reduce((e,t,o)=>{let s="";return t.images&&(s=t.images.reduce((e,t)=>e.concat(`![${t.url}](${n.globals.imageUrlPrefix}${t.url}.png "")`),"")),t.containsWords&&(d(t),i(t),s=t.enhancedText.reduce((e,t)=>e.concat(t.toMarkdown()),"")),e.concat(s).concat("\n")},"")}exports.default=a,a.BOLD=new a(e=>r(e,"**")),a.OBLIQUE=new a(e=>r(e,"_")),a.BOLD_OBLIQUE=new a(e=>r(e,"**_","_**")),a.MONOSPACE=new a(e=>r(e,"`")),a._=a.closeEnum(),exports.toMarkdown=l;
},{"./pdf2md.global":"FrYy"}],"OTOl":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.pdfToMarkdown=void 0,require("pdfjs-dist/es5/build/pdf.js");const t=e(require("fs")),o=e(require("path")),a=require("util"),s=require("pdfjs-dist"),r=require("./pdf2md.page"),d=require("./pdf2md.markdown"),i=require("./pdf2md.global"),l="../../../node_modules/pdfjs-dist/cmaps/",n=!0,u=a.promisify(t.default.readFile),c=a.promisify(t.default.writeFile);async function f(e,t={}){try{const f=o.default.basename(e,".pdf"),p=o.default.join(i.globals.outDir,`${f}.fonts.json`);i.globals.loadLocalFonts(p);const g=new Uint8Array(await u(e)),m=await s.getDocument({data:g,cMapUrl:l,cMapPacked:n}).promise,b=m.numPages,w=Array(b);for(let e=1;e<=b;e++){const t=await m.getPage(e),o=await r.processPage(t);w.push(o)}const j=w.map(e=>d.toMarkdown(e)).reduce((e,t)=>e.concat(t),"");await c(o.default.join(i.globals.outDir,"out.md"),j),i.globals.saveFonts(p),t.debug&&w.forEach(e=>e.consoleLog()),t.stats&&(console.table([i.globals.stats]),console.log(i.globals.stats.textHeigths))}catch(a){console.log(a)}}exports.pdfToMarkdown=f;
},{"./pdf2md.page":"GVVa","./pdf2md.markdown":"WThc","./pdf2md.global":"FrYy"}],"QCba":[function(require,module,exports) {
"use strict";var a=this&&this.__importDefault||function(a){return a&&a.__esModule?a:{default:a}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.run=void 0,require("pdfjs-dist/es5/build/pdf.js");const t=a(require("fs")),e=require("util"),r=require("pdfjs-dist"),o=require("./pdf2md.image"),i=require("./pdf2md.global"),n="../../../node_modules/pdfjs-dist/cmaps/",s=!0,d=e.promisify(t.default.readFile),p=e.promisify(t.default.access),c=e.promisify(t.default.mkdir);async function u(a){l.assert(a,"provided path is not valid");try{await p(a)}catch(t){console.log(`folder ${a} doesn't exist, try to create`),await c(a)}}async function f(a){try{const e=new Uint8Array(await d(a)),i=await r.getDocument({data:e,cMapUrl:n,cMapPacked:s}).promise,p=i.numPages;for(let a=1;a<=p;a++){const t=await i.getPage(a),e=await t.getOperatorList();for(let a=0;a<e.fnArray.length;a++)if(e.fnArray[a]==r.OPS.paintJpegXObject||e.fnArray[a]==r.OPS.paintImageXObject){const r=e.argsArray[a][0],i=t.objs.get(r);await o.writePageImage(i,r)}}}catch(t){console.log(t)}}async function m(a){try{const e=new Uint8Array(await d(a)),i=await r.getDocument({data:e,cMapUrl:n,cMapPacked:s}).promise,p=i.numPages;for(let a=1;a<=p;a++){const t=await i.getPage(a);await o.writePageAsImage(t)}}catch(t){console.log(t)}}const g=require("commander"),l=require("console"),w=require("./pdf2md.main");async function y(){g.program.version("0.0.1").name("pdftools").option("-o, --outdir [folder]","output folder","out");g.program.command("pdfximages <pdf>").description("extract images (as png) from pdf and save it to the given folder").alias("pxi").action((a,t)=>(i.globals.outDir=t.parent.outdir,f(a)));g.program.command("pdf2images <pdf>").description("create an image (as png) for each pdf page").alias("p2i").action(async(a,t)=>(await u(t.parent.outdir),i.globals.outDir=t.parent.outdir,m(a)));g.program.command("pdf2md <pdf>").description("convert pdf to markdown format.").alias("p2md").option("--stats","print stats information").option("--debug","print debug information").action(async(a,t)=>{await u(t.parent.outdir),i.globals.outDir=t.parent.outdir;const e={debug:t.debug,stats:t.stats};await w.pdfToMarkdown(a,e)});return g.program.on("--help",()=>{g.program.commands.forEach(a=>{console.log("========================================================="),a.outputHelp()}),console.log("=========================================================")}),await g.program.parseAsync(process.argv)}exports.run=y;
},{"./pdf2md.image":"K2lX","./pdf2md.global":"FrYy","./pdf2md.main":"OTOl"}]},{},["QCba"], null)
//# sourceMappingURL=/index.js.map
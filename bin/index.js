<<<<<<< HEAD
parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"FrYy":[function(require,module,exports) {
"use strict";var t=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.globals=void 0;const e=require("assert"),s=t(require("path")),r=t(require("fs")),i=require("util"),o=i.promisify(r.default.access),n=i.promisify(r.default.readFile),a=i.promisify(r.default.writeFile);class c{constructor(){this._fontMap=new Map,this._textHeights=new Map,this._imageUrlPrefix=process.env.IMAGE_URL||"",this._options={filler:!1,debug:!1,stats:!1},this._stats=null,this.outDir=s.default.join(process.cwd(),"out")}get useImageDuplicateDetection(){return!0}get options(){return this._options}addFont(t,s){e(s,`font ${t} is not valid ${s}`);let r=this._fontMap.get(t)||Object.assign(Object.assign({},s),{occurrence:0});r.occurrence++,this._fontMap.set(t,r)}getFont(t){return this._fontMap.get(t)}getFontIdByName(t){for(const[e,s]of this._fontMap.entries())if(s.name==t)return e}addTextHeight(t){let e=this._textHeights.get(t)||0;this._textHeights.set(t,++e)}get stats(){if(!this._stats){const t=()=>{const[t,e]=Array.from(this._fontMap.entries()).reduce(([t,e],[s,r])=>r.occurrence>e.occurrence?[s,r]:[t,e],["",{occurrence:0}]);return t},e=()=>Array.from(this._textHeights.keys()).reduce((t,e)=>e>t?e:t),s=()=>{const[t,e]=Array.from(this._textHeights.entries()).reduce(([t,e],[s,r])=>r>e?[s,r]:[t,e],[0,-1]);return t};this._stats={maxTextHeight:e(),maxHeightFont:null,mostUsedFont:t(),mostUsedTextHeight:s(),textHeigths:Array.from(this._textHeights.keys()).sort((t,e)=>e-t),mostUsedTextDistanceY:-1}}return this._stats}async loadLocalFonts(t){try{await o(t)}catch(e){return void console.warn(`WARN: file ${t} doesn't exists!`)}try{const s=await n(t),r=JSON.parse(s.toString());Object.entries(r).forEach(([t,e])=>this.addFont(t,e))}catch(e){console.warn(`WARN: error loading and evaluating ${t}! - ${e.message}`)}}async saveFonts(t){try{return await o(t),void console.warn(`WARN: file ${t} already exists!`)}catch(e){}try{const s={},r=Array.from(this._fontMap.entries()).sort((t,e)=>t[1].occurrence-e[1].occurrence).reduce((t,e)=>(t[e[0]]=e[1],t),s);await a(t,JSON.stringify(r))}catch(e){console.warn(`WARN: error writing ${t}! - ${e.message}`)}}get imageUrlPrefix(){return this._imageUrlPrefix}set imageUrlPrefix(t){t&&0!==t.trim().length&&(this._imageUrlPrefix=t.endsWith("/")?t:t.concat("/"))}consoleLog(){const t=[Object.assign(Object.assign({},this.stats),{textHeigths:JSON.stringify(this.stats.textHeigths)})];console.table(t)}}exports.globals=new c;
},{}],"K2lX":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.writePageAsImage=exports.writePageImageOrReuseOneFromCache=void 0;const a=require("canvas"),t=require("console"),s=e(require("fs")),i=e(require("path")),r=require("util"),n=e(require("jimp")),o=require("./pdf2md.global");var c;!function(e){e[e.GRAYSCALE_1BPP=1]="GRAYSCALE_1BPP",e[e.RGB_24BPP=2]="RGB_24BPP",e[e.RGBA_32BPP=3]="RGBA_32BPP"}(c||(c={}));const d=r.promisify(s.default.writeFile),u=new Map;async function l(e,a){let s=0;switch(e.kind){case c.RGB_24BPP:s=3;break;case c.RGBA_32BPP:s=4;break;case c.GRAYSCALE_1BPP:t.assert(`kind ${e.kind} is not supported yet!`),s=1;break;default:t.assert(`kind ${e.kind} is not supported at all!`)}const r=new n.default(e.width,e.height),d=e.width*s;for(var l=0;l<e.width;l++)for(var g=0;g<e.height;g++){const a=g*d+l*s,t=e.data[a],i=e.data[a+1],o=e.data[a+2],c=3==s?255:e.data[a+3],u=n.default.rgbaToInt(t,i,o,c);r.setPixelColor(u,l,g)}let f;if(o.globals.useImageDuplicateDetection){const e=r.hash(),t=u.get(e);if(t){const e=t.find(e=>0==n.default.diff(r,e.jimg).percent);e?f=e.name:t.push({name:a,jimg:r})}else u.set(e,[{name:a,jimg:r}])}return f||(r.write(i.default.join(o.globals.outDir,`${a}.png`)),a)}exports.writePageImageOrReuseOneFromCache=l;class g{create(e,s){t.assert(e>0&&s>0,"Invalid canvas size");var i=a.createCanvas(e,s),r=i.getContext("2d");return{canvas:i,context:r}}reset(e,a,s){t.assert(e.canvas,"Canvas is not specified"),t.assert(a>0&&s>0,"Invalid canvas size"),e.canvas.width=a,e.canvas.height=s}destroy(e){t.assert(e.canvas,"Canvas is not specified"),e.canvas.width=0,e.canvas.height=0}}async function f(e){const a=e.getViewport({scale:1}),t=new g,s=t.create(a.width,a.height),r={canvasContext:s.context,viewport:a,canvasFactory:t};await e.render(r).promise;const n=s.canvas.toBuffer();await d(i.default.join(o.globals.outDir,`page-${e.pageNumber}.png`),n)}exports.writePageAsImage=f;
},{"./pdf2md.global":"FrYy"}],"FCxD":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.EnhancedWord=void 0;const t=require("./pdf2md.global"),i=" ¶ ";class s{constructor(t){this.x=t.x,this.y=t.y,this.width=t.width,this.height=t.height,this.text=t.text,this.font=t.font}appendWord(s,e){let h=!1;const o=this.x+this.width,r=o<s.x,n=this.height===s.height&&this.font===s.font,d=s.x-o,x=0===s.text.trim().length;return n?(r&&!x&&t.globals.options.filler?(this.text+=i.concat(s.text),this.width+=s.width+d):(this.text+=s.text,this.width+=s.width),h=!0):e&&r&&!x&&t.globals.options.filler&&(this.text+=i.concat(s.text),this.width+=s.width+d),h}addTransformer(t){if(this._transformer)return!1;this._transformer=t}toMarkdown(){const i=this._transformer?this._transformer(this.text):this.text;return i&&t.globals.options.debug?`\x3c!--${this.font}--\x3e${i}`:i}}exports.EnhancedWord=s;
},{"./pdf2md.global":"FrYy"}],"GVVa":[function(require,module,exports) {
"use strict";var t=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.processPage=exports.Page=exports.Row=void 0;const e=t(require("assert")),s=require("./pdf2md.global"),r=require("./pdf2md.image"),n=require("./pdf2md.model"),a=require("pdfjs-dist");class o{constructor(){this.lines=Array()}appendRow(t){var e;if(t.containsImages){null===(e=t.images)||void 0===e||e.map((t,e)=>{this.lines.push({y:null==t?void 0:t.y,width:null==t?void 0:t.width,x:null==t?void 0:t.x,height:null==t?void 0:t.height,image:(null==t?void 0:t.url)||"undefined"})})}if(t.containsWords){const e=t.enhancedText.map((t,e)=>{const s=t.text,r={height:t.height,image:void 0,text:s,font:t.font};return 0==e?Object.assign({y:t.y,width:t.width,x:t.x},r):Object.assign({width:t.width,x:t.x},r)});this.lines.push(...e)}}}class i{constructor(t){this.y=t.y,this._words=t.words,this._images=t.images,this._updateEnhancedText()}get containsWords(){return void 0!==this._words}addWord(t){var e;null===(e=this._words)||void 0===e||e.push(t),this._updateEnhancedText()}get containsImages(){return void 0!==this._images}addImage(t){var e;null===(e=this._images)||void 0===e||e.push(t)}_updateEnhancedText(){if(!this._words||0==this._words.length)return;const t={lastIndex:-1,result:Array()};this._etextArray=this._words.reduce((t,e,s,r)=>{if(t.lastIndex<0)t.result.push(new n.EnhancedWord(e)),t.lastIndex=0;else{const a=s===r.length-1;t.result[t.lastIndex].appendWord(e,a)||(t.result.push(new n.EnhancedWord(e)),t.lastIndex++)}return t},t).result}get enhancedText(){return this._etextArray}get images(){return this._images}containsTextWithHeight(t){return e.default(this._etextArray,"text array is undefined!"),this._etextArray.findIndex(e=>e.height==t)>=0}}exports.Row=i;class d{constructor(){this.rows=Array()}process(t){return"text"in t&&this.processWord(t),"url"in t&&this.processImage(t),this}processImage(t){let e,s=this.rows.findIndex(e=>e.y==t.y);return s<0?(e=new i({y:t.y,images:Array()}),this.rows.push(e)):e=this.rows[s],e.addImage(t),this}processWord(t){let e,s=this.rows.findIndex(e=>e.y===t.y);return s<0?(e=new i({y:t.y,words:Array()}),this.rows.push(e)):e=this.rows[s],e.containsWords&&e.addWord(t),this}insertRow(t,e){if(t<0||t>=this.rows.length)throw`atIndex ${t} is out of range!`;const s=new i({y:e.y,words:[e]});this.rows.splice(t,0,s)}consoleLog(){const t=new o;this.rows.forEach(e=>t.appendRow(e)),console.table(t.lines)}}function h(t,e){return t.concat(e)}async function c(t){const n=await t.getOperatorList();let o=null;const i=Array();n.fnArray.forEach(async(d,h)=>{let c=n.argsArray[h];switch(d){case a.OPS.setFont:const l=c[0];let g;try{(g=t.objs.get(l))&&s.globals.addFont(l,g)}catch(u){s.globals.addFont(l,{name:""})}break;case a.OPS.transform:e.default(h<n.argsArray.length,`index ${h} exceed the argsArray size ${n.argsArray.length}`),o=c;break;case a.OPS.paintJpegXObject:case a.OPS.paintImageXObject:const w={x:0,y:0};o&&(w.x=o?Math.round(o[4]):0,w.y=o?Math.round(o[5]):0);const p=c[0];try{const e=t.objs.get(p);if(e){const t=await r.writePageImageOrReuseOneFromCache(e,p);i.push({y:w.y,x:w.x,width:e.width,height:e.height,url:t})}}catch(u){console.warn(`image name ${p} not found!`)}o=null}});const c=t.getViewport({scale:1});return h((await t.getTextContent()).items.map(t=>{const e=a.Util.transform(c.transform,t.transform),r=Math.sqrt(e[2]*e[2]+e[3]*e[3]),n=t.height/r,o={x:Math.round(t.transform[4]),y:Math.round(t.transform[5]),width:Math.round(t.width),height:Math.round(n<=1?t.height:n)};return s.globals.addTextHeight(o.height),Object.assign({text:t.str,font:t.fontName},o)}),i).sort((t,e)=>{const s=e.y-t.y;return 0===s?t.x-e.x:s}).reduce((t,e)=>t.process(e),new d)}exports.Page=d,exports.processPage=c;
},{"./pdf2md.global":"FrYy","./pdf2md.image":"K2lX","./pdf2md.model":"FCxD"}],"WThc":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.toMarkdown=exports.isHeadline=void 0;const e=require("assert"),t=require("enumify"),n=require("./pdf2md.global");class o extends t.Enumify{constructor(e){super(),this.toText=e.toText}}function s(e){return e&&2==e.enumKey.length&&"H"===e.enumKey[0]}o.H1=new o({toText:e=>`# ${e}`}),o.H2=new o({toText:e=>`## ${e}`}),o.H3=new o({toText:e=>`### ${e}`}),o.H4=new o({toText:e=>`#### ${e}`}),o.H5=new o({toText:e=>`##### ${e}`}),o.H6=new o({toText:e=>`###### ${e}`}),o.OVERFLOW=new o({toText:e=>e}),o._=o.closeEnum(),exports.isHeadline=s;const r=(e,t,n)=>{n||(n=t);const o=/^(.+[^\s]?)(\s*)$/.exec(e);return o?`${t}${o[1]}${n}${o[2]}`:"null"};class a extends t.Enumify{constructor(e){super(),this.toText=e}}function d(e){const t=o.enumValues.find(t=>t.enumKey==`H${e}`);return t||(console.warn(`Unsupported headline level: ${e} (supported are 1-6)`),o.OVERFLOW)}function c(t){if(1==t.enhancedText.length){const o=n.globals.stats.mostUsedTextHeight,s=t.enhancedText[0];if(s.height!=o||s.font!=n.globals.stats.mostUsedFont){const t=n.globals.stats.textHeigths.findIndex(e=>e==s.height);e(t>=0,`height ${s.height} not present in textHeights stats!`);const o=d(t+1);s.addTransformer(o.toText)}}}function l(e){e.enhancedText.forEach(e=>{const t=e.font,o=n.globals.getFont(t);if(o&&null!=o.name){const t=o.name.toLowerCase(),s=()=>t.includes("bold"),r=()=>t.includes("oblique")||t.includes("italic"),d=()=>t.includes("monospace")||t.includes("code");s()&&r()?e.addTransformer(a.BOLD_OBLIQUE.toText):s()?e.addTransformer(a.BOLD.toText):r()?e.addTransformer(a.OBLIQUE.toText):d()?e.addTransformer(a.MONOSPACE.toText):t===n.globals.stats.maxHeightFont&&e.addTransformer(a.BOLD_OBLIQUE.toText)}})}function i(e){const t=n.globals.getFontIdByName("monospace")||n.globals.getFontIdByName("code");if(!t)return void console.warn("monospace or code font doesn't exists!");const o=Array();let s=null;e.rows.forEach((e,n)=>{if((e=>e.containsWords&&1==e.enhancedText.length&&e.enhancedText[0].font==t)(e)){const t=e.enhancedText[0];null==s?s={start:n,end:n,word:Object.assign(Object.assign({},t),{text:"`"})}:s.end=n}else null!=s&&s.end>s.start&&(s.end=n,o.push(s)),s=null});let r=0;o.forEach(t=>{for(let n=t.start+r;n<t.end+r;++n)e.rows[n].enhancedText[0].addTransformer(e=>e);e.insertRow(t.start+r++,t.word),e.insertRow(t.end+r++,t.word)})}function u(e){i(e);return e.rows.reduce((e,t,o)=>{let s="";return t.images&&(s=t.images.reduce((e,t)=>e.concat(`![${t.url}](${n.globals.imageUrlPrefix}${t.url}.png)`),"")),t.containsWords&&(c(t),l(t),s=t.enhancedText.reduce((e,t)=>e.concat(t.toMarkdown()),"")),e.concat(s).concat("\n")},"")}exports.default=a,a.BOLD=new a(e=>r(e,"**")),a.OBLIQUE=new a(e=>r(e,"_")),a.BOLD_OBLIQUE=new a(e=>r(e,"**_","_**")),a.MONOSPACE=new a(e=>r(e,"`")),a._=a.closeEnum(),exports.toMarkdown=u;
},{"./pdf2md.global":"FrYy"}],"OTOl":[function(require,module,exports) {
"use strict";var o=this&&this.__importDefault||function(o){return o&&o.__esModule?o:{default:o}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.pdfToMarkdown=void 0;const e=o(require("fs")),a=o(require("path")),t=require("util"),s=require("./pdf2md.page"),r=require("./pdf2md.markdown"),i=require("./pdf2md.global"),l=require("pdfjs-dist"),d="../../../node_modules/pdfjs-dist/cmaps/",n=!0,u=t.promisify(e.default.readFile),c=t.promisify(e.default.writeFile);async function p(o){try{const t=a.default.basename(o,".pdf"),p=a.default.join(i.globals.outDir,`${t}.fonts.json`),f=a.default.join(i.globals.outDir,`${t}.md`);i.globals.loadLocalFonts(p);const g=new Uint8Array(await u(o)),m=await l.getDocument({data:g,cMapUrl:d,cMapPacked:n}).promise,b=m.numPages,w=Array(b);for(let o=1;o<=b;o++){const e=await m.getPage(o),a=await s.processPage(e);w.push(a)}const q=w.map(o=>r.toMarkdown(o)).reduce((o,e)=>o.concat(e),"");await c(f,q),i.globals.saveFonts(p),i.globals.options.debug&&w.forEach(o=>o.consoleLog()),i.globals.options.stats&&i.globals.consoleLog()}catch(e){console.log(e)}}exports.pdfToMarkdown=p;
},{"./pdf2md.page":"GVVa","./pdf2md.markdown":"WThc","./pdf2md.global":"FrYy"}],"QCba":[function(require,module,exports) {
"use strict";var a=this&&this.__importDefault||function(a){return a&&a.__esModule?a:{default:a}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.run=void 0,require("pdfjs-dist/es5/build/pdf.js");const e=a(require("fs")),t=require("util"),r=a(require("path")),i=require("./pdf2md.image"),o=require("./pdf2md.global"),s=require("commander"),n=require("console"),d=require("./pdf2md.main"),p=require("pdfjs-dist"),c="../../../node_modules/pdfjs-dist/cmaps/",l=!0,u=t.promisify(e.default.readFile),f=t.promisify(e.default.access),g=t.promisify(e.default.mkdir);async function m(a){n.assert(a,"provided path is not valid");try{await f(a)}catch(e){console.log(`folder ${a} doesn't exist, try to create`),await g(a)}return a}async function w(a){try{const t=new Uint8Array(await u(a)),r=await p.getDocument({data:t,cMapUrl:c,cMapPacked:l}).promise,o=r.numPages;for(let a=1;a<=o;a++){const e=await r.getPage(a),t=await e.getOperatorList();for(let a=0;a<t.fnArray.length;a++)if(t.fnArray[a]==p.OPS.paintJpegXObject||t.fnArray[a]==p.OPS.paintImageXObject){const r=t.argsArray[a][0],o=e.objs.get(r);await i.writePageImageOrReuseOneFromCache(o,r)}}}catch(e){console.log(e)}}async function y(a){try{const t=new Uint8Array(await u(a)),r=await p.getDocument({data:t,cMapUrl:c,cMapPacked:l}).promise,o=r.numPages;for(let a=1;a<=o;a++){const e=await r.getPage(a);await i.writePageAsImage(e)}}catch(e){console.log(e)}}async function b(){const a=(a,e)=>e.parent.outdir?e.parent.outdir:r.default.basename(a,".pdf");return s.program.version("0.4.0").name("pdftools").option("-o, --outdir [folder]","output folder"),s.program.command("pdfximages <pdf>").description("extract images (as png) from pdf and save it to the given folder").alias("pxi").action(async(e,t)=>(o.globals.outDir=await m(a(e,t)),w(e))),s.program.command("pdf2images <pdf>").description("create an image (as png) for each pdf page").alias("p2i").action(async(e,t)=>(o.globals.outDir=await m(a(e,t)),y(e))),s.program.command("pdf2md <pdf>").description("convert pdf to markdown format.").alias("p2md").option("--imageurl [url prefix]","imgage url prefix").option("--stats","print stats information").option("--debug","print debug information").action(async(e,t)=>{o.globals.outDir=await m(a(e,t)),t.imageurl&&(o.globals.imageUrlPrefix=t.imageurl),o.globals.options.debug=t.debug,o.globals.options.stats=t.stats,await d.pdfToMarkdown(e)}),await s.program.parseAsync(process.argv)}exports.run=b;
},{"./pdf2md.image":"K2lX","./pdf2md.global":"FrYy","./pdf2md.main":"OTOl"}]},{},["QCba"], null)
//# sourceMappingURL=/index.js.map
=======
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
require("pdfjs-dist/legacy/build/pdf.js");
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const path_1 = __importDefault(require("path"));
const pdf2md_image_1 = require("./pdf2md.image");
const pdf2md_global_1 = require("./pdf2md.global");
const commander_1 = require("commander");
const console_1 = require("console");
const pdf2md_main_1 = require("./pdf2md.main");
const pdfjs_dist_1 = require("pdfjs-dist");
const CMAP_URL = "../../../node_modules/pdfjs-dist/cmaps/";
const CMAP_PACKED = true;
const readFile = util_1.promisify(fs_1.default.readFile);
const checkFileExistsAsync = util_1.promisify(fs_1.default.access);
const mkdirAsync = util_1.promisify(fs_1.default.mkdir);
async function createFolderIfDoesntExist(path) {
    console_1.assert(path, `provided path is not valid`);
    try {
        await checkFileExistsAsync(path);
    }
    catch (e) {
        console.log(`folder ${path} doesn't exist, try to create`);
        await mkdirAsync(path);
    }
    return path;
}
async function extractImagesfromPages(pdfPath) {
    try {
        const data = new Uint8Array(await readFile(pdfPath));
        const pdfDocument = await pdfjs_dist_1.getDocument({
            data: data,
            cMapUrl: CMAP_URL,
            cMapPacked: CMAP_PACKED,
        }).promise;
        const pages = pdfDocument.numPages;
        for (let i = 1; i <= pages; i++) {
            const page = await pdfDocument.getPage(i);
            const ops = await page.getOperatorList();
            for (let j = 0; j < ops.fnArray.length; j++) {
                if (ops.fnArray[j] == pdfjs_dist_1.OPS.paintJpegXObject || ops.fnArray[j] == pdfjs_dist_1.OPS.paintImageXObject) {
                    const op = ops.argsArray[j][0];
                    const img = page.objs.get(op);
                    await pdf2md_image_1.writePageImageOrReuseOneFromCache(img, op);
                }
            }
        }
    }
    catch (reason) {
        console.log(reason);
    }
}
async function savePagesAsImages(pdfPath) {
    try {
        const data = new Uint8Array(await readFile(pdfPath));
        const pdfDocument = await pdfjs_dist_1.getDocument({
            data: data,
            cMapUrl: CMAP_URL,
            cMapPacked: CMAP_PACKED,
        }).promise;
        const pages = pdfDocument.numPages;
        for (let i = 1; i <= pages; i++) {
            const page = await pdfDocument.getPage(i);
            await pdf2md_image_1.writePageAsImage(page);
        }
    }
    catch (reason) {
        console.log(reason);
    }
}
async function run() {
    const choosePath = (pdfPath, cmdobj) => (cmdobj.parent.outdir) ?
        cmdobj.parent.outdir :
        path_1.default.basename(pdfPath, '.pdf');
    commander_1.program.version('0.4.0')
        .name('pdftools')
        .option('-o, --outdir [folder]', 'output folder');
    commander_1.program.command('pdfximages <pdf>')
        .description('extract images (as png) from pdf and save it to the given folder')
        .alias('pxi')
        .action(async (pdfPath, cmdobj) => {
        pdf2md_global_1.globals.outDir = await createFolderIfDoesntExist(choosePath(pdfPath, cmdobj));
        return extractImagesfromPages(pdfPath);
    });
    commander_1.program.command('pdf2images <pdf>')
        .description('create an image (as png) for each pdf page')
        .alias('p2i')
        .action(async (pdfPath, cmdobj) => {
        pdf2md_global_1.globals.outDir = await createFolderIfDoesntExist(choosePath(pdfPath, cmdobj));
        return savePagesAsImages(pdfPath);
    });
    commander_1.program.command('pdf2md <pdf>')
        .description('convert pdf to markdown format.')
        .alias('p2md')
        .option('--imageurl [url prefix]', 'imgage url prefix')
        .option('--stats', 'print stats information')
        .option('--debug', 'print debug information')
        .action(async (pdfPath, cmdobj) => {
        pdf2md_global_1.globals.outDir = await createFolderIfDoesntExist(choosePath(pdfPath, cmdobj));
        if (cmdobj.imageurl) {
            pdf2md_global_1.globals.imageUrlPrefix = cmdobj.imageurl;
        }
        pdf2md_global_1.globals.options.debug = cmdobj.debug;
        pdf2md_global_1.globals.options.stats = cmdobj.stats;
        await pdf2md_main_1.pdfToMarkdown(pdfPath);
    });
    return await commander_1.program.parseAsync(process.argv);
}
exports.run = run;
>>>>>>> feature/link

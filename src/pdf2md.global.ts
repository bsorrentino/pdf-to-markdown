import assert from "assert";
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
const checkFileExistsAsync = promisify(fs.access)
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
/**
 * @interface Font
 * @description An interface representing a font.
 * @property {string | null} name - The name of the font, can be null if not specified.
 */
interface Font {
    name: string | null
}
/**
 * Represents a font statistic by extending the base `Font` type with an additional property for occurrence count.
 * @typedef {Object} FontStat
 * @property {Font} baseProps - The properties of a font.
 * @property {number} occurrence - The number of times the font occurs.
 */
type FontStat = Font & { occurrence: number }
/**
 * Represents statistical data from a document or similar.
 * @property {string} mostUsedFont - The font used most frequently, identified by its ID.
 * @property {number} mostUsedTextHeight - The height of the text that is most commonly used.
 * @property {number} maxTextHeight - The maximum height of any text within the document.
 * @property {Array<number>} textHeigths - An array containing the heights of all texts encountered.
 * @property {string | null} maxHeightFont - The font with the maximum height if applicable, or null otherwise.
 * @property {number} mostUsedTextDistanceY - The vertical distance (in pixels) for the text that is most often seen.
 */
export interface Stats {
    mostUsedFont: string // fontId
    mostUsedTextHeight: number
    maxTextHeight: number
    textHeigths: Array<number>
    maxHeightFont: string | null
    mostUsedTextDistanceY: number
}
class Globals {

    private _fontMap = new Map<string, FontStat>()
    private _textHeights = new Map<number, number>()
    private _imageUrlPrefix = process.env['IMAGE_URL'] || ''
    private _options = {
        filler: false,
        debug: false,
        stats: false,
    }

    pageSeparator?: string
    outDir: string

    get useImageDuplicateDetection() { return true }

    get options() { return this._options }

    /**
     * 
     * @param fontId 
     * @param font 
     */
    addFont(fontId: string, font: Font) {

        assert(font, `font ${fontId} is not valid ${font}`)

        let value = this._fontMap.get(fontId) || { ...font, occurrence: 0 }

        value.occurrence++

        this._fontMap.set(fontId, value)

    }

    /**
     * 
     * @param fontId 
     */
    getFont(fontId: string): Font | undefined {
        return this._fontMap.get(fontId) as Font
    }

    /**
     * 
     * @param fontId 
     */
    getFontIdByName(name: string): string | undefined {
        for( const [k,f] of this._fontMap.entries() ) 
            if( f.name == name ) 
                return k
    }

    /**
     * 
     * @param height 
     */
    addTextHeight(height: number) {

        let occurrence = this._textHeights.get(height) || 0

        this._textHeights.set(height, ++occurrence)

    }

    private _stats: Stats | null = null

    /**
     * 
     */
    get stats(): Stats {

        if (!this._stats) {
            const calculateMostUsedFont = () => {
                const [k, _] = Array.from(this._fontMap.entries()).reduce(([k1, v1], [k, v]) => (v.occurrence > v1.occurrence) ? [k, v] : [k1, v1], ['', { occurrence: 0 }])
                return k
            }

            const calculateMaxTextHeight = () =>
                Array.from(this._textHeights.keys()).reduce((result, h) => (h > result) ? h : result)


            const calculateMostUsedTextHeight = () => {
                const [k, _] = Array.from(this._textHeights.entries()).reduce(([k1, v1], [k, v]) => (v > v1) ? [k, v] : [k1, v1], [0, -1])
                return k
            }

            this._stats = {
                maxTextHeight: calculateMaxTextHeight(),
                maxHeightFont: null,
                mostUsedFont: calculateMostUsedFont(),
                mostUsedTextHeight: calculateMostUsedTextHeight(),
                textHeigths: Array.from(this._textHeights.keys()).sort((a, b) => b - a),
                mostUsedTextDistanceY: -1,
            }
        }

        return this._stats

    }


    /**
     * 
     * @param fontsFile 
     * @param globals 
     */
    async loadLocalFonts(fontsFile: string) {

        try {
            await checkFileExistsAsync(fontsFile)
        }
        catch (e) {
            console.warn(`WARN: file ${fontsFile} doesn't exists!`)
            return
        }

        try {
            const contents = await readFileAsync(fontsFile)

            const fonts: { [name: string]: Font } = JSON.parse(contents.toString())

            Object.entries(fonts).forEach(([k, v]) => this.addFont(k, v))

        }
        catch (e:any) {
            console.warn(`WARN: error loading and evaluating ${fontsFile}! - ${e.message}`)
        }
    }

    /**
     * 
     * @param fontMap 
     */
    async saveFonts(fontsFile: string) {

        try {
            await checkFileExistsAsync(fontsFile)
            console.warn(`WARN: file ${fontsFile} already exists!`)
            return
        }
        catch (e) {
            // correct file doesn't exists
        }

        try {

            const init:{ [fontId:string]:FontStat } = {}

            const contents = Array.from(this._fontMap.entries())
                .sort( (e1,e2) => e1[1].occurrence - e2[1].occurrence )
                .reduce( ( result, e) => { result[ e[0] ] = e[1]; return result } , init )
            
            await writeFileAsync(fontsFile, JSON.stringify(contents) )

        }
        catch (e:any) {
            console.warn(`WARN: error writing ${fontsFile}! - ${e.message}`)
        }
    }

    get imageUrlPrefix() { 
        // console.log( `imageUrlPrefix ${this._imageUrlPrefix}`)
        return this._imageUrlPrefix 
    }
    
    set imageUrlPrefix( value:string ) {
        if( !value || value.trim().length===0) return 

        this._imageUrlPrefix = value.endsWith('/') ? value : value.concat('/')
    }

    constructor() {
        this.outDir = path.join(process.cwd(), 'out')
    }

    consoleLog() {


        const log = [ { ...this.stats, textHeigths: JSON.stringify( this.stats.textHeigths) } ]

        console.table( log )
        
    }
}
export const globals = new Globals()
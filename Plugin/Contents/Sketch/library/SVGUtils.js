@import 'library/svg/generator.js'

function convertFromSVG(svgContent) {
    var result = parseFile(svgContent)
    return NSString.stringWithString(result)
}
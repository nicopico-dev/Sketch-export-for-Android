@import 'library/SVGUtils.js'

var drawableFoldersMap = {
    null:       'drawable-anydpi',
    '':         'drawable-anydpi',
    '@1x':      'drawable-mdpi',
    '@1.5x':    'drawable-hdpi',
    '@2x':      'drawable-xhdpi',
    '@3x':      'drawable-xxhdpi',
    '@4x':      'drawable-xxxhdpi',
    'mdpi':     'drawable-mdpi',
    'hdpi':     'drawable-hdpi',
    'xhdpi':    'drawable-xhdpi',
    'xxhdpi':   'drawable-xxhdpi',
    'xxxhdpi':  'drawable-xxxhdpi'
}

function extractFromDocument(document) {
    var layers = document.allExportableLayers()
    var exports = Array();
    for (var i = 0; i < layers.count(); i++) {
        var layer = layers[i]
        var exportRequests = MSExportRequest.exportRequestsFromExportableLayer(layer)
        for (var j = 0; j < exportRequests.count(); j++) {
            var exportRequest = exportRequests[j]
            exports.push(new DrawableExporter(layer.name(), document, exportRequest))
        }
    }
    return exports
}

class DrawableExporter {

    constructor(name, document, exportRequest) {
        this.name = name
        this.document = document
        this.exportRequest = exportRequest

        // format: MSExportFormat
        this.scale = exportRequest.scale()
        this.suffix = exportRequest.name().replace(name, '')
        this.type = exportRequest.format()
    }

    process(outputDir) {
        var filename = this.name
            .trim().toLowerCase()
            .replace(/[^0-9a-z_]/,'_')
            .replace(/_+/g,'_')

        if (this.type == 'png' || this.type == 'jpg') {
            var outputFile = outputDir + '/' + drawableFoldersMap[this.suffix] + '/' + filename + '.' + this.type
            log('Exporting ' + this.name + ' to ' + outputFile)
            this.document.saveExportRequest_toFile(this.exportRequest, outputFile)
        }
        else if (this.type == 'svg') {
            var outputFile = outputDir + '/drawable-anydpi/' + filename + '.xml'
            log('Exporting ' + this.name + ' to ' + outputFile)

            // Export to SVG
            var svgFile = NSTemporaryDirectory() + filename + '.svg'
            this.document.saveExportRequest_toFile(this.exportRequest, svgFile)

            // Read and delete the SVG file
            var encoding = NSUTF8StringEncoding
            var svgContent = NSString.stringWithContentsOfFile_encoding_error(svgFile, encoding, null)
            NSFileManager.defaultManager().removeItemAtPath_error(svgFile, null)

            // Convert the SVG to a VectorDrawable file
            var result = convertFromSVG(svgContent)
            result.writeToFile_atomically_encoding_error(outputFile, false, encoding, null)
        }
    }
}
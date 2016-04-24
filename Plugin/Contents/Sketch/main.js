@import 'library/DrawableExporter.js'
@import 'library/FileUtils.js'

var onRun = function(context) {
    var outputDir = chooseOutputFolder()
    log('outputDir: ' + outputDir)

    var exports = extractFromDocument(context.document)
    for (var i = 0; i < exports.length; i++) {
        var slice = exports[i]
        slice.process(outputDir)
    }
    log('done')
}
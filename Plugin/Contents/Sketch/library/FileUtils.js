var defaultDirectoryUrl = null

function chooseOutputFolder() {
    var panel = NSOpenPanel.openPanel()
    panel.setTitle("Export Android resources to ...")
    panel.setPrompt("Export")
    panel.setDirectoryURL(defaultDirectoryUrl)
    
    panel.setCanCreateDirectories(true)
    panel.setCanChooseFiles(false)
    panel.setCanChooseDirectories(true)
    panel.setAllowsMultipleSelection(false)

    if (panel.runModal() == NSOKButton) {
        var selectedUrl = panel.URL()
        defaultDirectoryUrl = selectedUrl
        return selectedUrl.fileSystemRepresentation()
    }

    return null
}
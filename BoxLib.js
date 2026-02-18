/**
 * BoxLib.js
 * Fork of FoldOverBoxGenerator by William Sokol (2024)
 * Original: https://github.com/williamsokol/FoldOverBoxGenerator
 * License: MIT
 */

window.thickness = 4.8
window.Dthick    = thickness * 2
window.tabLength = 10
window.width     = 130
window.length    = 140
window.height    = 60

window.MMToInches = function (mm)   { return mm * 0.0393701 }
window.InchesToMM = function (inch) { return inch * 25.4 }

window.makeTabs = function (shapePath, length, start = 0, dist = 0) {
    var tabPath  = new CompoundPath()
    let tabPos   = 0
    let tabCount = getTabCount(length)

    for (var j = 0; j < tabCount; j++) {
        var tab = new Path.Rectangle(new Point(0, 0), new Size(tabLength, thickness))
        tabPos  = j * (length / tabCount) + (length / tabCount) / 2 + start
        var offsetPoint = shapePath.getPointAt(tabPos)
        var tan  = shapePath.getTangentAt(tabPos)
        let norm = shapePath.getNormalAt(tabPos)
        tab.rotate(tan.angle)
        tab.position = offsetPoint + (norm * dist)
        tabPath.addChild(tab)
    }
    return tabPath
}

window.getTabCount = function (len, tabDense = 2.0) {
    return Math.floor(((len - tabLength) / tabDense) / tabLength)
}

window.makeLivingHinge = function (x, y, w, h) {
    const spacing = 2, line = 19, gap = 7
    x += spacing
    w -= spacing
    var path = new CompoundPath()

    for (var i = 0; i < w / spacing; i++) {
        let yOffset = (i % 2 * (line + gap) / 2) - line
        while (yOffset < h) {
            let top  = Math.max(y + yOffset, y)
            let bot  = Math.min(line + y + yOffset, y + h)
            var path2 = new Path.Line(new Point(i * spacing + x, top), new Point(i * spacing + x, bot))
            yOffset += gap + line
            path.addChild(path2)
        }
    }
    path.strokeColor = '#000000'
    return path
}

window.makeMotorMount = function (x, y) {
    let mmW = 47.6, mmL = 23.0, mScrew = 10
    let rectangle1 = new Path.Rectangle(new Point(x, y), new Size(mmL, mmW))
    rectangle1 = rectangle1.scale(1.01)
    let cir  = new Path.Circle(new Point(x + mmL / 2, y + 14.1), mmL / 2)
    let cir2 = new Path.Circle(new Point(x + mmL / 2, y + mScrew / 2), mScrew / 2)
    let cir3 = new Path.Circle(new Point(x + mmL / 2, y + 28.2 - mScrew / 2), mScrew / 2)
    cir = cir.unite(cir2)
    cir = cir.unite(cir3)
    let cir4 = new Path.Circle(new Point(x + mmL / 2 - (17.8 / 2), y + mmW - 2.6), 1.5)
    let cir5 = new Path.Circle(new Point(x + mmL / 2 + (17.8 / 2), y + mmW - 2.6), 1.5)
    return rectangle1
}

window.makeTabLine = function (x, y, dist, rot = 0) {
    var from = new Point(x, y)
    var to   = new Point(x, y - dist)
    var path = new Path.Line(from, to)
    path.rotate(rot, from)
    return path
}

window.booleanCompound = function (Cpath, path, operation = 'subtract') {
    var res = new CompoundPath()
    for (let i = 0; i < Cpath.children.length; i++) {
        res.addChild(Cpath.children[i][operation](path, { stroke: true }))
    }
    return res
}

var downloadAsSVG = function (fileName) {
    if (!fileName) fileName = "box.svg"
    let rect = new Rectangle(project.activeLayer.bounds)
    rect = rect.scale(1.1)
    var url  = "data:image/svg+xml;utf8," + encodeURIComponent(project.exportSVG({ asString: true, bounds: rect }))
    var link = document.createElement("a")
    link.download = fileName
    link.href     = url
    link.click()
}

function process() {
    project.activeLayer.scale(3.779528)
    project.activeLayer.position = project.activeLayer.bounds.size / 2
    myCanvas.width  = project.activeLayer.bounds.width  + 100
    myCanvas.height = project.activeLayer.bounds.height + 10
    downloadAsSVG()
}

window.process = process

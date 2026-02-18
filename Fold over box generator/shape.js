/**
 * shape.js
 * Fork of FoldOverBoxGenerator by William Sokol (2024)
 * Original: https://github.com/williamsokol/FoldOverBoxGenerator
 * License: MIT
 *
 * Changes: handle cutouts removed, form IDs updated for new UI.
 */

var thickness = 4.8

// Settings in MM
var width = 100
var length = 100 + thickness * 2
var height = 100

const form = document.querySelector('form');
form.reset();

form.addEventListener('submit', (event) => {
    event.preventDefault();

    thickness = parseFloat(document.getElementById('thickness').value)
    length    = parseFloat(document.getElementById('length').value)
    width     = parseFloat(document.getElementById('width').value)
    height    = parseFloat(document.getElementById('height').value)

    length = clamp(length, 30, 1000)
    width  = clamp(width,  30, 1000)
    height = clamp(height, 50, 1000)

    document.getElementById('thickness').value = thickness
    document.getElementById('length').value    = length
    document.getElementById('width').value     = width
    document.getElementById('height').value    = height

    document.getElementById('myCanvas').width  = height * 2 + thickness * 2 + length + height * 2 + thickness * 2
    document.getElementById('myCanvas').height = height + height + width

    if (event.submitter && event.submitter.value === 'Export') {
        start()
        window.process()
    }
    start()
});

start()

function start() {
    project.clear()

    const offset    = new Point(height * 2 + thickness * 2, height)
    const LRSizes   = new Size(height, width)
    const TBSizes   = new Size(length - thickness * 2, height)
    const TB_LRSizes = new Size(width / 2, height - thickness)

    // ── Base ──
    var base          = new Path.Rectangle(offset, new Size(length, width))
    var baseTabHole1  = new Path.Rectangle(offset + new Point(0, width * 1 / 6),               new Size(thickness * 2, width / 6))
    var baseTabHole2  = new Path.Rectangle(offset + new Point(0, width * 4 / 6),               new Size(thickness * 2, width / 6))
    var baseTabHole3  = new Path.Rectangle(offset + new Point(length - thickness * 2, width * 4 / 6), new Size(thickness * 2, width / 6))
    var baseTabHole4  = new Path.Rectangle(offset + new Point(length - thickness * 2, width * 1 / 6), new Size(thickness * 2, width / 6))

    // ── Left sides ──
    var sideL     = new Path.Rectangle(offset - new Point(height, 0),                       LRSizes)
    var sideL1_5  = new Path.Rectangle(offset - new Point(height + thickness, 0),           new Size(thickness * 1.5, LRSizes.height))
    var sideL2    = new Path.Rectangle(offset - new Point(height * 2 + thickness, 0),       LRSizes)
    var sideLTab1 = new Path.Rectangle(offset - new Point(height * 2 + thickness * 2, -width * 1 / 6), new Size(thickness, width / 6))
    var sideLTab2 = new Path.Rectangle(offset - new Point(height * 2 + thickness * 2, -width * 4 / 6), new Size(thickness, width / 6))

    // ── Right sides ──
    var sideR     = new Path.Rectangle(offset + new Point(length, 0),                           LRSizes)
    var sideR1_5  = new Path.Rectangle(offset + new Point(length + height, 0),                  new Size(thickness * 1.5, LRSizes.height))
    var sideR2    = new Path.Rectangle(offset + new Point(length + height + thickness, 0),      LRSizes)
    var sideRTab1 = new Path.Rectangle(offset + new Point(length + height * 2 + thickness, width * 1 / 6), new Size(thickness, width / 6))
    var sideRTab2 = new Path.Rectangle(offset + new Point(length + height * 2 + thickness, width * 4 / 6), new Size(thickness, width / 6))

    // ── Top flaps ──
    var sideT   = new Path.Rectangle(offset - new Point(-thickness, height),                    TBSizes)
    var sideTL  = new Path.Rectangle(offset - new Point(TB_LRSizes.width - thickness, height),  TB_LRSizes)
    var sideTR  = new Path.Rectangle(offset - new Point(-TBSizes.width - thickness, height),    TB_LRSizes)

    // ── Bottom flaps ──
    var sideB   = new Path.Rectangle(offset + new Point(thickness, width),                         TBSizes)
    var sideBL  = new Path.Rectangle(offset - new Point(TB_LRSizes.width - thickness, -width - thickness),  TB_LRSizes)
    var sideBR  = new Path.Rectangle(offset - new Point(-length + thickness, -width - thickness),           TB_LRSizes)

    // ── Boolean union / subtract ──
    var base2 = base.clone()

    base = base.subtract(baseTabHole1)
    base = base.subtract(baseTabHole2)
    base = base.subtract(baseTabHole3)
    base = base.subtract(baseTabHole4)
    base = base.unite(sideL)
    base = base.unite(sideL1_5)
    base = base.unite(sideL2)
    base = base.unite(sideLTab1)
    base = base.unite(sideLTab2)
    base = base.unite(sideR)
    base = base.unite(sideR1_5)
    base = base.unite(sideR2)
    base = base.unite(sideRTab1)
    base = base.unite(sideRTab2)
    base = base.unite(sideT)
    base = base.unite(sideTR)
    base = base.unite(sideTL)
    base = base.unite(sideB)
    base = base.unite(sideBR)
    base = base.unite(sideBL)
    base.strokeColor = "#ff0000"

    // ── Fold / score dashed lines ──
    var base2D    = dashPath(base2)
    var sideL1_5D = dashPath(sideL1_5)
    var sideR1_5D = dashPath(sideR1_5)
    var sideTLD   = dashPath(sideTL)
    var sideTRD   = dashPath(sideTR)
    var sideBLD   = dashPath(sideBL)
    var sideBRD   = dashPath(sideBR)

    ;[base2D, sideL1_5D, sideR1_5D, sideTLD, sideTRD, sideBLD, sideBRD]
        .forEach(p => { p.strokeColor = "#ff0000" })
}

// ── Helpers ──

function dashPath(path) {
    const dashline = 8, dashgap = 7
    var dashPos = dashgap
    var compoundPath = new CompoundPath()

    while (path.length > dashPos + 8) {
        var skip = false
        path.segments.forEach(s => {
            if (dashPos - dashgap / 2 < path.getOffsetOf(s.point) &&
                dashPos + dashline + dashgap / 2 > path.getOffsetOf(s.point)) {
                skip = true
            }
        })
        var segments = [path.getPointAt(dashPos), path.getPointAt(dashPos + dashline)]
        dashPos += dashline + dashgap
        if (skip) continue
        compoundPath.addChild(new Path(segments))
    }
    return compoundPath
}

function process() {
    project.activeLayer.scale(3.779528)
    project.activeLayer.position = project.activeLayer.bounds.size / 2

    myCanvas.width  = project.activeLayer.bounds.width  + 100
    myCanvas.height = project.activeLayer.bounds.height + 10
}

function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max))
}

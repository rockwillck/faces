const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.width = 1024
canvas.height = 1024

ctx.translate(0, 200)

function drawLine(slope, xMin, xMax, yStart) {
    // ctx.beginPath()
    ctx.lineTo(xMin, yStart)
    ctx.lineTo(xMax, yStart + slope * (xMax - xMin))
    // ctx.closePath()
}

function getTangentValues(start, end, slope, yCoord) {
    r = Math.sqrt((end**2) * (slope ** 2 + 1) / (slope ** 2))
    b = Math.sqrt(slope ** 2 + 1) * r - slope*end
    return {
        r:r,
        b:yCoord + slope * (start - end) - b
    }
}

function drawTangentCircle(start, end, slope, yCoord) {
    r = getTangentValues(start, end, slope, yCoord).r
    b = getTangentValues(start, end, slope, yCoord).b

    ctx.beginPath()
    ctx.arc(canvas.width/2, b, r, 0, 2*Math.PI)
    ctx.closePath()
}

function drawHead(fill, render=true) {
    ctx.beginPath()
    drawLine(jawSlant*secondMultiplier, canvas.width/2 - start - (start - end)/2, canvas.width/2 - start, canvas.height/2 - jawSlant*secondMultiplier*(start - end)/2)
    drawLine(jawSlant, canvas.width/2 - start, canvas.width/2 - end, canvas.height/2)

    drawLine(-jawSlant, canvas.width/2 + end, canvas.width/2 + start, canvas.height/2 + jawSlant * (start - end))
    drawLine(-jawSlant*secondMultiplier, canvas.width/2 + start, canvas.width/2 + start + (start - end)/2, canvas.height/2)
    ctx.closePath()
    
    if (render) {
        if (fill) {
            ctx.fill()
        } else {
            ctx.stroke()
        }
    }


    drawTangentCircle(start, end, jawSlant, canvas.height/2)
    if (render) {
        if (fill) {
            ctx.fill()
        } else {
            ctx.stroke()
        }
    }

    drawTangentCircle(start, start + (start-end)/2, jawSlant*secondMultiplier, canvas.height/2)
    if (render) {
        if (fill) {
            ctx.fill()
        } else {
            ctx.stroke()
        }
    }
}

function getSmoothRandom(index, offset) {
    return (Math.sin(index * offset) + 1)/2
}

var jawSlant = Math.random()*0.5 + 0.5
var secondMultiplier = Math.random()*3 + 2
var start = 150
var end = Math.random()*60
var part = Math.random() * 0.6 + 0.2
var angleIndex = 0
var offsets = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()]
function render() {
    requestAnimationFrame(render)
    ctx.clearRect(0, -200, canvas.width, canvas.height)
    pupilAngle = angleIndex*2*Math.PI * 0.1
    shadowAngle = angleIndex*2*Math.PI * 0.1

    jawSlant = getSmoothRandom(angleIndex, offsets[0])*0.5 + 0.5
    secondMultiplier = getSmoothRandom(angleIndex, offsets[1])*3 + 2
    start = getSmoothRandom(angleIndex, offsets[2])*50 + 130
    end = getSmoothRandom(angleIndex, offsets[3])*60
    part = getSmoothRandom(angleIndex, offsets[4]) * 0.6 + 0.2

    ctx.fillStyle = "wheat"

    ctx.lineWidth = 10
    // head outline
    drawHead(false)

    // head fill
    drawHead(true)

    ctx.lineWidth = 5
    // eyebrows
    ctx.beginPath()
    ctx.arc(canvas.width/2 - 100, canvas.height/2 - 100, 100, Math.PI*1.3, Math.PI*1.7)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(canvas.width/2 + 100, canvas.height/2 - 100, 100, Math.PI*1.3, Math.PI*1.7)
    ctx.stroke()

    // eyes
    // whites
    ctx.fillStyle = "white"

    ctx.beginPath()
    ctx.arc(canvas.width/2 - 100, canvas.height/2 - 170, 30, 0, 2*Math.PI)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(canvas.width/2 + 100, canvas.height/2 - 170, 30, 0, 2*Math.PI)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = "black"
    ctx.beginPath()
    ctx.arc(canvas.width/2 - 100 + Math.cos(pupilAngle)*15, canvas.height/2 - 170 + Math.sin(pupilAngle)*15, 15, 0, 2*Math.PI)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(canvas.width/2 + 100 + Math.cos(pupilAngle)*15, canvas.height/2 - 170 + Math.sin(pupilAngle)*15, 15, 0, 2*Math.PI)
    ctx.fill()


    // mouth
    ctx.fillStyle = "pink"
    ctx.beginPath()
    ctx.arc(canvas.width/2, canvas.height/2, 20, 0, 2*Math.PI)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.save()
    ctx.clip()
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.beginPath()
    ctx.arc(canvas.width/2 + 10*Math.cos(shadowAngle), canvas.height/2 + 10*Math.sin(shadowAngle), 15, 0, 2*Math.PI)
    ctx.closePath()
    ctx.fill()
    ctx.restore()

    // hair
    ctx.fillStyle = `rgb(${getSmoothRandom(angleIndex, offsets[5])*255}, ${getSmoothRandom(angleIndex, offsets[6])*255}, ${getSmoothRandom(angleIndex, offsets[7])*255})`
    upperHead = getTangentValues(start, start + (start-end)/2, jawSlant*secondMultiplier, canvas.height/2)

    partAngle =  (2 - part) * Math.PI

    angle = (2 - part/2) * Math.PI
    distance = Math.sqrt(((Math.cos(angle) - Math.cos(partAngle))*upperHead.r)**2 + ((Math.sin(angle) - Math.sin(partAngle))*upperHead.r)**2)

    ctx.save()

    drawHead(false, false)
    ctx.clip()

    ctx.beginPath()
    ctx.arc(canvas.width/2 + Math.cos(angle)*upperHead.r , upperHead.b + Math.sin(angle)*upperHead.r, distance, 0, 2*Math.PI)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    angle = (2 - (part + 1)/2) * Math.PI
    distance = Math.sqrt(((Math.cos(angle) - Math.cos(partAngle))*upperHead.r)**2 + ((Math.sin(angle) - Math.sin(partAngle))*upperHead.r)**2)
    ctx.beginPath()
    ctx.arc(canvas.width/2 + Math.cos(angle)*upperHead.r , upperHead.b + Math.sin(angle)*upperHead.r, distance, 0, 2*Math.PI)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.restore()

    angleIndex += 0.1

}
render()
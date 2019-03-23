const w : number = window.innerWidth
const h : number = window.innerHeight
const scGap : number = 0.05
const scDiv : number = 0.51
const nodes : number = 5
const lines : number = 2
const strokeFactor : number = 90
const sizeFactor : number = 2.9
const foreColor : string = "#4CAF50"
const backColor : string = "#212121"

const scaleFactor : Function = (scale : number) : number => Math.floor(scale / scDiv)
const maxScale : Function = (scale : number, i : number, n : number) : number => {
    return Math.max(0, scale - i / n)
}
const divideScale : Function = (scale : number, i : number, n : number) : number => {
    return Math.min(1 / n, maxScale(scale, i, n)) * n
}
const mirrorValue : Function = (scale : number, a : number, b : number) : number => {
    const k : number = scaleFactor(scale)
    return (1 - k) / a + k / b
}

const updateValue : Function = (scale : number, dir : number, a : number, b : number) : number => {
    return mirrorValue(scale, a, b) * dir * scGap
}

const drawLARNode : Function = (context : CanvasRenderingContext2D, i : number, scale : number) => {
    const gap : number = h / (nodes + 1)
    const size : number = gap / sizeFactor
    context.lineCap = 'round'
    context.lineWidth = Math.min(w, h) / strokeFactor
    context.strokeStyle = foreColor
    const sc1 : number = divideScale(scale, 0, 2)
    const sc2 : number = divideScale(scale, 1, 2)
    context.save()
    context.translate(w / 2, gap * (i + 1))
    context.rotate(Math.PI/2 * sc2)
    for (var j = 0; j < lines; j++) {
        const y : number = (size / 2) * (1 - 2 * j)
        const sc : number = divideScale(sc1, j, lines)
        context.save()
        context.translate(0, y)
        for (var k = 0; k < 2; k++) {
            context.save()
            context.rotate(2 * Math.PI / 3 * sc * k)
            context.beginPath()
            context.moveTo(0, 0)
            context.lineTo(0, -y)
            context.stroke()
            context.restore()
        }
        context.restore()
    }
    context.restore()
}

class LineAngleRotStage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : LineAngleRotStage = new LineAngleRotStage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {

    scale : number = 0
    prevScale : number = 0
    dir : number = 0

    update(cb : Function) {
        this.scale += updateValue(this.scale, this.dir, lines, 1)
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb(this.prevScale)
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

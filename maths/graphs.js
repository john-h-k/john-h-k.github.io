function lerp(a, b, t) {
    return a + (b - a) * t
}

function ratio(x, a, b) {
    return (x - a) / (b - a)
}

function toMaxPrecision(value, n) {
    return parseFloat(value.toPrecision(n)).toString()
}

// function polyToMath(c) {
//     return c instanceof Complex ? math.complex(c.re, c.im) : math.complex(c, 0)
// }

// function mathToPoly(c) {
//     return c instanceof math.Complex ? Complex(c.re, c.im) : Complex(c, 0)
// }

class Argan {
    constructor(id) {
        this.canvas = document.getElementById(id)
        this.canvas.width = 1000
        this.canvas.height = 1000
        this.context = this.canvas.getContext('2d')
        
        this.reRange = [-5, 5]
        this.imRange = [-5, 5]

        this.points = {}
        this.circles = {}

        this.canvas.onmousedown = function(ev) {
            let [x, y] = this.#canvasMouseCoordinates(ev)

            for (const point of Object.values(this.points)) {
                let [a, b] = this.#coordinatesFromValue(point.value)

                const clickRadius = 12;

                if (Math.sqrt(Math.pow(x - a, 2) + Math.pow(y - b, 2)) < clickRadius) {
                    this.draggedItem = point

                    ev.preventDefault()
                    ev.stopPropagation()
                }
            }
        }.bind(this)

        this.canvas.onmousemove = function(ev) {
            if (this.draggedItem == null) {
                return
            }

            ev.preventDefault()
            ev.stopPropagation()

            let [x, y] = this.#canvasMouseCoordinates(ev)

            this.movePoint(this.draggedItem.label, this.#valueFromCoordinates(x, y))

            this.draw()
        }.bind(this)

        this.canvas.onmouseup = function(ev) {
            ev.preventDefault()
            ev.stopPropagation()

            if (this.draggedItem != null) {
                this.draggedItem = null
            }
        }.bind(this)

        this.draw()
    }

    reset(removeCircles) {
        this.points = {}

        if (removeCircles) {
            this.circles = {}
        }
    }

    markCircle(label, radius) {
        this.circles[label] = {
            radius: radius,
            label: label
        }
    }

    markPoint(label, value, onMoveCallback) {
        if (!(value instanceof math.Complex)) {
            value = math.complex(value, 0)
        }

        this.points[label] = {
            onMoveCallback: onMoveCallback,
            label: label,
        }

        this.movePoint(label, value)
    }

    movePoint(label, value, context) {
        const point = this.points[label]

        point.value = value
        if (point.onMoveCallback != null) {
            point.onMoveCallback(point, context)
        }
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.#drawRanges()
        this.#drawCircles()
        this.#drawPoints()
    }

    #drawCircles() {
        let ctx = this.context

        ctx.font = ctx.font.replace(/\d+px/, "24px");

        for (const {radius} of Object.values(this.circles)) {
            ctx.beginPath()
        
            let [x, y] = this.#coordinatesFromValue(math.complex(0, 0))
            let radiusX = this.#realDistance(radius)
            let radiusY = this.#imagDistance(radius)
        
            ctx.ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI)
            ctx.stroke()

            if (label != null) {
                //ctx.fillText(label.toString(), x + 20, y)
            }
        }
    }

    #drawPoints() {
        let ctx = this.context

        this.#setFontSize(24)

        for (const point of Object.values(this.points)) {
            ctx.beginPath()

            const {value, label} = point
            let [x, y] = this.#coordinatesFromValue(value)

            const radius = 10;

            ctx.arc(x, y, radius, 0, 2 * Math.PI)
            ctx.fill()

            if (label != null) {
                ctx.fillText(label.toString(), x + 20, y)
            }
        }
    }

    #drawRanges() {
        const n = 10

        let ctx = this.context
        ctx.beginPath()
        this.#setFontSize(24)
        ctx.lineWidth = 5

        let x, y;

        if (this.reRange[0] <= 0 && this.reRange[1] >= 0) {
            [x, y] = this.#coordinatesFromValue(math.complex(0, 0))

            ctx.moveTo(x, 0)
            ctx.lineTo(x, this.canvas.height)
            
            ctx.moveTo(0, y)
            ctx.lineTo(this.canvas.width, y)
        } else {
            x = 0
            y = 0
        }

        let reIntervalOf = i => lerp(this.reRange[0], this.reRange[1], i / n)
        let imIntervalOf = i => lerp(this.imRange[0], this.imRange[1], i / n)

        for (let i = 1; i < n; i++) {
            let reInterval = reIntervalOf(i)
            let imInterval = imIntervalOf(i)

            let [markerX, markerY] = this.#coordinatesFromValue(math.complex(reInterval, imInterval))

            let reText = reInterval.toString()
            let imText = imInterval.toString()
            let reTextInfo = ctx.measureText(reText)
            let imTextInfo = ctx.measureText(imText)

            let offsetMarker = (marker, info) => marker - (0.3 * info.fontBoundingBoxAscent)

            if (!(i > 0 && imIntervalOf(i - 1) < 0 && imIntervalOf(i + 1) > 0)) {
                ctx.moveTo(x, markerY)
                ctx.lineTo(x - 10, markerY)
                ctx.fillText(imText, x - 10 - 5 - imTextInfo.width, offsetMarker(markerY, imTextInfo))
            }

            if (!(i > 0 && reIntervalOf(i - 1) < 0 && reIntervalOf(i + 1) > 0)) {
                ctx.moveTo(markerX, y)
                ctx.lineTo(markerX, y - 10)
                ctx.fillText(reText, offsetMarker(markerX, reTextInfo), y - 10 - 5 - reTextInfo.width)
            }
        }

        ctx.stroke()
    }

    #coordinatesFromValue(value) {
        let re, im;
        if (value instanceof math.Complex) {
            re = value.re
            im = value.im
        } else {
            re = value[0]
            im = value[1]
        }

        return [this.#realCoordinate(re), this.#imagCoordinate(im)]
    }

    #valueFromCoordinates(x, y) {
        return math.complex(this.#realValue(x), this.#imagValue(y))
    }

    #realValue(x) {
        let point = ratio(x, 0, this.canvas.width)

        return lerp(this.reRange[0], this.reRange[1], point)
    }

    #realCoordinate(value) {
        let width = this.canvas.width
        let point = ratio(value, this.reRange[0], this.reRange[1])

        return lerp(0, width, point)
    }
    
    #realDistance(value) {
        return this.#realCoordinate(this.reRange[0] + value)
    }

    #imagValue(y) {
        let point = ratio(y, this.canvas.height, 0)

        return lerp(this.imRange[0], this.imRange[1], point)
    }
    
    #imagCoordinate(value) {
        let height = this.canvas.height
        let point = ratio(value, this.imRange[0], this.imRange[1])

        return lerp(height, 0, point)
    }

    #imagDistance(value) {
        return this.canvas.height - this.#imagCoordinate(this.imRange[0] + value)
    }

    #canvasMouseCoordinates(ev) {
        const {left, top, width, height} = this.canvas.getBoundingClientRect()

        let normX = ratio(ev.clientX - left, 0, width);
        let normY = ratio(ev.clientY - top, height, 0);

        let x = lerp(0, this.canvas.width, normX)
        let y = lerp(this.canvas.height, 0, normY)

        return [x, y]
    }
    
    #setFontSize(px) {
        this.context.font = this.context.font.replace(/\d+px/, `${px}px`);
    }
}

const CoefficientNames = "abcdefghijklmno"
class DisplayedPolynomial {
    constructor(degree, coefficients) {
        if (coefficients.length - 1 != degree) {
            throw "Coefficients does not match degree"
        }

        this.degree = degree
        this.coefficients = coefficients

        this.#setPageRoots()
        this.#setPageCoefficients()

        this.#solveRoots()

        let equationParts = []
        for (let i = 0; i < degree + 1; i++) {
            equationParts.push(`${CoefficientNames[i]}x^${degree - i}`)
        }

        this.equation = equationParts.join(" + ")

        if (this.#simpleName()) {
            this.equation += ` (${this.#simpleName()})`
        }

        document.getElementById("equation").innerHTML = this.equation
    }

    setRoots(roots) {
        roots ??= Array(this.degree).fill(0)
        if (roots.length - 1 != this.degree) {
            throw "Coefficients does not match degree"
        }

        const poly = Polynomial.fromRoots(roots)
        this.roots = roots
        this.coefficients = poly.coeffArray.slice().reverse()
    }

    setCoefficient(index, value) {
        coefficients.movePoint(CoefficientNames[index], value, true)
    }

    #changeCoefficient(point, entryBoxChange) {
        let index = CoefficientNames.indexOf(point.label)
        let div = document.getElementById(`coefficient_${index}`)

        this.coefficients[index] = point.value

        if (entryBoxChange) {
            coefficients.draw()
        } else {
            div.querySelector("input[name='reValue']").value = toMaxPrecision(point.value.re, 4)
            div.querySelector("input[name='imValue']").value = toMaxPrecision(point.value.im, 4)
        }

        this.#solveRoots()
    }

    #solveRoots() {
        const reversedCoefficients = this.coefficients.slice().reverse().map(x => {
            if (!(x instanceof Complex)) {
                x = x.re != null && x.im != null ? new Complex(x) : new Complex(x, 0)
            }
            
            return x
        })

        const poly = new Polynomial(reversedCoefficients)
    
        this.roots = poly.complexRoots(this.roots ?? rootGuess(reversedCoefficients)).root.map(x => math.complex(x))

        for (const [i, root] of this.roots.entries()) {
            roots.movePoint(`x${i}`, root)
        }

        roots.draw()
    }


    #setPageCoefficients() {
        coefficients.reset()

        let first = document.getElementById(`coefficient_0`)
        let clone = first.cloneNode(true)
        let parent = first.parentNode

        parent.innerHTML = ""
        parent.appendChild(clone)

        first = clone

        coefficients.markPoint(CoefficientNames[0], this.coefficients[0], this.#changeCoefficient.bind(this))

        for (let i = 1; i < this.degree + 1; i++) {
            const label = CoefficientNames[i]
            const coefficient = this.coefficients[i]

            clone = first.cloneNode(true)
            
            clone.id = `coefficient_${i}`
            clone.querySelector(".name").innerHTML = label

            parent.appendChild(clone)

            coefficients.markPoint(label, coefficient, this.#changeCoefficient.bind(this))
        }
    }

    #setPageRoots() {
        roots.reset()

        let first = document.getElementById(`root_0`)
        let clone = first.cloneNode(true)
        let parent = first.parentNode

        parent.innerHTML = ""
        parent.appendChild(clone)

        first = clone

        roots.markPoint(`x0`, 0)

        for (let i = 1; i < this.degree; i++) {
            const label = `x${i}`

            clone = first.cloneNode(true)
            
            clone.id = `root_${i}`
            clone.querySelector(".name").innerHTML = label

            parent.appendChild(clone)

            roots.markPoint(label, 0)
        }
    }

    #simpleName() {
        return {
            1: "linear",
            2: "quadratic",
            3: "cubic",
            4: "quartic",
            5: "quintic",
            6: "sextic"
        }[this.degree]
    }
}

Polynomial.setField("C")
Object.defineProperty(Complex.prototype, "mod", {
    get: function mod() {
        return this.abs()
    }
});

const coefficients = new Argan("coefficients")
const roots = new Argan("roots")

const degreeInput = document.getElementById("degree")

let polynomial;

degreeInput.addEventListener('input', function() {
    let randomCoefficients = [];

    const randomComplex = () => math.complex(math.random(-2, 2), math.random(-2, 2))

    const degree = parseInt(degreeInput.value)

    randomCoefficients = Array(degree + 1).fill(0).map(_ => randomComplex())
    polynomial = new DisplayedPolynomial(degree, randomCoefficients)

    coefficients.draw()
    roots.draw()
})

degreeInput.dispatchEvent(new Event('input'));

for (const input of document.querySelectorAll("input[name='reValue'], input[name='imValue']")) {
    input.addEventListener('input', function(ev) {
        ev.preventDefault()
        ev.stopPropagation()

        const target = ev.target

        let index = parseInt(target.parentNode.id.match(/coefficient_(\d)/)[1])
        let change = parseFloat(target.value)
        let value

        if (target.getAttribute("name") == "reValue") {
            value = math.complex(change, polynomial.coefficients[index].im)
        } else {
            value = math.complex(polynomial.coefficients[index].re, change)
        }

        polynomial.setCoefficient(index, value)
    })
}
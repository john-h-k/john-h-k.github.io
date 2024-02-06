
// IMPORTANT
// this was hacked together over a rushed lunch break - it is not elegant or very clear. but it mostly works :)

let timer = 480; // 8 minutes in seconds
let questionIndex = 0;
let score = 0;

function initializeTest() {
    // Start the timer
    setInterval(updateTimer, 1000);
    
    // Generate the first question
    generateAndDisplayQuestion();
}

function updateTimer() {
    timer--;
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    document.getElementById("timer").innerText = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    if (timer <= 0) {
        endTest();
    }
}

function generateAndDisplayQuestion() {
    const question = genQuestion();
    const display = document.getElementById("question-display");
    
    // Set question text
    display.innerHTML = `<math>
        <mn>${question.op1 || "?"}</mn>
        <mspace width="5px"/>
        <mo>${question.op}</mo>
        <mspace width="5px"/>
        <mn>${question.op2 || "?"}</mn>
        <mo>=</mo>
        <mn>${question.rhs || "?"}</mn>
    </math>`;

    // Set answers
    for(let i = 0; i < 4; i++) {
        document.getElementById(`answer${i}`).innerText = question.answers[i].value;
        document.getElementById(`answer${i}`).dataset.correct = question.answers[i].correct;
    }

    document.getElementById("question-number").innerText = `${questionIndex + 1}/80`;
    document.getElementById("question-type").innerText = question.ty;
    questionIndex++;
}

function submitAnswer(index) {
    const answerBtn = document.getElementById(`answer${index}`);
    if(answerBtn.dataset.correct === "true") {
        score++;
    } else {
        score -= 2;
    }
    document.getElementById("score").innerText = `Score: ${score}`;

    if(questionIndex >= 80) {
        endTest();
    }

    // Generate the next question
    generateAndDisplayQuestion();
}

function endTest() {
    alert(`Test ended! Your score is: ${score}`);
    
    // TODO: Implement a proper ending screen if needed.
}

function genQuestion() {
    let op = pickOp();
    let [ty, values] = pickValues(op);

    let answers = genBadAnswers(op, ty, values);
    let answer_pos = Math.floor(Math.random() * 3);
    let answer = formatValue(ty, genAnswer(op, ty, values));
    
    answers.splice(answer_pos, 0, { value: answer, correct: true });

    return {
        ty: ty,
        op1: values[0],
        op: op,
        op2: values[1],
        rhs: values[2],
        answers: answers
    };
}

function formatValue(ty, value) {
    switch (ty) {
        case "integer":
            return Math.round(value);
        case "decimal":
            return Math.fround(value).toFixed(3);
        case "fraction":
            return [Math.round(value[0]), Math.round(value[1])];
    }
    
}

function genBadAnswers(op, ty, values) {
    let real = genAnswer(op, ty, values);

    let fakes;

    // FIXME: better logic
    switch (ty) {
        case "integer":
            let err = real > 100 ? 0.05 : 0.2;
            fakes = [
                tryTillNotEqual((i) => real + randInt(real * err * i), real),
                tryTillNotEqual((i) => real - randInt(real * err * i), real),
                tryTillNotEqual((i) => real - randInt(real * err * i), real)
            ];
            break;
        case "decimal":
            fakes = [
                real + randDecimal(real * 0.05),
                real - randDecimal(real * 0.1),
                real - randDecimal(real * 0.1)
            ];
            break;
        case "fraction":
            // TODO:
            fakes = [
                real + randFn(real * 0.05),
                real - randFn(real * 0.1),
                real - randFn(real * 0.1)
            ];
            break;
    }
    return fakes.map(v => ({ value: formatValue(ty, v), correct: false }));
}

function tryTillNotEqual(fn, val) {
    let i = 0;
    while (true) {
        let v = fn(i);
        if (v != val) {
            return v; 
        }

        i++;
    }
}

function genAnswer(op, ty, values) {
    switch (op) {
        case '+':
            if (values[0] === null) {
                return values[2] - values[1];
            } else if (values[1] === null) {
                return values[2] - values[0];
            } else {
                return values[0] + values[1];
            }
        case '-':
            if (values[0] === null) {
                return values[2] + values[1];
            } else if (values[1] === null) {
                return values[0] - values[2];
            } else {
                return values[0] - values[1];
            }
        case '*':
            if (values[0] === null) {
                return values[2] / values[1];
            } else if (values[1] === null) {
                return values[2] / values[0];
            } else {
                return values[0] * values[1];
            }
        case '/':
            if (values[0] === null) {
                return values[2] * values[1];
            } else if (values[1] === null) {
                return values[0] / values[2];
            } else {
                return values[0] / values[1];
            }
    }
}

function pickValues(op) {
    let [int_max, mul_max] = randChoice([
        [50, 50],
        [500, 10],
        [2000, 5]
    ]);

    let unknown_pos = Math.floor(Math.random() * 3);
    let ty = randChoice(["integer" /* "decimal", "fraction" */]);

    let values;
    switch (ty) {
        case "integer": {
            // always solvable
            if (op == "+" || op == "-" || (op == "*" && unknown_pos == 2) || (op == "/" && unknown_pos == 0)) {
                values = [randInt(int_max), randInt(int_max)];
            } else if (op == "*") {
                // just generate second rand as multiple of first
                v = randInt(int_max);
                values = [v, v * randInt(mul_max)]
            } else {
                // either a/<unknown> = b or a/b = <unknown>
                v = randInt(int_max);
                values = [v * randInt(mul_max), v]
            }
            
            values.splice(unknown_pos, 0, null);
            break;
        }
        case 1: {
            if (op == "+" || op == "-") {
                values = [randDecimal(int_max), randDecimal(int_max)];
            } else {
                // one int 
                values = [randInt(int_max), randDecimal(int_max)]
                if (randBool()) {
                    values.reverse();
                }
            }

            values.splice(unknown_pos, 0, null);
            break;
        }
        case 2: {
            FRAC_PART_MAX = 50
            values = [[randInt(FRAC_PART_MAX), randInt(FRAC_PART_MAX)], [randInt(FRAC_PART_MAX), randInt(FRAC_PART_MAX)]];
            break;
        }
    }

    return [ty, values];
}

function randChoice(arr) {
    return arr[randInt(arr.length) - 1];
}

function randBool() {
    return Math.random() < 0.5;
}

function randInt(maxVal) {
    return Math.floor(Math.random() * maxVal) + 1;
}

function randDecimal(maxVal) {
    let value = Math.random() * maxVal;
    return parseFloat((value > 0 ? value.toPrecision(4) : value.toPrecision(2)));
}

function pickOp() {
    switch (Math.floor(Math.random() * 4)) {
        case 0:
            return "+";
        case 1:
            return "-";
        case 2:
            return "*";
        case 3:
            return "/";
    }
}


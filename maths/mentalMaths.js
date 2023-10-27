
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
    let [ty, values] = pickValues();

    // insert null into 0 (op1) 1 (op2) or 2 (rhs)
    let unknown_pos = Math.floor(Math.random() * 3);
    values.splice(unknown_pos, 0, null);

    let answers = genBadAnswers(op, ty, values);
    let answer_pos = Math.floor(Math.random() * 3);
    let answer = formatValue(ty, genAnswer(op, ty, values));
    
    answers.splice(answer_pos, 0, { value: answer, correct: true });

    return {
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

    // FIXME: better logic
    return [real + 1, real * 10, real - 5].map(v => ({ value: formatValue(ty, v), correct: false }));
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

function pickValues() {
    switch (Math.floor(Math.random() * 2 /* no fractions rn */)) {
        case 0:
            INT_MAX = 2000
            return ["integer", [randInt(INT_MAX), randInt(INT_MAX)]];
        case 1:
            return ["decimal", [randDecimal(), randDecimal()]];
        case 2:
            FRAC_PART_MAX = 50
            return ["fraction", [[randInt(FRAC_PART_MAX), randInt(FRAC_PART_MAX)], [randInt(FRAC_PART_MAX), randInt(FRAC_PART_MAX)]]];
    }
}

function randInt(maxVal) {
    return Math.floor(Math.random() * maxVal) + 1;
}

function randDecimal() {
    return parseFloat((Math.random() * 2000).toFixed(3));
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


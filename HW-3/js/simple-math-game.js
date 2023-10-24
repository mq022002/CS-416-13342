let difficultyLevel = $('input:radio:checked').val();

let randomNumber1, op, randomNumber2, correct;

let numberOfButtons;
let uniqueNumbers = [];

let score = 0;
let scoreTotal = 0;

let timer;
let timerDuration = 0;

$('input:radio[name=difficulty]').change(function () {
    difficultyLevel = $('input:radio:checked').val();
    reset();
    generateButtons();
});

function generateExpression() {
    randomNumber1 = Math.floor(Math.random() * 89) + 11;
    const randomValue = Math.random();

    if (randomValue < 0.33) {
        op = '+';
    } else if (randomValue < 0.66) {
        op = '-';
    } else {
        op = '*';
    }

    randomNumber2 = Math.floor(Math.random() * (randomNumber1 - 11)) + 11;

    if (op === '+') {
        correct = randomNumber1 + randomNumber2;
    } else if (op === '-') {
        correct = randomNumber1 - randomNumber2;
    } else if (op === '*') {
        correct = randomNumber1 * randomNumber2;
    }

    $('#expression').text(randomNumber1 + " " + op + " " + randomNumber2);
    generateButtons();
    startTimer();
}
generateExpression();

function startTimer() {
    if (timer) {
        clearInterval(timer);
    }

    if (difficultyLevel === 'hard') {
        timerDuration = 10;
    } else if (difficultyLevel === 'insane') {
        timerDuration = 3;
    } else {
        timerDuration = 0;
    }

    if (timerDuration > 0) {
        $('#timer').show();
        let timeLeft = timerDuration;
        generateTimerText(timeLeft);
        timer = setInterval(function () {
            timeLeft--;
            generateTimerText(timeLeft);
            if (timeLeft === 0) {
                checkCorrect(-1);
                clearInterval(timer);
                generateExpression();
            }
        }, 1000);
    } else {
        $('#timer').hide();
    }
}

function generateTimerText(timeLeft) {
    $('#timer').css( 'color', '#4E0707').text("Time left: " + timeLeft);
}


function generateRandomChoices() {
    if (op === '+') {
        return Math.floor(Math.random() * 90) + 11;
    } else if (op === '-') {
        return Math.floor(Math.random() * 90) + 10;
    } else if (op === '*') {
        return Math.floor(Math.random() * 10000) + 1;
    }
}

function generateButtons() {
    if (difficultyLevel == "insane" || difficultyLevel == "hard") {
        numberOfButtons = 10;
    } else {
        numberOfButtons = 5;
        $('#timer').hide();
    }

    $('#choices').empty();
    let buttonValues = [];
    buttonValues.push(correct);

    for (let i = 1; i < numberOfButtons; i++) {
        let randomNumber;
        do {
            randomNumber = generateRandomChoices();
        } while (buttonValues.includes(randomNumber));

        buttonValues.push(randomNumber);
    }

    buttonValues.sort(function (randomNumber1, randomNumber2) { return randomNumber1 - randomNumber2; });

    for (let i = 0; i < numberOfButtons; i++) {
        const button = $('<button class="btn btn-primary btn-lg container-sm col-sm-1 mb-2 px-2">').text(buttonValues[i]);
        button.click(function () {
            checkCorrect(buttonValues[i]);
        });
        $('#choices').append(button).append(" ");
    }
}

function checkCorrect(selectedNumber) {
    if (selectedNumber === -1) {
        $('#feedback').css('color', 'gray').text("No answer");
        scoreTotal++;
    } else {
        scoreTotal++;
        if (selectedNumber == correct) {
            score++;
            $('#feedback').css('color', 'green').text("Correct!");
        } else {
            $('#feedback').css('color', 'red').text("Wrong. " + randomNumber1 + " " + op + " " + randomNumber2 + " = " + correct);
        }
    }
    $('#score').text("Score: " + score + "/" + scoreTotal);
    generateExpression();
    startTimer();
}

function reset() {
    score = 0;
    scoreTotal = 0;
    uniqueNumbers = [];
    $('#score').text("Score: 0/0");
    $('#feedback').text("");
    generateExpression();
    startTimer();
}

$('#reset').click(function () {
    reset();
});
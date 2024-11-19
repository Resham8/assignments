let currentQuestionIndex = 0;
let selectedAnswers = new Array(quizData.length).fill(null);
let isAnswerChecked = false;

function renderQuestion() {
    isAnswerChecked = false;
    const question = quizData[currentQuestionIndex];
    const questionEl = document.getElementById("question");
    questionEl.textContent = question.question;

    const optionEl = document.getElementById("options");
    optionEl.innerHTML = '';

    ['a', 'b', 'c', 'd'].forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        if (selectedAnswers[currentQuestionIndex] === option) {
            button.classList.add('selected');            
            if (option === question.correct) {
                button.classList.add('correct');
            } else {
                button.classList.add('incorrect');
            }
        }
        button.textContent = question[option];
        button.onclick = () => selectOption(option);
        optionEl.appendChild(button);
    });

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.textContent = currentQuestionIndex === quizData.length - 1 ? 'Finish' : 'Next';
}

function selectOption(option) {
    if (isAnswerChecked) return; 

    selectedAnswers[currentQuestionIndex] = option;
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected', 'correct', 'incorrect');
    });
    
    const selectedButton = event.target;
    selectedButton.classList.add('selected');
    
    const currentQuestion = quizData[currentQuestionIndex];
    if (option === currentQuestion.correct) {
        selectedButton.classList.add('correct');
    } else {
        selectedButton.classList.add('incorrect');        
        document.querySelectorAll('.option-btn').forEach(btn => {
            if (btn.textContent === currentQuestion[currentQuestion.correct]) {
                btn.classList.add('correct');
            }
        });
    }
    isAnswerChecked = true;
}

function showResults() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const correct = selectedAnswers.reduce((score, answer, index) => 
        answer === quizData[index].correct ? score + 1 : score, 0);
    
    const percentage = ((correct / quizData.length) * 100).toFixed(1);
        
    const modalContent = document.createElement("div");
    modalContent.className = 'modal-content';

    const header = document.createElement("h2");
    header.textContent = 'Quiz Results';
    modalContent.appendChild(header);

    const resultDetails = document.createElement('div');
    resultDetails.className = 'result-details';
    
    const score = document.createElement('h3');
    score.textContent = `Score: ${correct}/${quizData.length} (${percentage}%)`;
    resultDetails.appendChild(score);
    
    modalContent.appendChild(resultDetails);
    
    const questionsReview = document.createElement('div');
    questionsReview.className = 'questions-review';

    quizData.forEach((question, index) => {
        const userAnswer = selectedAnswers[index];
        const isCorrect = userAnswer === question.correct;

        const reviewDiv = document.createElement("div");
        reviewDiv.setAttribute("class",`question-review ${isCorrect ? 'correct' : 'incorrect'}`);

        const pRight = document.createElement("p");
        pRight.innerHTML = `<strong>Q${index + 1}:</strong> ${question.question}`;

        const pAns = document.createElement("p");
        pAns.innerHTML = `Your answer: ${userAnswer ? question[userAnswer] : 'Not answered'}` ;

        const pCorrect = document.createElement("p");
        pCorrect.innerHTML = `Correct answer: ${question[question.correct]}`;

        reviewDiv.appendChild(pRight);
        reviewDiv.appendChild(pAns);
        reviewDiv.appendChild(pCorrect);

        questionsReview.appendChild(reviewDiv);
        
    });

    modalContent.appendChild(questionsReview);

    const restartBtn = document.createElement('button');
    restartBtn.className = 'restart-btn';
    restartBtn.textContent = 'Restart Quiz';
    restartBtn.onclick = restartQuiz;

    modalContent.appendChild(restartBtn);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    setTimeout(() => modal.classList.add('show'), 10);
}

function restartQuiz() {
    currentQuestionIndex = 0;
    selectedAnswers = new Array(quizData.length).fill(null);
    isAnswerChecked = false;
    document.querySelector('.modal').remove();
    renderQuestion();
}

document.getElementById('prevBtn').onclick = () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
};

document.getElementById('nextBtn').onclick = () => {
    if (currentQuestionIndex === quizData.length - 1) {
        showResults();
    } else {
        currentQuestionIndex++;
        renderQuestion();
    }
};


renderQuestion();
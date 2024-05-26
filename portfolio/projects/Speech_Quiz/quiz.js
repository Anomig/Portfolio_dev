const questions = [
    {
        question: "What is the capital of France?",
        answer: "Paris"
    },
    {
        question: "What is 2 + 2?",
        answer: "4"
    },
    {
        question: "What is the color of the sky on a clear day?",
        answer: "blue"
    }
];

let currentQuestionIndex = 0;
const questionElement = document.getElementById('question');
const resultElement = document.getElementById('result');
const startButton = document.getElementById('startButton');

function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
}

function listen() {
    return new Promise((resolve, reject) => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            resolve(transcript);
        };

        recognition.onerror = (event) => {
            reject(event.error);
        };
    });
}

async function askQuestion() {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;
        speak(currentQuestion.question);

        try {
            const answer = await listen();
            if (answer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
                resultElement.textContent = "Correct!";
                speak("Correct!");
            } else {
                resultElement.textContent = `Incorrect! The correct answer was ${currentQuestion.answer}.`;
                speak(`Incorrect! The correct answer was ${currentQuestion.answer}.`);
            }
        } catch (error) {
            resultElement.textContent = "Sorry, I didn't catch that. Please try again.";
            speak("Sorry, I didn't catch that. Please try again.");
        }

        currentQuestionIndex++;
        setTimeout(askQuestion, 3000);
    } else {
        questionElement.textContent = "Quiz finished!";
        speak("Quiz finished!");
    }
}

startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    askQuestion();
});

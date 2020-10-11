
document.addEventListener("DOMContentLoaded", function (e) {

    // skapa class Question, med flera egenskaper 
    class Question {
        constructor(question) {
            this.id = question.id;
            this.question = question.question;
            this.answers = question.answers;
            this.multiple_correct_answers = question.multiple_correct_answers;
            this.correct_answers = question.correct_answers;
        }
    }
     // skapa class QuestionSet
    class QuestionSet {
        constructor(elements) {  
            this.questions = [];  // skapa array 

            for (let element of elements) {   // loop genom array
                this.questions.push(new Question(element));    // push new Question i array
            }
        }
          // metod som skapar och visar list med alla frågor och svar 
        renderList() {
            this.questions.forEach((question, index) => {     // forEach anropar funktion för varje element i array

                // skapa div för frågor 
                let questionDiv = document.createElement("div");
                questionDiv.classList.add("question"); // lägg class "question", för css
                questionDiv.innerText = (index +1) + ". " + question.question;    

                // skapa div för alla svar
                let answersDiv = document.createElement("div");
                answersDiv.classList.add("answers"); // lägg class "answers", för css

                // Object.values retunerar array med värdet [alla answers]
                Object.values(question.answers).forEach((answer, index) => {   // forEach anropar funktion för varje element i array
                    let uniqueId = question.id + "-" + index ; // skapa uniqId för varje answer    question.id -> 978-0 <- index answer
                    if (answer) {
                        let answerDiv = document.createElement("div");// div för varje svar
                        let label = document.createElement("label"); //  label för svar
                        label.innerText = answer;
                        label.htmlFor = uniqueId; // set egenskap ,label for uniqueID 

                        // skapa input med checkbox eller radio
                        let input = document.createElement("input");
                        if(question.multiple_correct_answers === "true"){
                            input.setAttribute ("type", "checkbox");
                            input.setAttribute("id", uniqueId);
                        }
                        else {
                            input.setAttribute ("type", "radio");
                            input.setAttribute("name", question.id);
                            input.setAttribute("id",  uniqueId);
                        }
                        
                        //när man klickar på radio/checkboxarna anropar man funct handleClick
                        input.addEventListener("click", function (event) { handleClick(event, index, question.correct_answers) });

                        answerDiv.appendChild(input);
                        answerDiv.appendChild(label);
                        answersDiv.appendChild(answerDiv);
                    }
                })

                quiz.appendChild(questionDiv);
                quiz.appendChild(answersDiv);
            })

        }

    }
      //frågorna läsas från https://quizapi.io/ som levererar ett resultat i JSON
    fetch("https://quizapi.io/api/v1/questions?apiKey=XpwLTryzZOOtDKkZ3QHVLMvZ79R5QhWii0UPmBEq&category=code&difficulty=Easy&limit=10&tags=JavaScript")
        .then(response => response.json())
        .then(data => {
           let questions = new QuestionSet(data);
           startBtn.addEventListener("click", function () { questions.renderList() });
        })

    //  div för buttons
    const buttonsDiv = document.getElementById("buttons");

     // skapa Start button
     const startBtn = document.createElement("button");
     startBtn.setAttribute("id", "btnStart");
     startBtn.setAttribute("type", "button");
     startBtn.innerText = "Start";
     

    // skapar Submit button
    const submitBtn = document.createElement("button");
    submitBtn.setAttribute("id", "btnSubmitAnswers");
    submitBtn.setAttribute("type", "button");
    submitBtn.addEventListener("click", function (event) { handleSubmit(event) }); //när man klickar på Submit anropar man funct handleSubmit
    submitBtn.innerText = "Submit";

    // skapar Play again button
    const startAgainBtn = document.createElement("button");
    startAgainBtn.setAttribute("id", "btnStartAgain");
    startAgainBtn.setAttribute("type", "button");
    startAgainBtn.addEventListener("click",handleStartAgain); //när man klickar på Play again anropar man funct handleStartAgain
    startAgainBtn.innerText = "Play again";


    buttonsDiv.appendChild(submitBtn);
    buttonsDiv.appendChild(startBtn);
    buttonsDiv.appendChild(startAgainBtn);

})

let score = 0;

// funktion som kontrollerar svar och ger poäng
function handleClick(event, inputIndex, correct_answers) {   
    const isChecked = event.target.checked; //  event.target kontrollerar vilket elementet i formuläret som klickades på
    const correctAnswerList = Object.values(correct_answers); // Object.values retunerar array med värdet ["true", "false", "false", "false"]
    const isCorrect = correctAnswerList.filter((corr,index) => index === inputIndex)[0];
 
    //  spelaren har checked rätt svar
    if ( isChecked && isCorrect === "true"){
       // console.log("CORRECT")  
        score += 1;  // plus 1 poäng
        
    }
    // console.log("skore: " + score) 
}
// function som visar spelarens namn och hur många poäng spelare fick 
    function handleSubmit(event) {
    const resultDiv = document.getElementById("result");
    const playerName = document.getElementById("namePlayer").value;
   
    resultDiv.innerHTML =  playerName + "'s result: " + score;
    event.target.style.display = "none";  // ta bort submit button, när man gjörde submit 

}

function handleStartAgain() {
    location.reload()  // när man klickar på button play again, sida laddas om 
}
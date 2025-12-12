let draggingCard = null;
let dragOverBox = null;
let dragOverCard = null;

let currentIdx = 0;

// [수정 1] const -> let으로 변경 (그래야 나중에 데이터를 채울 수 있음)
let gameData = []; 

// 데이터를 불러오는 함수
function loadGameData() {
    fetch('game_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log("데이터 로딩 성공:", data); // 확인용 로그
            gameData = data; // 가져온 데이터를 변수에 저장
            initGame();      // 데이터 로딩이 끝나면 게임 시작
        })
        .catch(function(error) {
            console.log("Error loading JSON: " + error);
            alert("데이터 파일을 불러올 수 없습니다.\n꼭 VS Code의 'Live Server'로 실행해주세요!");
        });
}

function onDragStartCard(){
    draggingCard = this;
}

function onDragEndCard(){
    draggingCard = null;

    if (dragOverCard) dragOverCard.classList.remove("overCard");
    if (dragOverBox) dragOverBox.classList.remove("overBox");
}

function onDragOverCard(event){
    event.preventDefault(); 
    dragOverCard = this;
    this.classList.add("overCard");
}

function onDragLeaveCard(event){
    event.preventDefault();
    dragOverCard = null;
    this.classList.remove("overCard");
}

function onDropCard(event){
    event.stopPropagation();
    this.parentNode.insertBefore(draggingCard, this);
}

function onDragOverBox(event){
    event.preventDefault();
    dragOverBox=this;
    this.classList.add("overBox");
}

function onDragLeaveBox(){
    dragOverBox = null;
    this.classList.remove("overBox");
}

function onDropBox(event){
    event.preventDefault();
    this.appendChild(draggingCard);
}

function initGame(){
    // 데이터가 없으면 중단
    if(gameData.length === 0) return;

    let data = gameData[currentIdx];

    $("#korText").text(data.kor);
    $("#msg").text("");
    $("#nextBtn").hide();

    // 배경색 초기화
    $("#answerBox").css("background-color", "darkgrey");
    $("#answerBox").css("border-color", "green"); 

    let words = data.eng.split(" ");

    words.sort(function(){ return Math.random() - 0.5});

    let sourceBox = document.getElementById("sourceBox");
    document.getElementById("answerBox").innerHTML = "";
    sourceBox.innerHTML = "";

    for(let word of words){
        let div = document.createElement("div");
        div.className = "word-card";
        div.draggable = true;
        div.innerHTML = word;

        div.addEventListener("dragstart", onDragStartCard);
        div.addEventListener("dragend", onDragEndCard);
        div.addEventListener("dragover", onDragOverCard);
        div.addEventListener("dragleave", onDragLeaveCard);
        div.addEventListener("drop", onDropCard);

        sourceBox.appendChild(div);
    }
}

function checkAnswer(){
    let myAnswer = "";
    let cards = document.querySelectorAll("#answerBox .word-card");

    for(let i=0; i<cards.length; i++){
        myAnswer += cards[i].innerHTML;
        if(i < cards.length - 1) myAnswer += " ";
    }

    let realAnswer = gameData[currentIdx].eng;

    if(myAnswer === realAnswer){
        $("#msg").text("정답!").css("color", "blue");
        $("#answerBox").css("background-color", "lightgreen"); 
        $("#answerBox").css("border-color", "blue");
        $("#nextBtn").show();
    } else{
        $("#msg").text("틀렸습니다.").css("color", "red");
        $("#answerBox").css("background-color", "lightpink"); 
    }
}

function nextGame(){
    currentIdx ++;
    if(currentIdx >= gameData.length){
        alert("모든 문제 완료");
        currentIdx = 0;
    }
    initGame();
}

$(document).ready(function(){
    // [수정 2] 여기서 initGame()이 아니라 loadGameData()를 호출해야 함
    loadGameData(); 

    $("#checkBtn").click(checkAnswer);
    $("#nextBtn").click(nextGame);

    let boxes = document.querySelectorAll(".box");
    for(let box of boxes){
        box.addEventListener("dragover", onDragOverBox);
        box.addEventListener("dragleave", onDragLeaveBox);
        box.addEventListener("drop", onDropBox);
    }
});
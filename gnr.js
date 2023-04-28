let rolled = 0
let point = 0
let rollmessage = ""

function roll(guessed) {
    if (point <= -50) {
        rollmessage = "YOU LOST THE GAME!"
    }
    else if (point >= 50) {
        rollmessage = "YOU WON THE GAME!"
    }
    else {
        game(guessed)
    }

    document.getElementById("rollMsg").innerText = rollmessage;

}


function game(guessed) {
    document.getElementById("guessRes").innerText = guessed;

    changeImage("guessImg",guessed)


    rolled = randomIntFromInterval(1, 6)

    document.getElementById("rollRes").innerText = rolled;
    changeImage("rollImg", rolled)
    
    console.log(guessed, rolled)

    if (guessed == rolled) {
        point += 10
        rollmessage = "YOU GUESSED IT RIGHT!"
    }
    else {
        point -= 1
        if (Math.abs(guessed - rolled)==1) {
            rollmessage = "OOPS! YOU WERE SOO CLOSE"
        }
        else {
            rollmessage = "BETTER LUCK NEXT TIME!"
        }
    }
    document.getElementById("rollMsg").innerText = rollmessage;
    document.getElementById("points").innerText = point;

}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function changeImage(imgID, num) {
    var image = document.getElementById(imgID);
    switch (num) {
        case 1: imgSrc = "ludo1.png"
            break;
        case 2: imgSrc = "ludo2.png"
            break;
        case 3: imgSrc = "ludo3.png"
            break;
        case 4: imgSrc = "ludo4.png"
            break;
        case 5: imgSrc = "ludo5.png"
            break;
        case 6: imgSrc = "ludo6.png"
            break;
        default : imgSrc = ""
    }
    image.src = imgSrc;
    image.alt = ":(";
}
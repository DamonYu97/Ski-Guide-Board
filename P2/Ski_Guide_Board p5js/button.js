var buttonValue;

function setButtonValue() {
    if(buttonCode == '') {
        return;
    }
    if(currentPage == 'home') {
        if (buttonCode == '1') {
            buttonValue = 'easy';
        } else if (buttonCode == '2') {
            buttonValue = 'middle';
        } else if (buttonCode == '3') {
            buttonValue = 'hard';
        } else if (buttonCode == '4') {
            buttonValue = 'hard+';
        } else if (buttonCode == '5') {
            buttonValue = 'forecast';
        } else if (buttonCode == '6') {
            buttonValue = 'photo';
        }
    } else if (currentPage == 'easy' || currentPage == 'middle' || currentPage == 'hard' || currentPage == 'hard+') {
        if (buttonCode == '3') {
            buttonValue = 'next';
        } else if (buttonCode == '4') {
            buttonValue = 'last';
        } else if (buttonCode == '5') {
            buttonValue = 'home';
        } else if (buttonCode == '6') {
            buttonValue = 'print';
        } 
    } else if (currentPage == 'forecast') {
        if (buttonCode == '5') {
            buttonValue = 'home';
        }
    }
}

function keyPressed() {
    console.log(keyCode);
    if(currentPage == 'home') {
        if (keyCode == 49) {
            buttonValue = 'easy';
        } else if (keyCode == 50) {
            buttonValue = 'middle';
        } else if (keyCode == 51) {
            buttonValue = 'forecast';
        } else if (keyCode == 52) {
            buttonValue = 'hard+';
        }
    } else if (currentPage == 'easy' || currentPage == 'middle' || currentPage == 'hard' || currentPage == 'hard+') {
        if (keyCode == LEFT_ARROW) {
            buttonValue = 'left';
        } else if (keyCode == RIGHT_ARROW) {
            buttonValue = 'right';
        } else if (keyCode == 8) {
            buttonValue = 'home';
        } else if (keyCode == 87) {
            buttonValue = 'zoomIn';
        } else if (keyCode == 83) {
            buttonValue = 'zoomOut';
        } else if (keyCode == 65) {
            buttonValue = 'last';
        } else if (keyCode == 68) {
            buttonValue = 'next';
        }
    } else if (currentPage == 'forecast') {
        if (keyCode == '8') {
            buttonValue = 'home';
        }
    }
}


function bottomButton(name, color, x) {

    fill(173, 135, 98);
    strokeWeight(3);
    stroke(173, 135, 98, 120);
    rect(x + 35, windowHeight - 90, 60, 100);
    
    button(name, color, x + 65, windowHeight - 100);
}

function bottomButtonSimple(name, color, x) {
    buttonSimple(name, color, x, windowHeight - 60);
}

function leftButtonSimple (name, color) {
    buttonSimple(name, color, 60, windowHeight / 2);
}

function rightButtonSimple (name, color) {
    buttonSimple(name, color, windowWidth - 60, windowHeight / 2);
}

function buttonSimple(name, color, x, y) {
    fill(0, 50);
    strokeWeight(4);
    stroke(192,192,192, 50);
    circle(x, y, 60);

    fill(color, 200);
    strokeWeight(1);
    stroke(255, 50);
    circle(x, y, 52);

    fill(0, 200);
    strokeWeight(2);
    textSize(30);
    text(name, x - 10, y + 10);
}





function leftButton(name, color) {
    fill(173, 135, 98);
    strokeWeight(3);
    stroke(173, 135, 98, 120);
    rect(0, windowHeight / 2 - 30, 100, 60);

    button(name, color, 100, windowHeight / 2);
}

function rightButton(name, color) {
    fill(173, 135, 98);
    strokeWeight(3);
    stroke(173, 135, 98, 120);
    rect(windowWidth - 100, windowHeight / 2 - 30, 100, 60);

    button(name, color, windowWidth - 100, windowHeight / 2);
}

function button(name, color, x, y) {
    fill(0);
    strokeWeight(4);
    stroke(192,192,192);
    circle(x, y, 120);

    fill(color);
    strokeWeight(1);
    stroke(255);
    circle(x, y, 112);

    /*fill(255, 200);
    strokeWeight(6);
    stroke(255, 126);
    circle(x + 55, windowHeight - 140, 10);*/

    //console.log("here");
    /*fill(color);
    noStroke();
    beginShape();
    vertex(x, windowHeight - 100);
    vertex(x + 65, windowHeight - 150);
    vertex(x + 130, windowHeight - 100);
    vertex(x + 130, windowHeight);
    vertex(x, windowHeight);
    vertex(x, windowHeight - 100);
    endShape();*/

    fill(255);
    strokeWeight(2);
    if (name.length < 3) {
        textSize(60);
        text(name, x - 30, y + 15);
    } else {
        textSize(30);
        text(name, x - 40, y + 5);
    }
}

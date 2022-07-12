
let scaleRate = 1;
let moveX = 0;
let moveY = 0;
let angle = 0;
let lifts = [];
let pistes = [];
let pisteMapInitilised = false;
let currentLocation;
let currentLevelPistes = [];
let currentHightlightPisteIndex = -1;

function pisteMap(level) {
    if (!pisteMapInitilised) {
        initPisteMap();
    }
    loadPistes(level);
    tint(255, 255);
    push()
    scale(scaleRate);
    translate(moveX, moveY);  
    image(mapImage, 0, 0, windowWidth, windowHeight);
    textSize(40);
    text('📍', currentLocation.x , currentLocation.y);
    drawCurrentLevelPistes();
    if (currentHightlightPisteIndex > -1 && currentHightlightPisteIndex < currentLevelPistes.length) {
        const piste = currentLevelPistes[currentHightlightPisteIndex];
        highlightPiste(piste);
        drawLift(piste.lift);
        const radian = Math.atan2(piste.lift.startLocation.y - (currentLocation.y), (piste.lift.startLocation.x - currentLocation.x));
        let tempAngle = - 180 / Math.PI * radian;
        if (tempAngle > 180) {
            tempAngle = 180;
        } else if (tempAngle < 0) {
            tempAngle = 0;
        }
        if (tempAngle != angle) {
            angle = tempAngle;
            serial.write(angle);
            console.log('nav deg:' + (angle));
        }
        
    }
    pop();
    //console.log(currentPage);
    if (buttonValue == 'home') {
        currentPage = 'home';
        //reset
        currentHightlightPisteIndex  = -1;
        scaleRate = 1;
        moveX = 0;
        moveY = 0;
        angle = 0;
        serial.write(angle);
        return;
    } else if (buttonValue == 'zoomIn') {
        scaleRate -= 0.1;
    } else if (buttonValue == 'zoomOut') {
        scaleRate += 0.1;
    } else if (buttonValue == 'left') {
        moveX += 20;
    } else if (buttonValue == 'right') {
        moveX -= 20;
    } else if (buttonValue == 'next') {
        currentHightlightPisteIndex = (currentHightlightPisteIndex + 1) % currentLevelPistes.length;
    } else if (buttonValue == 'last') {
        console.log("index: " + currentHightlightPisteIndex);
        currentHightlightPisteIndex = (3 + (currentHightlightPisteIndex - 1) % currentLevelPistes.length) % currentLevelPistes.length;
        console.log("update: " +  currentHightlightPisteIndex);
        console.log("length: " + currentLevelPistes.length );
    }
    buttonValue = '';

    bottomButtonSimple('<', 250, windowWidth / 2 + 50);
    bottomButtonSimple('>', 250, windowWidth / 2 + 250);
    leftButtonSimple('🏠', 50);
    rightButtonSimple('🖨', 50);
}

function loadPistes(level) {
    currentLevelPistes = [];
    for (const piste of pistes) {
        if (piste.level == level && piste.status == 'open') {
            currentLevelPistes.push(piste);
        }
    }
}

function highlightPiste(piste) {
    drawPiste(piste, 14);

    //draw piste infoBox
    fill(255);
    strokeWeight(3);
    stroke(135,206,235, 200);
    line(piste.infoPosition.x + 100, piste.infoPosition.y + 100, piste.infoPosition.markX, piste.infoPosition.markY);
    rect(piste.infoPosition.x, piste.infoPosition.y, 200, 200, 0, 0, 10, 10);
    if (piste.image != null) {
        image(piste.image, piste.infoPosition.x, piste.infoPosition.y, 200, 150);
    }
    let rateWidth = 200 * piste.traffic / 100;
    if (piste.traffic <= 20) {
        fill('green');
    } else if (piste.traffic <= 40) {
        fill('yellow');
    } else {
        fill('red');
    }
    noStroke();
    rect(piste.infoPosition.x, piste.infoPosition.y + 150, rateWidth, 50, 0, 5, 5, 10);
    textSize(30);
    text('⛷', piste.infoPosition.x - 25 + rateWidth, piste.infoPosition.y + 190);
}


function drawCurrentLevelPistes() {
    for (const piste of currentLevelPistes) {
        drawPiste(piste, 8);
        drawLift(piste.lift);
    }
}

function drawPiste(piste, weight) {
    noFill();
    strokeWeight(weight);
    for (var i = 0; i < piste.path.length - 1; i++) {
        stroke(piste.path[i][2]);
        line(piste.path[i][0], piste.path[i][1], piste.path[i + 1][0], piste.path[i + 1][1]);
    }
}


function drawLift(lift) {
    fill(254, 221, 12);
    noStroke();
    circle(lift.startLocation.x, lift.startLocation.y, 10);
    circle(lift.endLocation.x, lift.endLocation.y, 10);
    strokeWeight(4);
    stroke(254, 221, 12);
    line(lift.startLocation.x, lift.startLocation.y, lift.endLocation.x, lift.endLocation.y);
    noStroke();
    liftInfoBox(lift);
}

function liftInfoBox(lift) {
    const middleX = (lift.startLocation.x + lift.endLocation.x) / 2;
    const middleY = (lift.startLocation.y + lift.endLocation.y) / 2;
    const img = (lift.type == 'chair' ? icons.chairLiftIcon : icons.tbarLiftIcon);
    fill(254, 221, 12);
    rect(middleX, middleY, 40, 40, 20, 20, 20, 20);
    image(img, middleX +5, middleY + 5, 32, 32);
    
    fill(230);
    if (lift.name.indexOf('\n') > -1) {
        rect(middleX + 45, middleY - 20, 120, 45, 10, 10, 10, 10);
        fill(0);
        strokeWeight(3);
        stroke(255);
        textSize(20);
        textLeading(20);
        text(lift.name, middleX + 45, middleY - 5);
    } else {
        rect(middleX + 45, middleY, 120, 30, 10, 10, 10, 10);
        fill(0);
        strokeWeight(3);
        stroke(255);
        textSize(20);
        text(lift.name, middleX + 45, middleY + 20);
    }
}

function initPisteMap() {
    currentLocation = {
        x: windowWidth / 2 - 200, 
        y: windowHeight - 60
    };
    let cairnwellChairLift = {
        code: 'CC',
        name: 'Cairnwell\r\nCharlift',
        type: 'chair',
        startLocation: {
           x: windowWidth / 2 - 220,
           y: windowHeight - 52
        },
        endLocation: {
            x: 25, 
            y: windowHeight / 2 + 13
        },
        status: 'open'
    }
    let claybokleLift = {
        code: 'CB',
        name: 'Claybokle',
        type: 'tbar',
        startLocation: {
            x: windowWidth / 2 - 128, 
            y: windowHeight - 200
        },
        endLocation: {
            x: windowWidth / 2 - 280,
            y: windowHeight / 2 - 40
        },
        status: 'open'
    }

    let dinkDinkLift = {
        code: 'DD',
        name: 'Dink Dink\r\nPoma',
        type: 'tbar',
        startLocation: {
            x: windowWidth / 2  - 5, 
            y: windowHeight - 100
        },
        endLocation: {
            x: windowWidth / 2  - 10,
            y: windowHeight - 25
        },
        status: 'open'
    }

    let cairnwellTBARLift = {
        code: 'CT',
        name: 'Cairnwell\r\nT-Bar',
        type: 'tbar',
        startLocation: {
            x: windowWidth / 2 - 70, 
            y: windowHeight - 250
        },
        endLocation: {
            x: windowWidth / 2 - 343, 
            y: 170
        },
        status: 'open'
    }

    lifts.push(cairnwellChairLift);
    lifts.push(claybokleLift);
    lifts.push(cairnwellTBARLift);
    lifts.push(dinkDinkLift);

    let clayboklePiste = {
        code: 'CB',
        lift: claybokleLift,
        level: 'easy',
        infoPosition: {
            x: 200,
            y: windowHeight / 2 + 10,
            markX: windowWidth / 2 - 280,
            markY: windowHeight / 2 + 10
        },
        image: null,
        traffic: 40,
        path: [[windowWidth / 2 - 290, windowHeight / 2 - 40, 'green'],
            [windowWidth / 2 - 280, windowHeight / 2 + 10, 'green'],
            [windowWidth / 2 - 170, windowHeight - 230, 'green'], 
            [windowWidth / 2 - 135, windowHeight - 200, 'green'], 
            [windowWidth / 2 - 135, windowHeight - 200, 'green']],
        status: 'open'
    }

    let gaintSlalomPiste = {
        code: 'GSL',
        name: 'Gaint Slalom',
        lift: cairnwellTBARLift,
        infoPosition: {
            x: windowWidth / 2 - 20,
            y: 250,
            markX: windowWidth / 2 - 200,
            markY: 250
        },
        level: 'middle',
        image: null,
        traffic: 20,
        path: [[windowWidth / 2 - 335, 170, 'green'],
            [windowWidth / 2 - 300, 150, '#0066CC'],
            [windowWidth / 2 - 200, 250, '#0066CC'],
            [windowWidth / 2 - 50, windowHeight - 270, '#0066CC']],
        status: 'open'
    }

    let dinkDinkPiste = {
        code: 'DD',
        name: 'Dink Dink',
        lift: dinkDinkLift,
        infoPosition: {
            x: windowWidth / 2 + 100,
            y: windowHeight - 300,
            markX: windowWidth / 2 - 23,
            markY: windowHeight - 70
        },
        level: 'easy',
        image: null,
        traffic: 60,
        path: [[windowWidth / 2 - 20, windowHeight - 100, 'green'],
            [windowWidth / 2 - 25, windowHeight - 30, 'green']],
        status: 'open'
    }

    let bunnyRunPiste = {
        code: 'BR',
        name: 'Bunny Run',
        lift: cairnwellTBARLift,
        infoPosition: {
            x: windowWidth / 2 - 20,
            y: 300,
            markX: windowWidth / 2 - 40,
            markY: 220
        },
        level: 'easy',
        image: null,
        traffic: 15,
        path: [[windowWidth / 2 - 335, 170, 'green'],
            [windowWidth / 2 - 300, 150, 'green'],
            [windowWidth / 2 - 40, 220, 'green'],
            [windowWidth / 2 + 180, 120, 'green'],
            [windowWidth / 2 + 245, 40, 'green'],
            [windowWidth / 2 + 270, 60, 'green'],
            [windowWidth / 2 + 240, 200, 'green'],
            [windowWidth / 2 + 250, 300, 'green'],
            [windowWidth / 2 + 210, 370, 'green']],
        status: 'open'
    }

    let tigerPiste = {
        code: 'T',
        name: 'Tiger',
        lift: cairnwellChairLift,
        infoPosition: {
            x: 200,
            y: windowHeight / 2 - 100,
            markX: 45,
            markY: windowHeight / 2 + 90
        },
        level: 'hard+',
        image: null,
        traffic: 14,
        path: [[40, windowHeight / 2 , 'black'],
            [35 , windowHeight / 2 + 50, 'black'],
            [45 , windowHeight / 2 + 90, 'black'],
            [80 , windowHeight / 2 + 150, 'black'],
            [165 , windowHeight - 230, 'black'],
            [200 , windowHeight - 185, 'black'],
            [257 , windowHeight - 185, 'red'],
            [360 , windowHeight - 135, 'red'],
            [420 , windowHeight - 75, 'red'],
            [windowWidth / 2 - 230 , windowHeight - 55, 'red']],
        status: 'open'
    }


    loadImage('assets/pistes/slalom.jpeg', img => {
        gaintSlalomPiste.image = img;
    });
    loadImage('assets/pistes/claybokle.jpeg', img => {
        clayboklePiste.image = img;
    });
    loadImage('assets/pistes/dinkdink.jpeg', img => {
        dinkDinkPiste.image = img;
    });
    loadImage('assets/pistes/bunnyRun.jpeg', img => {
        bunnyRunPiste.image = img;
    });
    loadImage('assets/pistes/d.jpeg', img => {
        tigerPiste.image = img;
    });
    pistes.push(tigerPiste);
    pistes.push(clayboklePiste);
    pistes.push(gaintSlalomPiste);
    pistes.push(bunnyRunPiste);
    pistes.push(dinkDinkPiste);
    pisteMapInitilised = true;
}


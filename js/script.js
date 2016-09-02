
var chessBoard = [];
var player = true;
var over = false;

var victory = [];
var playerWin = [];
var computerWin = [];

//定义棋盘
for(var i=0; i<15; i++) {
	chessBoard[i] = [];
	for(var j=0; j<15; j++) {
		chessBoard[i][j] = 0;
	}
}
//胜利条件
for(var i=0; i<15; i++) {
	victory[i] = [];
	for(var j=0; j<15; j++) {
		victory[i][j] = [];
	}
}

var victoryCount = 0;
//横线胜利
for(var i=0; i<15; i++){
	for(var j=0; j<11; j++) {
		for(var k=0; k<5; k++) {
			victory[i][j+k][victoryCount] = true;
		}
		victoryCount++;
	}
}
//竖线胜利
for(var i=0; i<15; i++){
	for(var j=0; j<11; j++) {
		for(var k=0; k<5; k++) {
			victory[j+k][i][victoryCount] = true;
		}
		victoryCount++;
	}
}
//斜线胜利
for(var i=0; i<11; i++){
	for(var j=0; j<11; j++) {
		for(var k=0; k<5; k++) {
			victory[i+k][j+k][victoryCount] = true;
		}
		victoryCount++;
	}
}
//反斜线胜利
for(var i=0; i<11; i++){
	for(var j=14; j>3; j--) {
		for(var k=0; k<5; k++) {
			victory[i+k][j-k][victoryCount] = true;
		}
		victoryCount++;
	}
}
//console.log(victoryCount); 共有572中胜利种类

for (var i=0; i<victoryCount; i++) {
	playerWin[i] = 0;
	computerWin[i] = 0;
}

var chess = document.getElementById("chess");
var context = chess.getContext("2d");

context.strokeStyle = "#black";

var board = new Image();
board.src = "image/woodboard.jpg";
board.onload = function() {
	context.drawImage(board, 0, 0, 450, 450);
	drawChessBoard();
}
//画一个棋盘
var drawChessBoard = function() {
	for( i=0; i<15; i++) {
		context.moveTo(15 + i*30, 15);
		context.lineTo(15 + i*30, 435);
		context.stroke();
		
		context.moveTo(15, 15 + i*30);
		context.lineTo(435, 15 + i*30);
		context.stroke();
	}
} 
//棋子绘制
var oneStep = function(i, j, player) {
	context.beginPath();
	context.arc(15 + i*30, 15 + j*30, 13, 0, 2*Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(15 + i*30 + 2, 15 + j*30 -2, 13, 15 + i*30 + 2, 15 + j*30 -2, 0);
	if(player) {
		gradient.addColorStop(0, "#0A0A0A");
		gradient.addColorStop(1, "#636766");
	} else {
		gradient.addColorStop(0, "#D1D1D1");
		gradient.addColorStop(1, "#F9F9F9");
	}
	context.fillStyle = gradient;
	context.fill();
}
//点击落子
chess.onclick =  function(e) {
	if(over || !player) {
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	if(chessBoard[i][j] == 0) {
		oneStep(i, j, player);
		chessBoard[i][j] = 1;
		for(var k=0; k<victoryCount; k++) {
			if(victory[i][j][k]) {
				playerWin[k]++;
				computerWin[k] = 6;
				if(playerWin[k] == 5) {
					window.alert("玩家胜利");
					over = true;
				}
			}
		}
		if(!over) {
			player = !player;
			computerAI();
		}
	}
}

var computerAI = function() {
	var playerScore = [];
	var computerScore = [];
	var scoreMax = 0;
	var u = 0;
	var v = 0;
	for(var i=0; i<15; i++) {
		playerScore[i] = [];
		computerScore[i] = [];
		for(var j=0; j<15; j++) {
			playerScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for(var i=0; i<15; i++) {
		for(var j=0; j<15; j++) {
			if(chessBoard[i][j] == 0) {
				for(var k=0; k<victoryCount; k++) {
					if(victory[i][j][k]) {
						if(playerWin[k] == 1) {
							playerScore[i][j] += 200;
						} else if(playerWin[k] == 2) {
							playerScore[i][j] += 400;
						} else if(playerWin[k] == 3) {
							playerScore[i][j] += 2000;
						} else if(playerWin[k] == 4) {
							playerScore[i][j] += 10000;
						}
						if(computerWin[k] == 1) {
							computerScore[i][j] += 220;
						} else if(computerWin[k] == 2) {
							computerScore[i][j] += 420;
						} else if(computerWin[k] == 3) {
							computerScore[i][j] += 2100;
						} else if(computerWin[k] == 4) {
							computerScore[i][j] += 20000;
						}
					}
				}
				if(playerScore[i][j] > scoreMax) {
					scoreMax = playerScore[i][j];
					u = i;
					v = j;
				} else if(playerScore[i][j] = scoreMax) {
					if(computerScore[i][j] > computerScore[u][v]) {
						u = i;
						v = j;
					}
				}
				if(computerScore[i][j] > scoreMax) {
					scoreMax = computerScore[i][j];
					u = i;
					v = j;
				} else if(computerScore[i][j] = scoreMax) {
					if(playerScore[i][j] > playerScore[u][v]) {
						u = i;
						v = j;
					}
				}
			}
		}
	}
	oneStep(u, v, false);
	chessBoard[u][v] = 2;
	for(var k=0; k<victoryCount; k++) {
		if(victory[u][v][k]) {
			computerWin[k]++;
			playerWin[k] = 6;
			if(computerWin[k] == 5) {
				window.alert("计算机胜利");
				over = true;
			}
		}
	}
	if(!over) {
		player = !player;
	}
}

var ROWS = 20;
var COLS = 20;
var PROB = 0.15;
var cells = [];
var board = document.getElementById("board");
var cellColor = "#BABABA";
var startedTime = false;
var start = document.getElementById("start");
var totalMines = 0;

start.addEventListener("click", function(){
	var menu = document.getElementById("menu");
	startedTime = true;
	$('#time').show();
	menu.parentNode.removeChild(menu);

});

window.addEventListener("keypress", function(key){
	if(key.which == 114){
		removeBoard();
		setTimeout(addBoard, 10);
	}
});
function neighbors(){
	var n = [];
	var r = this.row;
	var c = this.col;
	for(var i = -1; i < 2; i++){
		for(var j = -1; j < 2; j++){
			if(cells[this.row+i] && cells[this.row+i][this.col+j] && !(i == 0 && j == 0))
				//console.log(cells[r+i][c+j]);
				n.push(cells[this.row+i][this.col+j]);
		}
	};
	return n;
}
function numMines(){
	var n = this.neighbors();
	var count = 0;
	for(var i = 0; i < n.length; i++){
		if(n[i].hasMine){
			count++;
		}
	}
	return count;
}
function clicked(){
	if(this.hasMine && !this.flagged && startedTime){
		startedTime = false;
		show();

	}
	else if(this.numMines() == 0 && !this.flagged && startedTime){
		this.flaggable = false;
		reveal(this.row, this.col);
		won();
	}
	else if(!this.flagged && startedTime){
		this.flaggable = false;
		fill(this);
		this.innerHTML = this.numMines();
		won();
	}
}
function rightClicked(event){
	if(event.which == 3){
		if(this.flagged){
			totalMines++;
			countFlags();
		}
		else{
			totalMines--;
			countFlags();
		}

		if(this.flagged == false && this.flaggable && startedTime){
			this.flagged = true;
			this.innerHTML = "<img style = \"width: 9px; height: 7px\"src = \"https://openclipart.org/image/20px/svg_to_png/14933/nicubunu-Simple-flag-on-a-pole.png\">";
			won();
		}
		else if(this.flagged && this.flaggable && startedTime){
			this.flagged = false;
			this.innerHTML = "";
		}
	}

}

function fill(cell){
	cell.filled = true;
	cell.flaggable = false;
	cell.style["background-color"] = cellColor;
}
//recursive to reveal squares with 0 mines around them
function reveal(row, col){
	if(row < 0 || row >= ROWS)
		return;
	if(col < 0 || col >= COLS)
		return;
	if(cells[row][col].numMines() != 0){
		fill(cells[row][col]);
		cells[row][col].innerHTML = cells[row][col].numMines();
		return;
	}
	if(cells[row][col].filled)
		return;
	if(cells[row][col].flagged)
		return;
	fill(cells[row][col]);

	reveal(row, col-1);
	reveal(row, col+1);
	reveal(row+1, col);
	reveal(row-1, col);	
}


//generate board 
function generateBoard(grid){
	totalMines = 0;
	for(var i = 0; i < ROWS; i++){
		cells[i] = [];
		var r = document.createElement("tr");
		grid.appendChild(r);
		for(var j = 0; j < COLS; j++){
			var c = document.createElement("td");
			c.row = i;
			c.col = j;
			c.hasMine = Math.random() <= PROB;
			//c.innerHTML = c.hasMine;
			if(c.hasMine){
				totalMines++;
			}
			c.neighbors = neighbors;
			c.numMines = numMines;
			c.filled = false;
			c.flagged = false;
			c.flaggable = true;
			c.addEventListener("click", clicked);
			c.addEventListener("mousedown", rightClicked);
			r.appendChild(c);	
			cells[i][j] = c;
		}
	}
}
function show(){
	for(var i = 0; i < ROWS; i++){
		for(var j = 0; j < COLS; j++){
			var cell = cells[i][j];
			if(cell.hasMine){		
				cell.style["background-color"] = "red";
				var m = document.createElement("img");
				m.setAttribute("id", "gameMine");
				cell.innerHTML = "<img style = \"width: 7px\"; src = \"http://old.no/icon/entertainment/mini-mine.gif\">";
			}
			else if(cell.numMines() == 0){
				cell.style["background-color"] = cellColor;
			}
			else{
				cell.style["background-color"] = cellColor;
				cell.innerHTML = cell.numMines();
			}
		}
	}	
}
function checkWin(){
	for(var i = 0; i < ROWS; i++){
		for(var j = 0; j < COLS; j++){
			var cell = cells[i][j];
			if(cell.hasMine && !cell.flagged){
				return false;
			}
			if(!cell.hasMine && !cell.filled)
				return false;
		}
	}

	return true;
}
function won(){
	if(checkWin()){
		startedTime = false;
		alert("You won!");

	}
}

function startTimer(duration, display) {
    var timer = duration;
    var minutes;
    var seconds;
    setInterval(function (){
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;
        if(startedTime)
       		timer++;
    }, 1000);
}

window.onload = function(){
    var start = 0,
        display = document.querySelector('#time');
    startTimer(start, display);
};
function removeBoard(){
	document.body.removeChild(document.getElementsByTagName("table")[0]);
	if(document.getElementById("menu"))
		document.body.removeChild(document.getElementById("menu"));
	document.body.removeChild(document.getElementById("time"));
	startedTime = false;
	cells = [];

}
function addBoard(){
	var t = document.createElement("table");
	var b = document.createElement("button");
	var men = document.createElement("div");
	var timer = document.createElement("span");
	var title = document.createElement("span");
	var mine = document.createElement("img");

	document.body.appendChild(men);
	men.appendChild(b);
	men.appendChild(title);
	men.appendChild(mine);
	document.body.appendChild(t);
	document.body.appendChild(timer);

	mine.setAttribute("id", "mine");
	mine.setAttribute("src", "https://lh4.ggpht.com/d4ThZdKjGANziFu-sr_CElac-kjeZ2LbXeVRkTNk9RJhzb_4qFqGooCprBlalb3yLcgo=w300");
	title.setAttribute("id", "title");
	men.setAttribute("id", "menu");
	t.setAttribute("id", "board");
	b.setAttribute("id", "start");
	timer.setAttribute("id", "time");
	startTimer(0, timer);

	title.textContent = "Minesweeper";
	b.innerHTML = "Start!";
	b.addEventListener("click",  function(){
	var menu = document.getElementById("menu");
	startedTime = true;
	$('#time').show();
	menu.parentNode.removeChild(menu);
});
	generateBoard(t);
	countFlags();
	//add some special effects :^)
	$('#menu').hide();
	$('#menu').fadeIn('slow');
 	t = $('table');
    t.hide();
    t.fadeIn('slow');
    s = $('#start');
    s.hide();
    s.fadeIn('slow');
    $('#time').hide();
}

function countFlags(){
	number.textContent = " = "+totalMines;
}
var easy = document.getElementById("easy");
easy.addEventListener("click", function (){
	ROWS = 10;
	COLS = 10;
	removeBoard();
	addBoard();
});
var medium = document.getElementById("medium");
medium.addEventListener("click", function(){
	ROWS = 20;
	COLS = 20;
	removeBoard();
	addBoard();
});
var hard = document.getElementById("hard");
hard.addEventListener("click", function(){
	ROWS = 40;
	COLS = 40;
	removeBoard();
	addBoard();
});


generateBoard(board);
countFlags();
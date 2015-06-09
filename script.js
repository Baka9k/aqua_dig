var TileHeight = 40;
var TileWidth = 40;
var TileX = 24;
var TileY = 16;
var lrsw = 'r';
var div = 0;
var keys = 'enabled';

function main() {
	div = document.getElementById('o2div');
	div.style.width = 160+'px';
	drawWorld(0,0,0,0);  
}

//от kx (TileNumberX) до x (TileX)
function drawWorld(TileNumberX, TileNumberY, x, y) {
	var canvas = document.getElementById('1');
	var context = canvas.getContext('2d');
	if (div.style.width == 0+'px') {
		alert("Game over");
		window.location.reload();
	}
	
	function drawGround0(TileNumberX, TileNumberY) {
		var stone = document.getElementById("stone");
		context.drawImage(stone, TileNumberX*TileWidth - - x, TileNumberY*TileHeight - - y, TileWidth, TileHeight);
	}

	function drawQuartz(TileNumberX, TileNumberY) {
		var quartz = document.getElementById("quartz");
		context.drawImage(quartz, TileNumberX*TileWidth + x + 4, TileNumberY*TileHeight + y + 4, 30, 30);
	}

	function drawRuby(TileNumberX, TileNumberY) {
		var img = document.getElementById("ruby");
		context.drawImage(img, TileNumberX*TileWidth + x + 4, TileNumberY*TileHeight + y + 4, 30, 30);
	}

	function drawEmerald(TileNumberX, TileNumberY) {
		var img = document.getElementById("emerald");
		context.drawImage(img, TileNumberX*TileWidth + x + 4, TileNumberY*TileHeight + y + 4, 30, 30);
	}

	function drawDiamond(TileNumberX, TileNumberY) {
		var img = document.getElementById("diamond");
		context.drawImage(img, TileNumberX*TileWidth + x + 4, TileNumberY*TileHeight + y + 4, 30, 30);
	}

	function drawBoat() {
		if (lrsw == 'l') {
			var pic = document.getElementById("boat-l");             
			context.drawImage(pic, (24*TileWidth/2), (16*TileHeight/2)+4, TileWidth-3, TileHeight-10);
		}
		if (lrsw == 'r') {
			var pic = document.getElementById("boat-r");             
			context.drawImage(pic, (24*TileWidth/2)+3, (16*TileHeight/2)+4, TileWidth-3, TileHeight-10);
		}
	}

	function drawTile(TileNumberX, TileNumberY) {
		//Sky and water
		if (TileNumberY > 5) {
			context.fillStyle = "#6495ED";
			context.fillRect(TileNumberX*TileWidth - - x, TileNumberY*TileHeight - - y, TileWidth, TileHeight);
		}
		else if (TileNumberY <= 5) {
			context.fillStyle = "#87CEFA";
			context.fillRect(TileNumberX*TileWidth - - x, TileNumberY*TileHeight - - y, TileWidth, TileHeight);
		}

		//Ground	
		var xandy = (TileNumberX+'and'+TileNumberY);
		var ap = hash2prob(coordHash(TileNumberX, TileNumberY));
		var probability = 0.5;
		if ((ap < probability) && (TileNumberY == 21) && (a.in_array(xandy)==false)) {
			drawGround0(TileNumberX, TileNumberY);
		}
		if ((TileNumberY > 21) && (a.in_array(xandy)==false)) {
			drawGround0(TileNumberX, TileNumberY);
		}
		var probability = 0.01;
		if ((ap < probability) && (TileNumberY > 30) && (TileNumberY < 50) && (a.in_array(xandy)==false)) {
			drawQuartz(TileNumberX, TileNumberY);
		}
		var probability0 = 0.01;
		var probability1= 0.02;
		if ((ap < probability1) && (ap > probability0) && (TileNumberY > 55) && (TileNumberY < 50) && (a.in_array(xandy)==false)) {
			drawEmerald(TileNumberX, TileNumberY);   
		}
	}

	for (i = TileNumberX; i < TileX; i += 1) {
		for (j = TileNumberY; j < TileY; j += 1) {
			drawTile(i, j);
		}
	}
	drawBoat();
}

function canvas_keypress(event) {
	if (keys == "enabled") {
		k = event.keyCode;
		if(k == 38) {
			CameraUp();
		}
		if(k == 40) {
			CameraDown();
		}
		if(k == 37) {
			CameraLeft();
		}
		if(k == 39) {
			CameraRight();
		}
	}
	//Z z   90
	//<	    37
	//^	    38
	//>    39
	//v    40
	//c C   67
	//u U	85
}
document.addEventListener('keydown', canvas_keypress, false);

function coordHash( a, b ) {
	var hash = a ^ b;
	for(var i = 0; i < 3; i++) {
		hash = hash*31 ^ (a << (0x0F & hash-1)) ^ (b << (0x0F & hash-31));
	}
	return hash;            
}

function hash2prob( hash ) {
	return (hash & 0xFFFF)/65536;
}

function Reset() {
	x1 = 0;
	y1 = 0;
	kx = 0;
	ky = 0;
}

function Zoom1() {
	TileHeight = (TileHeight - (TileHeight/2));
	TileWidth = (TileWidth - (TileWidth/2));
	TileX = (TileX*2);
	TileY = (TileY*2);
	drawWorld(0,0,-x1,-y1);
}

function Zoom2() {
	TileHeight = (TileHeight - - (TileHeight));
	TileWidth = (TileWidth - - (TileWidth));
	TileX = (TileX/2);
	TileY = (TileY/2);
	drawWorld(kx,ky,-x1,-y1);
}

function collect(TileNumberX, TileNumberY) {
	var xandy = (TileNumberX+'and'+TileNumberY);
	var ap = hash2prob(coordHash(TileNumberX, TileNumberY));
	var probability = 0.01;
	if ((ap < probability) && (TileNumberY > 30) && (TileNumberY < 50) && (a.in_array(xandy)==false)) {
		sq++;
		document.getElementById('quartzdiv').innerHTML= sq;
	}
}

var ax = 0;
var ay = 0;
var x1 = 0;
var y1 = 0;
var kx = 0;
var ky = 0;
var sq = 0;

var a = new Array();
var a = [ax+'and'+ay];

Array.prototype.in_array = function(p_val) {
	for(var i = 0, l = this.length; i < l; i++)	{
		if(this[i] == p_val) {
			return true;
		}
	}
	return false;
}

function CameraRight() {
	lrsw = 'r';
	document.getElementById("rightbutton").disabled = true;
	setTimeout(function() {document.getElementById("rightbutton").disabled = false}, 400);	
	keys = "disabled";
	setTimeout(function() {keys = "enabled"}, 400);
	TileX = (TileX + 1);
	var x2 = (x1 + TileWidth);
	var anR = setInterval(function() {
		if ((x1-4) < x2) {
			drawWorld(kx,ky,-x1,-y1);
			x1 = x1 + 4;
		} else {
			x1 = x1 - 4;
			clearInterval(anR);
		}
	},30); 
	ax = (TileX - 12);	
	ay = (TileY - 8);
	collect(ax,ay);
	a[a.length] = (ax+'and'+ay);
	kx = kx+1;
	div.style.width = parseFloat(div.style.width) - 1+'px';	
}

function CameraLeft() {
	lrsw = 'l';
	document.getElementById("leftbutton").disabled = true;
	setTimeout(function() {document.getElementById("leftbutton").disabled = false}, 400);
	keys = "disabled";
	setTimeout(function() {keys = "enabled"}, 400);
	TileX = (TileX - 1);
	var x2 = (x1 - TileWidth);
	var anL = setInterval(function() {
		if ((x1+4) > x2) {
			drawWorld(kx,ky,-x1,-y1);
			x1 = x1 - 4;
		} else {
			x1 = x1 + 4;
			clearInterval(anL);
		}
	},30); 
	ax = (TileX - 12);	
	ay = (TileY - 8);
	collect(ax,ay);
	a[a.length] = (ax+'and'+ay);
	kx = kx-1; 
	div.style.width = parseFloat(div.style.width) - 1+'px';
}

var lnk = 0;

function CameraUp() {
	if ((TileY - 8)>6) {
		document.getElementById("upbutton").disabled = true;
		setTimeout(function() {document.getElementById("upbutton").disabled = false}, 400);
		keys = "disabled";
		setTimeout(function() {keys = "enabled"}, 400);
		TileY = (TileY - 1);
		var y2 = (y1 - TileHeight);
		var anUp = setInterval(function() {
			if ((y1+4) > y2) {
				drawWorld(kx,ky,-x1,-y1);
				y1 = y1 - 4;
				lnk++;
			} else {
				y1 = y1 + 4;
				clearInterval(anUp);
			}
		},30); 
		ax = (TileX - 12);	
		ay = (TileY - 8);
		collect(ax,ay);
		a[a.length] = (ax+'and'+ay);
		ky = ky-1;
		div.style.width = parseFloat(div.style.width) - 1+'px';
	}
}

function CameraDown() {
	document.getElementById("downbutton").disabled = true;
	setTimeout(function() {document.getElementById("downbutton").disabled = false}, 400);
	keys = "disabled";
	setTimeout(function() {keys = "enabled"}, 400);
	TileY = (TileY + 1);
	var y2 = (y1 + TileHeight);
	var anD = setInterval(function() {
		if ((y1-4) < y2) {
			drawWorld(kx,ky,-x1,-y1);
			y1 = y1 + 4;
		} else {
			y1 = y1 - 4;
			clearInterval(anD);
		}
	},30); 
	ax = (TileX - 12);	
	ay = (TileY - 8);
	collect(ax,ay);
	a[a.length] = (ax+'and'+ay);
	ky = ky+1;
	div.style.width = parseFloat(div.style.width) - 1+'px';
}

function anim() {
	var N = 60;
	var incr = -0.5/N;
	setInterval(function() {
		incr = -0.5/N;
		drawWorld(kx,ky,-x1,-y1);
	}, 1000/N);
}


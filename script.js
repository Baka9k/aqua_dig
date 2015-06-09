function main() {
	var ad = {};

	ad.canvas = document.createElement('canvas');
	document.body.appendChild(ad.canvas);
	ad.context = ad.canvas.getContext("2d");
	ad.canvas.width = window.innerWidth;
	ad.canvas.style.position = "absolute";
	ad.canvas.style.left = "0px";
	ad.canvas.style.top = "0px";
	ad.canvas.height = window.innerHeight;
	ad.width = window.innerWidth;
	ad.height = window.innerHeight;

	ad.tileHeight = 40;
	ad.tileWidth = 40;
	ad.tilesOnX = Math.ceil(ad.width/ad.tileWidth);
	ad.tilesOnY = Math.ceil(ad.height/ad.tileHeight);
	ad.lr = 'r';
	ad.o2 = 100;
	ad.keys = 'enabled';
	ad.map = new Array();
	ad.displacementX = 0;
	ad.displacementY = 0;
	ad.camera = {};
	
	Array.prototype.in_array = function(p_val) {
		for(var i = 0, l = this.length; i < l; i++)	{
			if(this[i] == p_val) {
				return true;
			}
		}
		return false;
	}

	ad.draw = function(img, x, y, width, height) {
		ad.context.drawImage(img, x, y, width, height);
	}

	ad.drawBoat = function(x, y, width, height) {
		if (ad.lr == 'l') {
			var img = document.getElementById("boat-l");             
			ad.context.drawImage(img, x, y, width, height);
		}
		if (ad.lr == 'r') {
			var img = document.getElementById("boat-r");
			ad.context.drawImage(img, x, y, width, height);
		}
	}

	ad.coordHash = function(a, b) {
		var hash = a ^ b;
		for(var i = 0; i < 3; i++) {
			hash = hash*31 ^ (a << (0x0F & hash-1)) ^ (b << (0x0F & hash-31));
		}
		return hash;            
	}

	ad.hash2prob = function(hash) {
		return (hash & 0xFFFF)/65536;
	}

	ad.drawTile = function(tileX, tileY) {
		var x = tileX * ad.tileWidth + ad.displacementX;
		var y = tileY * ad.tileHeight + ad.displacementY;
		//Sky and water
		if (tileY > 5) {
			ad.context.fillStyle = "#6495ED";
			ad.context.fillRect(x, y, ad.tileWidth, ad.tileHeight);
		}
		else {
			ad.context.fillStyle = "#87CEFA";
			ad.context.fillRect(x, y, ad.tileWidth, ad.tileHeight);
		}

		//Ground
		var xandy = (tileX + 'and' + tileY);
		var ap = ad.hash2prob(ad.coordHash(x, y));
		if (tileY == 2) { //212212121212122121212121212121221212
			var probability = 0.5;
			if ((ap < probability) && (ad.map.in_array(xandy) == false)) {
				ad.draw(stone, x, y, ad.tileWidth, ad.tileHeight);
			}
		}
		if ((tileY > 21) && (ad.map.in_array(xandy) == false)) {
			ad.draw(stone, x, y, ad.tileWidth, ad.tileHeight);
		}
		var probability = 0.01;
		if ((ap < probability) && (tileY > 30) && (tileY < 50) && (ad.map.in_array(xandy) == false)) {
			ad.draw(quartz, x, y, ad.tileWidth, ad.tileHeight);
		}
		probability = 0.03;
		if ((ap < probability) && (tileY > 51) && (tileY < 50) && (a.in_array(xandy)==false)) {
			ad.draw(emerald, x, y, ad.tileWidth, ad.tileHeight);  
		}
	}

	ad.drawWorld = function (fromX, fromY) {		
		for (var i = fromX; i < (fromX + ad.tilesOnX); i++) {
			for (var j = fromY; j < (fromY + ad.tilesOnY); j++) {
				ad.drawTile(i, j);
			}
		}
		ad.drawBoat((ad.tilesOnX / 2 * ad.tileWidth) - ad.tileWidth, 6 * (ad.tileHeight) + ad.tileHeight * 0.2, ad.tileWidth, ad.tileHeight - 11);
	}
	
	ad.keypress = function(event) {
		if (ad.keys == 'enabled') {
			k = event.keyCode;
			if (k == 38) {
				ad.camera.up();
			}
			else if (k == 40) {
				ad.camera.down();
			}
			else if (k == 37) {
				ad.camera.left();
			}
			else if (k == 39) {
				ad.camera.right();
			}
		}
		//<	   37
		//^	   38
		//>    39
		//v    40
	}
	
	document.addEventListener('keydown', ad.keypress, false);

	ad.dig = function (tileX, tileY) {
		var xandy = (tileX + 'and' + tileY);
		if(!ad.map.in_array(xandy)) {
			ad.map.push(xandy);
		}
		
	}
	
	ad.camera.right = function () {
		ad.lr = 'r';
		ad.keys = "disabled";
		setTimeout(function() {ad.keys = "enabled"}, 400);
		ad.displacementX++;
		ad.dig(ad.tilesOnX / 2 + ad.displacementX, 6 + ad.displacementY);
		ad.drawWorld(ad.displacementX, ad.displacementY);
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
	
	
	ad.drawWorld(0,0);
	//ad.drawTools();

}
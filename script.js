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
	ad.currentFromX = 0;
	ad.currentFromY = 0;
	
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
		var x = (tileX - ad.displacementX)* ad.tileWidth;
		var y = (tileY - ad.displacementY)* ad.tileHeight;
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
		var ap = ad.hash2prob(ad.coordHash(tileX, tileY));
		if (tileY == 21) {
			var probability = 0.5;
			if ((ap < probability) && (ad.map.in_array(xandy) == false)) {
				ad.draw(stone, x, y, ad.tileWidth, ad.tileHeight);
			}
		}
		if ((tileY > 21) && (ad.map.in_array(xandy) == false)) {
			ad.draw(stone, x, y, ad.tileWidth, ad.tileHeight);
		}
		var probability = 0.01;
		if ((tileY > 30) && (tileY < 50) && (ap < probability) && (ad.map.in_array(xandy) == false)) {
			ad.draw(quartz, x, y, ad.tileWidth, ad.tileHeight);
		}
		probability = 0.03;
		if ((tileY > 51) && (tileY < 100) && (ap < probability) && (ad.map.in_array(xandy)==false)) {
			ad.draw(emerald, x, y, ad.tileWidth, ad.tileHeight);  
		}
	}

	ad.drawWorld = function (fromX, fromY) {
		for (var i = fromX; i < (fromX + ad.tilesOnX); i++) {
			for (var j = fromY; j < (fromY + ad.tilesOnY); j++) {
				ad.drawTile(i, j);
			}
		}
		ad.drawBoat((Math.ceil(ad.tilesOnX / 2) * ad.tileWidth) - ad.tileWidth, 6 * (ad.tileHeight) + ad.tileHeight * 0.2, ad.tileWidth, ad.tileHeight * 0.725);
		ad.currentFromX = fromX;
		ad.currentFromY = fromY;
	}
	
	ad.keypress = function(event) {
		if (ad.keys == 'enabled') {
			k = event.keyCode;
			switch(k) {
				case 38:
					ad.camera.up();
					break;
				case 40:
					ad.camera.down();
					break;
				case 37:
					ad.camera.left();
					break;
				case 39:
					ad.camera.right();
					break;
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
		ad.dig(Math.round(ad.tilesOnX / 2) + ad.displacementX - 1, 6 + ad.displacementY);
		ad.drawWorld(ad.displacementX, ad.displacementY);
	}

	ad.camera.left = function () {
		ad.lr = 'l';
		ad.keys = "disabled";
		setTimeout(function() {ad.keys = "enabled"}, 400);
		ad.displacementX--;
		ad.dig(Math.round(ad.tilesOnX / 2) + ad.displacementX - 1, 6 + ad.displacementY);
		ad.drawWorld(ad.displacementX, ad.displacementY);
	}

	ad.camera.down = function () {
		ad.keys = "disabled";
		setTimeout(function() {ad.keys = "enabled"}, 400);
		ad.displacementY++;
		ad.dig(Math.round(ad.tilesOnX / 2) + ad.displacementX - 1, 6 + ad.displacementY);
		ad.drawWorld(ad.displacementX, ad.displacementY);
	}
	
	ad.camera.up = function () {
		if (ad.displacementY <= 0) return;
		ad.keys = "disabled";
		setTimeout(function() {ad.keys = "enabled"}, 400);
		ad.displacementY--;
		ad.dig(Math.round(ad.tilesOnX / 2) + ad.displacementX - 1, 6 + ad.displacementY);
		ad.drawWorld(ad.displacementX, ad.displacementY);
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
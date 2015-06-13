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
	ad.o2 = 1;
	ad.keys = 'enabled';
	ad.map = new Array();
	ad.currentMap = new Array();
	ad.displacementX = 0;
	ad.displacementY = 0;
	ad.camera = {};
	ad.currentFromX = 0;
	ad.currentFromY = 0;
	ad.currentDisplacementX = 0;
	ad.currentDisplacementY = 0;
	ad.items = {
		quartz: 0,
		emerald: 0,
		ruby: 0,
		diamond: 0
	};
	ad.context.font = '16px lucida console';
	
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

	ad.drawTile = function(tileX, tileY, dispX, dispY) {
		var x = (tileX - ad.currentDisplacementX)* ad.tileWidth + dispX;
		var y = (tileY - ad.currentDisplacementY)* ad.tileHeight + dispY;
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
		var ap = ad.hash2prob(ad.coordHash(tileX, tileY));
		var probability = 0.01;
		if ((tileY > 30) && (tileY < 50) && (ap < probability) && (ad.map.in_array(xandy) == false)) {
			ad.items.quartz++;
		}
		probability = 0.03;
		if ((tileY > 51) && (tileY < 100) && (ap < probability) && (ad.map.in_array(xandy)==false)) {
			ad.items.emerald++;
		}
		var xandy = (tileX + 'and' + tileY);
		if(!ad.map.in_array(xandy)) {
			ad.map.push(xandy);
		}
	}
	
	ad.camera.right = function () {
		ad.lr = 'r';
		ad.keys = "disabled";
		ad.displacementX++;
		ad.dig(Math.ceil(ad.tilesOnX / 2) + ad.displacementX - 1, 6 + ad.displacementY);
		ad.drawWorld(ad.displacementX, ad.displacementY);
	}

	ad.camera.left = function () {
		ad.lr = 'l';
		ad.keys = "disabled";
		ad.displacementX--;
		ad.dig(Math.ceil(ad.tilesOnX / 2) + ad.displacementX - 1, 6 + ad.displacementY);
		ad.drawWorld(ad.displacementX, ad.displacementY);
	}

	ad.camera.down = function () {
		ad.keys = "disabled";
		ad.displacementY++;
		ad.dig(Math.ceil(ad.tilesOnX / 2) + ad.displacementX - 1, 6 + ad.displacementY);
		ad.drawWorld(ad.displacementX, ad.displacementY);
	}
	
	ad.camera.up = function () {
		if (ad.displacementY <= 0) return;
		ad.keys = "disabled";
		ad.displacementY--;
		ad.dig(Math.ceil(ad.tilesOnX / 2) + ad.displacementX - 1, 6 + ad.displacementY);
		ad.drawWorld(ad.displacementX, ad.displacementY);
	}

	ad.drawWorld = function (fromX, fromY) {
		var xandy = ((Math.ceil(ad.tilesOnX / 2) + ad.displacementX - 1) + 'and' + (6 + ad.displacementY));
		var ap = ad.hash2prob(ad.coordHash((Math.ceil(ad.tilesOnX / 2) + ad.displacementX - 1), (6 + ad.displacementY)));
		if (((!ad.currentMap.in_array(xandy)) && ((fromY + 6) > 21)) || ((!ad.currentMap.in_array(xandy)) && ((fromY + 6) == 21) && (ap < 0.5))) {
			var t = 1000;
			var fps = 40;
		} else {
			var t = 250;
			var fps = 10;
		}
		var stepX = (ad.currentFromX - fromX) * ad.tileWidth / fps;
		var stepY = (ad.currentFromY - fromY) * ad.tileHeight / fps;
		var c = 0;
		var dx = 0;
		var dy = 0;
		var si = setInterval(function() {			
			for (var i = ad.currentFromX - 1; i <= (fromX + ad.tilesOnX); i++) {
				for (var j = ad.currentFromY - 1; j <= (fromY + ad.tilesOnY); j++) {
					ad.drawTile(i, j, dx, dy);
				}
			}
			dx += stepX;
			dy += stepY;
			c++;
			if (c == fps) {
				clearInterval(si);
				ad.currentDisplacementX = ad.displacementX;
				ad.currentDisplacementY = ad.displacementY;
				ad.currentMap = [];
				ad.currentMap = ad.map.concat(ad.currentMap);
				ad.keys = "enabled";
			}
			ad.drawBoat((Math.ceil(ad.tilesOnX / 2) * ad.tileWidth) - ad.tileWidth, 6 * (ad.tileHeight) + ad.tileHeight * 0.2, ad.tileWidth, ad.tileHeight * 0.725);
			ad.drawTools();
		}, t/fps);
		ad.currentFromX = fromX;
		ad.currentFromY = fromY;
	}
	
	ad.drawTools = function() {
		ad.context.fillStyle = "#DDDDDD";
		ad.context.fillRect(8, 8, 80, 160);
		ad.draw(quartz, 36, 12, 20, 20);
		ad.context.fillStyle = "#555555";
		ad.context.fillText(ad.items.quartz, 65, 28);
		ad.draw(emerald, 36, 42, 20, 20);
		ad.context.fillText(ad.items.emerald, 65, 58);
		ad.draw(ruby, 36, 72, 20, 20);
		ad.context.fillText(ad.items.ruby, 65, 88);
		ad.draw(diamond, 36, 102, 20, 20);
		ad.context.fillText(ad.items.diamond, 65, 118);
		ad.context.fillStyle = "#00DD00";
		ad.context.fillRect(15, 15, 10, 130 * ad.o2);
		ad.context.fillText('O2', 15, 160);
	}
	
	
	ad.drawWorld(0,0);
}
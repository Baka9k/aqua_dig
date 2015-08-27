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
	ad.characteristics = {
		o2consumption: 0.00025
	};
	ad.dx = 0;
	ad.dy = 0;
	
	Array.prototype.in_array = function(p_val) {
		for(var i = 0, l = this.length; i < l; i++)	{
			if(this[i] == p_val) {
				return true;
			}
		}
		return false;
	}

	ad.draw = function(img, x, y, width, height) {
		ad.context.drawImage(img, Math.round(x), Math.round(y), width, height);
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
		var xandy = (tileX + 'and' + tileY);
		var ap = ad.hash2prob(ad.coordHash(tileX, tileY));
		
		//Sky
		if (tileY < 6){
			ad.context.fillStyle = "#87CEFA";
			ad.context.fillRect(x, y, ad.tileWidth, ad.tileHeight);
		} 

		//Ground
		if (tileY == 21) {
			var probability = 0.5;
			if ((ap < probability) && (!ad.map.in_array(xandy))) {
				ad.draw(stone, x, y, ad.tileWidth, ad.tileHeight);
			}
		}
		if ((tileY > 21) && (ad.map.in_array(xandy) == false)) {
			ad.draw(stone, x, y, ad.tileWidth, ad.tileHeight);
		}
		var probability0 = 0.01;
		if ((tileY > 30) && (ap < probability0) && (ad.map.in_array(xandy) == false)) {
			ad.draw(quartz, x, y, ad.tileWidth, ad.tileHeight);
		}
		probability0 = 0.01;
		var probability1 = 0.02;
		if ((tileY > 71) && (tileY < 170) && (ap > probability0) && (ap < probability1) && (ad.map.in_array(xandy)==false)) {
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
		var xandy = (tileX + 'and' + tileY);
		var ap = ad.hash2prob(ad.coordHash(tileX, tileY));
		var probability = 0.01;
		if ((tileY > 30) && (tileY < 70) && (ap < probability) && (!ad.map.in_array(xandy))) {
			ad.items.quartz++;
		}
		probability = 0.01;
		if ((tileY > 71) && (tileY < 170) && (ap < probability) && (!ad.map.in_array(xandy))) {
			ad.items.emerald++;
		}
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
			var t = 70;
		} else {
			var t = 20;
		}
		var stepX = Math.round((ad.currentFromX - fromX) * ad.tileWidth / t * 100) / 100;
		var stepY = Math.round((ad.currentFromY - fromY) * ad.tileHeight / t * 100) / 100;
		var nStepsX = (ad.currentFromX - fromX) * ad.tileWidth / stepX;
		var nStepsY = (ad.currentFromY - fromY) * ad.tileHeight / stepY;
		var c = 0;
		console.log(stepY);
		
		var step = function() {
			ad.raf = window.requestAnimationFrame(step);
			ad.dx += stepX;
			ad.dy += stepY;
			c++;
			ad.context.fillStyle = "#6495ED";
			ad.context.fillRect(0, 0, ad.width, ad.height); //Background (water)
			for (var i = ad.currentFromX - 1; i <= ad.currentFromX + ad.tilesOnX; i++) {
				for (var j = ad.currentFromY - 1; j <= ad.currentFromY + ad.tilesOnY; j++) {
					ad.drawTile(i, j, ad.dx, ad.dy);
				}
			}
			ad.drawBoat((Math.ceil(ad.tilesOnX / 2) * ad.tileWidth) - ad.tileWidth + 1, 6 * (ad.tileHeight) + ad.tileHeight * 0.2, ad.tileWidth - 2, ad.tileHeight * 0.725);
			ad.drawTools();
			ad.o2 -= ad.characteristics.o2consumption;
			if ((c > nStepsX) || (c > nStepsY)) {
				cancelAnimationFrame(ad.raf);
				ad.dx = 0;
				ad.dy = 0;
				ad.currentDisplacementX = ad.displacementX;
				ad.currentDisplacementY = ad.displacementY;
				ad.currentMap = [];
				ad.currentMap = ad.map.concat(ad.currentMap);
				ad.keys = "enabled";
			}
			if (ad.o2 <= 0) {
				ad.o2 = 0;
				ad.keys = "disabled";
				ad.context.font = '56px lucida console';
				ad.context.fillStyle = "#111111";
				ad.context.fillText('GAME OVER', ad.width / 2 - 200, ad.height / 2 - 60);
			}
		}
		
		step();
		ad.currentFromX = fromX;
		ad.currentFromY = fromY;
		if (ad.displacementY == 0) {
			ad.o2 = 1;
		}
	}
	
	ad.drawTools = function() {
		ad.context.font = '16px lucida console';
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
var c = document.getElementById("cardCanvas"),
	w = innerWidth,
	h = innerHeight;
c.width = w;
c.height = h;
var ctx = c.getContext("2d"),
	input = document.getElementById("CanvasImage"),
	reader = new FileReader(),
	img = new Image(),
	imgW, //px
	imgH, //px
	imgData,
	tileDim = {x: 250, y: 317}, //tile dimensions px
	tileCountX, //how many tiles we can fit
	tileCountY;

//read file input
input.onchange = function() {
	reader.readAsDataURL(input.files[0]);
	reader.onload = function() {
		img.src = reader.result;
		img.onload = function() {
			//start
			init();
			var tiles = getTiles();
			drawTiles(tiles);
		}
	}
}

function init() {
	imgW = img.width;
	imgH = img.height;
	//check how many full tiles we can fit
	//right and bottom sides of the image will get cropped
	tileCountX = ~~(imgW / tileDim.x);
	tileCountY = ~~(imgH / tileDim.y);

	ctx.drawImage(img, 0, 0);
	imgData = ctx.getImageData(0, 0, imgW, imgH).data;
	ctx.clearRect(0, 0, w, h);
}

//get imgdata index from img px positions
function indexX(x) {
	var i = x * 4;
	if (i > imgData.length) console.warn("X out of bounds");
	return i;
}
function indexY(y) {
	var i = imgW * 4 * y;
	if (i > imgData.length) console.warn("Y out of bounds");
	return i;
}
function getIndex(x, y) {
	var i = indexX(x) + indexY(y);
	if (i > imgData.length) console.warn("XY out of bounds");
	return i;
}

//get a tile of size tileDim.x*tileDim.x from position xy
function getTile(x, y) {
	var tile = [];
	//loop over rows
	for (var i = 0; i < tileDim.y; i++) {
		//slice original image from x to x + tileDim.x, concat
		tile.push(...imgData.slice(getIndex(x, y + i), getIndex(x + tileDim.x, y + i)));
	}
	//convert back to typed array and to imgdata object
	tile = new ImageData(new Uint8ClampedArray(tile), tileDim.x, tileDim.y);
	//save original position
	tile.x = x;
	tile.y = y;
	return tile;
}

//generate all tiles
function getTiles() {
	var tiles = [];
	for (var yi = 0; yi < tileCountY; yi++) {
		for (var xi = 0; xi < tileCountX; xi++) {
			tiles.push(getTile(xi * tileDim.x, yi * tileDim.y));
		}
	}
	return tiles;
}

//and draw with offset
var offset = 1.1;
function drawTiles(tiles) {
	tiles.forEach((d,i) => ctx.putImageData(d, d.x * offset, d.y * offset));		//ritar in bilden
	
	//more interesting effects are easy to do:
	//tiles.forEach((d,i) => ctx.putImageData(d, d.x * i * 0.01, d.y * i * 0.01));
	
	//for efficiency in animation etc tiles should be converted to image object
}
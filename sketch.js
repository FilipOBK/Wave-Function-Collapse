//Things to edit
const dim = 20;
const folder = "base+";



const tiles = [];
const tileImages = [];

let grid = [];
const width = 800;
const height = 800;

const folderSize = function(){
    switch(folder){
        case "base":
            return 2;
        case "base+":
            return 5;
        case "carcassone":
            return 17;
        default:
            return 2;
    }
}();

const BLANK = 0;
const UP = 1;
const RIGHT = 2;
const DOWN = 3;
const LEFT = 4;

function preload(){
    //load images
    for(let i = 0; i < folderSize; i++){
        tileImages[i] = loadImage(`tiles/${folder}/${i}.png`);
    }
}

function setup(){
    createCanvas(width,height);

    //create the tiles
    switch(folder){
        case 'base': {
            tiles[0] = new Tile(tileImages[0], [0, 0, 0, 0]);
            tiles[1] = new Tile(tileImages[1], [1, 1, 0, 1]);
            break;
        }
        case 'base+': {
            tiles[0] = new Tile(tileImages[0], [0, 0, 0, 0]);
            tiles[1] = new Tile(tileImages[1], [1, 1, 0, 1]);
            tiles[2] = new Tile(tileImages[2], [1, 1, 0, 0]);
            tiles[3] = new Tile(tileImages[3], [1, 1, 1, 1]);
            tiles[4] = new Tile(tileImages[4], [1, 0, 0, 0]);
            break;
        }
        case 'town': {
            tiles[0] = new Tile(tileImages[0], [0, 0, 0, 0]);
            tiles[1] = new Tile(tileImages[1], [1, 1, 0, 1]);
            break;
        }
        case 'carcassone': {
            tiles[0] = new Tile(tileImages[0], [1, 1, 1, 1]);
            tiles[1] = new Tile(tileImages[1], [0, 1, 0, 1]);
            tiles[2] = new Tile(tileImages[2], [2, 2, 2, 2]);
            tiles[3] = new Tile(tileImages[3], [2, 2, 2, 2]);
            tiles[4] = new Tile(tileImages[4], [2, 2, 0, 2]);
            tiles[5] = new Tile(tileImages[5], [2, 1, 2, 1]);
            tiles[6] = new Tile(tileImages[6], [2, 0, 2, 2]);
            tiles[7] = new Tile(tileImages[7], [2, 0, 0, 0]);
            tiles[8] = new Tile(tileImages[8], [2, 0, 1, 0]);
            tiles[9] = new Tile(tileImages[9], [2, 1, 0, 2]);
            tiles[10] = new Tile(tileImages[10], [1, 2, 1, 2]);
            tiles[11] = new Tile(tileImages[11], [2, 0, 1, 2]);
            tiles[12] = new Tile(tileImages[12], [2, 0, 1, 1]);
            tiles[13] = new Tile(tileImages[13], [2, 1, 1, 2]);
            tiles[14] = new Tile(tileImages[14], [0, 1, 1, 1]);
            tiles[15] = new Tile(tileImages[15], [0, 1, 0, 1]);
            tiles[16] = new Tile(tileImages[16], [0, 0, 1, 1]);
            break;
        }
        default:
            break;
    }

    //rotate tiles that need to be rotated
    const baseToRotate = [1];
    const basePlusToRotate = [1, 2, 4];
    const carcassoneToRotate = [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    let tilesToRotate = [];
    switch(folder){
        case 'base': {
            tilesToRotate = baseToRotate;
            break;
        }
        case 'base+': {
            tilesToRotate = basePlusToRotate;
            break;
        }
        case 'town': {
            tilesToRotate = baseToRotate;
            break;
        }
        case 'carcassone': {
            tilesToRotate = carcassoneToRotate;
            break;
        }
        default:
            tilesToRotate = [0];
            break;
    }
    for(let i = 1; i <= 3; i ++){
        for(let j = 0; j < tilesToRotate.length; j++){
            let tile = tiles[tilesToRotate[j]];
            tiles.push(tile.rotateTile(i));
        } 
    }

    //create adjacency rules based off of edges
    for(let i = 0; i < tiles.length; i++){
        const tile = tiles[i];
        tile.analyze(tiles);
    }

    genGrid();
}

//generate the grid
const genGrid = () => {
    //create a cell object for each gridpoint, with options of each any tile
    for(let i = 0; i < dim*dim; i++){
        grid[i] = new Cell(tiles.length);
    }
}

function checkValid(options, valid){
    for(let i = options.length - 1; i >= 0; i--){
        //element being looked at
        let element = options[i];
        //if the element looked at is not included in the valid options, remove it from options
        if(!valid.includes(element)){
            options.splice(i, 1);
        }
    }
}

function evaluate(){
    let newGrid = [];
    for(let row = 0; row < dim; row ++){
        for(let col = 0; col < dim; col++){

            let index = col + (row * dim);
            if(grid[index].collapsed){
                newGrid[index] = grid[index];
            } else {
                let possibilities = new Array(tiles.length).fill(0).map((x, i) => i);
                //look up
                if(row > 0){
                    const tileAbove = grid[col + (row - 1) * dim];
                    let allBelow = [];
                    for(let option of tileAbove.options){
                        let posBelow = tiles[option].down;
                        allBelow = allBelow.concat(posBelow);
                    }
                    checkValid(possibilities, allBelow);
                }
                //look right
                if(col < dim - 1){
                    const tileRight = grid[col + 1 + row * dim];
                    let allLeft = [];
                    for(let option of tileRight.options){
                        let posLeft = tiles[option].left;
                        allLeft = allLeft.concat(posLeft);
                    }
                    checkValid(possibilities, allLeft);
                }
                //look down
                if(row < dim - 1){
                    const tileBelow = grid[col + (row + 1) * dim];
                    let allAbove = [];
                    for(let option of tileBelow.options){
                        let posAbove = tiles[option].up;
                        allAbove = allAbove.concat(posAbove);
                    }
                    checkValid(possibilities, allAbove);
                }
                //look left
                if(col > 0){
                    const tileLeft = grid[col - 1 + row * dim];
                    let allRight = [];
                    for(let option of tileLeft.options){
                        let posRight = tiles[option].right;
                        allRight = allRight.concat(posRight);
                    }
                    checkValid(possibilities, allRight);
                }

                newGrid[index] = new Cell(possibilities);
            }
        }
    }
    return newGrid;
}

function draw(){
    background(0);
    //width of image is width of canvas / #of cells
    const w = width / dim;
    //height of image is height of canvas / #of cells
    const h = height / dim;

    //for each cell
    for(let row = 0; row < dim; row++){
        for(let col = 0; col < dim; col++){
            //store the object in var called cell
            let cell = grid[col + row * dim];
            if(cell.collapsed){
                //only collapsed if 1 option, which will be the first in the arr
                let index = cell.options[0]
                //load the image at the col, row, spaced according to size of images 
                image(tiles[index].img, col * w, row * h, w, h);
            } else {
                //else make a black rectangle
                fill(40);
                stroke(0, 228, 223);
                rect(col * w, row * h, w, h);
            }
        }
    }

    //evaluating entropy----------------------
    //make a copy of the grid
    let sortedGrid = grid.slice();
    sortedGrid = sortedGrid.filter(element => !element.collapsed);
        //if everything is collapsed, stop evaluating
        if(sortedGrid.length == 0){
            return;
        }
    //if < 0, set a before b
    sortedGrid.sort((a, b) => a.options.length - b.options.length);
    //get rid of all that have higher entropy than the lowest
    const cutGrid = sortedGrid.filter(cell => {
        return cell.options.length == sortedGrid[0].options.length;
    });

    //get a random cell, assign a random direction
    const cell = random(cutGrid);
    cell.collapsed = true;
    const dir = random(cell.options);
    if(dir == undefined){
        genGrid();
        return;
    }
    cell.options = [dir];

    grid = evaluate();
}
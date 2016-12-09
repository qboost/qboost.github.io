/* ----------------------------------------------------------------------------
 * NAME:        MATCH-O-MATIC LAB 2
 * AUTHOR:      STRIDER WHITE A01
 * PURPOSE:     IMPLEMENT LAB 2 SPECIFICATION
 * DATE:        NOV 28 2016
 ----------------------------------------------------------------------------*/

// ----------------------------- VARIABLE DECLARATIONS ---------------------- //

var difficulty =4;                              //GAME DIFFICULTY LEVEL
var cell;                                       //CELL GAME OBJECT
var colors = ['red','green','blue','yellow'];   //SOME COLORS
var highlightCount;                             //HOW MANY CELLS ARE HIGHLIGHTED
var gridRows = 3;                               //# OF ROWS
var gridCols = 8;                               //# OF COLS
var grid = [];                                  //GRID ARRAY
var score;                                      //USER CURRENT SCORE

// ----------------------------- FUNCTION DECLARATIONS ---------------------- //

//-----------------------------------------------------------------------//
//CELL: CONSTRUCTOR FOR 'CELL', SETS SOME PARAMAS.      
//ARG   R:  # OF ROWS
//ARG   C:  # OF COLS
//------------------------------------------------------------------------//
function Cell(r,c){
    this.row = r;
    this.col = c;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.highlight = false;
    this.alive = true;
}


//-----------------------------------------------------------------------//
//window.onload: ANNON FUNC THAT BINDS "START GAME" BUTTON TO NewGame FUNC
//PARMAS:   NONE
//RETURNS:  NOTHNIG  
//------------------------------------------------------------------------//
window.onload = function(){
    document.getElementById("startGame").onclick = NewGame;
};


//-----------------------------------------------------------------------//
//Cell.prototype.Show:  SHOWS THE CELLS, ALSO CHECKS IF HIGHLIGHTED OR ALIVE/DEAD 
//PARMAS:   NONE
//RETURNS:  NOTHNIG  
//------------------------------------------------------------------------//
Cell.prototype.Show = function()
{    
    //construct the ID name....
    var thisCell = document.getElementById("r" + this.row + "c" + this.col);
    
    //document.write(thisCell);
    
    //if alive set bg to the color, othwise its dead set to black
    if (this.alive)
    {
        thisCell.style.backgroundColor = this.color;       
    }
    else
    {
        thisCell.style.backgroundColor = '#000000';
        thisCell.style.borderWidth = 'thin';
    }
    
    if (this.highlight)
    {
        thisCell.style.backgroundColor = '#ff00ff';
        thisCell.style.borderWidth = 'thick';
    }
    else{
        thisCell.style.borderWidth = 'thin';
    }
    
}

//-----------------------------------------------------------------------//
//Cell.prototype.Bind: ESTBALISHES SUBROUTINES FOR MOUSEOVER AND ONCLICK    
//PARMAS:   NONE
//RETURNS:  NOTHNIG  
//------------------------------------------------------------------------//

Cell.prototype.Bind = function()
{
    var bindRow = this.row;
    var bindCol = this.col;
    var bindColor = this.color;


    // ONMOUSEOVER CELL HANDLER
    // set the highlight state of adjacent colors
    document.getElementById("r" + bindRow + "c" + bindCol)
                                                .onmouseover = function(){
        for (var x = 0; x < grid.length; ++x) 
            for (var y = 0; y < grid[x].length; ++y) 
                grid[x][y].highlight = false;
    
        highlightCount = 0;                
        highlightCount = Check(0,bindRow,bindCol,bindColor);   
        
        //document.write("score " + score);
        //document.write("HIGHLIGHT COUNT: " + highlightCount);
        //console.log(highlightCount);
        ShowGrid();
    };   
     
    // ONCLICK CELL HANDLE     
    //  iterate through and the cell is alive and highlighted, then increment 
    //  the score and kill/unhighlight it
    document.getElementById("r" + bindRow + "c" + bindCol).onclick = function()
    {        
        //"KILL" Figures out how many kills we got    
        score += Math.pow(Kill(), 2);
        var CanMoveDown = true;  
        while (CanMoveDown){
            CanMoveDown = false;
            for (var r = 1; r < grid.length; r++) 
            {
                for (var c = grid[r].length - 1; c >= 0; c--)
                {
                    if (grid[r][c].Move())
                    {
                        CanMoveDown = true;
                    }
                } 
            }   
        }   
        ShiftLeft();  
        BindGrid();
        ShowGrid();

        console.log(WinCondition());
        
        if(WinCondition()){
            alert('You Win!  Score: ' + score);
        }
    };
        
};


//-----------------------------------------------------------------------//
//Cell.prototype.Move: DETERMINES IF WE CAN MOVE DOWN 
//PARMAS:   NONE
//RETURNS:  NOTHNIG  
//------------------------------------------------------------------------//
Cell.prototype.Move = function()
{  
    //if we can mvoe down
    var canMoveDown = false;
    //the cell above
    var aboveCell = grid[this.row - 1][this.col];  
    if (!this.alive && aboveCell.alive){
        canMoveDown = true;
        this.alive = true;
        this.color = aboveCell.color;
        aboveCell.alive = false;
    }
    return canMoveDown;
};



//-----------------------------------------------------------------------//
//Check: RECURSIVE FUNC WHICH HIGHLIGHTS AJACENT CELLS OF THE SAME COLOR.      
//ARG   Count:  # OF "HIGHLIGHTED" CELLS
//ARG   X:  CURRENT X POS
//ARG   Y:  CURRENT Y POS
//ARG   Color: COLOR OF CELLS WE ARE LOOKING FOR
//------------------------------------------------------------------------//
function Check(Count,x,y,color)
{  
    //GROSS IF
    //IF NOT OUT OF BOUNDS AND COLORS ARE THE SAME
    if(x < gridRows 
            && x >= 0 
            && y >= 0 
            && y < gridCols
            && grid[x][y].alive && grid[x][y].color === color 
            && !grid[x][y].highlight){
        
            grid[x][y].highlight = true;
            ++Count;
            
            Count = Check(Count,x+1,y,color);
            Count = Check(Count,x,y+1,color);
            Count = Check(Count,x-1,y,color);
            Count = Check(Count,x,y-1,color);
    }
    return Count;
}


//-----------------------------------------------------------------------//
//ShowGrid: JUST CALLS "SHOW" ON ALL EXISTING CELLS.     
//PARMAS:   NONE
//RETURNS:  NOTHNIG  
//------------------------------------------------------------------------//
function ShowGrid()
{  
    for (var x = 0; x < grid.length; ++x) 
        for (var y = 0; y < grid[x].length; ++y) 
            grid[x][y].Show();
    
    document.getElementById("score").innerHTML = score;   
    document.getElementById("highlighted").innerHTML = highlightCount;    
}


//-----------------------------------------------------------------------//
//Kill: DETERMINES HOW MANY CELLS WERE KILLED FROM THE CLICK 
//PARMAS:   NONE
//RETURNS:  NOTHNIG  
//------------------------------------------------------------------------//
function Kill(){  
    var killCount = 0;

    for (var x = 0; x < grid.length; ++x){
        for (var y = 0; y < grid[x].length; ++y) {
            if (grid[x][y].highlight){
                grid[x][y].alive = false;
                grid[x][y].highlight = false;
                ++killCount;
            }  
        }
    } 
    return killCount;
}



//-----------------------------------------------------------------------//
//BindGrid: CALLS BIND FOR ALL CELLS      
//PARMAS:   NONE
//RETURNS:  NOTHNIG  
//------------------------------------------------------------------------//
function BindGrid(){  
    for (var x = 0; x < grid.length; ++x) 
        for (var y = 0; y < grid[x].length; ++y) 
            grid[x][y].Bind();
}


//-----------------------------------------------------------------------//
//WinCondition: CHECKS IF WE WON, SEARCH FOR NON-WIN CONDITION
//PARMAS:   NONE
//RETURNS:  NOTHNIG  
//------------------------------------------------------------------------//
function WinCondition()
{
    for (var x = 0; x < grid.length; ++x) 
        for (var y = 0; y < grid[x].length; ++y) 
            if(grid[x][y].alive)
                return false;
    return true;
}




//-----------------------------------------------------------------------//
//ShiftLeft: SHIFTS ALL CELLS LEFT IF POSSIBLE
//PARMAS:   NONE
//RETURNS:  NOTHNIG  
//------------------------------------------------------------------------//
function ShiftLeft ()
{
    var shift = true;  
    while (shift)
    {
        shift = false;  
        for (var c = 0; c < grid[0].length - 1; ++c)
        {
            if (!grid[gridRows-1][c].alive && grid[gridRows-1][c + 1].alive)
            {
                shift = true;                
                for (var r = 0; r < grid.length; r++) 
                {
                    if (grid[r][c+1].alive){
                        grid[r][c].alive = true;
                        grid[r][c + 1].alive = false;
                        grid[r][c].color = grid[r][c+1].color;
                    }                
                }
            }
        }
    }
    
}



//-----------------------------------------------------------------------//
//NewGame: START A NEW GAME, ALSO CALLS BindGrind and ShowGrid funcs
//PARMAS:   NONE
//RETURNS:  NOTHNIG  
//------------------------------------------------------------------------//
function NewGame(){  
    //SWITCH/CASE BETWEEN THE GAME DIFFICULTY
    switch(Number(document.getElementById("gameDiff").value))
    {
        case 1:
            gridRows = 3;
            gridCols = 8;
            break;
        case 2:
            gridRows = 6;
            gridCols = 12;
            break;
        case 3:
            gridRows = 10;
            gridCols = 16;
            break;       
    }
    for(var x = 0; x < gridRows; ++x)
    {
        grid[x] = [];
        for(var y = 0; y < gridCols; ++y)
            grid[x][y] = new Cell(x,y);
    }
   
    score = 0;
    highlightCount = 0;
    
    NewGrid();
    BindGrid();
    ShowGrid();
}


//-----------------------------------------------------------------------//
//NewGrid: ESTABLISHES THE GAME GRID, DRAWS IT OUT TO THE SCREEN VIA HTML EDIT
//PARMAS:   NONE
//RETURNS:  NOTHNIG  
//------------------------------------------------------------------------//
function NewGrid()
{       
    var tableDiv = document.getElementById("gameTable"); 
    tableDiv.innerHTML = '';
    var table = document.createElement('table');   
    var tableBody = document.createElement('tbody');
    table.appendChild(tableBody);   
    for (var row = 0; row < gridRows; row++) {       
        var tr = document.createElement('tr');
        tableBody.appendChild(tr);
        
        for (var col = 0; col < gridCols; col++) {
            var td = document.createElement('td');
            td.innerHTML = "<button type='button' class='gameButton' id='r" +
                            row + "c" + col +"'>&nbsp;</button>";
            tr.appendChild(td);
        }
    }   
    tableDiv.appendChild(table);
}
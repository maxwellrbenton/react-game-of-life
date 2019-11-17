import React, {useState, useEffect, useRef } from 'react';
import BoardContainer from './components/BoardContainer'
import ControlsContainer from './components/ControlsContainer'
import  { idbKeyval } from './indexDB/'
import './App.css';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    margin: "5%"
  }
}));

function App() {
  //sets colors, speed, size
  const [offColor, setOffColor] = useState('#003')//'#'+(Math.random()*0xFFFFFF<<0).toString(16).slice(0,3))
  const [onColor, setOnColor] = useState('#aaa')//'#'+(Math.random()*0xFFFFFF<<0).toString(16).slice(0,3))
  const [speed, setSpeed] = useState(100);
  const [size, setSize] = useState(40);
  const [grid, setGrid] = useState(null)
  const classes = useStyles();

  //gridRef required for timer calls
  const gridRef = useRef(grid);
  const boardRef = useRef(null);
  gridRef.current = grid;

  const handleOffColorChange = newColor => {
    setOffColor(newColor)
  }
  const handleOnColorChange = newColor => {
    setOnColor(newColor)
  }

  useEffect(() => {
    const updateData = async () => {
      let data = await idbKeyval.get('game-data')
      if (data) {
        setGrid(data)
      }
    }
    updateData()
  }, [])

  const save = async () => {
    let data = await idbKeyval.get('game-data')
    if (JSON.stringify(data) !== JSON.stringify(grid)) {
      await idbKeyval.set('game-data', grid)
    }
  }

  const load = async () => {
    let data = await idbKeyval.get('game-data')
    setGrid(data)
  }
  
  const handleClear = () => {
    rebuildGrid("clear")
  }

  const handleRandom = () => {
    rebuildGrid("random")
  }

  const handleSpeedSliderChange = (event, newValue) => {
    setSpeed(newValue);
  };
  const handleSizeSliderChange = (event, newValue) => {
    setSize(newValue);
  };

  const handleCellClick = (id, alwaysOn) => {
    setGrid(previousState => {
      return previousState.map((row, rowIndex) => {
          if(id[0] === rowIndex) {
            return row.map((cell, cellIndex)  => {
              if(cellIndex === id[1]) {
                if (alwaysOn) {
                  return true
                } else {
                  return !cell
                }
              } else {
                return cell
              }
            })
          } else {
            return row
          }
        })
    })
  }

  const checkForNeighbors = (row,column) => {
    if(gridRef.current !== null && gridRef.current[row]) {
      let neighbors = [
        gridRef.current[row-1] ? gridRef.current[row-1][column-1] : false,
        gridRef.current[row-1] ? gridRef.current[row-1][column] : false,
        gridRef.current[row-1] ? gridRef.current[row-1][column+1] : false,
        gridRef.current[row][column-1],
        gridRef.current[row][column+1],
        gridRef.current[row+1] ? gridRef.current[row+1][column-1] : false,
        gridRef.current[row+1] ? gridRef.current[row+1][column] : false,
        gridRef.current[row+1] ? gridRef.current[row+1][column+1] : false,
      ].filter(n => n)
      if(gridRef.current[row][column]) {
        return neighbors.length === 2 || neighbors.length === 3
      } else {
        return neighbors.length === 3
      }
    } else {
      return Math.random() > .5
    }
  }

  const rebuildGrid = (option = null) => {
    console.log('build')
    let newGrid = []
    for(let row = 0; row < Math.floor(boardRef.current.clientHeight/(boardRef.current.clientWidth/(size+5))); row++) {
      newGrid[row] = []
      for(let column = 0; column < Math.floor(boardRef.current.clientWidth/(boardRef.current.clientWidth/(size+5))); column++) {
        if(option === "clear") {
          newGrid[row][column] = false
        } else if(option === "random") {
          newGrid[row][column] = Math.random() > .5
        } else {
          newGrid[row][column] = checkForNeighbors(row,column)
        }
      }
    }
    setGrid(newGrid)
  }

  return (
    <div className="App">
      <BoardContainer 
        grid={grid}
        offColor={offColor}
        onColor={onColor}
        speed={speed} 
        size={size}
        rebuildGrid={rebuildGrid}
        handleCellClick={handleCellClick}
        boardRef={boardRef}
      />
      <ControlsContainer
        save={save}
        load={load}
        speed={speed} 
        size={size}
        offColor={offColor}
        onColor={onColor}
        handleSpeedSliderChange={handleSpeedSliderChange}
        handleSizeSliderChange={handleSizeSliderChange}
        handleClear={handleClear}
        handleRandom={handleRandom}
        handleOffColorChange={handleOffColorChange}
        handleOnColorChange={handleOnColorChange}
      />
      <Paper className={classes.root}>
        <Typography variant="body1">
          The Game of Life is a cellular automation game designed by John Conway in 1970. The game follows simple rules: each 'cell' can be OFF or ON ('dead' or 'alive'). Whether or not a cell is ON is determined by how many neighboring cells are ON. An OFF cell will turn ON if it has exactly three neighboring cells that are ON. An ON cell will stay on if there are two or three neighboring cells that are ON. Otherwise, the cell turns or stays OFF.
        </Typography>
        <br/>
        <Typography variant="body1">
          While these rules are simple, it is possible for highly complex patterns to develop, including patterns that can sustain themselves, 'travel' across the board, and even create other self-sustaining patterns. It is theoretically possible to create complete Turing machines using the patterns that can exist in this 2d world.
        </Typography>
      </Paper>
    </div>
  );
}

export default App;

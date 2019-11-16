import React, {useState, useEffect, useRef } from 'react';
import BoardContainer from './components/BoardContainer'
import ControlsContainer from './components/ControlsContainer'
import  { idbKeyval } from './indexDB/'
import './App.css';

function App() {
  //sets colors, speed, size
  const [offColor, setOffColor] = useState("#aaa")
  const [onColor, setOnColor] = useState("#333")
  const [speed, setSpeed] = useState(15);
  const [size, setSize] = useState(15);
  const [grid, setGrid] = useState(null)

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
    </div>
  );
}

export default App;

import React, { useState, useRef, useEffect } from 'react';
import Cell from './Cell'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    margin: "5%"
  }
}));

const BoardContainer = ({speed, size, grid, offColor, onColor, handleCellClick, rebuildGrid, controlsRequest, boardRef}) => {
  const [alwaysOn, setAlwaysOn] = useState(false)
  const classes = useStyles();
  const timerRef = useRef(null);

  const handleMouseDown = () => {
    setAlwaysOn(true)
  }

  const handleMouseUp = () => {
    setAlwaysOn(false)
  }

  useEffect(() => {
    window.addEventListener("resize", rebuildGrid);
    return () => {
      window.removeEventListener("resize", rebuildGrid);
    }
  }, [])

  const tick = () => {
    clearTimeout(timerRef.current)
    rebuildGrid()
    timerRef.current = setTimeout(tick, 15/(speed+1)*1000)
  }

  useEffect(() => {
    tick()
  }, [speed, size, onColor, offColor])

  const renderCells = () => {
    let cellSize = Math.round((boardRef.current.clientWidth/(size+5)))*10/10
    
    return grid.map((row, rowIndex) => {
      return row.map((column, columnIndex) => {
        return <Cell 
          offColor={offColor}
          onColor={onColor}
          alwaysOn={alwaysOn}
          key={[rowIndex,columnIndex]} 
          id={[rowIndex,columnIndex]} 
          handleClick={handleCellClick}
          status={grid[rowIndex][columnIndex]}
          cellSize={cellSize}
        />
      })
    })
  }

  return (
    <Paper className={classes.root + " BoardContainer"} >
      <div ref={boardRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}className="Board">
        {grid ? renderCells() : null}
      </div>
    </Paper>
  )
}

export default BoardContainer
import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import AppsIcon from '@material-ui/icons/Apps';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    margin: "5%"
  }
}));

const ControlsContainer = ({speed, size, save, load, offColor, onColor, handleSpeedSliderChange, handleSizeSliderChange, handleClear, handleRandom, handleOnColorChange, handleOffColorChange}) => {
  const classes = useStyles();
  const [inputValues, setInputValues] = useState({"off": '#', 'on': '#'})

  const handleInputChange = event => {
    let id = event.target.id
    let value = event.target.value.slice(1)
    if(value.length > 3) value = value.slice(0,3)
    value = value.replace(/[^0-9a-fA-F]/, '')
    value = '#' + value
    if(value.length === 4 && id === "off") handleOffColorChange(value)
    if(value.length === 4 && id === "on") handleOnColorChange(value)
    setInputValues(previous => ({...previous, [id]: value}))
  }

  return (
    <Paper className={classes.root}>
      <Typography id="input-slider" gutterBottom>
        Speed
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <AccessTimeIcon />
        </Grid>
        <Grid item xs>
          <Slider
            value={typeof speed === 'number' ? speed : 0}
            onChange={handleSpeedSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
      </Grid>
      <Typography id="input-slider" gutterBottom>
        Size
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <AppsIcon />
        </Grid>
        <Grid item xs>
          <Slider
            value={typeof size === 'number' ? size : 0}
            onChange={handleSizeSliderChange}
            aria-labelledby="input-slider"
            step={5}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} justify="center">
        <Grid item>
          <div className="cellControl" style={{background: offColor}}></div>
        </Grid>
        <Grid item>
          <div className="cellControl" style={{background: onColor}}></div>
        </Grid>
      </Grid>
      <Grid container spacing={2} justify="center">
        <Grid item>
            <Input className="cellControlInput" id="off" name="off" value={inputValues["off"]} onChange={handleInputChange}/>
        </Grid>
        <Grid item>
            <Input className="cellControlInput" id="on" name="on" value={inputValues["on"]} onChange={handleInputChange}/>
        </Grid>
      </Grid>
      <Grid container spacing={2} justify="center">
        <Grid item>
          <ButtonGroup variant="contained" size="medium" aria-label="small contained button group">
            <Button onClick={() => save()}>Save</Button>
            <Button onClick={() => load()}>Load</Button>
            <Button onClick={() => handleRandom()}>Random</Button>
            <Button onClick={() => handleClear()}>Clear</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      
    </Paper>
  )
}

export default ControlsContainer
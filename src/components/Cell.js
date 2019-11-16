import React from 'react'

class Cell extends React.Component { 
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.cellSize !== this.props.cellSize) return true
    if(nextProps.status !== this.props.status) return true
    if(nextProps.onColor !== this.props.onColor) return true
    if(nextProps.offColor !== this.props.offColor) return true
    return false
  }

  handleHover = () => {
    if(this.props.alwaysOn) {
      this.props.handleClick(this.props.id, this.props.alwaysOn)
    }
  }
  render() {
    return (
      <div 
        id={this.props.id} 
        onClick={() => this.props.handleClick(this.props.id, false)}
        className="cell"
        onMouseEnter={this.handleHover}
        onMouseOut={this.handleHover}
        style={{
          position: 'absolute',
          top: this.props.id[0] * this.props.cellSize,
          left: this.props.id[1] * this.props.cellSize,
          width: this.props.cellSize,
          height: this.props.cellSize,
          background: this.props.status ? this.props.onColor : this.props.offColor,
          border: this.props.status ? this.props.onColor : this.props.offColor
        }}
      ></div>
    )
  }
}

export default Cell;
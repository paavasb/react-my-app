import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const player1 = 'X';
const player2 = 'O';

function Square(props) {
  const winningSquareStyle = {
    backgroundColor: '#add8e6'
  };

  return (
    <button className="square" onClick={props.onClick} style={props.winningSquare ? winningSquareStyle : null}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let winningSquare = this.props.winner && this.props.winner.includes(i);
    return (
    <Square 
    value={this.props.squares[i]}
    onClick={()=>this.props.onClick(i)}
    winningSquare={winningSquare}
    />
    );
  }
  render() {
    let renderedBoard = [];
    for(var i = 0; i < 3; i++){
      let renderedRow = [];
      for(var j = 0; j < 3; j++){
        renderedRow.push(<span key = {i*3+j}>{this.renderSquare(i*3 + j)}</span>);
      }
      renderedBoard.push(<div className = "board-row" key = {i}>{renderedRow}</div>);
    }
    return (
    <div>
      {renderedBoard}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        col: null,
        row: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      reverseOrder: false,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const [col, row] = calculateColRow(i);
    const [winner,] = calculateWinner(squares);
    if(winner || squares[i]) {
      return; 
    }
    squares[i] = this.state.xIsNext ? player1 : player2;
    this.setState({
      history: history.concat([{
        squares: squares,
        col: col,
        row: row,
      }]), 
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(move) {
    this.setState({
      stepNumber: move,
      xIsNext: (move % 2) === 0,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const [winner, locations] = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const movePosition = '(' + step.col + ', ' + step.row + ')';
      const moveBy = move % 2 === 0 ? player2 : player1;
      const desc = move ? 
      'Go to move #' + move + ' by ' + moveBy + ' to '+ movePosition : 
      'Go to game start';
      return (
        <li key={move}>
          <button 
          style={ this.state.stepNumber === move ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}
          onClick={() => this.jumpTo(move)}>
          {desc}
          </button>
        </li>
      );
    });

    if (this.state.reverseOrder) {
      moves.sort(function(a,b) {
         return b.key - a.key;
       });
    } 

    let status;
    if(winner) {
      const winningSquares = locations.map((i) => calculateColRow(i));
      var winningSquaresDisplay = "";
      for(var i = 0; i < 3; ++i) {
        winningSquaresDisplay += "(" + winningSquares[i] + ")";
        winningSquaresDisplay += i !== 2 ? ", " : "";
      }
      status = 'Winner: ' + winner + " -> " + winningSquaresDisplay;

    } else if(this.state.stepNumber === 9){
      status = "Draw: No one won";
    } else {
      status = 'Next Player: ' + (this.state.xIsNext ? player1 : player2);
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            onClick = {(i)=>this.handleClick(i)} 
            winner = {winner && locations}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button className="status" onClick={()=> this.setState({reverseOrder: !this.state.reverseOrder,})}>
            {'Reverse the order'}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, null];
}

function calculateColRow(i) {
  const col = i % 3;
  const row = Math.floor(i/3);
  return [col, row];
}


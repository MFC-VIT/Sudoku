import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { gameStateAtom } from "./atoms";
import { calculateGameRating, calculatePlayerRating, createNewGame } from "./functions";
import _ from 'lodash'
import Game from "./Components/Game";
// import GameOver from "./Components/Modals/GameOver";
import { errorLimits, timeLimit } from "./constants";

function App() {

  const [ game, setGame ] = useRecoilState(gameStateAtom)

  // (Function to generate and set the new game state)
  const generateNewGame = useCallback(
    (difficulty) => {
      const { data, board, solution, notes } = createNewGame(difficulty);
      const newGame = {
        ...game,
        data,

        board,
        solution,

        isRunning: true,
        isOver: false,
        rating: 5,
        errorCount: 0,
        timeSpentInSec: 0,

        highlightMoves: false,
        calledHighlightMoves: false,

        makeNotes: false,
        notes,

        selectedNumber: null,
        selectedSquaresForNumber: [],
        validSquaresForNumber: [],

        selectedSquare: { r: null, c: null },
        selectedNumbersForSquare: [],
        validNumbersForSquare: [],

        disabledNumbers: [],

      };
      setGame(newGame);
      return newGame;
    },
    [setGame, game.selectedDifficulty]
  );

  // (Initializing the Game)
  useEffect(() => {
    const savedGame = JSON.parse(localStorage.getItem("game"));
    if (
      !savedGame ||
      !savedGame.board.length ||
      savedGame.isOver
    ) {
      const newGame = generateNewGame();
      localStorage.setItem("game", JSON.stringify(newGame));
      console.log(1.1)
      console.log(newGame);
    } else {
      setGame({
        ...savedGame,
        makeNotes: false,
        isRunning: true,
      });
      console.log(1.2)
      console.log(savedGame);
    }
  }, [setGame, generateNewGame]);

  //Game Over
  useEffect(() => {
    if ( game.board.length && game.solution.length )
    if (_.flattenDeep(game.board).join("") === _.flattenDeep(game.solution).join("") || game.errorCount >= errorLimits[game.data.difficulty]){
      const gameRating = calculateGameRating(game.timeSpentInSec, timeLimit[game.data.difficulty], game.errorCount, errorLimits[game.data.difficulty]) - (game.calledHiglightMoves ? 1 : 0);
      setGame(game=>({
        ...game,
        isOver: true,
        isRunning: false,
        rating: gameRating > 0 ? gameRating : 0,
        player: { ...game.player, 
          totalGamesPlayed: (game.player.totalGamesPlayed ? game.player.totalGamesPlayed : 0) + 1,
          rating: calculatePlayerRating(game.player.rating, game.player.totalGamesPlayed + 1, gameRating),
        },
      }));
      console.log(2)

    // Auto fill the last number
    //Board change (notes check required here)
    } else if (game.disabledNumbers.length == 8){
      const numToFill = _.range(1, 10).find(num=>!game.disabledNumbers.includes(num));
      const newBoard = [];
      for (let r = 0; r < 9; r++){
        const row = [];
        for (let c = 0; c < 9; c++){
          if (game.board[r][c]==null) row.push(numToFill);
          else row.push(game.board[r][c]);
        }
        newBoard.push(row);
      }
      const gameRating = calculateGameRating(game.timeSpentInSec, timeLimit[game.data.difficulty], game.errorCount, errorLimits[game.data.difficulty]) - (game.calledHiglightMoves ? 1 : 0);
      setGame(game=>({
        ...game,
        board: newBoard,
        disabledNumbers: [...game.disabledNumbers, numToFill],
        isOver: true,
        isRunning: false,
        rating: gameRating > 0 ? gameRating : 0,
        player: { ...game.player, 
          totalGamesPlayed: (game.player.totalGamesPlayed ? game.player.totalGamesPlayed : 0) + 1,
          rating: calculatePlayerRating(game.player.rating, game.player.totalGamesPlayed + 1, gameRating),
        },
      }))
    }
  }, [game.board, game.solution, setGame, game.errorCount, game.disabledNumbers]);

  //Difficulty (Change in difficulty)
  useEffect(() => {
    if (game.selectedDifficulty != game.data.difficulty && game.board.length) {
      generateNewGame(game.selectedDifficulty);
      console.log(3)
    }
  }, [game.selectedDifficulty, generateNewGame, game.data.difficulty, game.board.length]);


//Numbers (function to check which number is completed on board)
  const isDisabled = useCallback(query=>{
    const solution = _.flatten(game.solution);
    const board = _.flatten(game.board);
    return !solution.filter((num, index)=>num!=board[index]).includes(query)
  }, [game.board, game.solution])
  
//Numbers (array of disabled numbers)
  useEffect(()=>{
    if (game.isRunning && game.board.length){
      const disabledNumbers = _.range(1, 10).filter(num=>isDisabled(num));
      if (disabledNumbers.length){
        setGame(game=>({
          ...game,
          disabledNumbers,
        }))
      }
      console.log(4)
    }
  }, [isDisabled, setGame, game.board, game.isRunning])

//Numbers (reseet selected squares and selected number if it is disabled)
  useEffect(()=>{
      if (game.isRunning && isDisabled(game.selectedNumber) && game.board.length){
          setGame(game=>({
              ...game,
              selectedNumber: null,
              selectedSquaresForNumber: [],
          }))
          console.log(5)
      }
  }, [isDisabled, setGame, game.selectedNumber, game.isRunning, game.board.length]);

//Numbers (move hints for selected square)
  useEffect(()=>{
    if (game.isRunning && game.board.length){
      const r = game.selectedSquare.r;
      const c = game.selectedSquare.c;
      if (r != null && c != null){
        const validNumbers = _.range(1, 10);
        for (let i = 0; i < 3; i++){
          for (let j = 0; j < 3; j++){
            const [ x, y ] = [ Math.floor(r/3)*3, Math.floor(c/3)*3 ];
            if ((x+i != r || y+j != c) && game.board[x+i][y+j]){
              const index = validNumbers.indexOf(game.board[x+i][y+j]);
              validNumbers.splice(index, 1)
            }
          }
        }
          
        for (let i = 0; i < 9; i++){
          if (validNumbers.includes(game.board[i][c])){
            const index =validNumbers.indexOf(game.board[i][c])
            validNumbers.splice(index, 1)
          }
        }
            
        for (let j = 0; j < 9; j++){
          if (validNumbers.includes(game.board[r][j])){
            const index =validNumbers.indexOf(game.board[r][j])
            validNumbers.splice(index, 1)
          }
        }
              
        setGame(game=>({
          ...game,
          validNumbersForSquare: validNumbers,
        }))
      }
      console.log(6)
    }
  }, [game.board, game.selectedSquare, game.selectedSquare.c, game.selectedSquare.r, setGame, game.isRunning])

  //Board (valid squares for selected number)
  useEffect(()=>{
    if (game.isRunning && game.selectedNumber != null && game.board.length){
      let validSquaresForNumber = [];
      for (let r = 0; r < 3; r++){
        for (let c = 0; c < 3; c++){
          let validSquares = [];
          let validCols = [];
          let validRows = []
          let isBoxValid = true;
          for (let i = r*3; i < r*3+3; i++){
            for (let j = c*3; j < c*3+3; j++){
              validCols.push(j);
              validRows.push(i);
              validSquares.push({r: i, c: j});
              if (game.board[i][j] == game.selectedNumber){
                isBoxValid = false;
              }
            }
          }
          if (isBoxValid && validSquares){
            validCols = validCols.filter(c=>_.range(0, 9).every(r=>game.board[r][c]!=game.selectedNumber));
            validRows = validRows.filter(r=>_.range(0, 9).every(c=>game.board[r][c]!=game.selectedNumber));
            validSquaresForNumber = validSquaresForNumber.concat(validSquares.filter(sqaure=>validCols.includes(sqaure.c)&&validRows.includes(sqaure.r)&&!game.board[sqaure.r][sqaure.c]));
          }
        }
      }
      setGame(game=>({
        ...game,
        validSquaresForNumber,
      }))
      console.log(7)
    }
  }, [game.isRunning, game.selectedNumber, game.board, setGame])
  
  //Timer
  useEffect(() => {
    let interval = null;
    if (game.isRunning && !game.isOver) {
      interval = setInterval(() => {
        setGame(game=>{
          const gameRating = calculateGameRating(game.timeSpentInSec, timeLimit[game.data.difficulty], game.errorCount, errorLimits[game.data.difficulty]) - (game.calledHiglightMoves ? 1 : 0);
          return {
          ...game,
          timeSpentInSec: game.timeSpentInSec + 1,
          rating:  gameRating > 0 ? gameRating : 0,
        }})
        console.log(8)
      }, 1000);
    } else if (!game.isRunning && game.isOver && game.timeSpentInSec !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [game.isRunning, game.timeSpentInSec, setGame, game.isOver]);

  // (storing game state after every state changes)
  useEffect(() => {
    if (game.board.length)
    localStorage.setItem('game', JSON.stringify(game));
  }, [game]);

  return (
    <>
      <Game />
      {/* <GameOver />  */}
    </>
  )
}

export default App

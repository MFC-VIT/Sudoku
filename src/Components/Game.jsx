import { useRecoilValue } from "recoil"
import Appbar from "./Appbar"
import Board from "./Board"
import Difficulty from "./Difficulty"
import Errors from "./Errors"
import Highlight from "./Highlight"
import Numbers from "./Numbers"
import Rating from "./Rating"
import Timer from './Timer'
import { gameStateAtom } from "../atoms"

const Game = () => {
  const game = useRecoilValue(gameStateAtom);
  return (
    <div>
       <div className="h-screen w-full">
        <Appbar />
        <div className="grid grid-cols-2">
          <div>
            <Board />
            <Numbers />
          </div>
          <div className="flex flex-col gap-4 pt-2 first:mb-2">
            <Rating rating={game.rating} />
            <Timer />
            <Difficulty />
            <Highlight />
            <Errors />
          </div>
        </div>
        {/* <Timer /> */}
        {/* {game.isOver && <GameOver />} */}
      </div>
    </div>
  )
}

export default Game

import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Die from "./components/Die";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [rolls, setRolls] = useState(0);
  const [timer, setTimer] = useState(0);
  const [start, setStart] = useState(true);
  const [bestTime, setBestTime] = useState(localStorage.getItem("timer") || 0);
  const [bestRolls, setBestRolls] = useState(
    localStorage.getItem("rolls") || 0
  );

  useEffect(() => {
    const allLock = dice.every((die) => die.isHeld);
    const allSame = dice.every((die) => die.value === dice[0].value);
    if (allLock && allSame) {
      setTenzies(true);
      setStart(false);
      checkRecord();
    }
  }, [dice]);

  function checkRecord() {
    if (!bestTime || timer < bestTime) {
      localStorage.setItem("timer", timer);
      setBestTime(timer);
    }
    if (!bestRolls || rolls < bestRolls) {
      localStorage.setItem("rolls", rolls);
      setBestRolls(rolls);
    }
  }

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newArray = [];
    for (let i = 0; i < 10; i++) {
      newArray.push(generateNewDie());
    }
    return newArray;
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      lockDice={() => lockDice(die.id)}
    />
  ));

  function lockDice(id) {
    setDice((prevDice) =>
      prevDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  function rollDice() {
    if (tenzies) {
      setDice(allNewDice);
      setTenzies(false);
      setRolls(0);
      setTimer(0);
      setStart(true);
    } else {
      setRolls((prevRoles) => prevRoles + 1);
      setDice((prevDice) =>
        prevDice.map((die) => (die.isHeld ? die : generateNewDie()))
      );
    }
  }

  useEffect(() => {
    let interval = null;
    if (start) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [start]);

  return (
    <div>
      {tenzies && <Confetti />}
      <main>
        <h1 className="appTitle">Tenzies</h1>
        {!tenzies ? (
          <p className="details appInstruction">
            Roll until all dice are the same.
            <br />
            Click each die to freeze it at its current value between rolls.
          </p>
        ) : (
          <p className="details appWin">You Won!!!</p>
        )}
        <div className="score">
          <p>Rolls: {rolls}</p>
          <p>
            Timer: {("0" + Math.floor((timer / 60000) % 60)).slice(-2)}:
            {("0" + Math.floor((timer / 1000) % 60)).slice(-2)}:
            {("0" + ((timer / 10) % 1000)).slice(-2)}
          </p>
        </div>
        <div className="diceContainer">{diceElements}</div>
        <button className="diceButton" onClick={rollDice}>
          {tenzies ? "New Game" : "Roll"}
        </button>
        <div className="bestScore">
          <label>
            Best Rolls <p>{bestRolls}</p>
          </label>
          <label>
            Best Time
            <p>
              {("0" + Math.floor((bestTime / 60000) % 60)).slice(-2)}:
              {("0" + Math.floor((bestTime / 1000) % 60)).slice(-2)}:
              {("0" + ((bestTime / 10) % 1000)).slice(-2)}
            </p>
          </label>
        </div>
        <p className="footer">© 2024, Coded by Chan Zhao Yi</p>
      </main>
    </div>
  );
}

// CSS
import "./App.css";
// React
import React, { useCallback, useEffect, useState } from "react";
// Data
import { wordsList } from "./data/words";
// Components
import StartScreen from './components/StartScreen';
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * categories.length)];

    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);
    // estatísticas o jogo de palavras secretas
  const startGame = useCallback(() => {
    // limpar todas as letras
    clearLetterStates();
    // escolha a palavra e escolha a categoria
    const { word, category } = pickWordAndCategory();
    // criar uma categoria de seleção de matriz
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    console.log(word, category);

    setPickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase();

    // verifique se a carta já foi utilizada
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // empurre a letra adivinhada ou remova um palpite
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      setGuesses((actualGuesses) => actualGuesses -1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };
  // verifique se os palpites terminaram
  useEffect (() =>{
    if (guesses <= 0) {
      // redefinir todos os estados
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses])

  // verifique a condição de vitória
  useEffect (() => {

    const uniqueLetters = [... new Set(letters)];

    // condição de vitória
    if(guessedLetters.length === uniqueLetters.length) {
      //  a pontuação
      setScore((actualScore) => actualScore += 100)
      //  reinicie o jogo com uma nova palavra
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

   // reinicia o jogo
  const retry = () => {
    setScore(0);
    setGuesses(3);

    setGameStage(stages[0].name);
  };

  return (
    <>
      <div className='App'>
        {gameStage === "start" && <StartScreen startGame={startGame} />}
        {gameStage === "game" &&
          <Game
            verifyLetter={verifyLetter}
            pickedWord={pickedWord}
            pickedCategory={pickedCategory}
            letters={letters}
            guessedLetters={guessedLetters}
            wrongLetters={wrongLetters}
            guesses={guesses}
            score={score}
          />}
        {gameStage === "end" && <GameOver retry={retry} score={score} />}
      </div>
    </>
  );
}

export default App;

import React, { useState, useEffect } from 'react';

function AlphabetGame() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const [currentLetter, setCurrentLetter] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null); // null for initial state, true/false later
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Initialize game with a random letter
    newLetter();
  }, []);

  const newLetter = () => {
    const randomIndex = Math.floor(Math.random() * 25); // Up to 'y' to have a 'next' letter
    setCurrentLetter(alphabet[randomIndex]);
    setUserAnswer('');
    setIsCorrect(null);
  };


  const handleChange = (event) => {
    setUserAnswer(event.target.value.toLowerCase());
  };

  const checkAnswer = () => {
    const currentIndex = alphabet.indexOf(currentLetter);
    const nextLetter = alphabet[currentIndex + 1];

    if (userAnswer === nextLetter) {
      setIsCorrect(true);
      setScore(score + 1);
      setTimeout(newLetter, 1000); // Show the correct answer for a second
    } else {
      setIsCorrect(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      checkAnswer();
    }
  };


  return (
    <div className="game-container">
      <h1>Alphabet Game</h1>
      <div className="letter-display">
        <p>Current Letter: {currentLetter}</p>
      </div>
      <div className="input-area">
        <input
          type="text"
          maxLength="1"  // Restrict input to a single character
          value={userAnswer}
          onChange={handleChange}
          onKeyPress={handleKeyPress} // Handle "Enter" key press
        />
        <button onClick={checkAnswer}>Check</button>
      </div>

      <div className="feedback">
        {isCorrect === true && <p className="correct">Correct!</p>}
        {isCorrect === false && <p className="incorrect">Incorrect. Try again!</p>}
      </div>

      <div className="score">
        <p>Score: {score}</p>
      </div>
    </div>
  );
}

export default AlphabetGame;

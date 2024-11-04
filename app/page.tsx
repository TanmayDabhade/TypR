// components/TypingTest.js
import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const TypingTest = ({ language, snippet }) => {
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 0 });

  useEffect(() => {
    if (input.length === 1) setStartTime(Date.now()); // Start timing on first keystroke
  }, [input]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    calculateStats();
  };

  const calculateStats = () => {
    // Calculate words per minute and accuracy
    const words = input.split(' ').length;
    const minutes = (Date.now() - startTime) / 60000;
    const accuracy = (input === snippet.slice(0, input.length) ? 100 : 0); // Simplified accuracy check
    setStats({ wpm: Math.round(words / minutes), accuracy });
  };

  return (
    <div className="typing-test">
      <SyntaxHighlighter language={language} style={atomDark}>
        {snippet}
      </SyntaxHighlighter>
      <textarea
        value={input}
        onChange={handleInputChange}
        placeholder="Start typing here..."
        className="typing-input"
      />
      <div className="stats">
        <p>WPM: {stats.wpm}</p>
        <p>Accuracy: {stats.accuracy}%</p>
      </div>
    </div>
  );
};

export default TypingTest;

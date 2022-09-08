import { useState } from 'react';
import './App.css';
import { TopBar } from './components/topbar';
import { WizardsRobbingJapan } from './components/wizardsrobbingjapan';

function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="App">
      <TopBar
        score={score}
      />
      <WizardsRobbingJapan
        setScore={setScore} 
      />
    </div>
  );
}

export default App;

//Create a top bar component with rules/timer/found character count
//A background component displaying the image
//A start game screeen
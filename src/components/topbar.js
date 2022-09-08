import { collection, onSnapshot, query, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { firestore } from "../utils/firebase";

export function TopBar(props) {
    const [minute, setMinute] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [win, setWin] = useState(false);
    const [finalScore, setFinalScore] = useState('0:00');

    const uploadScore = async () => {
        const scoreData = query(collection(firestore, "leaderboard"));
        const unsub = onSnapshot(scoreData, (snapshot) => {
            setDoc(finalScore);
        })
        const querySnapshot = await setDoc(scoreData, finalScore);
    }
    


    const timeoutRef = useRef(null);
    function resetInterval() {
        if (timeoutRef.current) {
          clearInterval(timeoutRef.current);
        }
    }

    const startTimer = () => {
        timeoutRef.current = setInterval(() => {
            setSeconds(seconds => seconds + 1);
        }, 1000);
    };

    useEffect(() => {
        if (seconds === 60) {
            setSeconds(() => 0);
            setMinute(minute => minute + 1);
        }
    }, [seconds])

    useEffect(() => {
        if (props.score === 5) {
            resetInterval();
            setWin(true);
            setFinalScore(() => `${minute}:${seconds}`)
        }
    }, [props.score])


    return (
        <div id="topBar">
            <div className="gameHeader">
                <h1>Wizards Robbing Japan</h1>
                <h3>by Hasib Hashemi and Adeeb Djawad of Wizards Robbing Kids</h3>
                <h2>Find all the Characters</h2>
            </div>
            <div className="gameTimer">
                <div>{minute}:{seconds < 10 ? `0${seconds}` : seconds}</div>
                {!win 
                  ? <div className="timerStart">
                            <button onClick={startTimer}>Start Game</button>
                    </div>
                  : <div>
                        <label>Enter Name:</label>
                        <input type='text'></input>
                        <button onClick={uploadScore}>Submit Score</button>
                    </div>
                }
                
            </div>
            <div className="gameCount">
                <div>{props.score}/5</div>
            </div>
        </div>
    );
  }
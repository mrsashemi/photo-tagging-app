import { collection, doc, getDoc, getDocs, onSnapshot, query, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { firestore } from "../utils/firebase";

class Highscore {
    constructor (name, score) {
        this.name = name;
        this.score = score;
    }
}

const highscoreConverter = {
    toFirestore: (player) => {
        return {
            name: player.name,
            score: player.score
        }
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Highscore(data.name, data.score);
    }
}

export function TopBar(props) {
    const [minute, setMinute] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [name, setName] = useState('')
    const [win, setWin] = useState(false);
    const [finalScore, setFinalScore] = useState('0:00');
    const [leaderboard, setLeaderboard] = useState([]);

    const uploadScore = async () => {
        const scoreData = doc(firestore, "leaderboard", name).withConverter(highscoreConverter);
        await setDoc(scoreData, new Highscore(name, finalScore))
    }

    const loadLeaderboard = async () => {
        let dataPoints = [];
        const leaderData = query(collection(firestore, "leaderboard"));
        const querySnapshot = await getDocs(leaderData);
        querySnapshot.forEach((doc) => {
            dataPoints.push(doc.data());
            dataPoints.sort((a,b) => b.score - a.score);
            setLeaderboard(() => [...dataPoints]);
        })
    }

    useEffect(() => {
        loadLeaderboard();
    }, [])

    const timeoutRef = useRef(null);
    function resetInterval() {
        if (timeoutRef.current) {
          clearInterval(timeoutRef.current);
        }
    }

    const startTimer = () => {
        props.setBegin(() => true);
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
                <ul className="leaderboard">
                    {leaderboard.map((leader) => {
                        return <li key={`${leader.name}-${leader.score}`}>{leader.name}: {leader.score}</li>
                    })}
                </ul>
            </div>
            <div className="gameTimer">
                <div>{minute}:{seconds < 10 ? `0${seconds}` : seconds}</div>
                {!win 
                  ? <div className="timerStart">
                            <button onClick={startTimer}>Start Game</button>
                    </div>
                  : <div>
                        <label>Enter Name:</label>
                        <input type='text' id="name" onChange={(e) => setName(() => e.target.value)} value={name}></input>
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
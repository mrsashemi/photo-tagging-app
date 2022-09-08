import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { firestore, storage } from "../utils/firebase";

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
    const [charURL, setCharURL] = useState([]);
    const [loading, setLoading] = useState(true);

    const counter = useRef(0);
    const mewRef = ref(storage, 'mew-as-pikachu.png');
    const gagaRef = ref(storage, 'gaga-as-samus.png');
    const muralRef = ref(storage, 'peace-on-earth.png');
    const beatlesRef = ref(storage, 'the-beatles.png');
    const ygRef = ref(storage, 'yg-as-cowboy-bebop.png');
    const charRefArray = [
        [mewRef, "Mew Disguised as Pikachu"], 
        [gagaRef, "Lady Gaga as Samus Aran"], 
        [muralRef, "Peace on Earth Mural"], 
        [ygRef, "YG as Cowboy Bebop"], 
        [beatlesRef, "The Beatles in Tokyo"]
    ];

    const imageLoaded = () => {
        counter.current += 1;
        if (counter.current >= 5) {
            setLoading(false);
        }
    };

    const uploadScore = async () => {
        const scoreData = doc(firestore, "leaderboard", name).withConverter(highscoreConverter);
        await setDoc(scoreData, new Highscore(name, finalScore));
        window.location.reload(false);
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
        let urlArray = []
        loadLeaderboard();
        charRefArray.forEach((item) => {
            getDownloadURL(item[0]).then((url) => {
                urlArray.push([url, item[1]]);
                setCharURL(() => [...urlArray]);
            })
        });
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
        console.log(props.score)
        if (props.score === 5) {
            resetInterval();
            setWin(true);
            setFinalScore(() => `${minute}:${seconds}`)
        }
    }, [props.score])


    return (
        <div id="topBar">
            <div className="gameHeader">
                <div className="mainHeader">
                    <h1>Wizards Robbing Japan</h1>
                    <h3>by Hasib Hashemi and Adeeb Djawad of Wizards Robbing Kids</h3>
                </div>
                <div className="findCharHeader">
                    <h2>Find all the Characters:</h2>
                    <div className="charContainer">
                        <div 
                            className='charImgContainer' 
                            style={{
                                display: loading ? "block" : "none"
                            }}
                        >Loading...
                        </div>
                        {charURL.map((url, index) => {
                            return (
                                <div className="charImgContainer" style={{display: loading ? "none" : "flex"}} key={`${url[1]}-${index}`}>
                                    <img src={url[0]} className="charIMG" key={`${url[1]}-${url[0]}-${index}`} alt={url[1]} onLoad={imageLoaded}></img>
                                    <div className="charLabel" key={`${url[0]}-${url[1]}-${index}`}>{url[1]}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="leaderboard">
                    <h3>Leaderboard:</h3>
                    <ul className="highscoresList">
                        {leaderboard.map((leader, index) => {
                            return <li key={`${leader.name}-${leader.score}-${index}`}>{leader.name} - {leader.score}</li>
                        })} 
                    </ul>
                </div>
            </div>
            <div className="gameTimer">
                <div className="time">{minute}:{seconds < 10 ? `0${seconds}` : seconds}</div>
                {!win 
                  ? <div className="timerStart">
                            <button onClick={startTimer} className="startGame">Start Game</button>
                    </div>
                  : <div className="submitScore">
                        <label>Enter Name:</label>
                        <input type='text' id="name" onChange={(e) => setName(() => e.target.value)} value={name}></input>
                        <button onClick={uploadScore}>Submit Score</button>
                    </div>
                }
                <div className="gameCount">
                    <div>{props.score}/5</div>
                </div>
                
            </div>
        </div>
    );
  }
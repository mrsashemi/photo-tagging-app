import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { firestore } from '../utils/firebase';

export function PopUp(props) {
    const [characters, setCharacters] = useState([]);
    const [result, setResult] = useState('');
    const [paddingOn, setPaddingOn] = useState(false);
    const [backgroundClr, setBackGroundClr] = useState('white')

    const loadCharacterData = async () => {
        let dataPoints = [];
        const characterData = query(collection(firestore, "character-coords"));
        const querySnapshot = await getDocs(characterData);
        querySnapshot.forEach((doc) => {
            dataPoints.push(doc.data());
            setCharacters(() => [...dataPoints]);
        })
    }

    useEffect(() => {
        loadCharacterData();
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setResult(() => '');
            setPaddingOn(() => false);
            setBackGroundClr(() => 'white');
        }, 2500);
        return () => clearTimeout(timer);
    }, [result, paddingOn, backgroundClr])
    
    return (
    <React.Fragment>
        <div id="popUp" style={{display: props.popUpDisplay, left: props.left, top: props.top}}>
            <ul className="characterList">
                {characters.map((character) => {
                    return <li key={character.id} onClick={(e) => {
                        if (props.xCoord >= character.xMin && props.xCoord <= character.xMax 
                            && props.yCoord >= character.yMin && props.yCoord <= character.yMax) {
                            setResult(() => `You found ${character.name}!`);
                            setPaddingOn(() => true);
                            setBackGroundClr(() => 'rgba(0, 128, 0, 0.5)');
                            props.setScore(score => score + 1);
                            console.log(paddingOn);
                            e.target.style.display = 'none'
                        } else {
                            setBackGroundClr(() => 'rgba(255, 0, 0, 0.5)');
                            setPaddingOn(() => true);
                            setResult(() => `Not quite the right character, keep looking!`)
                        }
                    }}>{character.name}</li>
                })}
            </ul>
        </div>
        <div id='successOrFailPopUp' style={{padding: paddingOn ? '0.5rem' : '0', background: backgroundClr}}>
            {result}
        </div>
    </React.Fragment>
    );
}
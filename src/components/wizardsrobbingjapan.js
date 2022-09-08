import React, { useEffect, useRef, useState } from 'react';
import { storage } from '../utils/firebase';
import { ref, getDownloadURL } from 'firebase/storage'
import { PopUp } from './popup';


export function WizardsRobbingJapan(props) {
    const [location, setLocation] = useState(false);
    const [popUpDisplay, setPopUpDisplay] = useState('none');
    const [wrjSRC, setWrjSRC] = useState('');
    const [wrjCharSRC, setWrjCharSRC] = useState('');
    const [wrjLinesSRC, setWrjLinesSRC] = useState('');
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);
    const [loading, setLoading] = useState(true);
    const [timeEvent, setTimeEvent] = useState(false);
    const [xCoord, setX] = useState(0);
    const [yCoord, setY] = useState(0);

    const counter = useRef(0);
    const imgRef = useRef();
    const wrjRef = ref(storage, 'WRJ-temp-scan.jpg');
    const charRef = ref(storage, 'WRJ-characters.png');
    const linesRef = ref(storage, 'WRJ-lines.png');
    const refArray = [wrjRef, charRef, linesRef];
    
    //disable pointer events while scrolling for improved performance/less image lag
    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeEvent(() => false);
        }, 150);
        return () => clearTimeout(timer);
    }, [timeEvent])

    const disablePointer = () => {
        setTimeEvent(() => true);
    }

    //get URLs for each image from the backend
    useEffect(() => {
        refArray.forEach((item) => {
            getDownloadURL(item).then((url) => {
                if (item === wrjRef) setWrjSRC(() => url);
                if (item === charRef) setWrjCharSRC(() => url);
                if (item === linesRef) setWrjLinesSRC(() => url);
            })
        });
    }, []);

    //load the images before rendering
    const imageLoaded = () => {
        counter.current += 1;
        if (counter.current >= 3) {
            setLoading(false);
        }
    };

    //find the coordinates on the image to display the pop-up menu and to record the character location
    const onMouseMove = (e) => {
        if (props.begin) {
            //x,y coordinates within the target DIV
            let rect = e.currentTarget.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            
            //find and set the coordinates dynamically relative to the height and width of the image
            const width = imgRef.current.offsetWidth;
            const height = imgRef.current.offsetHeight;
            const relX = (x / width).toFixed(2);
            const relY = (y / height).toFixed(2);

            setX(() => relX);
            setY(() => relY);

            //populate the popup menu
            setLocation(() => location ? false : true);
            setPopUpDisplay(() => location ? 'block' : 'none');
            setLeft(() => location ? x : 0);
            setTop(() => location ? y : 0);
        }
    };

    return (
    <React.Fragment>
        <div 
            className='backgroundImg' 
            style={{
                display: loading ? "block" : "none"
            }}
        >Loading...
        </div>
        <div className='backgroundImg' 
            style={{
                backgroundImage: `url(${wrjSRC})`, 
                display: loading ? "none" : "block", 
                pointerEvents: timeEvent ? "none" : "all"
            }} 
            onClick={onMouseMove} 
            onScroll={disablePointer}
            ref={imgRef}
        >
            <div id="wrjContainer"> 
                <img 
                    src={wrjSRC} 
                    id="wizardsRobbingJapan" 
                    className="imgLevel" 
                    onLoad={imageLoaded}
                ></img>
                <img 
                    src={wrjLinesSRC} 
                    id="wrjLines" 
                    className="imgLevel" 
                    onLoad={imageLoaded}
                ></img>
                <img 
                    src={wrjCharSRC} 
                    id="wrjCharacters" 
                    className="imgLevel" 
                    onLoad={imageLoaded}
                ></img>
            </div>
            <PopUp
                popUpDisplay={popUpDisplay}
                left={left}
                top={top}
                xCoord={xCoord}
                yCoord={yCoord}
                setScore={props.setScore}
            />
        </div>
    </React.Fragment>
    );
}



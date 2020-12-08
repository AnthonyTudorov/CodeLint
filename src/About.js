import React, { useState, useEffect } from 'react';
import './home.css';
import Socket from './Socket';
import Settings from './Settings'
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import Marquee, { Motion, randomIntFromInterval } from "react-marquee-slider";
import times from "lodash/times";

export default function App() {
  const [value, setValue] = useState(0);
  const [user, setUser] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('editorTheme') || 'tomorrow');
  const [fontSize, setFontSize] = useState(localStorage.getItem('font') || '14');
  const [windowheight, setWindowHeight] = useState(900)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    Socket.emit('is logged in');
    setWindowHeight(window.innerHeight)
      console.log(window.innerWidth)
    window.addEventListener('resize', updateWindowDimensions);

     return () => {
      window.removeEventListener('resize', updateWindowDimensions);
    };
  }, []);

  const updateWindowDimensions = () => {
      setWindowHeight(window.innerHeight)
      setWindowWidth(window.innerWidth)
  }
  const handleLogout = () => {
    Socket.emit('logout');
    setIsLoggedIn(false);
  };

  const handleChange = (e, val) => {
    if (e.constructor.name !== 'SyntheticEvent')
      setValue(val);
  };

  const updateUser = (usr) => {
    setUser(usr);
    localStorage.setItem('username', usr);
  };

  const handleFontSize = (val) => {
    setFontSize(val);
    localStorage.setItem('font', val);
  };

  const handleTheme = (val) => {
    localStorage.setItem('editorTheme', val);
    setTheme(val);
  };


  return (
    <>
      <Settings handleFontSize={handleFontSize} user={user} isLoggedIn={isLoggedIn} handleLogout={handleLogout} changeTheme={handleTheme} />
      <div style={{ height: windowheight.toString() + 'px', width: windowWidth.toString() + 'px' ,backgroundImage:`url(../static/background/background.jpg)`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} className="main-dropback">
        <h1>Codelint</h1>
        <h5>linting made easy</h5>
        <p></p>
        <p></p>
        <p></p>
      </div>

         <div style={{ height: windowheight.toString() + 'px', width: windowWidth.toString() + 'px'}} className="developers">
           <h1 style={{'paddingTop': '1em', 'textAlign': 'center'}}>Developers</h1>
         <div style={{'marginTop': '2em'}} className="dev-images">
           <div className="one-dev">
                <img src='/static/developers/anthony.jpg' />
                <p>Anthony Tudorov</p>
               <div className='icon-bottom'>
                    <div className='icon-button'>
                        <a href="https://github.com/AnthonyTudorov"><GitHubIcon fontSize='large' /></a>
                    </div>
                    <div className='icon-button'>
                       <a href="https://www.linkedin.com/in/anthony-tudorov/"><LinkedInIcon fontSize='large' /></a>
                    </div>
               </div>
           </div>
            <div className="one-dev">
                <img src='/static/developers/rudra.jpg' />
                <p>Rudra Desai</p>
                <div className='icon-bottom'>
                    <div className='icon-button'>
                        <a href="https://github.com/rudra-desai"><GitHubIcon fontSize='large' /></a>
                    </div>
                    <div className='icon-button'>
                        <a href="https://www.linkedin.com/in/rudra-desai/"><LinkedInIcon fontSize='large' /></a>
                    </div>
               </div>
           </div>
         </div>
             <div style={{'marginTop': '2em'}} className="dev-images">
           <div className="one-dev">
                <img src='/static/developers/joel.jpg' />
                <p>Joel Gonzalez</p>
               <div className='icon-bottom'>
                    <div className='icon-button'>
                         <a href="https://github.com/jg526"><GitHubIcon fontSize='large' /></a>
                    </div>
                    <div className='icon-button'>
                         <a href="https://www.linkedin.com/in/joel-gonzalez-84133515b/"><LinkedInIcon fontSize='large' /></a>
                    </div>
               </div>
           </div>
            <div className="one-dev">
                <img src='/static/developers/chaoyang.jpg' />
                <p>Chao-Yang Cheng</p>
                <div className='icon-bottom'>
                    <div className='icon-button'>
                         <a href="https://github.com/weiwei87318"><GitHubIcon fontSize='large' /></a>
                    </div>
                    <div className='icon-button'>
                        <a href="https://www.linkedin.com/in/chao-yang-cheng-b9240a201/"><LinkedInIcon fontSize='large' /></a>
                    </div>
               </div>
           </div>
         </div>
     </div>
       <div style={{width: windowWidth.toString() + 'px'}} className="about-us">
          <h1 style={{'paddingTop': '1em'}}>About</h1>
          <p style={{'paddingTop': '1em'}}>Write a paragraph here</p>
      </div>

        <div className="about-us" style={{ paddingTop: '1em', color: 'black', background: 'white', height: '500px'}}>
            <h1>Technologies</h1>
  <Marquee velocity={10} minScale={0.7} resetAfterTries={200} scatterRandomly>
    {times(6, Number).map((id) => (
      <Motion
        key={`child-${id}`}
        initDeg={randomIntFromInterval(0, 180)}
        direction={Math.random() > 0.5 ? "clockwise" : "counterclockwise"}
        velocity={10}
        radius={50}
      >
        <div
          style={{
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            backgroundColor: "",
            textAlign: "center",
            lineHeight: "50px",
          }}
        >
            {[<img height='300px' width='300px' src="../static/tech/eslint.png" />,
              <img height='300px' width='300px' src="../static/tech/flask.png" />,
              <img height='300px' width='300px' src="../static/tech/github.png" />,
              <img height='300px' width='300px' src="../static/tech/postgresql.png" />,
              <img height='300px' width='300px' src="../static/tech/python.png" />,
              <img height='300px' width='300px' src="../static/tech/react.png" />,
            ][id]}
        </div>
      </Motion>
    ))}
  </Marquee>
</div>;
    </>
  );
}

import React, { useState, useEffect } from 'react';
import './home.css';
import Socket from './Socket';
import Settings from './Settings';
import GridSystem from './GridSystem';
import BottomFooter from './Footer';

export default function App() {
  const [value, setValue] = useState(0);
  const [user, setUser] = useState(localStorage.getItem('username') || '');
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('photo') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('username') && true || false);
  const [tabs, setTabs] = useState((localStorage.getItem('tabs')) ? localStorage.getItem('tabs').split(',') : ['New File']);
  const [theme, setTheme] = useState(localStorage.getItem('editorTheme') || 'tomorrow');
  const [fontSize, setFontSize] = useState(localStorage.getItem('font') || '14');
  const [windowheight, setWindowHeight] = useState(900);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const updateWindowDimensions = () => {
    setWindowHeight(window.innerHeight);
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    Socket.emit('is logged in');
    setWindowHeight(window.innerHeight);
    window.addEventListener('resize', updateWindowDimensions);

    return () => {
      window.removeEventListener('resize', updateWindowDimensions);
    };
  }, []);

  const handleLogout = () => {
    Socket.emit('logout');
    localStorage.removeItem('username');
    localStorage.removeItem('photo');
    for (let i = 0; i < tabs.length; i += 1) {
      localStorage.removeItem(`code${String(i)}`);
      localStorage.removeItem(`selectedRepo${String(i)}`);
      localStorage.removeItem(`selectedFile${String(i)}`);
      localStorage.removeItem(`linter${String(i)}`);
      localStorage.removeItem(`styleguide${String(i)}`);
      localStorage.removeItem(`errors${String(i)}`);
    }
    localStorage.removeItem('repo_tree');
    localStorage.removeItem('repo_tree_files');
    localStorage.removeItem('allRepoInfo');
    localStorage.removeItem('tabs');
    setIsLoggedIn(false);
  };

  const handleChange = (e, val) => {
    if (e.constructor.name !== 'SyntheticEvent') setValue(val);
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
      <Settings
        profilePhoto={profilePhoto}
        handleFontSize={handleFontSize}
        user={user}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        changeTheme={handleTheme}
      />
      <div
        style={{
          height: `${windowheight.toString()}px`, width: `${windowWidth.toString()}px`, backgroundImage: 'url(../static/background/background.jpg)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat',
        }}
        className="main-dropback"
      >
        <h1>Codelint</h1>
        <h5>linting made easy</h5>
        <p />
        <p />
        <p />
      </div>

      <div style={{ width: `${windowWidth.toString()}px` }} className="developers">
        <h1 style={{ paddingTop: '1em', textAlign: 'center' }}>Developers</h1>
        <GridSystem info={[
          {
            name: 'Rudra Desai', imgsrc: '/static/developers/rudra.jpg', github: 'https://github.com/rudra-desai', linkedin: 'https://www.linkedin.com/in/rudra-desai/',
          },
          {
            name: 'Anthony Tudorov', imgsrc: '/static/developers/anthony.jpg', github: 'https://github.com/AnthonyTudorov', linkedin: 'https://www.linkedin.com/in/anthony-tudorov/',
          },
          {
            name: 'Joel Gonzalez', imgsrc: '/static/developers/joel.jpg', github: 'https://github.com/jg526', linkedin: 'https://www.linkedin.com/in/joel-gonzalez-84133515b/',
          },
          {
            name: 'Chao-Yang Cheng', imgsrc: '/static/developers/chaoyang.jpg', github: 'https://github.com/weiwei87318', linkedin: 'https://www.linkedin.com/in/chao-yang-cheng-b9240a201/',
          },
        ]}
        />
      </div>
      <div style={{ background: 'black', width: `${windowWidth.toString()}px` }} className="developers">
        <h1 style={{ color: 'white', paddingTop: '1em', textAlign: 'center' }}>Technologies</h1>
        <GridSystem info={[
          { name: 'Python', imgsrc: '/static/tech/python.png' },
          { name: 'Flask', imgsrc: '/static/tech/flaskwhite.png' },
          { name: 'React.js', imgsrc: '/static/tech/react.png' },
          { name: 'Eslint', imgsrc: '/static/tech/eslint.png' },
          { name: 'PostgreSQL', imgsrc: '/static/tech/postgresql.png' },
          { name: 'GitHub', imgsrc: '/static/tech/githubwhite.png' },
        ]}
        />
      </div>
      <div id="footer">
        <BottomFooter />
      </div>

    </>
  );
}

import './settings.css';
import React, { useState, useEffect, useRef } from 'react';
import ComputerIcon from '@material-ui/icons/Computer';
import { CSSTransition } from 'react-transition-group';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Logo from './logo';
import CaretIcon from './Caret';
import GithubOauth from './GithubOauth';
import GithubLogout from './GithubLogout';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import TextFormatIcon from '@material-ui/icons/TextFormat';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import App from './App'
import About from './About'

function Settings({
  changeTheme, isLoggedIn, handleLogout, user, handleFontSize
}) {
  return (
    <>
      <Navtop isLoggedIn={isLoggedIn} handleLogout={handleLogout}>
        <NavItem icon={<CaretIcon />}>
          <DropdownMenu
            changeTheme={changeTheme}
            handleFontSize={handleFontSize}
            user={user}
          />
        </NavItem>
      </Navtop>
    </>
  );
}

function Navtop(props) {
  return (
    <nav className="navbar">
      <h2 style={{ padding: '0', margin: '0%', alignItems: 'center' }} className="logoLeft">Codelint</h2>
      <div style={{ alignItems: 'center', width: '100%' }} className="navbar-nav">
        {!props.isLoggedIn && <GithubOauth /> || props.children && <GithubLogout handleLogout={props.handleLogout}/>}
        {useLocation().pathname !== "/" && <Link to="/">Home</Link>}
        {useLocation().pathname !== "/about" && <Link to="/about">About</Link>}
        <ul>
          {props.children}
        </ul>
      </div>
    </nav>
  );
}

function NavItem(props) {
  const [open, setOpen] = useState(false);
  return (
    <li className="nav-item">
      <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
        {props.icon}
      </a>
      {open && props.children}
    </li>
  );
}

function DropdownMenu({ changeTheme, user, handleFontSize }) {
  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);
  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight);
  }, []);

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  function DropdownItem(props) {
    const handleChange = () => {
      if (props.goToMenu) { setActiveMenu(props.goToMenu); }
      if (props.value) { props.changeTheme(props.value); }
      if (props.size) { props.changeFontSize(props.size) }
    };
    return (
      <a href="#" className="menu-item" onClick={handleChange}>
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
      </a>
    );
  }
  return (
    <div className="options" style={{ height: menuHeight }} ref={dropdownRef}>
      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem>{user}</DropdownItem>
          <DropdownItem
            leftIcon={<Brightness4Icon />}
            goToMenu="theme"
          >
            Theme Mode
          </DropdownItem>
          <DropdownItem
            leftIcon={<ComputerIcon />}
            goToMenu="editor"
          >
            Editor Settings
          </DropdownItem>
          <DropdownItem
            leftIcon={<TextFieldsIcon />}
            goToMenu="font"
          >
            Editor Font Size
          </DropdownItem>

        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'theme'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<ArrowBackIosIcon />}>
            <h4>Go Back</h4>
          </DropdownItem>
          <DropdownItem leftIcon={<Brightness7Icon />}>Light Mode</DropdownItem>
          <DropdownItem leftIcon={<Brightness3Icon />}>Dark Mode</DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'editor'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<ArrowBackIosIcon />}>
            <h4>Go Back</h4>
          </DropdownItem>
          <DropdownItem changeTheme={changeTheme} value="monokai" leftIcon={<ArrowForwardIosIcon />}>Monokai</DropdownItem>
          <DropdownItem changeTheme={changeTheme} value="github" leftIcon={<ArrowForwardIosIcon />}>GitHub</DropdownItem>
          <DropdownItem changeTheme={changeTheme} value="tomorrow" leftIcon={<ArrowForwardIosIcon />}>Tomorrow</DropdownItem>
          <DropdownItem changeTheme={changeTheme} value="tomorrow_night" leftIcon={<ArrowForwardIosIcon />}>Tomorrow Night</DropdownItem>
          <DropdownItem changeTheme={changeTheme} value="kuroir" leftIcon={<ArrowForwardIosIcon />}>Kuroir</DropdownItem>
          <DropdownItem changeTheme={changeTheme} value="twilight" leftIcon={<ArrowForwardIosIcon />}>Twilight</DropdownItem>
          <DropdownItem changeTheme={changeTheme} value="xcode" leftIcon={<ArrowForwardIosIcon />}>Xcode</DropdownItem>
          <DropdownItem changeTheme={changeTheme} value="textmate" leftIcon={<ArrowForwardIosIcon />}>Textmate</DropdownItem>
          <DropdownItem changeTheme={changeTheme} value="solarized_dark" leftIcon={<ArrowForwardIosIcon />}>Solarized Dark</DropdownItem>
          <DropdownItem changeTheme={changeTheme} value="solarized_light" leftIcon={<ArrowForwardIosIcon />}>Solarized Light</DropdownItem>
          <DropdownItem changeTheme={changeTheme} value="terminal" leftIcon={<ArrowForwardIosIcon />}>Terminal</DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'font'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<ArrowBackIosIcon />}>
            <h4>Go Back</h4>
          </DropdownItem>
          <DropdownItem changeFontSize={handleFontSize} size='12' leftIcon={<TextFormatIcon />}>12</DropdownItem>
          <DropdownItem changeFontSize={handleFontSize}  size='14' leftIcon={<TextFormatIcon />}>14</DropdownItem>
          <DropdownItem changeFontSize={handleFontSize} size='16' leftIcon={<TextFormatIcon />}>16</DropdownItem>
          <DropdownItem changeFontSize={handleFontSize} size='18' leftIcon={<TextFormatIcon />}>18</DropdownItem>
          <DropdownItem changeFontSize={handleFontSize} size='20' leftIcon={<TextFormatIcon />}>20</DropdownItem>
          <DropdownItem changeFontSize={handleFontSize} size='22' leftIcon={<TextFormatIcon />}>22</DropdownItem>
          <DropdownItem changeFontSize={handleFontSize}  size='24' leftIcon={<TextFormatIcon />}>24</DropdownItem>
        </div>
      </CSSTransition>

    </div>
  );
}

export default Settings;

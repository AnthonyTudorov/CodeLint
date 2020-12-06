import './settings.css'
import React, { useState, useEffect, useRef } from 'react';
import CaretIcon from "./Caret";
import Logo from './logo'
import { CSSTransition } from 'react-transition-group';
import GithubOauth from "./GithubOauth";

function Settings({changeTheme, isLoggedIn}) {
    return (
    <>
        <Navtop isLoggedIn={isLoggedIn}>
            <NavItem icon={<CaretIcon />}>
                <DropdownMenu
                    changeTheme={changeTheme}
                />
            </NavItem>
        </Navtop>
     </>
    );
}

function Navtop(props) {
  return (
        <nav className="navbar">
          <h2 style={{'padding': '0', 'margin': '0%', 'alignItems': 'center'}} className="logoLeft"><Logo /></h2>
            <div style={{'alignItems': 'center', 'width': '100%'}} className="navbar-nav">
              <ul>
                  {props.children}
                  {/*{!props.isLoggedIn && <GithubOauth /> || props.children}*/}
              </ul>
            </div>
        </nav>
  );
}

function NavItem(props){
    const [open, setOpen] = useState(false);
    return (
        <li className="nav-item">
            <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
                {props.icon}
            </a>
            {open && props.children}
        </li>
    )
}

function DropdownMenu({changeTheme}){
    const [activeMenu, setActiveMenu] = useState('main')
    const [menuHeight, setMenuHeight] = useState(null);
    const dropdownRef = useRef(null);
    useEffect(() => {
        setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
    }, [])

    function calcHeight(el) {
        const height = el.offsetHeight;
        setMenuHeight(height);
    }

    function DropdownItem(props){
        const handleChange = () => {
            if (props.goToMenu)
                setActiveMenu(props.goToMenu)
            if (props.value) {
                props.changeTheme(props.value)
            }

        }
        return (
            <a href="#" className="menu-item" onClick={handleChange}>
                <span className="icon-button">{props.leftIcon}</span>
                {props.children}
            </a>
        )
    }
    return (
     <div className="options" style={{ height: menuHeight }} ref={dropdownRef}>
      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem>My Profile</DropdownItem>
          <DropdownItem
            leftIcon={<CaretIcon />}
            goToMenu="theme">
            Theme Mode
          </DropdownItem>
          <DropdownItem
            leftIcon="🦧"
            goToMenu="editor">
            Editor Settings
          </DropdownItem>

        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'theme'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<CaretIcon />}>
            <h4>Go Back</h4>
          </DropdownItem>
          <DropdownItem leftIcon={<CaretIcon />}>Light Mode</DropdownItem>
          <DropdownItem leftIcon={<CaretIcon />}>Dark Mode</DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'editor'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<CaretIcon />}>
            <h4>Go Back</h4>
          </DropdownItem>
          <DropdownItem changeTheme={changeTheme} value="monokai" leftIcon="🦘">Monokai</DropdownItem>
          <DropdownItem  changeTheme={changeTheme} value="github" leftIcon="🐸">GitHub</DropdownItem>
          <DropdownItem  changeTheme={changeTheme} value="tomorrow" leftIcon="🦋">Tomorrow</DropdownItem>
          <DropdownItem  changeTheme={changeTheme} value="tomorrow_night" leftIcon="🦋">Tomorrow Night</DropdownItem>
          <DropdownItem  changeTheme={changeTheme} value="kuroir" leftIcon="🦋">Kuroir</DropdownItem>
          <DropdownItem  changeTheme={changeTheme} value="twilight" leftIcon="🦔">Twilight</DropdownItem>
          <DropdownItem  changeTheme={changeTheme} value="xcode" leftIcon="🦔">Xcode</DropdownItem>
          <DropdownItem  changeTheme={changeTheme} value="textmate" leftIcon="🦔">Textmate</DropdownItem>
          <DropdownItem  changeTheme={changeTheme} value="solarized_dark" leftIcon="🦔">Solarized Dark</DropdownItem>
          <DropdownItem  changeTheme={changeTheme} value="solarized_light" leftIcon="🦔">Solarized Light</DropdownItem>
          <DropdownItem  changeTheme={changeTheme} value="terminal" leftIcon="🦔">Terminal</DropdownItem>
        </div>
      </CSSTransition>
    </div>
    )
}

export default Settings
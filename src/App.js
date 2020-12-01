import React, { useState, useEffect } from 'react';
import './styles.css';
import OneTab from './OneTab'
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";


export default function App() {
    const [value, setValue] = useState(0)

    const handleChange = (e, val) => {
        setValue(val)
    }
  return (
      <>
          <AppBar position="static">
              <Tabs value={value} onChange={handleChange}>
                  <Tab label="File 1">
                  </Tab>
                  <Tab label="File 2">
                  </Tab>
                  <Tab label="File 3">
                  </Tab>
              </Tabs>
          </AppBar>
          <OneTab index={0} currentTab={value}/>
          <OneTab index={1} currentTab={value} />
          <OneTab index={2} currentTab={value} />
      </>
  );
}

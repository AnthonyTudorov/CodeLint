import React from 'react'
import { Switch, Route } from 'react-router-dom'
import App from './App'
import About from './About'

export default function Main() {
    return(
      <main>
        <Switch>
          <Route exact path='/home' component={About}/>
          <Route path='/' component={App}/>
        </Switch>
      </main>
     );
}

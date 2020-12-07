import React from 'react'
import { Switch, Route } from 'react-router-dom'
import App from './App'
import About from './About'

export default function Main() {
    return(
      <main>
        <Switch>
          <Route exact path='/' component={App}/>
          <Route path='/about' component={About}/>
        </Switch>
      </main>
     );
}

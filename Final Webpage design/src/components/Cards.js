import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      <h1>Check out these EPIC Features!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/linters.jpg'
              text='Choose from two popular linters, ESLint and Pylint!'
              label='Feature'
            />
            <CardItem
              src='images/githuboauth.jpg'
              text='Link your Github profile to the app and commit back to your main branch.'
              label='Feature'

            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='images/darkmode.gif'
              text='Blinded by the bright page? We have a light/dark mode button for that!'
              label='Feature'

            />
            <CardItem
              src='images/pylint.jpg'
              text='Get documentation of each line being linted.'
              label='Feature'
            />
            <CardItem
              src='images/persist.jpg'
              text='Accidentally closed our app? No problem! Pick up where you left off!'
              label='Feature'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;

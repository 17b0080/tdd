import React, { PureComponent } from 'react';
import './App.scss';
import Logo from './Logo.png';

class App extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <h1> Hello World!</h1>
        <img src={Logo} alt="logo" />
        <p> it&apos;s me, React</p>
      </React.Fragment>
    );
  }
}

export default App;

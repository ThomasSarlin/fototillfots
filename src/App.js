import React, { Component } from 'react';
import './App.css';
import Collage from './components/Collage'
import Upload from './components/Upload'
import { BrowserView, MobileView, isBrowser, isMobile } from "react-device-detect";
import MobileApp from './components/MobileApp'
import TeacherLogin from './components/TeacherLogin'
import WebFont from 'webfontloader';
WebFont.load({
  google: {
    families: ['Tajawal', 'sans-serif']
  }
});
const taj ={
  fontFamily: 'Tajawal'
}
class App extends Component {
  render() {
    return (
      <div style={taj}>
        <BrowserView device={isBrowser}>
          <div>
            <TeacherLogin/>
          </div>
        </BrowserView>
        <MobileView device={isMobile}>
          <div>
            <MobileApp/>
          </div>
        </MobileView>
      </div>
    )
  }
}

export default App;


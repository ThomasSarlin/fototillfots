import React, { Component } from 'react';
import * as firebase from 'firebase'
import { ImageFromStorage } from 'react-firebase-storage-connector'
import Paper from 'material-ui/Paper'
import Image from './Image'

const card = {
  height: 'inherit',
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
  fontFamily: 'Tajawal'
}

class Collage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      images: []
    }
  }
  componentDidMount() {
    var rootRef = firebase.database().ref().child('imageurl')
    rootRef.on("value", snap => {
      console.log(snap.val())
      var data = []
      snap.forEach(ss => {
        if (ss.child('mission').val() === this.props.mission && ss.child('class').val()=== this.props.className) {
          console.log("TUFF TUFF")
          data.push(ss.val())
        }
      })
      this.setState({
        images: data
      })
    })
  }

  render() {
    return (
      this.state.images.map(function (e) {

        return (
            <Paper style={card} zDepth={5}>
              <h1>{e.mission}</h1>
              <Image image={e.imgUrl} />
              <p>{e.body}</p>
            </Paper>
        )

      }));
  }
}

export default Collage;

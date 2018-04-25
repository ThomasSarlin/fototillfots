import React, { Component } from 'react';
import * as firebase from 'firebase'
import { ImageFromStorage } from 'react-firebase-storage-connector'
import Paper from 'material-ui/Paper'

const image = {
    height: 200,
    padding: 10
}

class Image extends Component {

    constructor(props) {
        super(props);
        this.state = {
            image: this.props.image
        }
    }
    render() {
        console.log(this.state.image)
        return (<ImageFromStorage style={image}
            storageRef={this.state.image && firebase.storage()
                .ref()
                .child(this.state.image)} alt="Error" />
        );
    }
}

export default Image;

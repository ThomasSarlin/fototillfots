import React, { Component } from 'react';
import * as firebase from 'firebase'
import { ImageFromStorage } from 'react-firebase-storage-connector'



class Image extends Component {

    constructor(props) {
        super(props);
        this.state = {
            image: this.props.image,
            show:true
        }
    }
    toggle(){
        this.setState({show:!this.state.show})
    }
    render() {
        console.log(this.state.image)
        return (this.state.show?<ImageFromStorage style={this.props.style}
            onClick={this.toggle.bind(this)}
            storageRef={this.state.image && firebase.storage()
                .ref()
                .child(this.state.image)} alt="Error" />:""
        );
    }
}

export default Image;

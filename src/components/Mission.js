import React, { Component } from 'react';
import * as firebase from 'firebase'
import {ImageFromStorage} from 'react-firebase-storage-connector'

export default class Mission extends Component {
    constructor(props){
        super(props)
        this.state={
            title:this.props.title,
            body:this.prop.body
        }
    }   
    render(){
        return(
            <div>
                <h1>{this.state.title}</h1>
                <p>{this.state.body}</p>
            </div>
        )
    }

}
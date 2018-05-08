import React, { Component } from 'react';

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
import React, { Component } from 'react';
import * as firebase from 'firebase';
import TextField from "material-ui/TextField";
import TeacherPage from "./TeacherPage"
import mainLogo from '../logo.svg'
let logo = {
    width: '60vw',
    marginLeft: '4vw'
}

let sBtnStyle = {
    width: '60vw',
    marginTop: '2vh',
    backgroundColor: '#dddddd',
    fontFamily: 'Tajawal',
    fontWeight: '300 !important',
    fontSize: '30px !important'
}
let sDivStyle = {
    width: '60vw',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '20vh'
}
let header = {
    marginBottom:'-2vh'
}

export default class StudentLogin extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            classes: '',
            teachers: '',
            animal: '',
            message: '',
            loggedIn: false
        }

        this.handleAnimalChange = this.handleAnimalChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkTeacher = this.checkTeacher.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        let rootRef = firebase.database().ref().child('class')
        rootRef.on("value", snap => {
            let data = []
            snap.forEach(ss => { data.push(ss.val()) })
            this.setState({
                classes: data
            });
        })
        rootRef = firebase.database().ref().child('teacher')
        rootRef.on("value", snap => {
            let data = []
            snap.forEach(ss => { data.push(ss.val()) })
            this.setState({
                teachers: data
            });
        })
    }
    checkTeacher() {
        let result = false;
        let name = this.state.name
        let animal = this.state.animal
        this.state.teachers.forEach(function (e) {
            if (e.name === name && e.animal === animal) {
                result = true;
            };
        });
        return result;
    }
    addTeacher() {
        firebase.database().ref().child('teacher').push({
            name: this.state.name,
            animal: this.state.animal
        });
    }
    handleAnimalChange(event) {
        this.setState({
            animal: event.target.value
        });
    }
    handleNameChange(event) {
        this.setState({
            name: event.target.value
        });
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.name === '' || this.state.class === '') {
            this.setState({
                message: 'du har inte fyllt i alla fält'
            });
        } else {

            if (!this.checkTeacher()) {
                this.addTeacher()
            }
            this.setState({
                message: '',
                loggedIn: true
            });
        }


    }
    form() {
        return (
            <div style={sDivStyle}>
                
                <img src={mainLogo} style={logo} alt="logo" />
                <form onSubmit={this.handleSubmit}>
                    <h4 style={header}>Inloggning lärare</h4>
                    <TextField
                        style={sBtnStyle}
                        hintText="Användarnamn"
                        onChange={this.handleNameChange}
                        value={this.state.name}
                    />
                    <TextField
                        style={sBtnStyle}
                        hintText="Favoritdjur"
                        onChange={this.handleAnimalChange}
                        value={this.state.animal}
                    />
                    <input type="submit" value="Logga in" />
                    <button onClick={this.props.onBack}>Tillbakas</button>
                </form>
                <p>{this.state.message ? this.state.message : ""}</p>
            </div>);
    }
    teacherPage() { return (<TeacherPage name={this.state.name} animal={this.state.animal} />) }

    render() {
        return (
            <div>
                {this.state.loggedIn ? this.teacherPage() : this.form()}
            </div>
        );
    }
}
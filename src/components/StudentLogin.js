import React, { Component } from 'react';
import * as firebase from 'firebase';
import TextField from "material-ui/TextField";
import StudentPage from "./StudentPage"
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
    marginBottom: '-2vh'
}

export default class StudentLogin extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            classes: '',
            students: '',
            class: '',
            teacher: '',
            message: '',
            loggedIn: ''
        }

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleClassChange = this.handleClassChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkClass = this.checkClass.bind(this);
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
        rootRef = firebase.database().ref().child('student')
        rootRef.on("value", snap => {
            let data = []
            snap.forEach(ss => { data.push(ss.val()) })
            this.setState({
                students: data
            });
        })
    }
    checkStudent() {
        let result = false;
        let test = this.state.students;
        this.state.classes.forEach(function (e) {
            if (e.name === test) {
                result = true;
            };
        });
        return result;
    }
    checkClass() {
        let result = false;
        let teacher = '';
        let test = this.state.class;
        this.state.classes.forEach(function (e) {
            if (e.name === test) {
                result = true;
                teacher = e.teacher;
            };
        });
        this.setState({
            teacher: teacher
        })
        return result;
    }
    addStudent() {
        firebase.database().ref().child('student').push({
            name: this.state.name,
            class: this.state.class
        });
    }
    handleClassChange(event) {
        this.setState({
            class: event.target.value
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
            if (!this.checkClass()) {
                this.setState({
                    message: 'klassen du angivit finns inte'
                });
            } else {
                if (!this.checkStudent()) {
                    this.addStudent()
                }
                this.setState({
                    message: '',
                    loggedIn: true
                });
            }
        }

    }
    form() {
        return (
            <div style={sDivStyle}>
                <img src={mainLogo} style={logo} alt="logo" />
                <form onSubmit={this.handleSubmit}>
                    <h4 style={header}>Inloggning elev</h4>
                    <TextField
                        style={sBtnStyle}
                        hintText="Användarnamn"
                        onChange={this.handleNameChange}
                        value={this.state.name}
                    />
                    <TextField
                        style={sBtnStyle}
                        hintText="Klass"
                        onChange={this.handleClassChange}
                        value={this.state.class}
                    />
                    <input type="submit" value="Logga in" />
                    <button onClick={this.props.onBack}>Tillbakas</button>
                </form>
                <p>{this.state.message ? this.state.message : ""}</p>
            </div>);
    }
    studentPage() { return (<StudentPage name={this.state.name} teacher={this.state.teacher} class={this.state.class} />) }
    render() {
        return (
            <div>
                {this.state.loggedIn ? this.studentPage() : this.form()}
            </div>
        );
    }
}
import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/FlatButton'
import StudentLogin from './StudentLogin'
import TeacherLogin from './TeacherLogin'
let sBtnStyle = {
    width:'60vw',
    marginTop:'2vh',
    backgroundColor:'#dddddd',
    fontFamily:'Tajawal',
    fontWeight:'300 !important',
    fontSize:'30px !important'
}
let sDivStyle ={
    width:'60vw',
    marginLeft:'auto',
    marginRight:'auto',
    marginTop:'40vh'
}
export default class MobileApp extends Component {
    constructor() {
        super();
        this.state = {
            isStartPage: true,
            isTeacher:undefined
        }
    }
    studentToggle(){
        this.setState({
            isTeacher:false,
            isStartPage:false
        })
    }
    teacherToggle(){
        this.setState({
            isTeacher:true,
            isStartPage:false
        })
    }
    render() {
        const startPage = (
            <div style={sDivStyle}>
                <Button label="Lärare" style={sBtnStyle}  onClick={this.studentToggle.bind(this)} />
                <Button label="Elev" style={sBtnStyle}  onClick={this.teacherToggle.bind(this)} />
            </div>
        )
        const studentPage = (
            <div>
                <StudentLogin/> 
            </div>
        )
        const teacherPage = (
            <div>
                <TeacherLogin/>
            </div>
        )
        const mainPage = this.state.isTeacher?studentPage:teacherPage;
        
        return (<div>{this.state.isStartPage?startPage:mainPage}</div>);
    }
}

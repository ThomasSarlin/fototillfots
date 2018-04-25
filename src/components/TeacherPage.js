import React, { Component } from 'react';
import * as firebase from 'firebase';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon';
import PhotoAlbum from 'material-ui/svg-icons/image/photo-album';
import FeedBack from 'material-ui/svg-icons/action/feedback';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import TextField from "material-ui/TextField";
import Collage from './Collage'
import Mission from './Mission'
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Upload from './Upload'
import TCollage from './tCollage'
const filler = {
    height: 20
}
const content = {
    width: '100vw',
    height: '10vh',
    textAlign: 'center',
    fontFamily: 'Tajawal'
}
const missionBtn = {}
const appbar = {
    backgroundColor: '#aaaaaa'
}
const mainButton = {
    width: '50vw',
    marginBottom: 0,
    height: '25vh',
    display: 'inline-block',
    backgroundColor: '#dddddd',
    fontFamily: 'Tajawal',
    borderColor: '#aaaaaa',
    borderStyle: 'solid',
    borderWidth: '1px'
}
export default class TeacherPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            animal: this.props.animal,
            missionTitle: '',
            missionBody: '',
            className: '',
            teacherpage: true,
            classes: undefined,
            viewName: '',
            missions: undefined,
            images:undefined
        }
    }
    checkTeacher() {
        let rootRef = firebase.database().ref().child('student')
        let result = false;
        rootRef.on("value", snap => {

            snap.forEach(ss => {
                if (ss.child('name').val() == this.state.name) {
                    result = true;
                }
            })
        })
        return result;
    }
    checkMission() {
        let rootRef = firebase.database().ref().child('mission')
        let result = false;
        rootRef.on("value", snap => {
            snap.forEach(ss => {
                if (ss.child('title').val() == this.state.missionTitle && ss.child('teacher').val == this.state.teacher) {
                    result = true;
                }
            })
        })
        return result;
    }
    checkClass() {
        let rootRef = firebase.database().ref().child('class')
        let result = false;
        rootRef.on("value", snap => {
            snap.forEach(ss => {
                if (ss.child('class').val() == this.state.className) {
                    result = true;
                }
            })
        })
        return result;
    }
    addTeacher() {
        firebase.database().ref().child('teacher').push({
            name: this.state.name
        });
    }
    addClass() {
        firebase.database().ref().child('class').push({
            name: this.state.className,
            teacher: this.state.name
        });
    }
    addMission(event) {
        event.preventDefault();
        firebase.database().ref().child('mission').push({
            class: this.state.viewName,
            title: this.state.missionTitle,
            body: this.state.missionBody,
            teacher: this.state.name,
            animal: this.state.animal
        });
        this.setState({ message: 'Uppdrag tillagt' })
    }
    deleteMission(title){
        let rootRef = firebase.database().ref().child('mission')
        rootRef.on("value", snap => {
            snap.forEach(ss => {
                if (ss.child('animal').val() === this.state.animal && ss.child('teacher').val() === this.state.name && ss.child('title').val()===title) {
                    firebase.database().ref().child('mission').child(ss.key).remove();
                }
            })
        })
        this.getMissions();
    }
    componentDidMount() {
        let rootRef = firebase.database().ref().child('class')
        rootRef.on("value", snap => {
            let data = [];
            snap.forEach(ss => {
                if (ss.child('animal').val() === this.state.animal && ss.child('teacher').val() === this.state.name) {
                    data.push(ss.val());
                }
            })
            this.setState({
                classes: data
            })
        })
        rootRef = firebase.database().ref().child('imageurl')
        rootRef.on("value", snap => {
            let data = []
            snap.forEach(ss => { if (ss.child('student').val() == this.state.name) data.push(ss.val()) })
            this.setState({
                images: data
            });
        })
        this.getMissions();
    }
    getMissions(){
        let rootRef = firebase.database().ref().child('mission')
        rootRef.on("value", snap => {
            let data = [];
            snap.forEach(ss => {
                if (ss.child('animal').val() === this.state.animal && ss.child('teacher').val() === this.state.name) {
                    data.push(ss.val());
                }
            })
            this.setState({
                missions: data
            })
        })
    }
    changeView(title) {
        this.setState({
            viewName: title,
            teacherpage: false
        })
    }


    closeView() {
        this.setState({
            teacherpage: true,
            viewName: ''
        })
    }
    handleMissionTitleChange(event) {
        this.setState({
            missionTitle: event.target.value
        });
    }
    handleMissionBodyChange(event) {
        this.setState({
            missionBody: event.target.value
        });
    }
    render() {
        if (this.state.teacherpage) {
            return (
                <div>
                    <AppBar onLeftIconButtonClick={this.toggleDrawer} style={appbar} title="Foto till Fots" iconClassNameRight="muidocs-icon-navigation-expand-more" />
                    <Drawer
                        docked={false}
                        width={200}
                        open={this.state.open}
                        onRequestChange={(open) => this.setState({ open })}
                    >
                        <MenuItem onClick={this.handleClose}>Logga ut</MenuItem>
                    </Drawer>
                    <div id="content" style={content}>
                        <h1>{this.state.name}</h1>
                    </div>
                    {this.state.classes ? this.state.classes.map((e) => {
                        return <Button key={e.name} label={e.name} style={mainButton} onClick={() => this.changeView(e.name)} />
                    }) : ""}
                    <Button label="Lägg till klass" style={mainButton} />
                    <p>{this.state.message}</p>
                </div>
            );
        } else if (this.state.addClass) {
            return ("");
        } else if (this.state.viewName) {

            return (
                <div>
                    <AppBar
                        onLeftIconButtonClick={this.toggleDrawer}
                        onRightIconButtonClick={this.closeView.bind(this)}
                        style={appbar} title={this.state.viewName}
                        iconClassNameRight="muidocs-icon-navigation-expand-more"
                        iconElementRight={<FlatButton label="stäng" />
                        } />
                    <Drawer
                        docked={false}
                        width={200}
                        open={this.state.open}
                        onRequestChange={(open) => this.setState({ open })}
                    >
                        <MenuItem onClick={this.handleClose}>Logga ut</MenuItem>
                    </Drawer>
                    {this.state.missions.map((e) => {
                        if (e.class === this.state.viewName) {
                            return (
                                <Card key={e.title}>
                                    <CardHeader
                                        title={e.title}
                                        actAsExpander={true}
                                        showExpandableButton={true}
                                    />
                                    <CardText expandable={true}>
                                        {e.body}
                                        <div style={filler}></div><div>
                                        <button onClick={() => this.deleteMission(e.title)}>Ta bort uppdrag</button></div>
                                        <TCollage mission={e.title} className={this.state.viewName}/>
                                    </CardText>
                                </Card>
                            )
                        }
                    })}
                    <Card>
                        <CardHeader
                            title="Lägg till nytt uppdrag"
                            actAsExpander={true}
                            showExpandableButton={true}
                        />
                        <CardText expandable={true}>
                            <form onSubmit={this.addMission.bind(this)}>
                                <TextField
                                    hintText="Titel"
                                    onChange={this.handleMissionTitleChange.bind(this)}
                                    value={this.state.missionTitle}
                                />
                                <TextField
                                    hintText="Uppdragsbeskrivning"
                                    onChange={this.handleMissionBodyChange.bind(this)}
                                    value={this.state.missionBody}
                                />
                                <input type="submit" value="Submit" />
                            </form>
                        </CardText>
                    </Card>
                </div>);
        }
    }
}
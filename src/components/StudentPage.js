import React, { Component } from 'react';
import * as firebase from 'firebase';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/FlatButton'
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Collage from './Collage'
import { Card, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Upload from './Upload'
import Image from './Image'

const image = {
    width: '80vw',
    padding: 10
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
const content = {
    width: '100vw',
    height: '35vh',
    textAlign: 'center'
}
const appbar = {
    backgroundColor: '#aaaaaa'
}
const filler = {
    height: 20
}
const info = {
    color: '#55aa55'
}

const deleteInfo = {
    color: '#aa5555'
}
export default class StudentPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            class: this.props.class,
            teacher: this.props.teacher,
            inUse: undefined,
            missions: undefined,
            open: false,
            studentpage: true,
            missionPage: false,
            albumPage: false,
            images: undefined
        }
    }
    missionToggle() {
        this.setState({
            studentpage: false,
            missionPage: true
        })
    }
    albumToggle() {
        this.setState({
            albumPage: true,
            studentpage: false
        })
    }
    componentDidMount() {
        let rootRef = firebase.database().ref().child('mission')
        rootRef.on("value", snap => {
            let data = []
            snap.forEach(ss => {
                if (ss.child('class').val() === this.props.class)
                    data.push(ss.val())
            })
            this.setState({
                missions: data
            });
        })
        rootRef = firebase.database().ref().child('imageurl')
        console.log(rootRef)
        rootRef.on("value", snap => {
            let data = []
            snap.forEach(ss => { if (ss.child('student').val() === this.state.name) data.push(ss.val()) })
            this.setState({
                images: data
            });
        })
    }
    deleteImage(mission,imgUrl) {
        console.log(imgUrl)
        let rootRef = firebase.database().ref().child('imageurl');
        let rmKey=''
        rootRef.orderByChild('student').equalTo(this.state.name).on("value",snap=>{
            snap.forEach(ss=>{if(ss.child('mission').val()===mission)rmKey=ss.key})
        })
        if(rmKey!==''){
            rootRef.child(rmKey).remove();
            firebase.storage()
                .ref()
                .child(imgUrl).delete().then(console.log("Image removed")).catch(err=>console.log(err))
        }
    }
    closeView() {
        this.setState({
            studentpage: true,
            missionPage: false,
            albumPage: false
        })
    }
    toggleDrawer = () => this.setState({ open: !this.state.open });

    hasUploaded(title) {
        let result = false;
        console.log(this.state.images)
        this.state.images.forEach((e) => {

            if (e.mission === title)
                result = true;
        })
        return result;
    }
    getUpload(title) {
        let result = '';
        this.state.images.forEach((e) => {
            if (e.mission === title)
                result = e.imgUrl;
        })
        return result;
    }
    handleClose(){
        window.location.reload();
    }
    render() {
        if (this.state.studentpage) {
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
                        <h3>{this.state.class}</h3>
                        <div style={filler}></div>
                        <h5>Ansvarig lärare: {this.state.teacher}</h5>
                    </div>
                    <Button label="Mitt rum" style={mainButton} disabled={true} />
                    <Button label="Mina uppdrag" style={mainButton} onClick={this.missionToggle.bind(this)} />
                    <Button label="Mina utmärkelser" style={mainButton} disabled={true} />
                    <Button label="Mitt album" style={mainButton} disabled={true} onClick={this.albumToggle.bind(this)} />
                </div>
            );
        } else if (this.state.missionPage) {
            return (
                <div>
                    <AppBar
                        onLeftIconButtonClick={this.toggleDrawer}
                        onRightIconButtonClick={this.closeView.bind(this)}
                        style={appbar} title="Uppdrag"
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
                        return (
                            <Card key={e.title}>
                                <CardHeader
                                    title={e.title}
                                    actAsExpander={true}
                                    showExpandableButton={true}
                                />
                                <CardText expandable={true}>
                                    {e.body}
                                    <div style={filler}></div>
                                    {this.hasUploaded(e.title) ?
                                        (<div>
                                            <Image image={this.getUpload(e.title)} style={image} />
                                            <p style={info}>Du har lämnat in denna uppgift</p>
                                            <a style={deleteInfo} onClick={() => this.deleteImage(e.title,this.getUpload(e.title))}>Ta bort inlämning</a>
                                        </div>) :
                                        <Upload
                                            class={e.class}
                                            student={this.state.name}
                                            mission={e.title}
                                            images={this.state.images}
                                        />}

                                </CardText>
                            </Card>
                        )
                    })}
                </div>);
        }
        else if (this.state.albumPage) {
            return (
                <div>
                    <AppBar
                        onLeftIconButtonClick={this.toggleDrawer}
                        onRightIconButtonClick={this.closeView.bind(this)}
                        style={appbar} title="Album"
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
                    <Collage student={this.props.name} />
                </div>);
        }
    }
}

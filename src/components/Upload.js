import React from 'react'
import axios, { post } from 'axios';
import * as firebase from 'firebase';
import TextField from "material-ui/TextField";

var metadata = { contentType: 'image/jpeg' };
export default class Upload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            message: '',
            body: '',
            uploaded: false
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
    }
    onFormSubmit(e) {
        e.preventDefault() // Stop form submit
    }
    onChange(e) {
        this.setState({ file: e.target.files[0], uploaded: true,message:"Laddar upp filen" },
            this.fileUpload(e.target.files[0]))
    }

    handleBodyChange(e) {
        this.setState({ body: e.target.value })
    }
    checkUpload(fileUrl, className, student, mission) {
        let result = true
        this.props.images.map(function (e) {
            if (e.imgUrl === fileUrl && e.mission === mission && e.student === student && e.class === className)
                result = false;
        })
        return result;
    }
    fileUpload(file) {
        // Create a root reference
        console.log("NAME ", file.name)
        let fileUrl = 'images/' + file.name;
        let className = this.props.class;
        let student = this.props.student;
        let body = this.state.body;
        let mission = this.props.mission;
        if (!this.checkUpload(fileUrl, className, student, mission)) {
            this.setState({ message: 'Du har lämnat in denna uppgift' })
        } else {

            var storageRef = firebase.storage().ref();
            let uploadTask = storageRef.child(fileUrl).put(file, metadata);

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                function (snapshot) {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                }, function (error) {

                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;

                        case 'storage/canceled':
                            // User canceled the upload
                            break;
                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                }, function () {
                    firebase.database().ref().child('imageurl').push({
                        imgUrl: fileUrl,
                        class: className,
                        student: student,
                        body: body,
                        mission: mission
                    });
                });
        }
    }

    render() {
        if (!this.state.uploaded) {
            return (
                <form onSubmit={this.onFormSubmit.bind(this)}>
                    <input type="file" onChange={this.onChange} />
                </form>
                
        )
        }else{
            return(
            <p>{this.state.message}</p>)
        }
    }
}
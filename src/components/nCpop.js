import React from 'react';
import * as firebase from 'firebase';
import TextField from "material-ui/TextField";
const popup_inner = {
  position: 'absolute',
  left: '5%',
  right: '5%',
  top: '35%',
  bottom: '35%',
  margin: 'auto',
  background: 'white'
}
const popup = {
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  margin: 'auto',
  backgroundColor: 'rgba(0,0,0, 0.5)'
}
export default class ncPop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      className: '',
      message: '',
      showButton: true
    }
  }
  addClass(event) {
    event.preventDefault();
    if (this.state.className === '') {
      this.setState({
        message: 'vänligen namnge din klass'
      })
    } else {
      this.setState({
        showButtons: false,
        message: 'please wait'
      }, () => {
        firebase.database().ref().child('class').push({
          name: this.state.className,
          teacher: this.props.name,
          animal: this.props.animal
        })
        this.props.closefunction();
      })
    }
  }
  handleChange(event) {
    this.setState({
      className: event.target.value
    })
  }
  render() {
    return (
      <div className='popup' style={popup}>
        <div className='popup_inner' style={popup_inner} >
          <form onSubmit={this.addClass.bind(this)}>
            <TextField
              hintText="Klassnamn"
              onChange={this.handleChange.bind(this)}
              value={this.state.className}
            />
            <div>
              {this.state.showButton ? <input type="submit" value="Lägg till" /> : ""}
              <input type="button" value="Stäng" onClick={this.props.closefunction} />
            </div>
          </form>
          <p>{this.state.message}</p>
        </div>
      </div>
    );
  }
} 
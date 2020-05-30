import React from 'react';
import classes from './signup.module.css';
import toastr from 'toastr';
import toastrSetup from '../../helpers/toastr/toastr';
import '../../helpers/toastr/toastr.css';
import { withRouter } from 'react-router-dom';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          username: '',
          password: '',
          repeatpw: '',
          email: '',
          btnLoading: false,
          users: []
        }
    }

    componentDidMount() {
      fetch("https://final-b8cc.restdb.io/rest/userlist", {
        method: 'GET',
        headers: {  
          "Content-Type": "application/json; charset=uf-8",
          "x-apikey": "5eb41a9ba020071c9ca8135c",
          "cache-control": "no-cache"
        }
      }).then(res => res.json()).then(data => {
          this.setState({
            users: data
          });
      })
    }
            
    newUser = () => {
      this.setState({btnLoading: true});
        fetch("https://final-b8cc.restdb.io/rest/userlist", {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "x-apikey": "5eb41a9ba020071c9ca8135c",
            "cache-control": "no-cache"
          },
          body: JSON.stringify({
            username: this.state.username,
            password: this.state.password,
            email: this.state.email
          })
        }).then(res => res.json()).then(data => {
          this.setState({btnLoading: false});
          toastr.success('Account successfully created');
          if (data.hasOwnProperty('_id')) {
            console.log('Success!');
          } else {
            console.log('Error');
          }
        })
    }

    handleChange = e => {
      const { value, name } = e.target;
      this.setState({ [name]: value });
    }

    handleSubmit = e => {
      e.preventDefault();
      const { username, email, users } = this.state;
      
      const usernameTaken = users.find(user => user.username === username);
      const emailTaken = users.find(user => user.email === email);
      if (usernameTaken) {
        toastr.error('Username is already taken')
      } else if (emailTaken) {
        toastr.error('Email is already taken')
      } else if (this.state.username.length < 6) {
        toastr.error('Username must have at least 6 characters');
      } else if (this.state.password.length < 6) {
        toastr.error('Password must have at least 6 characters');
      } else if (this.state.repeatpw !== this.state.password) {
        toastr.error('Repeated password is incorrect');
      } else {
        this.newUser();
        this.props.history.push("/login");
      }
    }
    
  render() {
    const { btnLoading } = this.state;
    toastr.options = toastrSetup;

    return (
        <div className={classes['form-container']}>
            <form className={classes['signup-form']} onSubmit={this.handleSubmit}>
                <div className={classes.group}>
                    <input onChange={this.handleChange} value={this.state.username} type="text" name="username" required/>
                    <label>Username</label>
                </div>
                <div className={classes.group}>
                    <input onChange={this.handleChange} value={this.state.password} type="password" name="password" required/>
                    <label>Password</label>
                </div>
                <div className={classes.group}>
                    <input onChange={this.handleChange} value={this.state.repeatpw} type="password" name="repeatpw" required/>
                    <label>Repeat password</label>
                </div>
                <div className={classes.group}>
                    <input onChange={this.handleChange} value={this.state.email} type="email" name="email" required/>
                    <label>Email</label>
                </div>
                <button className={classes['signup-btn']} type="submit">{btnLoading ? <i className="fa fa-circle-o-notch fa-spin"></i> : 'sign up'}</button>
            </form>
        </div>
    )
  }
}

export default withRouter(Signup);
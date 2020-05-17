import React from 'react';
import classes from './login.module.css';
import toastr from 'toastr';
import toastrSetup from '../../helpers/toastr/toastr';
import '../../helpers/toastr/toastr.css';
import { withRouter } from 'react-router-dom';

class Login extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          username: '',
          password: '',
          users: [],
          btnLoading: false,
          foundUser: false
      }
  }

  handleLogin = (cb) => {
    this.setState({btnLoading: true})
    fetch("https://final-b8cc.restdb.io/rest/userlist", {
      method: 'GET',
      headers: {  
        "Content-Type": "application/json; charset=uf-8",
        "x-apikey": "5eb41a9ba020071c9ca8135c",
        "cache-control": "no-cache"
      }
    }).then(res => res.json()).then(data => {
        this.setState({
          btnLoading: false,
        });
        cb(data);
    })
  }

  handleChange = e => {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { username, password } = this.state;

    this.handleLogin(users => {
      const foundUsername = users.find(user => user.username === username);
      if(!foundUsername) return toastr.error('Incorrect username');
      const user = users.find(user => user.username === username && user.password === password);
      user ? toastr.success('Logged in') : toastr.error('Incorrect password');
      localStorage.setItem("userID", user._id);
      this.setState({isLoggedIn: true});
      this.props.history.push("/", { logged: true });
    });
  }

  render() {
    const { btnLoading } = this.state;
    toastr.options = toastrSetup;

    return (
        <div className={classes['form-container']}>
            <form className={classes['login-form']} onSubmit={this.handleSubmit}>
                <div className={classes.group}>
                    <input onChange={this.handleChange} value={this.state.username} type="text" name="username" required/>
                    <label>Username</label>
                </div>
                <div className={classes.group}>
                    <input onChange={this.handleChange} value={this.state.password} type="password" name="password" required/>
                    <label>Password</label>
                </div>
                <button className={classes['login-btn']} type="submit" name="submit">{btnLoading ? <i className="fa fa-circle-o-notch fa-spin"></i> : 'log in'}</button>
            </form>
        </div>
    )
  }
}

export default withRouter(Login);
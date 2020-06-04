import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from 'react-router-dom';
import classes from'./App.module.css';
import Home from './pages/home/Home';
import Projects from './pages/projects/Projects';
import Tasks from './pages/tasks/Tasks';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Notfound from './helpers/notfound';
import toastr from 'toastr';
import toastrSetup from './helpers/toastr/toastr';
import './helpers/toastr/toastr.css';
import logo from './assets/img/logo.svg';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogged: false
    }
  }

  componentDidMount() {
    if (localStorage.getItem('userID') !== null) this.setState({ isLogged: true });
    else this.setState({ isLogged: false });
  }

  clear = () => {
    localStorage.clear();
    this.setState({ isLogged: false });
    toastr.success('Logged out');
  }

  handleLogged = () => {
    const { isLogged } = this.state;
    if (!isLogged) this.setState({ isLogged: true });
  }

  render() {
    toastr.options = toastrSetup;

    return (
      <Router>
        <div>
          <div className={classes['nav-bar-container']}>
            <div className={classes['left-side']}>
              <ul className={classes['nav-bar']}>
                <li>
                  <NavLink exact to='/' activeClassName={classes.active}>home</NavLink>
                </li>
                <li>
                  <NavLink to='/projects'  activeClassName={classes.active}>projects</NavLink>
                </li>
                <li>
                  <NavLink to='/tasks'  activeClassName={classes.active}>tasks</NavLink>
                </li>
              </ul>
            </div>
            <div className={classes['logo-container']}>
              <Link to='/'>
                <img src={logo} alt='logo'></img>
              </Link>
            </div>
            <div className={classes['right-side']}>
            { this.state.isLogged 
              ? 
              <Link to='/' onClick={this.clear} className={classes['log-out']}>log out</Link>
              : 
              <ul>
                <li>
                  <NavLink to='/login'>log in</NavLink> 
                </li>
                <li>
                  <NavLink to='/signup'>sign up</NavLink>
                </li>            
              </ul> 
            }
            </div>
          </div>
          <Switch>
            <Route exact path='/' component={props => <Home onRedirect={() => this.handleLogged()} {...props} />} />
            <Route path='/projects' component={Projects} />
            <Route path='/tasks' component={Tasks} />
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />
            <Route component={Notfound} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;
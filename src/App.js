import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
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
    if(localStorage.getItem('userID') !== null) this.setState({ isLogged: true });
    else this.setState({ isLogged: false });
  }

  clear = () => {
    localStorage.clear();
    this.setState({isLogged: false});
    toastr.success('Logged out');
  }

  handleLogged = () => {
    const { isLogged } = this.state;
    if(!isLogged) this.setState({ isLogged: true });
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
                  <Link to='/'>home</Link>
                </li>
                <li>
                  <Link to='/projects'>projects</Link>
                </li>
                <li>
                  <Link to='/tasks'>tasks</Link>
                </li>
              </ul>
            </div>
            <div className={classes['logo-container']}>
              <img src={logo} alt='logo'></img>
            </div>
            <div className={classes['right-side']}>
            {this.state.isLogged ? <Link to='/' onClick={this.clear} className={classes['log-out']}>log out</Link>
              : <ul>
              <li>
                <Link to='/login'>log in</Link> 
              </li>
              <li>
                <Link to='/signup'>sign up</Link>
              </li>            
            </ul> }
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
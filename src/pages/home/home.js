import React from 'react';
import classes from './home.module.css';
import linkedin from '../../assets/img/linkedin.svg';
import behance from '../../assets/img/behance.svg';
import github from '../../assets/img/github.svg';
import gmail from '../../assets/img/gmail.svg';
import facebook from '../../assets/img/facebook.svg';
import { withRouter } from 'react-router-dom';

class Home extends React.Component {
  componentDidMount() {
    if(this.props.location.state && this.props.location.state.logged) {
      this.props.history.replace('', null);
      this.props.onRedirect();
    }
  }

  render() {
    return (
      <div>
        <div className={classes.sidebar}>
          <div className={classes['contact-container']}>
            <a href='https://www.linkedin.com/in/mihail-sebastian-rotar-92464a101/' target='_blank'>
            <img className={classes.linkedin + ' ' + classes.icons} src={linkedin} alt='linkedin icon'></img>
            </a>
            <a href='https://www.behance.net/rotarsebastian' target='_blank'>
            <img className={classes.behance + ' ' + classes.icons} src={behance} alt='behance icon'></img>
            </a>
            <a href='https://github.com/rotarsebastian' target='_blank'>
            <img className={classes.github + ' ' + classes.icons} src={github} alt='github icon'></img>
            </a>
            <a href='https://www.linkedin.com/in/mihail-sebastian-rotar-92464a101/' target='_blank'>
            <img className={classes.gmail + ' ' + classes.icons} src={gmail} alt='gmail icon'></img>
            </a>
            <a href='https://www.facebook.com/RotarSebastian1' target='_blank'>
            <img className={classes.facebook + ' ' + classes.icons} src={facebook} alt='facebook icon'></img>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Home);
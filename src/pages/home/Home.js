import React from 'react';
import classes from './home.module.css';
import linkedin from '../../assets/img/linkedin.svg';
import behance from '../../assets/img/behance.svg';
import github from '../../assets/img/github.svg';
import gmail from '../../assets/img/gmail.svg';
import facebook from '../../assets/img/facebook.svg';
import { withRouter } from 'react-router-dom';
import toastr from 'toastr';
import toastrSetup from '../../helpers/toastr/toastr';
import '../../helpers/toastr/toastr.css';

class Home extends React.Component {
  componentDidMount() {
    if(this.props.location.state && this.props.location.state.logged) {
      this.props.history.replace('', null);
      this.props.onRedirect();
    }
  }

  copyText = () => {
    navigator.clipboard.writeText('rotar.seby1@gmail.com');
    toastr.success('Copied! rotar.seby1@gmail.com');
  }

  render() {
    toastr.options = toastrSetup;

    return (
      <div>
        <div className={classes.intro}>
          <div className={classes.top}>
            <div className={classes.left}>soft cloud</div>
            <div className={classes.right}>MSR</div>
          </div>
          <div className={classes.bottom}>Fullstack Developer implementing modern code using modern technologies with passion.</div>
        </div>
        <div className={classes.sidebar}>
          <div className={classes['contact-container']}>
            <a href='https://www.linkedin.com/in/mihail-sebastian-rotar-92464a101/' target='_blank' rel="noopener noreferrer">
              <img className={classes.linkedin + ' ' + classes.icons} src={linkedin} alt='linkedin icon'></img>
            </a>
            <a href='https://www.behance.net/rotarsebastian' target='_blank' rel="noopener noreferrer">
              <img className={classes.behance + ' ' + classes.icons} src={behance} alt='behance icon'></img>
            </a>
            <a href='https://github.com/rotarsebastian' target='_blank' rel="noopener noreferrer">
              <img className={classes.github + ' ' + classes.icons} src={github} alt='github icon'></img>
            </a>
            <button onClick={this.copyText}>
              <img className={classes.gmail + ' ' + classes.icons} src={gmail} alt='gmail icon'></img>
            </button>
            <a href='https://www.facebook.com/RotarSebastian1' target='_blank' rel="noopener noreferrer">
              <img className={classes.facebook + ' ' + classes.icons} src={facebook} alt='facebook icon'></img>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Home);
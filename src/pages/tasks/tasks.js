import React, {} from 'react';
import classes from './tasks.module.css';
import toastr from 'toastr';
import toastrSetup from '../../helpers/toastr/toastr';
import '../../helpers/toastr/toastr.css';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      tasks: [],
      show: false,
      title: '',
      description: '',
      btnLoading: false,
      image: null,
      currentIdLoading: undefined,
      bigImg: false,
      imgClicked: undefined,
      userId: ''
    };
  }

  componentDidMount() {
    fetch("https://final-b8cc.restdb.io/rest/tasks", {
      method: 'GET',
      headers: {  
        "Content-Type": "application/json; charset=uf-8",
        "x-apikey": "5eb41a9ba020071c9ca8135c",
        "cache-control": "no-cache"
      }
    }).then(res => res.json()).then(data => {
        this.setState({
          isLoaded: true,
          tasks: data,
          userId: localStorage.getItem('userID')
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
  }

  handleChange = e => {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  }

  addTask = () => {
      this.setState({btnLoading: true});
      const formData = new FormData();
      formData.append('image', this.state.image, this.state.image.name);
      fetch("https://final-b8cc.restdb.io/media", {
        method: 'POST',
        headers: {  
          "x-apikey": "5eb41a9ba020071c9ca8135c",
        },
        body: formData
      }).then(res => res.json()).then(data => {
      fetch("https://final-b8cc.restdb.io/rest/tasks", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "x-apikey": "5eb41a9ba020071c9ca8135c",
          "cache-control": "no-cache"
        },
        body: JSON.stringify({
          title: this.state.title,
          description: this.state.description,
          image: data.ids[0],
          userId: this.state.userId
        })
      }).then(res => res.json()).then(data => {
        this.setState({btnLoading: false});
        const newTasks = [ ...this.state.tasks ];
        const newTask = { _id: data._id, title: data.title, description: data.description, image: data.image };
        newTasks.unshift(newTask);
        this.setState({tasks: newTasks});
        toastr.success('New task added');
      })
    })
  }

  checkTask = () => {
    if(this.state.title.length < 10) {
      toastr.error('Title must have at least 10 characters');
    } else if(this.state.description.length < 10) {
      toastr.error('Description must have at least 10 characters');
    } else {
      this.addTask();
    }
  }

  removeTask = _id => {
    this.setState({currentIdLoading: _id});
    fetch("https://final-b8cc.restdb.io/rest/tasks/" + _id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": "5eb41a9ba020071c9ca8135c",
        "cache-control": "no-cache"
      }
    }).then(res => res.json()).then(data => {
      const newTasks = [ ...this.state.tasks ];
      const indexToRemove = newTasks.findIndex(task => task._id === _id);
      newTasks.splice(indexToRemove, 1);
      this.setState({ tasks: newTasks, currentIdLoading: undefined });
      toastr.success('Task removed');
    })
  }

  makeImgBig = _id => {
    this.setState({imgClicked: _id, bigImg: true});
  }

  render() {
    const { error, isLoaded, tasks, btnLoading, currentIdLoading, bigImg, imgClicked } = this.state;
    toastr.options = toastrSetup;

    const style = {
      centeredTxt: {
        textAlign: 'center',
        marginTop: '15px',
        fontWeight: '600'
      },
      closeBtnContainer: {
        position: 'relative',
        marginBottom: '45px'
      },
      closeBtn: {
        position: 'absolute',
        right: '0'
      },
      deleteBtnContainer: {
        position: 'relative'
      },
      deleteBtn: {
        position: 'absolute',
        top: '-11px',
        right: '-5px'
      }
    }

    if(localStorage.getItem('userID') === null) {
      return <div style={style.centeredTxt}>You need to log in first in order to add a task and get your problem solved</div>
    } else if(error) {
      return <div style={style.centeredTxt}>Error: {error.message}</div>;
    } else if(!isLoaded) {
      return (
        <div className={classes.loader}></div>
      )
    } else {
      return (
        <div className={classes['middle-section']}>
          <div className={classes['add-container']}>
            {this.state.show ? null : <div className={classes['add-btn-container']}>
              <button onClick={() => {this.setState({show: true})}}><i className="fa fa-plus-circle" aria-hidden="true"></i></button>
              <span>add task</span>
            </div>}
          {this.state.show ? <div className={classes['data-container']}>
            <div style={style.closeBtnContainer} className={classes['close-btn-container']}>
              <button style={style.closeBtn} onClick={() => {this.setState({show: false})}}><i className="fa fa-times" aria-hidden="true"></i></button>
            </div>
            <input onChange={this.handleChange} value={this.state.title} type="text" name="title" placeholder="Title"></input>
            <input onChange={this.handleChange} value={this.state.description} name="description" placeholder="Description ..."></input>
            <input onChange={e => this.setState({ image: e.target.files[0] })} type="file" accept="image/*" name="image"></input>
            <div className={classes['submit-btn-container']}>
              <button onClick={this.checkTask}>{btnLoading ? <i className="fa fa-circle-o-notch fa-spin"></i> : 'add task'}</button>
            </div>
          </div> : null}
          </div>
          {tasks.filter(task => task.userId === localStorage.getItem('userID')).map(filteredTask => (
            <div className={classes.task} key={filteredTask._id}>
              <div className={classes['close-btn-container']} style={style.deleteBtnContainer}>
                <button style={style.deleteBtn} onClick={() => {this.removeTask(filteredTask._id)}}>{currentIdLoading === filteredTask._id ? <i className="fa fa-circle-o-notch fa-spin"></i> 
                 : <i className="fa fa-times" aria-hidden="true"></i>}</button>
              </div>
              <h1>{filteredTask.title}</h1>
              <p>{filteredTask.description}</p>
              <img className={classes['small-img']} onClick={() => {this.makeImgBig(filteredTask._id)}} src={'https://final-b8cc.restdb.io/media/' + filteredTask.image} alt='problem illustration'></img>
              {imgClicked === filteredTask._id && bigImg ? <div className={classes['modal']}>
                  <ClickAwayListener onClickAway={() => {this.setState({bigImg: false})}}>
                    <img className={classes['big-img']} src={'https://final-b8cc.restdb.io/media/' + filteredTask.image} alt='problem illustration'></img>
                  </ClickAwayListener>
                </div>
               : null}
              </div>
          ))}
        </div>
      )
    }
  }
}

export default Tasks;
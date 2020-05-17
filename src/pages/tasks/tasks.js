import React from 'react';
import classes from './tasks.module.css';
import toastr from 'toastr';
import toastrSetup from '../../helpers/toastr/toastr';
import '../../helpers/toastr/toastr.css'

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
      currentIdLoading: undefined
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
          tasks: data
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
    fetch("https://final-b8cc.restdb.io/rest/tasks", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "x-apikey": "5eb41a9ba020071c9ca8135c",
        "cache-control": "no-cache"
      },
      body: JSON.stringify({
        title: this.state.title,
        description: this.state.description
      })
    }).then(res => res.json()).then(data => {
      this.setState({btnLoading: false});
      const newTasks = [ ...this.state.tasks ];
      const newTask = { _id: data._id, title: data.title, description: data.description, image: [] };
      newTasks.unshift(newTask);
      this.setState({tasks: newTasks});
      toastr.success('New task added');
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

  removeTask = (_id, index) => {
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
      newTasks.splice(index, 1);
      this.setState({tasks: newTasks, currentIdLoading: undefined});
      toastr.success('Task removed');
    })
  }

  render() {
    const { error, isLoaded, tasks, btnLoading, currentIdLoading } = this.state;
    toastr.options = toastrSetup;

    const style = {
      defaultBtn: {
        filter: 'brightness(1)',
        cursor: 'initial'
      },
      taskCloseBtn: {
        position: 'absolute',
        top: '-11px',
        right: '-5px'
      },
      closeBtnContainer: {
        position: 'relative'
      },
      centeredTxt: {
        textAlign: 'center'
      }
    }

    if(localStorage.getItem('userID') === null) {
      return <div style={style.centeredTxt}>You need to log in first in order to add a task</div>
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
            <div className={classes['add-btn-container']}>
              {this.state.show ? <button style={style.defaultBtn} onClick={()=>{this.setState({show: true})}}><i className="fa fa-plus-circle" aria-hidden="true"></i></button>
                : <button onClick={()=>{this.setState({show: true})}}><i className="fa fa-plus-circle" aria-hidden="true"></i></button>}
              <span>add task</span>
          </div>
          {this.state.show ? <div className={classes['data-container']}>
            <div className={classes['close-btn-container']}>
              <button onClick={()=>{this.setState({show: false})}}><i className="fa fa-times" aria-hidden="true"></i></button>
            </div>
            <input onChange={this.handleChange} value={this.state.title} type="text" name="title" placeholder="Title"></input>
            <textarea onChange={this.handleChange} value={this.state.description} name="description" placeholder="Description ..."></textarea>
            <input type="file"  accept="image/*" name="image"></input>
            <div className={classes['submit-btn-container']}>
              <button onClick={this.checkTask}>{btnLoading ? <i className="fa fa-circle-o-notch fa-spin"></i> : 'submit'}</button>
            </div>
          </div> : null}
          </div>
          {tasks.map(task => (
            <div className={classes.task} key={task._id}>
              <div className={classes['close-btn-container']} style={style.closeBtnContainer}>
                <button style={style.taskCloseBtn} onClick={() => {this.removeTask(task._id)}}>{currentIdLoading && currentIdLoading === task._id ? <i className="fa fa-circle-o-notch fa-spin"></i> : <i className="fa fa-times" aria-hidden="true"></i>}</button>
              </div>
              <h1>{task.title}</h1>
              <p>{task.description}</p>
              </div>
          ))}
        </div>
      )
    }
  }
}

export default Tasks;
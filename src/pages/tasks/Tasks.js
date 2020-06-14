import React from 'react';
import classes from './tasks.module.css';
import toastr from 'toastr';
import toastrSetup from '../../helpers/toastr/toastr';
import '../../helpers/toastr/toastr.css';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Comment from '../../components/comment/Comment';

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.inputFile = React.createRef();
    this.state = {
      error: null,
      isLoaded: false,
      tasks: [],
      show: false,
      title: '',
      description: '',
      addLoading: false,
      image: undefined,
      removeLoading: undefined,
      imgBig: false,
      imgClicked: undefined,
      userId: localStorage.getItem('userID'),
      admin: false,
      // comments: [],
      // comment: '',
      // commLoading: false,
    };
  }

  componentDidMount() {
    fetch('https://final-b8cc.restdb.io/rest/tasks', {
      method: 'GET',
      headers: {  
        "Content-Type": "application/json; charset=uf-8",
        "x-apikey": "5eb41a9ba020071c9ca8135c",
        "cache-control": "no-cache"
      }
    }).then(res => res.json()).then(data => {
      // fetch('https://final-b8cc.restdb.io/rest/tasks/' + data[0]._id + '/comments', {
      //   method: 'GET',
      //   headers: {  
      //     "Content-Type": "application/json; charset=uf-8",
      //     "x-apikey": "5eb41a9ba020071c9ca8135c",
      //     "cache-control": "no-cache"
      //   }
      // }).then(res => res.json()).then(comments => {
        this.setState({
          // comments,
          isLoaded: true
        });
        if (this.state.userId === '5ebda67f00aa16790000d9e9') {
          this.setState({ admin: true, tasks: data });
        } else {
          this.setState({ tasks: data.filter(task => task.userId === this.state.userId) })
        }
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

  addTask = async () => {
      this.setState({ addLoading: true });
      const formData = new FormData();
      let response, image;

      if (this.state.image) {
        formData.append('image', this.state.image, this.state.image.name);
        response = await fetch("https://final-b8cc.restdb.io/media", {
          method: 'POST',
          headers: {  
            "x-apikey": "5eb41a9ba020071c9ca8135c",
          },
          body: formData
        });

        image = await response.json();
      }

      let requestObj = {
        title: this.state.title,
        description: this.state.description,
        userId: this.state.userId
      };

      if(image && image.hasOwnProperty('ids')) {
        requestObj.image = image.ids[0];
      }

      const response2 = await fetch("https://final-b8cc.restdb.io/rest/tasks", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "x-apikey": "5eb41a9ba020071c9ca8135c",
          "cache-control": "no-cache"
        },
        body: JSON.stringify(requestObj)
      });
      const response2data = await response2.json();

      this.setState({ addLoading: false });
      const newTasks = [ ...this.state.tasks ];
      const newTask = { _id: response2data._id, title: response2data.title, description: response2data.description, image: response2data.image };
      newTasks.unshift(newTask);
      this.setState({ tasks: newTasks });
      toastr.success('New task added');
      this.inputFile.current.value = '';
      this.setState({ title: '', description: '', image: undefined });
  }

  checkTask = () => {
    if (this.state.title.length < 5) {
      toastr.error('Title must have at least 5 characters');
    } else if (this.state.description.length < 10) {
      toastr.error('Description must have at least 10 characters');
    } else {
      this.addTask();
    }
  }

  removeTask = _id => {
    this.setState({ removeLoading: _id });
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
      this.setState({ tasks: newTasks, removeLoading: undefined });
      toastr.success('Task removed');
    })
  }

  makeImgBig = _id => this.setState({ imgClicked: _id, imgBig: true });

  // addComment = _id => {
  //   this.setState({ commLoading: true });
  //   fetch('https://final-b8cc.restdb.io/rest/tasks/' + _id + '/comments', {
  //     method: 'POST',
  //     headers: {
  //       "Content-Type": "application/json",
  //       "x-apikey": "5eb41a9ba020071c9ca8135c",
  //       "cache-control": "no-cache"
  //     },
  //     body: JSON.stringify({
  //       comment: this.state.comment,
  //       userId: this.state.userId
  //     })
  //   }).then(res => res.json()).then(data => {
  //     this.setState({ commLoading: false });
  //     const newComments = [ ...this.state.comments ];
  //     const newComment = { _id: data._id, userId: data.userId, comment: data.comment };
  //     newComments.unshift(newComment);
  //     this.setState({ comments: newComments });
  //     toastr.success('New comment added');
  //   })
  // }

  render() {
    const { error, isLoaded, tasks, addLoading, removeLoading, imgBig, imgClicked, userId } = this.state;
    toastr.options = toastrSetup;

    if(userId === null) return <div className={classes.centered}>You need to log in first in order to add a task and get your problem solved</div>
    else if(error) return <div className={classes.centered}>Error: {error.message}</div>;
    else if(!isLoaded) return <div className={classes.loader}></div>

    return (
      <div className={classes['middle-section']}>
        <div className={classes['add-container']}>
          {
            this.state.show 
            ? 
            null 
            : 
            (
              <div className={classes['add-btn-container']}>
                <button 
                  onClick={() => {this.setState({ show: true })}}
                >
                  <i className="fa fa-plus-circle" aria-hidden="true"></i>
                </button>
                <span>add task</span>
              </div>
            )
          }
        {
          this.state.show 
          ? 
          <div className={classes['data-container']}>
            <div className={classes['close-btn-container']}>
              <button onClick={() => this.setState({ show: false })}><i className="fa fa-times" aria-hidden="true"></i></button>
            </div>
            <input 
              onChange={this.handleChange} 
              value={this.state.title} 
              type="text" 
              name="title" 
              placeholder="Title"
            />
            <input 
              onChange={this.handleChange} 
              value={this.state.description} 
              name="description" 
              placeholder="Description ..."
            />
            <input 
              onChange={e => this.setState({ image: e.target.files[0] })}
              type="file"
              accept="image/*"
              name="image"
              ref={this.inputFile}
            />
            <div className={classes['submit-btn-container']}>
              <button onClick={this.checkTask}>
              { 
                addLoading 
                ? 
                <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true"></i>
                : 
                'add task'
              }
              </button>
            </div>
          </div> 
          :
          null
        }
        </div>
        { 
          tasks.map(filteredTask => (
          <React.Fragment key={filteredTask._id}>
            <div className={classes.task}>
              <div className={classes['delete-btn-container']}>
                <button onClick={() => this.removeTask(filteredTask._id)}>
                  {
                    removeLoading === filteredTask._id 
                    ? 
                    <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true"></i> 
                    : 
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  }
                </button>
              </div>

              <h1>{filteredTask.title}</h1>

              <p>{filteredTask.description}</p>

              { 
                filteredTask.image
                ?
                <img className={classes['small-img']} onClick={() => this.makeImgBig(filteredTask._id)} src={'https://final-b8cc.restdb.io/media/' + filteredTask.image} alt='problem illustration'></img>
                :
                null
              }

              {
                imgClicked === filteredTask._id && imgBig 
                ? 
                <div className={classes['modal']}>
                  <ClickAwayListener onClickAway={() => {this.setState({ imgBig: false })}}>
                    <img 
                      className={classes['big-img']} 
                      src={'https://final-b8cc.restdb.io/media/' + filteredTask.image} alt='problem illustration'
                    />
                  </ClickAwayListener>
                </div>
                : 
                null
              }
            </div>

            <Comment text={'comment'} />
            <Comment text={'another comment'} />

            <div className={classes['add-comment-container']}>
              <input 
                type='text' 
                name='comment' 
                placeholder='Comment ...'
              />
              <button><i className="fa fa-paper-plane" aria-hidden="true"></i></button>
            </div>
          </React.Fragment>
        ))}
      </div>
    )
  }
}

export default Tasks;
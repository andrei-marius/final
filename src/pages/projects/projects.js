import React from 'react';
import classes from './projects.module.css';
import toastr from 'toastr';
import toastrSetup from '../../helpers/toastr/toastr';
import '../../helpers/toastr/toastr.css';

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      projects: [],
      show: false,
      title: '',
      description: '',
      image: null,
      addLoading: false,
      removeLoading: undefined,
      admin: false
    };
  }

  componentDidMount() {
    fetch("https://final-b8cc.restdb.io/rest/projects", {
      method: 'GET',
      headers: {  
        "Content-Type": "application/json; charset=uf-8",
        "x-apikey": "5eb41a9ba020071c9ca8135c",
        "cache-control": "no-cache"
      }
    }).then(res => res.json()).then(data => {
        this.setState({
          isLoaded: true,
          projects: data,
        });
        if(localStorage.getItem('userID') === '5ebda67f00aa16790000d9e9') {
          this.setState({admin: true});
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

  addProject = () => {
    this.setState({addLoading: true});
    const formData = new FormData();
    formData.append('image', this.state.image, this.state.image.name);
    fetch("https://final-b8cc.restdb.io/media", {
      method: 'POST',
      headers: {  
        "x-apikey": "5eb41a9ba020071c9ca8135c",
      },
      body: formData
    }).then(res => res.json()).then(data => {
      fetch("https://final-b8cc.restdb.io/rest/projects", {
        method: 'POST',
        headers: {  
          "Content-Type": "application/json",
          "x-apikey": "5eb41a9ba020071c9ca8135c",
          "cache-control": "no-cache"
        },
        body: JSON.stringify({
          title: this.state.title,
          description: this.state.description,
          image: data.ids[0]
        })
      }).then(res => res.json()).then(data => {
        this.setState({addLoading: false})
        const newProjects = [ ...this.state.projects ];
        const newProject = { _id: data._id, title: data.title, description: data.description, image: data.image };
        newProjects.unshift(newProject);
        this.setState({projects: newProjects});
        toastr.success('New project added');
      })
    })
  }

  removeProject = (_id) => {
    this.setState({ removeLoading: _id });
    fetch("https://final-b8cc.restdb.io/rest/projects/" + _id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": "5eb41a9ba020071c9ca8135c",
        "cache-control": "no-cache"
      }
    }).then(res => res.json()).then(data => {
      const newProjects = [ ...this.state.projects ];
      const indexToRemove = newProjects.findIndex(project => project._id === _id);
      newProjects.splice(indexToRemove, 1);
      this.setState({ projects: newProjects, removeLoading: undefined });
      toastr.success('Project removed');
    })
  }

  render() {
    const { error, isLoaded, projects, addLoading, removeLoading, admin } = this.state;
    toastr.options = toastrSetup;

    const style = {
      centeredTxt: {
        textAlign: 'center'
      },
      closeBtnContainer: {
        position: 'relative',
        marginBottom: '41px'
      },
      closeBtn: {
        position: 'absolute',
        right: '0'
      },
      deleteBtnContainer: {
        position: 'absolute',
        bottom: '0px',
        padding: '13px'
      }
  }

    if(error) {
      return <div style={style.centeredTxt}>Error: {error.message}</div>;
    } else if(!isLoaded) {
      return (
        <div className={classes.loader}></div>
      )
    } else {
    return (
      <div className={classes['middle-section']}>
        {admin ? <div className={classes['add-container']}>
          {this.state.show ? null : <div className={classes['add-btn-container']}>
            <button onClick={()=>{this.setState({show: true})}}><i className="fa fa-plus-circle" aria-hidden="true"></i></button>
            <span>add project</span>
          </div>}
          {this.state.show ? <div className={classes['data-container']}>
            <div style={style.closeBtnContainer} className={classes['close-btn-container']}>
            <button style={style.closeBtn} onClick={()=>{this.setState({show: false})}}><i className="fa fa-times" aria-hidden="true"></i></button>
            </div>
            <input onChange={this.handleChange} value={this.state.title} type="text" name="title" placeholder="Title"></input>
            <input onChange={this.handleChange} value={this.state.description} name="description" placeholder="Description ..."></input>
            <input onChange={e => this.setState({ image: e.target.files[0] })} type="file"  accept="image/*" name="image"></input>
            <div className={classes['submit-btn-container']}>
              <button onClick={this.addProject}>{addLoading ? <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true"></i> : 'add project'}</button>
            </div>
          </div> : null}
        </div> : null}
      {projects.map(project => (
          <div className={classes.project} key={project._id}>
            <div className={classes['img-container']}>
              <img src={'https://final-b8cc.restdb.io/media/' + project.image} alt="project illustration"></img>
            </div>
            <div className={classes['hide-scroll-bar']}>
              <div className={classes['txt-container']}>
                <h1>{project.title}</h1>
                <p>{project.description}</p>
              </div>
            </div>
            {admin ? <div className={classes['close-btn-container']} style={style.deleteBtnContainer}>
              <button onClick={() => this.removeProject(project._id)}>{removeLoading === project._id ? <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true"></i> 
                : <i className="fa fa-times" aria-hidden="true"></i>}</button>
            </div> : null}
          </div>
      ))}
      </div>
    )
  }
}
}

export default Projects;
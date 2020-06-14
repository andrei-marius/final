import React from 'react';
import classes from './projects.module.css';
import toastr from 'toastr';
import toastrSetup from '../../helpers/toastr/toastr';
import '../../helpers/toastr/toastr.css';

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.inputFile = React.createRef();
    this.state = {
      error: null,
      isLoaded: false,
      projects: [],
      show: false,
      title: '',
      description: '',
      image: undefined,
      addLoading: false,
      removeLoading: undefined,
      admin: false,
      link: ''
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
        if (localStorage.getItem('userID') === '5ebda67f00aa16790000d9e9') {
          this.setState({ admin: true });
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
    this.setState({ addLoading: true });
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
          link: this.state.link,
          image: data.ids[0]
        })
      }).then(res => res.json()).then(data => {
        this.setState({ addLoading: false })
        const newProjects = [ ...this.state.projects ];
        const newProject = { _id: data._id, title: data.title, description: data.description, image: data.image };
        newProjects.unshift(newProject);
        this.setState({ projects: newProjects });
        toastr.success('New project added');
        this.inputFile.current.value = '';
        this.setState({ title: '', description: '', link: '', image: undefined });
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

    if(error) {
      return <div className={classes.centered}>Error: {error.message}</div>;
    } else if(!isLoaded) {
      return (
        <div className={classes.loader}></div>
      )
    } else {
    return (
      <div className={classes['middle-section']}>
        {admin ? <div className={classes['add-container']}>
          {this.state.show ? null : <div className={classes['add-btn-container']}>
            <button onClick={() => this.setState({ show: true })}><i className="fa fa-plus-circle" aria-hidden="true"></i></button>
            <span>add project</span>
          </div>}
          {this.state.show ? <div className={classes['data-container']}>
            <div className={classes['close-btn-container']}>
            <button onClick={() => this.setState({ show: false })}><i className="fa fa-times" aria-hidden="true"></i></button>
            </div>
            <input onChange={this.handleChange} value={this.state.title} type="text" name="title" placeholder="Title"></input>
            <input onChange={this.handleChange} value={this.state.description} name="description" placeholder="Description ..."></input>
            <input onChange={this.handleChange} value={this.state.link} name="link" placeholder="Link"></input>
            <input onChange={e => this.setState({ image: e.target.files[0] })} type="file"  accept="image/*" name="image" ref={this.inputFile}></input>
            <div className={classes['submit-btn-container']}>
              <button onClick={this.addProject}>{addLoading ? <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true"></i> : 'add project'}</button>
            </div>
          </div> : null}
        </div> : null}
      {projects.map(project => (
          <div className={classes.project} key={project._id + 1}>
            <div className={classes['img-container']}>
              <a href={project.link} target='_blank' rel="noopener noreferrer">
                <img src={'https://final-b8cc.restdb.io/media/' + project.image} alt="project illustration"></img>
              </a>
            </div>
              <div className={classes['txt-container']}>
                <div className={classes['title-container']}>
                  <h1>{project.title}</h1>
                </div>
                <div className={classes['description-scrolling']}>
                  <p>{project.description}</p>
                </div>
              </div>
            {admin ? <div className={classes['delete-btn-container']}>
              <button onClick={() => this.removeProject(project._id)}>{removeLoading === project._id ? <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true"></i> 
                : <i className="fa fa-trash" aria-hidden="true"></i>}</button>
            </div> : null}
          </div>
      ))}
      </div>
    )
  }
}
}

export default Projects;
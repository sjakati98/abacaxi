// This is a place holder for the initial application state.
const thumbnail_url = id => {return 'http://i3.ytimg.com/vi/'+id+'/hqdefault.jpg'};
const video_url = id => {return 'https://youtube.com/watch?v='+id};


// This grabs the DOM element to be used to mount React components.
var contentNode = document.getElementById("contents");

class VideoLikeButton extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      likes: props.likes, // when using the database this needs to be changed because we're only using a derived state here
      // so when using a database, there should be no need to set an initial state; this is just for PoC
      clickedFlag: false,
    }
  }

  handleLikeClick(){
    if (this.state.clickedFlag){
      this.setState(function(prevState, _) {
        return {
          likes: prevState.likes - 1,
          clickedFlag: !prevState.clickedFlag
        };
      })
    }
    else{
      this.setState(function(prevState, _) {
        return {
          likes: prevState.likes + 1,
          clickedFlag: !prevState.clickedFlag
        };
      })
    }
    
  }

  render(){

    let buttonTag = (this.state.clickedFlag) ? "btn-success" : "btn-light"

    return (
      <button type="button" className={`btn ${buttonTag}`} onClick={this.handleLikeClick.bind(this)}>
        Likes {this.state.likes}
      </button>
    )
  }
}

const Video = (props) => (
  <div className="card" style={{width: "18rem", float: "left", marginRight: "8px"}}>
    <a href={video_url(props.video.ytId)}><img className="card-img-top" src={thumbnail_url(props.video.ytId)} alt="Card image cap"></img></a>
    <div className="card-body">
      <h5 className="card-title">{props.video.title}</h5>
      <p className="card-text">Super dope video about the section</p>
      <a href="#" className="btn btn-primary">Go somewhere fun</a>
      <VideoLikeButton likes={props.video.likes} />
    </div>
  </div>
);

const AddVideoModal = (props) =>(
  <div>
    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#AddVideoModal">Add Video</button>

    <div className="modal fade" id="AddVideoModal" tabIndex="-1" role="dialog" aria-labelledby="AddVideoModalTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="AddVideoModalTitle">Add Your Video</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <AddVideoForm wikiID={props.wikiID} sections={props.sections} addVideo={props.addVideo} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
)

class AddVideoForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      wikiID: props.wikiID,
      sections: props.sections,
      selections : props.sections.map(section => (
        <Selection key={section.index} section={section} />
      ))
    };
    this.handleAddVidoe = this.handleAddVidoe.bind(this);
  }

  handleAddVidoe(e){
    e.preventDefault();
    let form = document.forms.videoAdd;
    const submitReq = {
      "video":{
				"wikiPageId": this.state.wikiID,
				"sectionIdx": form.wikiPageContentIndex.value,
				"ytId": form.videoID.value
			}
    }
    fetch('/api/videos', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitReq),
    })
    .then(res => res.json())
    .then(json => {
      console.log(json.success);
      if (json.success) {
        alert(json.msg);
        this.props.addVideo(json.video);
      }
      else {
        alert('Failed to add video.\n Error description: ' + json.msg);
      }
    });
  }

  render(){
    return(
      <div>
        <form name="videoAdd" onSubmit={this.handleAddVidoe}>
          <div className="form-group">
            <label htmlFor="videoID">Youtube Video ID</label>
            <input type="text" className="form-control" id="videoID" placeholder="The 11 Digit code after watch?v="></input>
          </div>
          <div className="form-group">
            <label htmlFor="wikiPageContentIndex">Choose The Content Section You Want To Submit</label>
            <select className="form-control" id="wikiPageContentIndex">
              {this.state.selections}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    )
  }
}

const Selection = (props) =>(
  <option value={props.section.index}>{props.section.index}. {props.section.line}</option>
)



function Section(props) {
  const CustomHeader = `h${props.section.level}`;
  const videos = props.videos.map(video => (
    <Video key={video.ytId} video={video} />
  ));
  return (
    <div className="container" style={{paddingBottom: '15px', marginBottom: '15px', borderBottom: "1px solid grey"}}>
      <div className="row">
        <CustomHeader>{props.section.line}</CustomHeader>
        <hr/>
        <div className="col-12" style={{"overflowX": "auto"}}>
          {videos}
        </div>
      </div>
    </div>
  );
}

function WikiPage(props) {
  const sections = props.sections.map(section => (
    <Section key={section.index} section={section} videos={props.videos.filter(videoObject => videoObject.sectionIdx == section.index)}/>
  ));
  return (
    <div>{sections}</div>
  );
}

class ContentPage extends React.Component {
  constructor() {
    super();

    const dummyWikiID = 1424309; // this is going to change when we use routers
    
    this.loadWikiData = this.loadWikiData.bind(this);
    this.loadAbaxaciData = this.loadAbaxaciData.bind(this);
    this.addVideo = this.addVideo.bind(this);


    // TODO: need to add upvotes downvotes and add title to page from wiki API

    this.state = { 
      wikiID: dummyWikiID,
      videos: [],
    };
  }

  componentWillMount(){
    this.loadWikiData();
    this.loadAbaxaciData();
  }

  loadWikiData(){
    let wikiID = this.state.wikiID;
    let wikiLink = `https://en.wikipedia.org/w/api.php?origin=*&action=parse&format=json&pageid=${wikiID}&prop=sections`
    fetch(wikiLink)
      .then(res => {
        if (res.ok) {
          res.json().then( json => {
            let newSections = json.parse.sections;
            newSections.unshift({
              "index": "0",
              "line": json.parse.title,
              "level": "1"
            })
            this.setState({sections: newSections});
          })
        }
      });
  }
 loadAbaxaciData(){
    let wikiID = this.state.wikiID;
    fetch("api/videos/" + wikiID.toString())
      .then( res => {
        if (res.ok) {
          res.json().then( json => {
            let videos = [];
            json.videos.forEach(video => {
              videos.push(
                video
              )
            });
            this.setState({videos: videos})
          })
        }
      }).catch( err => {
        alert("There was a problemo: " + err.message)
      });
  }
  addVideo(video){
    this.state.videos.push(video);
    this.setState({videos: this.state.videos});
  }

  render() {
    let loadingHeader = <h1> Loading ... </h1>
    let wikiPresentation = (this.state.sections != null) ? <WikiPage sections={this.state.sections} videos={this.state.videos}/> : loadingHeader
    let videoModal = (this.state.sections != null) ? <AddVideoModal sections={this.state.sections} wikiID={this.state.wikiID} addVideo={this.addVideo}/> : loadingHeader

    return (
      <div className="container">
        {videoModal}
        {wikiPresentation}
      </div>
    );
  }
}

// This renders the JSX component inside the content node:
ReactDOM.render(<ContentPage />, contentNode);

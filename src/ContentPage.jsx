// This is a place holder for the initial application state.
const state = {
  "wiki": "Emu",
};


const thumbnail_url = id => {return 'http://i3.ytimg.com/vi/'+id+'/maxresdefault.jpg'};
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

function Section(props) {
  const CustomHeader = `h${props.section.level}`;
  const videos = props.videos.map(video => (
    <Video key={video.id} video={video} />
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
    const dummyWikiID = 162393; // this is going to change when we use routers
    
    this.loadWikiData = this.loadWikiData.bind(this);
    this.loadAbaxaciData = this.loadAbaxaciData.bind(this);


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

  render() {
    let loadingHeader = <h1> Loading ... </h1>
    let wikiPresentation = (this.state.sections != null) ? <WikiPage sections={this.state.sections} videos={this.state.videos}/> : loadingHeader

    return (
      <div className="container">
        {wikiPresentation}
      </div>
    );
  }
}

// This renders the JSX component inside the content node:
ReactDOM.render(<ContentPage />, contentNode);

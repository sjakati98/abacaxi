// This is a place holder for the initial application state.
const state = {
  "wiki": "Emu",
};

const example_wikipedia_api_res = {
  "parse": {
      "title": "Emu",
      "pageid": 76894,
      "sections": [
          {
              "toclevel": 1,
              "level": "2",
              "line": "Taxonomy",
              "number": "1",
              "index": "1",
              "fromtitle": "Emu",
              "byteoffset": 5352,
              "anchor": "Taxonomy"
          },
          {
              "toclevel": 2,
              "level": "3",
              "line": "History",
              "number": "1.1",
              "index": "2",
              "fromtitle": "Emu",
              "byteoffset": 5366,
              "anchor": "History"
          },
          {
              "toclevel": 2,
              "level": "3",
              "line": "Systematics",
              "number": "1.2",
              "index": "3",
              "fromtitle": "Emu",
              "byteoffset": 11827,
              "anchor": "Systematics"
          },
          {
              "toclevel": 1,
              "level": "2",
              "line": "Description",
              "number": "2",
              "index": "4",
              "fromtitle": "Emu",
              "byteoffset": 18083,
              "anchor": "Description"
          },
          {
              "toclevel": 1,
              "level": "2",
              "line": "Distribution and habitat",
              "number": "3",
              "index": "5",
              "fromtitle": "Emu",
              "byteoffset": 24592,
              "anchor": "Distribution_and_habitat"
          },
          {
              "toclevel": 1,
              "level": "2",
              "line": "Behaviour and ecology",
              "number": "4",
              "index": "6",
              "fromtitle": "Emu",
              "byteoffset": 25788,
              "anchor": "Behaviour_and_ecology"
          },
          {
              "toclevel": 2,
              "level": "3",
              "line": "Diet",
              "number": "4.1",
              "index": "7",
              "fromtitle": "Emu",
              "byteoffset": 31241,
              "anchor": "Diet"
          },
          {
              "toclevel": 2,
              "level": "3",
              "line": "Breeding",
              "number": "4.2",
              "index": "8",
              "fromtitle": "Emu",
              "byteoffset": 35817,
              "anchor": "Breeding"
          },
          {
              "toclevel": 2,
              "level": "3",
              "line": "Predation",
              "number": "4.3",
              "index": "9",
              "fromtitle": "Emu",
              "byteoffset": 47238,
              "anchor": "Predation"
          },
          {
              "toclevel": 2,
              "level": "3",
              "line": "Parasites",
              "number": "4.4",
              "index": "10",
              "fromtitle": "Emu",
              "byteoffset": 49674,
              "anchor": "Parasites"
          },
          {
              "toclevel": 1,
              "level": "2",
              "line": "Relationship with humans",
              "number": "5",
              "index": "11",
              "fromtitle": "Emu",
              "byteoffset": 50668,
              "anchor": "Relationship_with_humans"
          },
          {
              "toclevel": 2,
              "level": "3",
              "line": "Economic value",
              "number": "5.1",
              "index": "12",
              "fromtitle": "Emu",
              "byteoffset": 53622,
              "anchor": "Economic_value"
          },
          {
              "toclevel": 2,
              "level": "3",
              "line": "Cultural references",
              "number": "5.2",
              "index": "13",
              "fromtitle": "Emu",
              "byteoffset": 63246,
              "anchor": "Cultural_references"
          },
          {
              "toclevel": 1,
              "level": "2",
              "line": "Status and conservation",
              "number": "6",
              "index": "14",
              "fromtitle": "Emu",
              "byteoffset": 68834,
              "anchor": "Status_and_conservation"
          },
          {
              "toclevel": 1,
              "level": "2",
              "line": "See also",
              "number": "7",
              "index": "15",
              "fromtitle": "Emu",
              "byteoffset": 71339,
              "anchor": "See_also"
          },
          {
              "toclevel": 1,
              "level": "2",
              "line": "Notes",
              "number": "8",
              "index": "16",
              "fromtitle": "Emu",
              "byteoffset": 71471,
              "anchor": "Notes"
          },
          {
              "toclevel": 1,
              "level": "2",
              "line": "References",
              "number": "9",
              "index": "17",
              "fromtitle": "Emu",
              "byteoffset": 71499,
              "anchor": "References"
          },
          {
              "toclevel": 1,
              "level": "2",
              "line": "External links",
              "number": "10",
              "index": "18",
              "fromtitle": "Emu",
              "byteoffset": 71645,
              "anchor": "External_links"
          }
      ]
  }
}

let example_video = {
  "url": "https://www.youtube.com/embed/Ej0ZO79Aqxw?rel=0",
  "title": "Emus Run!",
};

// This grabs the DOM element to be used to mount React components.
var contentNode = document.getElementById("contents");

const Video = (props) => (
  <div className="card" style={{width: "18rem"}}>
    <iframe className="card-img-top" src="https://www.youtube.com/embed/Ej0ZO79Aqxw?rel=0" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    <div className="card-body">
      <h5 className="card-title">{props.video.title}</h5>
      <p className="card-text">Super dope video about the section</p>
      <a href="#" className="btn btn-primary">Go somewhere fun</a>
    </div>
  </div>
);

function Section(props) {
  const CustomHeader = `h${props.section.level}`;
  return (
    <div className="row">
      <CustomHeader>{props.section.line}</CustomHeader>
      <hr/>
      <div className="col-12" style={{"overflowX": "auto"}}>
        {/*<Video key={props.section.index} video={example_video} />*/}
      </div>
      <hr/>
    </div>
  );
}

function WikiPage(props) {
  const sections = props.sections.map(section => (
    <Section key={section.index} section={section} />
  ));
  return (
    <div>{sections}</div>
  );
}

class ContentPage extends React.Component {
  constructor() {
    super();
    this.state = { sections: example_wikipedia_api_res.parse.sections };
  }

  // componentDidMount() {
  //   this.loadData();
  // }

  // loadData() {
  //   let query_url = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=' + state.wiki + '&prop=sections'
  //   fetch(query_url)
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log('Total count of records:',
  //         data._metadata.total_count);

  //       this.setState({ sections: data.records.parse.sections });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }

  render() {
    return (
      <div className="container">
        <h1>Content Page</h1>
        <hr />
        <WikiPage sections={this.state.sections} />
      </div>
    );
  }
}

// This renders the JSX component inside the content node:
ReactDOM.render(<ContentPage />, contentNode);

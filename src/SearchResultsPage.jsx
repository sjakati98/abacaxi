// This grabs the DOM element to be used to mount React components.
var contentNode = document.getElementById("contents");

function Result(props) {
  return (
    <div className="container" style={{paddingBottom: '8px', marginBottom: '12px', borderBottom: "1px solid grey"}}>
      <div className="row">
        <a href={props.result.link} className="col-12"><h2>{props.result.title}</h2></a>
        <p className="col-12">{props.result.desc}</p>
      </div>
    </div>
  );
}

class SearchResultsPage extends React.Component {
  constructor() {
    super();
    this.state = { 
      search: encodeURIComponent("algebra"), // this will be passed via the router in phase 3
      results: null
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    let url = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search="+this.state.search;
    fetch(url).then(response => {
      if (response.ok) {
        response.json().then(data => {
          let results = []
          for(let i=0; i < data[1].length; i++){
            results.push({
              title: data[1][i],
              desc: data[2][i],
              link: data[3][i]
            });
          }
          this.setState({ results: results });
        });
      } else {
        response.json().then(error => {
          alert("Failed to fetch issues:" + error.message)
        });
      }
    }).catch(err => {
      alert("Error in fetching data from server:", err);
    });
  }

  render() {
    let resultComps = <h2>Loading...</h2>
    if(this.state.results === null){
      resultComps = <h2>Loading...</h2>
    } else if (this.state.results.length == 0){
      resultComps = <h2>No results found.</h2>
    } else if(this.state.results.length > 0){
      resultComps = this.state.results.map(result => (
        <Result key={result.title} result={result} />
      ));
    }
    return (
      <div className="container">
        <h1>Results for "{decodeURIComponent(this.state.search)}"</h1>
        <hr />
        {resultComps}
      </div>
    );
  }
}

// This renders the JSX component inside the content node:
ReactDOM.render(<SearchResultsPage />, contentNode);

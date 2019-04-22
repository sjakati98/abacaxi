import React from 'react';
import { Link } from 'react-router';
import Navbar from './components/Navbar.jsx'


function Result(props) {
  return (
    <div className="container" style={{ paddingBottom: '8px', marginBottom: '12px', borderBottom: "1px solid grey" }}>
      <div className="row">
        <Link to={`/wiki/${props.result.wikiPageId}`} className="col-12" ><h3>{props.result.title}</h3></Link>
        <p className="col-12">{props.result.desc}</p>
      </div>
    </div>
  );
}

export default class SearchResultsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: decodeURIComponent(this.props.params.query),
      results: null
    };

    // build api urls for search and query wiki api endpoints
    // - query endpoint allows us to get wiki page id from the page title
    this.wikiAPIBase = "https://en.wikipedia.org/w/api.php?format=json&origin=*";
    this.gen_search_url = (query) => { return `${this.wikiAPIBase}&action=opensearch&search=${encodeURIComponent(query)}`; };
    this.gen_query_url = (title) => { return `${this.wikiAPIBase}&action=query&redirects=1&titles=${title}`; };

    this.handleNavbarSearch = this.handleNavbarSearch.bind(this);
  }

  componentDidMount() {
    this.loadData(this.state.search);
  }

  loadData(query) {
    document.getElementById("navbarSearchFields").setAttribute('disabled', 'disabled')
    fetch(this.gen_search_url(query)).then(response => {
      if (response.ok) {
        response.json().then(parsedata => {
          // handle no search results found
          if (parsedata[1].length == 0) {
            this.setState({ results: [] });
            document.getElementById("navbarSearchFields").removeAttribute('disabled');
            return;
          }

          // get wiki page id for each search result
          let results = [];
          for (let i = 0; i < parsedata[1].length; i++) {
            fetch(this.gen_query_url(parsedata[1][i])).then(response => {
              if (response.ok) {
                response.json().then(querydata => {
                  // add result and update state
                  results.push({
                    title: parsedata[1][i],
                    desc: parsedata[2][i],
                    wikiLink: parsedata[3][i],
                    wikiPageId: Object.keys(querydata.query.pages)[0]
                  });
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

            if (i === parsedata[1].length-1) { document.getElementById("navbarSearchFields").removeAttribute('disabled'); }
          }
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

  handleNavbarSearch(e) {
    e.preventDefault();
    let form = document.forms.navbarSearchForm;
    this.props.router.push({ pathname: '/search/' + encodeURIComponent(form.searchQuery.value) });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.query !== this.state.search) {
      this.loadData(nextProps.params.query);
      this.setState({
        search: decodeURIComponent(nextProps.params.query)
      });
    }
  }

  render() {
    let resultComps = <h2>Loading...</h2>
    if (this.state.results === null) {
      resultComps = <h2>Loading...</h2>
    } else if (this.state.results.length == 0) {
      resultComps = <h2>No results found.</h2>
    } else if (this.state.results.length > 0) {
      resultComps = this.state.results.map(result => (
        <Result key={result.title} result={result} />
      ));
    }
    return (
      <div>
        <Navbar handleNavbarSearch={this.handleNavbarSearch} />
        <div className="container page-contents">
          <h2>Results for "{decodeURIComponent(this.state.search)}"</h2>
          <hr />
          {resultComps}
        </div>
      </div>
    );
  }
}

SearchResultsPage.propTypes = {
  params: React.PropTypes.object.isRequired,
};

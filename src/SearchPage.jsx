// This is a place holder for the initial application state.
const state = [

];

// This grabs the DOM element to be used to mount React components.
var contentNode = document.getElementById("contents");

class MyComponent extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <div id='bigtitle' style={titlestyle}>
          <h1>Abacaxi</h1>
        </div>

        <div id='logo' style={logostyle}>
          <img src='/img/pineapple-512.jpg'></img>
        </div>

        <div id='search-bar' style={searchbarstyle}>
          <form name='search-form'>
            <input type='text' name='search-text' style={searchtextstyle} placeholder='Enter a search term here'/>
            <button id='search-btn'>Search</button>
          </form>
        </div>

      </div>
    );
  }
}

//Manual CSS Styles, need to change later
//TODO: Use stylesheet or more elegant solution for css styling

const titlestyle = {
  'text-align': 'center'
};

const logostyle = {
  'display': 'block',
  'margin-left': 'auto',
  'margin-right': 'auto',
  'width': '25%',
  'height': 'auto',
  'border-radius': '20px'
};

const searchtextstyle = {
  'width': '20%'
}

const searchbarstyle = {
  'text-align': 'center'
}

// This renders the JSX component inside the content node:
ReactDOM.render(<MyComponent />, contentNode);

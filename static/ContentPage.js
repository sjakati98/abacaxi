"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// This is a place holder for the initial application state.
var state = {
  "wiki": "Emu"
};

var example_wikipedia_api_res = {
  "parse": {
    "title": "Emu",
    "pageid": 76894,
    "sections": [{
      "toclevel": 1,
      "level": "2",
      "line": "Taxonomy",
      "number": "1",
      "index": "1",
      "fromtitle": "Emu",
      "byteoffset": 5352,
      "anchor": "Taxonomy"
    }, {
      "toclevel": 2,
      "level": "3",
      "line": "History",
      "number": "1.1",
      "index": "2",
      "fromtitle": "Emu",
      "byteoffset": 5366,
      "anchor": "History"
    }, {
      "toclevel": 2,
      "level": "3",
      "line": "Systematics",
      "number": "1.2",
      "index": "3",
      "fromtitle": "Emu",
      "byteoffset": 11827,
      "anchor": "Systematics"
    }, {
      "toclevel": 1,
      "level": "2",
      "line": "Description",
      "number": "2",
      "index": "4",
      "fromtitle": "Emu",
      "byteoffset": 18083,
      "anchor": "Description"
    }, {
      "toclevel": 1,
      "level": "2",
      "line": "Distribution and habitat",
      "number": "3",
      "index": "5",
      "fromtitle": "Emu",
      "byteoffset": 24592,
      "anchor": "Distribution_and_habitat"
    }, {
      "toclevel": 1,
      "level": "2",
      "line": "Behaviour and ecology",
      "number": "4",
      "index": "6",
      "fromtitle": "Emu",
      "byteoffset": 25788,
      "anchor": "Behaviour_and_ecology"
    }, {
      "toclevel": 2,
      "level": "3",
      "line": "Diet",
      "number": "4.1",
      "index": "7",
      "fromtitle": "Emu",
      "byteoffset": 31241,
      "anchor": "Diet"
    }, {
      "toclevel": 2,
      "level": "3",
      "line": "Breeding",
      "number": "4.2",
      "index": "8",
      "fromtitle": "Emu",
      "byteoffset": 35817,
      "anchor": "Breeding"
    }, {
      "toclevel": 2,
      "level": "3",
      "line": "Predation",
      "number": "4.3",
      "index": "9",
      "fromtitle": "Emu",
      "byteoffset": 47238,
      "anchor": "Predation"
    }, {
      "toclevel": 2,
      "level": "3",
      "line": "Parasites",
      "number": "4.4",
      "index": "10",
      "fromtitle": "Emu",
      "byteoffset": 49674,
      "anchor": "Parasites"
    }, {
      "toclevel": 1,
      "level": "2",
      "line": "Relationship with humans",
      "number": "5",
      "index": "11",
      "fromtitle": "Emu",
      "byteoffset": 50668,
      "anchor": "Relationship_with_humans"
    }, {
      "toclevel": 2,
      "level": "3",
      "line": "Economic value",
      "number": "5.1",
      "index": "12",
      "fromtitle": "Emu",
      "byteoffset": 53622,
      "anchor": "Economic_value"
    }, {
      "toclevel": 2,
      "level": "3",
      "line": "Cultural references",
      "number": "5.2",
      "index": "13",
      "fromtitle": "Emu",
      "byteoffset": 63246,
      "anchor": "Cultural_references"
    }, {
      "toclevel": 1,
      "level": "2",
      "line": "Status and conservation",
      "number": "6",
      "index": "14",
      "fromtitle": "Emu",
      "byteoffset": 68834,
      "anchor": "Status_and_conservation"
    }, {
      "toclevel": 1,
      "level": "2",
      "line": "See also",
      "number": "7",
      "index": "15",
      "fromtitle": "Emu",
      "byteoffset": 71339,
      "anchor": "See_also"
    }, {
      "toclevel": 1,
      "level": "2",
      "line": "Notes",
      "number": "8",
      "index": "16",
      "fromtitle": "Emu",
      "byteoffset": 71471,
      "anchor": "Notes"
    }, {
      "toclevel": 1,
      "level": "2",
      "line": "References",
      "number": "9",
      "index": "17",
      "fromtitle": "Emu",
      "byteoffset": 71499,
      "anchor": "References"
    }, {
      "toclevel": 1,
      "level": "2",
      "line": "External links",
      "number": "10",
      "index": "18",
      "fromtitle": "Emu",
      "byteoffset": 71645,
      "anchor": "External_links"
    }]
  }
};

var thumbnail_url = function thumbnail_url(id) {
  return 'http://i3.ytimg.com/vi/' + id + '/maxresdefault.jpg';
};
var video_url = function video_url(id) {
  return 'https://youtube.com/watch?v=' + id;
};

var example_videos = [{
  "id": "BXpu6tbFCsI",
  "title": "Emu War - OverSimplified (Mini-Wars #4)"
}, {
  "id": "yb2Y2rcgnCw",
  "title": "Emus in the House | Kangaroo Dundee"
}, {
  "id": "QOPZQHTNUs0",
  "title": "The Great Emu War"
}];

// This grabs the DOM element to be used to mount React components.
var contentNode = document.getElementById("contents");

var Video = function Video(props) {
  return React.createElement(
    "div",
    { className: "card", style: { width: "18rem", float: "left", marginRight: "8px" } },
    React.createElement(
      "a",
      { href: video_url(props.video.id) },
      React.createElement("img", { className: "card-img-top", src: thumbnail_url(props.video.id), alt: "Card image cap" })
    ),
    React.createElement(
      "div",
      { className: "card-body" },
      React.createElement(
        "h5",
        { className: "card-title" },
        props.video.title
      ),
      React.createElement(
        "p",
        { className: "card-text" },
        "Super dope video about the section"
      ),
      React.createElement(
        "a",
        { href: "#", className: "btn btn-primary" },
        "Go somewhere fun"
      )
    )
  );
};

function Section(props) {
  var CustomHeader = "h" + props.section.level;
  var videos = example_videos.map(function (video) {
    return React.createElement(Video, { key: video.id, video: video });
  });
  return React.createElement(
    "div",
    { className: "container", style: { paddingBottom: '15px', marginBottom: '15px', borderBottom: "1px solid grey" } },
    React.createElement(
      "div",
      { className: "row" },
      React.createElement(
        CustomHeader,
        null,
        props.section.line
      ),
      React.createElement("hr", null),
      React.createElement(
        "div",
        { className: "col-12", style: { "overflowX": "auto" } },
        videos
      )
    )
  );
}

function WikiPage(props) {
  var sections = props.sections.map(function (section) {
    return React.createElement(Section, { key: section.index, section: section });
  });
  return React.createElement(
    "div",
    null,
    sections
  );
}

var ContentPage = function (_React$Component) {
  _inherits(ContentPage, _React$Component);

  function ContentPage() {
    _classCallCheck(this, ContentPage);

    var _this = _possibleConstructorReturn(this, (ContentPage.__proto__ || Object.getPrototypeOf(ContentPage)).call(this));

    _this.state = { sections: example_wikipedia_api_res.parse.sections };
    return _this;
  }

  _createClass(ContentPage, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "container" },
        React.createElement(
          "h1",
          null,
          "Content Page"
        ),
        React.createElement("hr", null),
        React.createElement(WikiPage, { sections: this.state.sections })
      );
    }
  }]);

  return ContentPage;
}(React.Component);

// This renders the JSX component inside the content node:


ReactDOM.render(React.createElement(ContentPage, null), contentNode);
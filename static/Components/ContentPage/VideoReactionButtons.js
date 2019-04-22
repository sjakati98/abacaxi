"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VideoReactionButtons = function (_React$Component) {
    _inherits(VideoReactionButtons, _React$Component);

    function VideoReactionButtons(props) {
        _classCallCheck(this, VideoReactionButtons);

        var _this = _possibleConstructorReturn(this, (VideoReactionButtons.__proto__ || Object.getPrototypeOf(VideoReactionButtons)).call(this, props));

        _this.state = {
            upvotes: props.upvotes,
            downvotes: props.downvotes,
            click: 0,
            upvoteButtonActive: false,
            downvoteButtonActive: false,
            videoInfo: {
                wikiID: props.wikiID,
                sectionIdx: props.sectionIdx,
                ytID: props.ytID
            }
        };
        _this.handleDownvote = _this.handleDownvote.bind(_this);
        _this.handleUpvote = _this.handleUpvote.bind(_this);
        return _this;
    }

    _createClass(VideoReactionButtons, [{
        key: "handleDownvote",
        value: function handleDownvote(e) {
            e.preventDefault();
            var request = {
                "video": {
                    "wikiPageId": this.state.videoInfo.wikiID,
                    "sectionIdx": this.state.videoInfo.sectionIdx,
                    "ytId": this.state.videoInfo.ytID,
                    "downvote": this.state.click >= 0
                }
            };
            if (this.state.click == 1) {
                request.upvote = false;
            }
            this.setState(function (prevState) {
                return {
                    downvoteButtonActive: !prevState.downvoteButtonActive,
                    click: prevState.click >= 0 ? -1 : 0,
                    downvotes: prevState.click >= 0 ? prevState.downvotes++ : prevState.downvotes--,
                    upvotes: prevState.click == 1 ? prevState.upvotes-- : prevState.upvotes
                };
            });
            fetch('/api/videos', {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });
        }
    }, {
        key: "handleUpvote",
        value: function handleUpvote(e) {
            e.preventDefault();
            var request = {
                "video": {
                    "wikiPageId": this.state.videoInfo.wikiID,
                    "sectionIdx": this.state.videoInfo.sectionIdx,
                    "ytId": this.state.videoInfo.ytID,
                    "upvote": this.state.click >= 0
                }
            };
            if (this.state.click == -1) {
                request.downvote = false;
            }
            this.setState(function (prevState) {
                return {
                    upvoteButtonActive: !prevState.upvoteButtonActive,
                    click: prevState.click <= 0 ? 1 : 0,
                    upvotes: prevState.click <= 0 ? prevState.upvotes++ : prevState.upvotes--,
                    downvotes: prevState.click == -1 ? prevState.downvotes-- : prevState.downvotes
                };
            });
            fetch('/api/videos', {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });
        }
    }, {
        key: "render",
        value: function render() {
            _react2.default.createElement(
                "div",
                { className: "row" },
                _react2.default.createElement(
                    "button",
                    { onClick: this.handleUpvote },
                    "Upvote"
                ),
                _react2.default.createElement(
                    "button",
                    { onClick: this.handleDownvote },
                    "Downvote"
                )
            );
        }
    }]);

    return VideoReactionButtons;
}(_react2.default.Component);

exports.default = VideoReactionButtons;
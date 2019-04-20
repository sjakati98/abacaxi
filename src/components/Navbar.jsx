import React from 'react';
import { Link } from 'react-router';


export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container">
                        <Link to={'/'} className="navbar-brand" >
                            <img src='/img/cool-pineapple.png' width="30" height="30" alt=""></img> Abacaxi
                        </Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                            </ul>
                            <form className="form-inline my-2 my-lg-0" id='navbarSearchForm' onSubmit={this.props.handleNavbarSearch}>
                                <fieldset id="navbarSearchFields" disabled="">
                                    <input id='searchQuery' className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}
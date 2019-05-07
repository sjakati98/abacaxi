import React from 'react';
import InfoModal from './InfoModal.jsx';

export default class SearchForm extends React.Component{
    constructor(props){
        super(props);
        this.props = props;
    }

    render(){
        return(
            <form id='searchForm' onSubmit={this.props.handleSearch}>
                <div className="form-row justify-content-md-center">
                    <div className="col-md-4">
                        <input type='text' id='searchQuery' className="form-control" placeholder='Enter a search term here'/>
                    </div>
                    <button type="submit" id='search-btn' className="btn btn-success">Search</button>
                    <button type="button" className="btn btn-outline-dark" data-toggle="modal" data-target="#howItWorksModal" id="howItWorksBtn">?</button>
                    <InfoModal />
                </div>
            </form>
        );
    }
}
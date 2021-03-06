/**
 * External dependencies
 */
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { requestFeedSearch } from 'state/reader/feed-searches/actions';

class QueryFeedSearch extends Component {
	static propTypes = {
		query: PropTypes.string,
		searchFeeds: PropTypes.func,
	}

	componentWillMount() {
		const { searchFeeds, query } = this.props;
		searchFeeds( query );
	}

	componentWillReceiveProps( nextProps ) {
		const { searchFeeds, query } = nextProps;
		searchFeeds( query );
	}

	render() {
		return null;
	}
}

export default connect( null, { requestFeedSearch } )( QueryFeedSearch );

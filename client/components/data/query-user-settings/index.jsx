/**
 * External dependencies
 */
import { Component } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { isFetchingUserSettings } from 'state/user-settings/selectors';
import { fetchUserSettings } from 'state/user-settings/actions';

class QueryUserSettings extends Component {
	componentWillMount() {
		if ( ! this.props.fetchingUserSettings ) {
			this.props.fetchUserSettings();
		}
	}

	render() {
		return null;
	}
}

export default connect(
	( state ) => ( { fetchingUserSettings: isFetchingUserSettings( state ) } ),
	{ fetchUserSettings }
)( QueryUserSettings );

/**
 * External dependencies
 */
import page from 'page';
import React from 'react';

/**
 * Internal dependencies
 */
import { renderWithReduxStore } from 'lib/react-helpers';
import TrafficMain from 'my-sites/site-settings/traffic/main';
import sitesFactory from 'lib/sites-list';

const sites = sitesFactory();

const upgradeToBusiness = () => {
	const site = sites.getSelectedSite();
	if ( site ) {
		page( '/checkout/' + site.domain + '/business' );
	}
};

export default {
	traffic( context ) {
		renderWithReduxStore(
			React.createElement( TrafficMain, {
				...{ sites, upgradeToBusiness }
			} ),
			document.getElementById( 'primary' ),
			context.store
		);
	}
};

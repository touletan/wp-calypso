/** @format */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal Dependencies
 */
import CompactCard from 'components/card';
import EmptyContent from 'components/empty-content';
import getSites from 'state/selectors/get-sites';
import Main from 'components/main';
import MeSidebarNavigation from 'me/sidebar-navigation';
import PageViewTracker from 'lib/analytics/page-view-tracker';
import PendingListItem from './pending-list-item';
import PurchasesHeader from '../purchases/purchases-list/header';
import PurchasesSite from '../purchases/purchases-site';
import { getCurrentUserId } from 'state/current-user/selectors';
import { getHttpData, requestHttpData } from 'state/data-layer/http-data';
import { http } from 'state/data-layer/wpcom-http/actions';

export const requestId = userId => `pending-purchases/${ userId }`;

export const requestPendingPurchases = userId => {
	return requestHttpData(
		requestId( userId ),
		http( {
			path: '/me/purchases/pending',
			apiVersion: '1.1',
			method: 'POST',
			body: { userId },
		} ),
		{
			fromApi: () => purchases => [ [ requestId( userId ), purchases ] ],
			freshness: -Infinity,
		}
	);
};

export const requestShoppingCart = siteId => {
	return requestHttpData(
		requestId( siteId ),
		http( {
			path: `/me/shopping-cart/${ siteId }_redirect`,
			apiVersion: '1.1',
			method: 'POST',
			body: {},
		} ),
		{
			fromApi: () => carts => [ [ requestId( siteId ), carts ] ],
			freshness: -Infinity,
		}
	);
};

class PendingPurchases extends Component {
	componentDidMount = () => {
		requestPendingPurchases( this.props.userId );
	};

	render() {
		const { loading, error, pendingPurchases, translate } = this.props;

		let content;

		if ( loading ) {
			content = <PurchasesSite isPlaceholder={ true } />;
		} else if ( ! loading && ! pendingPurchases.length ) {
			content = (
				<CompactCard className="pending-purchases__no-content">
					<EmptyContent
						title={ translate( 'Looking to upgrade?' ) }
						line={ translate(
							'Our plans give your site the power to thrive. ' + 'Find the plan that works for you.'
						) }
						action={ translate( 'Upgrade Now' ) }
						actionURL={ '/plans' }
						illustration={ '/calypso/images/illustrations/illustration-nosites.svg' }
					/>
				</CompactCard>
			);
		} else if ( ! loading && pendingPurchases.length ) {
			content = (
				<div>
					{ pendingPurchases.map( purchase => (
						<PendingListItem key={ purchase.siteId } purchase={ purchase } />
					) ) }
				</div>
			);
		}

		return (
			<Main className="pending-purchases">
				<PageViewTracker path="/me/purchases/pending" title="Pending Purchases" />
				<MeSidebarNavigation />
				<PurchasesHeader section="pending" />
				{ content }
			</Main>
		);
	}
}

PendingPurchases.propTypes = {
	userId: PropTypes.number.isRequired,
	sites: PropTypes.array.isRequired,
	pendingPurchases: PropTypes.array.isRequired,
	loading: PropTypes.bool,
	error: PropTypes.object,
};

export default connect( state => {
	const userId = getCurrentUserId( state );
	const sites = getSites( state );

	//const response = getHttpData( requestId( userId ) );
	// console.log( userId );
	// console.log( sites );
	const response = {
		state: 'success',
		error: null,
		data: [
			{
				siteId: sites[ 0 ].ID,
				siteSlug: sites[ 0 ].slug,
				purchaseId: 123,
				productId: sites[ 0 ].plan.product_id,
				productName: sites[ 0 ].plan.product_name_short,
				productSlug: sites[ 0 ].plan.product_slug,
				isDomainRegistration: false,
				paymentType: 'wechat',
			},
		],
	};

	return {
		userId,
		sites,
		pendingPurchases: response.data || [],
		loading: response.state === 'uninitialized' || response.state === 'pending',
		error: response.error,
	};
} )( localize( PendingPurchases ) );

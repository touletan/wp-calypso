/** @format */
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import CompactCard from 'components/card/compact';
import { getName, purchaseType } from 'lib/purchases';
import PurchaseIcon from '../purchases/purchase-icon';
import { managePending } from '../purchases/paths';

function paymentType( purchase ) {
	return 'wechat';
}

class PendingListItem extends Component {
	render() {
		const { isDisconnectedSite, purchase, isJetpack } = this.props;

		let onClick;
		let href;
		// A "disconnected" Jetpack site's purchases may be managed.
		// A "disconnected" WordPress.com site may not (the user has been removed).
		//if ( ! isDisconnectedSite || isJetpack ) {
		onClick = () => window.scrollTo( 0, 0 );
		href = managePending( this.props.purchase.siteSlug, this.props.purchase.siteId );
		//}

		return (
			<CompactCard
				className={ 'pending-purchases__list-item' }
				data-e2e-connected-site={ ! isDisconnectedSite }
				href={ href }
				onClick={ onClick }
			>
				<span className="pending-purchases__list-item-wrapper">
					<PurchaseIcon purchase={ purchase } />
					<div className="pending-purchases__list-item-details">
						<div className="pending-purchases__list-item-title">{ getName( purchase ) }</div>
						<div className="pending-purchases__list-item-purchase-type">
							{ purchaseType( purchase ) }
						</div>
						<div className="pending-purchases__list-item-purchase-date">
							{ paymentType( purchase ) }
						</div>
					</div>
				</span>
			</CompactCard>
		);
	}
}

PendingListItem.propTypes = {
	isPlaceholder: PropTypes.bool,
	purchase: PropTypes.object,
	slug: PropTypes.string,
	isJetpack: PropTypes.bool,
};

export default localize( PendingListItem );

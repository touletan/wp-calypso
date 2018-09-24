/**
 * External dependencies
 */
import React from 'react';


/**
 * Internal dependencies
 */

/**
 * A Fobber for fobbing
 *
 * @export
 * @param {*} props The props to use
 * @returns {React.ReactElement} a rendered Fobber
 */
export default function Fobber( props ) {
	return <div className="muriel frobber">{ props.children }</div>;
}

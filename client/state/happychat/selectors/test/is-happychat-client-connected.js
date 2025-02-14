import deepFreeze from 'deep-freeze';
import {
	HAPPYCHAT_CONNECTION_STATUS_UNINITIALIZED,
	HAPPYCHAT_CONNECTION_STATUS_CONNECTED,
	HAPPYCHAT_CONNECTION_STATUS_DISCONNECTED,
	HAPPYCHAT_CONNECTION_STATUS_CONNECTING,
	HAPPYCHAT_CONNECTION_STATUS_RECONNECTING,
} from 'calypso/state/happychat/constants';
import isHappychatClientConnected from '../is-happychat-client-connected';

describe( '#isHappychatClientConnected', () => {
	it( 'should return false for UNINITIALIZED', () => {
		const stateUnitialized = deepFreeze( {
			happychat: {
				connection: {
					status: HAPPYCHAT_CONNECTION_STATUS_UNINITIALIZED,
				},
			},
		} );
		expect( isHappychatClientConnected( stateUnitialized ) ).toBe( false );
	} );

	it( 'should return true for CONNECTED', () => {
		const stateConnected = deepFreeze( {
			happychat: {
				connection: {
					status: HAPPYCHAT_CONNECTION_STATUS_CONNECTED,
				},
			},
		} );
		expect( isHappychatClientConnected( stateConnected ) ).toBe( true );
	} );

	it( 'should return false for DISCONNECTED', () => {
		const stateDisconnected = deepFreeze( {
			happychat: {
				connection: {
					status: HAPPYCHAT_CONNECTION_STATUS_DISCONNECTED,
				},
			},
		} );
		expect( isHappychatClientConnected( stateDisconnected ) ).toBe( false );
	} );

	it( 'should return false for CONNECTING', () => {
		const stateConnecting = deepFreeze( {
			happychat: {
				connection: {
					status: HAPPYCHAT_CONNECTION_STATUS_CONNECTING,
				},
			},
		} );
		expect( isHappychatClientConnected( stateConnecting ) ).toBe( false );
	} );

	it( 'should return false for RECONNECTING', () => {
		const stateReconnecting = deepFreeze( {
			happychat: {
				connection: {
					status: HAPPYCHAT_CONNECTION_STATUS_RECONNECTING,
				},
			},
		} );
		expect( isHappychatClientConnected( stateReconnecting ) ).toBe( false );
	} );
} );

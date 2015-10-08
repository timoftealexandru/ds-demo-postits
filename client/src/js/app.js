( function( deepstream, $ ) {

	function login() {
		var ds = deepstream( '192.168.0.201:6020' );
		ds.login( {}, function( success, errorEvent, errorMessage ) {
			if( success ) {
				var isDesktop = $( window ).width() > 800;
				new PostitBoard( ds, isDesktop );	
			} else {
				alert( 'Fail to login.' );
			}		
		} );

		ds.on( 'error', function( error ) {
			console.log( 'Error occured', error );
		} );
	}

	$( document ).ready( login );

} )( deepstream, jQuery );
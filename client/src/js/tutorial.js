( function( $ ) {

	function onReady() {
		$( '.menu-button' ).click( function() {
			$( 'body' ).toggleClass( 'menu-open' );
		} );

		$( '.menu-item' ).click( function() {
			$( '.menu-item.selected' ).removeClass( 'selected' );
			$( this ).addClass( 'selected' );
			$( '.tut' ).hide();

			var selectedTut = $( event.target ).attr( 'data-value' );
			$( '#' + selectedTut ).show();
		} );

		$( '#tut-server' ).show();

	}

	$( document ).ready( onReady );

} )( jQuery );
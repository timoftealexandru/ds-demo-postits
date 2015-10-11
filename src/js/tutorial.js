( function( $ ) {

	function toggleMenu( menuVisible ) {
		$( 'body' ).toggleClass( 'menu-open', menuVisible );
	}
	
	function togglePresentation( presentationVisible ) {
		$( '.presentation' ).toggle( presentationVisible );
	}

	function selectItem( target ) {
		$( '.menu-item.selected' ).removeClass( 'selected' );
		$( target ).addClass( 'selected' );
		$( '.tut' ).hide();

		var selectedTut = target.attr( 'data-value' );
		$( '#' + selectedTut ).show();
	}

	/**
	 * This is the application tab
	 */
	var slide = 3;
	function onKeyDown( e ) {
		var datanav = $( '[data-nav]' );
		
		if( e.keyCode === 33 && slide > 0 ) {		
			slide--;
		} else if( e.keyCode === 34 && slide < datanav.length - 1) {
			slide++;
		} else {
			return;
		}

		console.log( 'Showing slide: ', slide );
			
		var element = $( datanav[ slide ] );
		$( '.presentation-slide' ).hide();
		
		/**
		 * Presentation mode
		 */
		if( slide < 3 ) {
			togglePresentation( true );
			toggleMenu( false );
			element.show();
		} 
		/**
		 * Tutorial mode
		 */
		else if( slide > 3 ) {
			toggleMenu( true );
			selectItem( element );
		} 
		/**
		 * App mode
		 */
		else {
			toggleMenu( false );
			togglePresentation( false );
		}

		e.preventDefault();	
		return false;
	}

	function onReady() {
		var menuOpen = false;

		$( '.menu-button' ).click( function() {
			menuOpen = !menuOpen;
			toggleMenu( menuOpen );
		} );

		$( '.menu-item' ).click( function( event ) {
			slide = $( '[data-nav]' ).get().indexOf( event.target );
			selectItem( $( event.target ) );
		} );

		/**
		 * This code is used for presentation purposes
		 */
		$( document.body ).keydown( onKeyDown ); 	

		if( window.location.href.indexOf( 'presentation' ) > -1 ) {
			slide = 0;
			togglePresentation( true );
			$('[data-nav]:first' ).show();
		}
	}

	$( document ).ready( onReady );

} )( jQuery );
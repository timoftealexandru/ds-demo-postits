( function( $ ) {

	function onReady() {
		var menuOpen = false;
		$( '.menu-button' ).click( function() {
			$( 'body' ).toggleClass( 'menu-open' );
			menuOpen = !menuOpen;
		} );

		function selectItem( target ) {
			$( '.menu-item.selected' ).removeClass( 'selected' );
			$( target ).addClass( 'selected' );
			$( '.tut' ).hide();

			var selectedTut = target.attr( 'data-value' );
			$( '#' + selectedTut ).show();
		}

		$( '.menu-item' ).click( function( event ) {
			slide = datanav.get().indexOf( event.target );
			selectItem( $( event.target ) );
		} );

		var slide = 0;
		var datanav = $('[data-nav]' );
		$( document.body ).keydown( function( e ) {
			if( e.keyCode === 33 || e.keyCode === 34 ) {
				if( e.keyCode === 33 && slide > 0 ) {
					slide--;
				}
				if( e.keyCode === 34 && slide < datanav.length - 1 ) {
					slide++;
				}

				console.log( 'Selecting slide: ', slide );
				var element = $( datanav[ slide ] );
				$( '.presentation-slide' ).hide();
				if( slide === 3 ) {
					$( '.presentation' ).hide();
					if( menuOpen ) {
						$( '.menu-button' ).click();
					}
				} 
				else if( slide > 3 ) {
					if( !menuOpen ) {
						$( '.menu-button' ).click();
					}
					selectItem( element );
				} else {
					$( '.presentation' ).show();
					if( menuOpen ) {
						$( '.menu-button' ).click();
					}
					element.show();
				}

				e.preventDefault();	
				return false;
			}
		} ); 	

		if( window.location.href.indexOf( 'presentation' ) > -1 ) {
			$( $('[data-nav]' ).get( 0 ) ).show();
		}
	}

	$( document ).ready( onReady );

} )( jQuery );
function PostitBoard( ds, isDesktop ) {
	this.ds = ds;
	this.existingEntries = [];
	this.board = $( '.board' );
	
	this.isDesktop = isDesktop;
	if( this.isDesktop ) {
		this.enableDragAdding();
	} else {
		this.enableClickAdding();
	}

	this.stickyList = this.ds.record.getList( 'room/postits' );
	this.stickyList.setEntries([])
	this.stickyList.subscribe( this.onPostitsChanged.bind( this ) );
	this.stickyList.whenReady( this.onPostitsChanged.bind( this ) );
}

PostitBoard.prototype.onPostitsChanged = function() {
	var postit;
	var record;

	this.stickyList.subscribe( function() {
		entries = this.stickyList.getEntries();
		for( var i=0; i < entries.length; i++ ) {
			if( this.existingEntries.indexOf( entries[ i ] ) === -1 ) {
				this.existingEntries.push( entries[ i ] );

				record = this.ds.record.getRecord( entries[ i ] );
				record.whenReady( function( record ) {
					postit = new Postit( record, this.isDesktop  );
					this.board.append( postit.getElement());
				}.bind( this ) );
			}
		}
	}.bind( this ) );
};

PostitBoard.prototype.addItem = function( properties ) {
	var newPostitID = this.ds.getUid();
	var newPostit = this.ds.record.getRecord( newPostitID );
	newPostit.set( properties );
	this.stickyList.addEntry( newPostitID );
};

PostitBoard.prototype.enableDragAdding = function() {
	$( ".small-sticky-note" ).draggable( {
		helper: "clone",
		stop: function( event, ui ) {
			this.addItem( {
				position: {
					left: ui.offset.left,
					top: ui.offset.top,	
				},
				content: '',
				type: ui.helper.attr( 'data-type' )
			} );
		}.bind( this )
	} );
};

PostitBoard.prototype.enableClickAdding = function() {
	$( ".small-sticky-note" ).click( function( e ) {
		this.addItem( {
			position: {
				left: 0,
				top: 0
			},
			content: '',
			type: $( e.currentTarget ).attr( 'data-type' )
		} );
		$( window ).scrollTop( this.board.height() + 100 );
	}.bind( this ) );
};
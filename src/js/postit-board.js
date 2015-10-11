function PostitBoard( ds, isDesktop ) {
	this.ds = ds;
	this.boardElement = $( '.board' );
	
	this.isDesktop = isDesktop;
	if( this.isDesktop ) {
		this.enableDragAdding();
	} else {
		this.enableClickAdding();
	}

	this.stickyList = this.ds.record.getList( 'postits/example-board' );
	this.stickyList.on( 'entry-added', this.onPostitAdded.bind( this ) );
	this.stickyList.whenReady( this.onPostitsLoaded.bind( this ) );
}

PostitBoard.prototype.onPostitsLoaded = function() {
	var entries = this.stickyList.getEntries();
	for( var i=0; i < entries.length; i++ ) {
		this.onPostitAdded( entries[ i ] );
	}
};

PostitBoard.prototype.onPostitAdded = function( postitID ) {
	var record = this.ds.record.getRecord( postitID );
	record.whenReady( function( record ) {
		var postit = new Postit( record, this.isDesktop  );
		this.boardElement.append( postit.getElement());
	}.bind( this ) );
};

PostitBoard.prototype.addItem = function( properties ) {
	var newPostitID = this.ds.getUid();
	var newPostit = this.ds.record.getRecord( newPostitID );
	newPostit.set( properties );
	this.stickyList.addEntry( newPostitID );
};

PostitBoard.prototype.enableDragAdding = function() {
	$( '.small-sticky-note' ).draggable( {
		helper: 'clone',
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
	$( '.small-sticky-note' ).click( function( e ) {
		this.addItem( {
			position: {
				left: 0,
				top: 0
			},
			content: '',
			type: $( e.currentTarget ).attr( 'data-type' )
		} );
		$( window ).scrollTop( this.boardElement.height() + 100 );
	}.bind( this ) );
};
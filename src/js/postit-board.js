function PostitBoard( ds, isDesktop ) {
	this.ds = ds;
	this.boardElement = $( '.board' );
	this.postits = {};

	this.isDesktop = isDesktop;
	if( this.isDesktop ) {
		this.enableDragAdding();
		$( '.eraser' ).click( this.clearBoard.bind( this ) );
	} else {
		this.enableClickAdding();
	}

	this.postitList = this.ds.record.getList( 'postits/example-board' );
	this.postitList.on( 'entry-added', this.onPostitAdded.bind( this ) );
	this.postitList.on( 'entry-removed', this.onPostitRemoved.bind( this ) );
	this.postitList.whenReady( this.onPostitsLoaded.bind( this ) );
}

PostitBoard.prototype.clearBoard = function() {
	//This only does a soft clear
	this.postitList.setEntries( [] );
};

PostitBoard.prototype.onPostitsLoaded = function() {
	var entries = this.postitList.getEntries();
	for( var i=0; i < entries.length; i++ ) {
		this.onPostitAdded( entries[ i ] );
	}
};

PostitBoard.prototype.onPostitAdded = function( postitID ) {
	var record = this.ds.record.getRecord( postitID );
	record.whenReady( function( record ) {
		this.postits[ postitID ] = new Postit( record, this.isDesktop  );
		this.boardElement.append( this.postits[ postitID ].getElement());
	}.bind( this ) );
};

PostitBoard.prototype.onPostitRemoved = function( postitID ) {
	this.postits[ postitID ].destroy();
};

PostitBoard.prototype.addItem = function( properties ) {
	var newPostitID = this.ds.getUid();
	var newPostit = this.ds.record.getRecord( newPostitID );
	newPostit.whenReady( function( record ) {
		record.set( properties );
		this.postitList.addEntry( newPostitID );
	}.bind( this ) );
};

PostitBoard.prototype.enableDragAdding = function() {
	$( '.small-postit' ).draggable( {
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
	function addPostit( type, e) {
		this.addItem( {
			position: this.getRandomPosition(),
			content: '',
			type: type
		} );
		$( window ).scrollTop( this.boardElement.height() + 100 );
	}
	$( '.small-postit[data-type="mad"]' ).click( addPostit.bind( this, 'mad' ));
	$( '.small-postit[data-type="sad"]' ).click( addPostit.bind( this, 'sad' ));
	$( '.small-postit[data-type="happy"]' ).click( addPostit.bind( this, 'happy' ));
};

PostitBoard.prototype.getRandomPosition = function() {
	return {
		top: getRandomInt( 0, 800 ),
		left: getRandomInt( 300, 1000 )
	};
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var template = 
	'<div class="sticky-note large-sticky-note">' +
	  '<div class="sticky-note-header">' +
	  '</div>' +
	  '<div class="sticky-note-inner">' +
	    '<textarea class="sticky-note-copy"></textarea>' +
	  '</div>' +
	'</div>';

function Postit( record, isDesktop ) {
	this.element = $( template );
	this.textArea = this.element.find( '.sticky-note-copy' );

	this.record = record;

	this.createPostit();
	this.addContent();
	isDesktop && this.addPositioning();
}

Postit.prototype.createPostit = function() {
	this.element
		.attr( 'id', this.record.name )
		.attr( 'data-type', this.record.get( 'type' ) );
};

Postit.prototype.addContent = function() {
	this.record.subscribe( 'content', function( value ) {
		this.textArea.val( value );
	}.bind( this ), true );

	this.textArea.keyup( function() {
		this.record.set( 'content', this.textArea.val() );
	}.bind( this ) );
};

Postit.prototype.addPositioning = function() {
	this.element
		.css( 'position', 'absolute' )
		.draggable( {
			handle: ".sticky-note-header",
			drag: function( event, ui ) {	
				this.record.set( 'position', {
					top: ui.position.top,
					left: ui.position.left
				} ); 		
			}.bind( this )
		} );

	this.record.subscribe( 'position', function( position ) {
		if( position ) {
			this.element.css( {
				left: position.left,
				top: position.top
			} );	
		}
	}.bind( this ), true );
};

Postit.prototype.getElement = function() {
	return this.element;
};
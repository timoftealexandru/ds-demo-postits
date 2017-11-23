var template =
	'<div class="postit large-postit">' +
	  '<div class="postit-header">' +
		'<button class="postit-sync"> Sync </button>' +
	  '</div>' +
	  '<div class="postit-inner">' +
	    '<textarea class="postit-copy"></textarea>' +
	  '</div>' +
	'</div>';

function Postit( recordFactory, record, isDesktop ) {
	this.element = $( template );
	this.textArea = this.element.find( '.postit-copy' );
	this.syncButton = this.element.find('.postit-sync');

	this.recordFactory = recordFactory;
	this.record = record;

	record.on('error', function(description, event, topic) {
		this.textArea.prop('disabled', true)
		this.textArea.prop('style', 'background: red; border: 1px dotted black')
		console.log('Record ', postitID, 'error:', description, event, topic)
	}.bind( this ) )

	this.syncButton.on('click', function() {
		this.syncButton.prop('disabled', true)
		this.recordFactory.snapshot(this.record.name)
			.then(function(data) {
				alert('Synced')
				console.log(data)
				this.syncButton.prop('disabled', false)
				this.textArea.val(data.content)
			}.bind( this ))
			.catch(function(err) {
				this.textArea.prop('disabled', true)
				this.textArea.prop('style', 'background: red; border: 1px dotted black')
				this.element.find('.postit-header').append('<p> Error:' + new String(err) + '</p>')
			}.bind( this ))

	}.bind(this))

	this.createPostit();
	this.addContent();
	isDesktop && this.addPositioning();
}

Postit.prototype.createPostit = function() {
	this.element
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
			handle: ".postit-header",
			zIndex: 999,
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

Postit.prototype.destroy = function() {
	this.element.remove();
};
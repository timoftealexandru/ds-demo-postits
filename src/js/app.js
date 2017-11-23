( function( deepstream, $ ) {
	var deepstreamClient = deepstream.deepstream

	function login() {

		PostitBoard.prototype.isOnline = function() {
			return this.isConnected;
		}

		PostitBoard.prototype.goOffline = function() {
			this.ds.close()
			this.isConnected = false
		}

		PostitBoard.prototype.goOnline = function() {
			this.ds = deepstreamClient( 'localhost:6020' )
			this.ds.login({})
				.then(function () {
					alert('re-connected')
					this.isConnected = true

					for (var postitId in this.postits) {
						if (this.postits.hasOwnProperty(postitId)) {
							this.postits[postitId].record = this.ds.record.getRecord(postitId);
							this.postits[postitId].recordFactory = this.ds.record
						}
					}

				}.bind( this ) )
				.catch(function (error) {
					alert('Failed to re-login')
				})
		}

		var ds = deepstreamClient( 'localhost:6020' );

		ds.login({})
			.then(function() {
				var isDesktop = $( window ).width() > 800;
				var board = new PostitBoard( ds, isDesktop );

				var goOnlineButton = $( document ).find('button#go-online')
				var goOfflineButton = $( document ).find('button#go-offline')

				goOnlineButton.on('click', function(board) {
					if (!board.isOnline()) {
						board.goOnline()
						goOfflineButton.prop('disabled', false)
						goOnlineButton.prop('disabled', true)
					}
				}.bind(null, board))

				goOfflineButton.on('click', function(board) {
					if (board.isOnline()) {
						board.goOffline()
						goOfflineButton.prop('disabled', true)
						goOnlineButton.prop('disabled', false)
					}
				}.bind(null, board))
			})
			.catch(function (error) {
				alert( 'Failed to login.' );
			})

		ds.on( 'error', function( error, event, topic ) {
			console.log( 'An error occured', error, event, topic );
		} );
	}

	$( document ).ready( login );

} )( deepstream, jQuery );
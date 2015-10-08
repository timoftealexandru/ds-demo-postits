var DeepstreamServer = require( 'deepstream.io' );
var server = new DeepstreamServer();

server.set( 'host', '192.168.0.201' );
server.set( 'port', 6020 );

server.start();
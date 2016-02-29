// Use the Singleton pattern
// to make sure that only one Client object exists
var Client;

(function () {
  var instance;
  Client = function Client() {
    if (instance) {
      return instance;
    }

    // Set the instance variable and return it onwards
    instance = this;

    // Connect websocket to Server
    //this.connect();
    //console.log("Client started");
  };
}()); 

/* Nome */
Client.prototype.setName = function( name ) {
	this.name = name;
}

Client.prototype.getName = function() {
	return this.name;
}
/* Nome */

/* Id */
Client.prototype.setId = function( id ) {
	this.id = id;
}

Client.prototype.getId = function() {
	return this.id;
}
/* Id */

Client.prototype.connect = function() {
  var connString = config.protocol + config.domain + ':' + config.clientport;

  console.log("Websocket connection string:", connString, config.wsclientopts);

  var self = this;
  self.markets=[];

  this.socket = io.connect(connString, config.wsclientopts);

  // Handle error event
  this.socket.on('error', function (err) {  
    console.log("Websocket 'error' event:", err);
  });

  // Handle connection event
  this.socket.on('connect', function () { 
    console.log("Websocket 'connected' event with params:", self.socket);
    //document.getElementById('top').innerHTML = "Conectado!";
  });

  // Handle disconnect event
  this.socket.on('disconnect', function () {
    console.log("Websocket 'disconnect' event");
    //document.getElementById('top').innerHTML = "Disconnected.";
  });

// OWN EVENTS GO HERE...

  // Listen for server event
  this.socket.on('hello', function (data) {
    console.log("Tu id ", data.id);
    self.setId( data.id ); 
    // Start heartbeat timer
    self.heartbeat(self); 
  });

	
  // pong to our ping
  this.socket.on('getClientes', function (data) {
    
/*

{
	socket:socket ,
	id:socket.id ,
	name: data.name, 
	latitud: data.latitud, 
	longitud: data.longitud
	status: _STATUS_ACTUALIZADO 	
			
}		
	  
*/	  
	
	  
	  if(data.pingtime == self.pingtime) {
    			  
		self.tiempoRespuesta = Date.now() - self.pingtime + " milisegundos";
		var clientesFormatada = '';
		for( var i=0; i<data.clientes.length ; i++ ){
			
			clientesFormatada += '<br>--------------------------------------------<br>';
			clientesFormatada += ' - id : ' + data.clientes[i].id + '<br>';
			clientesFormatada += ' - name : ' + data.clientes[i].name + '<br>';
			clientesFormatada += ' - latitud : ' + data.clientes[i].latitud + '<br>';
			clientesFormatada += ' - longitud : ' + data.clientes[i].longitud + '<br>';
			clientesFormatada += ' - status : ' +  data.clientes[i].status + '<br>';	
			
			/* Adiciona o actuliza los makers en el mapa */
			//var index = self.markets.indexOf( data.clientesInfo[i].name );
			/*
			if( ! self.markets[ data.clientes[i].id ] ){
				self.markets[ data.clientes[i].id ] = mapa.addMaker( data.clientes[i].latitud , data.clientes[i].longitud , data.clientes[i].name );
			}else{
				mapa.changePosition( self.markets[ data.clientes[i].id ] , data.clientes[i].latitud , data.clientes[i].longitud );
			}
			*/
			/* Adiciona o actuliza los makers en el mapa */
					
		}
		
		/* Limpio */
		/* deleteMaker */
		var idsDel=[];
		for (var idSckt in self.markets) {
			//alert(self.markets[idSckt]);
			var existe = false;
			for( var x=0; x<data.clientes.length ; x++ ){
				if( idSckt == data.clientes[x].id )
					existe = true;
			}
			if( !existe && idSckt !=  self.getId ){ // si no existe y es diferente de mi id lo borro
				mapa.deleteMaker( self.markets[idSckt] ); // aqui solo borro el maker contenido en el array
				idsDel.push( idSckt );
			}
		}
		/* ids borrados*/
		for( var y=0; y<idsDel.length ; y++ ){
			delete self.markets[ idsDel[y] ];
		}
		/* deleteMaker */
					
		  
		console.log( clientesFormatada );
	}else {
		console.log("pong failed:", data.pingtime, self.pingtime);
	}
  });

};

// Keep pinging and ponging with server
Client.prototype.heartbeat = function (self) {
	
	function getLocation() {
		/*
		watchID = navigator.geolocation.watchPosition(function(position){
			console.log(JSON.stringify( position, null, 4 ));
			self.latitud = position.latLng.lat;
			self.longitud = position.latLng.lng; 			
		}, onError, optsLocation ); 
		*/
		
		map.getMyLocation( optsLocation , function(position){
			console.log(JSON.stringify( position, null, 4 ));
			self.latitud = position.latLng.lat;
			self.longitud = position.latLng.lng; 			
		}, onError);
		/* */
		
	}

	// Create heartbeat timer,
	// the third param 'self' is not supported in IE9 and earlier 
	var tmo = setTimeout(self.heartbeat, config.heartbeattmo, self); 
  	if(self.latitud && self.longitud){
  		self.pingtime = Date.now();

		/* cargo el mapa en la posicion que se encuentra el cliente 
		if( ! self.loaded ){
			console.log(self.latitud);
			mapa.loadApi( self.latitud , self.longitud );
			self.loaded = true;
		}
  		*/
		/* envia */
  		self.socket.emit('setCliente', {
  				pingtime: self.pingtime, 
				latitud : self.latitud ,
				longitud : self.longitud ,
				name : self.getName() 
		});  		
  		
	}
  	getLocation();
};
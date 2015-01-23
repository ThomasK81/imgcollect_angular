var NewCtrl = [
'$scope',
'urnServ',
'json',
'stdout',
'user',
'onto',
function( $scope, urnServ, json, stdout, user, onto ){
  
  // Update data
  
  $scope.json = {};
  $scope.ready = false;
  
  // Build CITE URN 
  
  $scope.id = null;
  $scope.urn = '';
  $scope.base_urn = urnServ.base;
  
  $scope.urn_build = function(){
    $scope.urn = $scope.base_urn+$scope.clean_id()
  }
  
  $scope.clean_id = function(){ 
	  return $scope.id.alphaOnly().toLowerCase() 
  }
  
  $scope.init = function( edit_fields ){ 
	  init(edit_fields) 
  }
  
  // Output messages
  
  $scope.stdout = "";
  $scope.saving = false;
    
  
  // Path to default JSON
  
  $scope.src = 'default/'+$scope.type+'.json';
  
  
  // Claim JackSON data url and CITE URN
  
  $scope.claim = function( urn ){
    urnServ.claim( $scope.data_path( urn ), urn ).then(
      function( data ){ 
        stdout.log( data );
        default_json();
      }
    );
  }
  
  
  // Build the data path URL
  
  $scope.data_path = function( urn ){
    return $scope.type+'/'+urn
  }
  
  
  // Save the default after writing the most basic values
  
  var save = function(){
  	touch();
  	$scope.saving = true;
  	json.put( $scope.data_path( $scope.urn ), $scope.json ).then(
  	function( data ){
	  stdout.log( data );
	  setTimeout( function(){
        $scope.saving = false;
	  }, 5000 );
	  $scope.ready = true;
  	});
  }
  
  
  // Set basic values
  
  var touch = function(){
  	$scope.json['@id'] = $scope.urn;
  	$scope.json['user']['@id'] = 'user:'+user.id();
  	$scope.json['dateTime'] = ( new TimeStamp ).xsd();
  }
  
  
  // Load the default JSON data
  
  var default_json = function(){
  	json.get( $scope.src ).then(
  	function( data ){
  		$scope.json = data;
  		stdout.log( "Default JSON loaded from: "+$scope.src );
  		save();
  	});
  }
  
  
  // Run when controller is initialized
  // @param [Array] editable fields for this item
  function init( edit_fields ){
    $scope.edit_text_fields = edit_fields;
  }
  
}];
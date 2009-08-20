/*
*	xhr.js
*/
$debug("Initializing Window XMLHttpRequest.");
// XMLHttpRequest
// Originally implemented by Yehuda Katz
$w.XMLHttpRequest = function(){
	this.headers = {};
	this.responseHeaders = {};
	$debug("creating xhr");
};

XMLHttpRequest.prototype = {
	open: function(method, url, async, user, password){ 
		this.readyState = 1;
		if (async === false ){
			this.async = false;
		}else{ this.async = true; }
		this.method = method || "GET";
		this.url = $env.location(url);
		this.onreadystatechange();
	},
	setRequestHeader: function(header, value){
		this.headers[header] = value;
	},
	send: function(data){
		var _this = this;
		
		function makeRequest(){
			$env.connection(_this, function(){
			  var responseXML = null;
				_this.__defineGetter__("responseXML", function(){
      				if ( _this.responseText.match(/^\s*</) ) {
      				  if(responseXML){
      				      return responseXML;
      				      
  				      }else{
        					try {
        					    $debug("parsing response text into xml document");
        						responseXML = $domparser.parseFromString(_this.responseText+"");
                                return responseXML;
        					} catch(e) { 
                                $error('response XML does not apear to be well formed xml', e);
        						responseXML = $domparser.parseFromString("<html>"+
                                    "<head/><body><p> parse error </p></body></html>");
                                return responseXML;
                            }
      					}
      				}else{
                        $env.warn('response XML does not apear to be xml');
                        return null;
                    }
      			});
                _this.__defineSetter__("responseXML",function(xml){
                    responseXML = xml;
                });
			}, data);
			_this.onreadystatechange();
		}
		if (this.async){
		    $debug("XHR sending asynch;");
			$env.runAsync(makeRequest);
		}else{
		    $debug("XHR sending synch;");
			makeRequest();
		}
	},
	abort: function(){
		//TODO
	},
	onreadystatechange: function(){
		//TODO
	},
	getResponseHeader: function(header){
        $debug('GETTING RESPONSE HEADER '+header);
	  var rHeader, returnedHeaders;
		if (this.readyState < 3){
			throw new Error("INVALID_STATE_ERR");
		} else {
			returnedHeaders = [];
			for (rHeader in this.responseHeaders) {
				if (rHeader.match(new RegExp(header, "i")))
					returnedHeaders.push(this.responseHeaders[rHeader]);
			}
            
			if (returnedHeaders.length){ 
                $debug('GOT RESPONSE HEADER '+returnedHeaders.join(", "));
                return returnedHeaders.join(", "); 
            }
		}
        return null;
	},
	getAllResponseHeaders: function(){
	  var header, returnedHeaders = [];
		if (this.readyState < 3){
			throw new Error("INVALID_STATE_ERR");
		} else {
			for (header in this.responseHeaders){
				returnedHeaders.push( header + ": " + this.responseHeaders[header] );
			}
		}return returnedHeaders.join("\r\n");
	},
	async: true,
	readyState: 0,
	responseText: "",
	status: 0
};
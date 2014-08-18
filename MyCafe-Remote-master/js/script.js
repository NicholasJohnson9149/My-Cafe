$(document).ready(function() {
	var deviceID    = "55ff6c065075555324421487";
    var accessToken = "7d00c39db70168aac8c3a5e317f2d3ae32809130";
	var brew = 0; // 1 = brewing, 0 = idle
	var command = ""; // sendData type
	var grindTime = 0; // how long to grind
	var grindSent = 0; // check if grind ended (event listener check)
	var brewSent = 0;
	// initialize by checking if MyCafe is ON or actively brewing
	requestURL = "https://api.spark.io/v1/devices/" +deviceID + "/" + brew + "/";
    
    //Brew Function 
	brew = $.get( requestURL, { access_token: accessToken });
	// if so, adjust interface accordingly
	if (brew == 1){
		$('.brew').empty().html('STOP BREWING');
	}
    // grind button logic
	$('.grind').on('click', function(){
		$(this).fadeOut(250, function(){
			$('.grind-options').fadeIn(250);
		});
	});
	// on click: sendData. If successful, listen for publish(end)
	$('.fine-grind').on('click', function(){
		grindTime = 30000;
		command = "grind";
		grindSent = sendData(command, grindTime);
		grindListen(grindSent); // set up event listener, if grindSent = 1, post was successfull
	});
	$('.medium-grind').on('click', function(){
		grindTime = 20000;
		command = "grind";
		grindSent = sendData(command, grindTime);
		grindListen(grindSent); // set up event listener, if grindSent = 1, post was successfull

	});
	$('.coarse-grind').on('click', function(){
		grindTime = 10000;
		command = "grind";
		grindSent = sendData(command, grindTime);
		grindListen(grindSent); // set up event listener, if grindSent = 1, post was successfull

	});
	// brew button logic
	$('.brew').on('click', function(){
		command = "brew";
    	if (brew === 1){
    		brew = "brew";
    		$('.grind').empty().html('BREW');
    	}
    	if (brew === 0){
    		brew = "offBrew";
    		$('.brew').empty().html('STOP BREWING');
    	}
		brewSent = sendData(command, brew);

	});


	var sendData = function(command, data){
		requestURL = "https://api.spark.io/v1/devices/" +deviceID + "/" + command + "/";
        
		if (command == "grind"){
			$.post( requestURL, { params: data, access_token: accessToken }, function(){return 1;});
		}
		else if (command == "brew"){
			$.post( requestURL, { params: data, access_token: accessToken }, function(){return 1;});
		}
	};
	
	var grindListen = function(grindSent){
		//grindSent = 1;
		if (grindSent == 1){
			alert('My Coffee Rrocks');
			var evtSource = new EventSource(requestURL);
			evtSource.addEventListener("ping", function(e){
				var obj = JSON.parse(e.data);

				$('.grind-options').fadeOut(250, function(){
					$('.grind').empty().html('GRINDING');
					$('.grind').fadeIn(250);
					loading();
				});
				if (obj === "Go get Coffee"){
					clearTimeout(noResponse);
					evtSouce.close();
					$('.grind').empty().html('GRIND COMPLETE').delay(3000).empty().html('GRIND');
				}
			}, false);
		}
		else{
			alert('My Coffee Failed');
			return 0;
		}	

	};
	var loading = function(){
		$('.grind').animate({opacity:'1'}, 1000);
    	$('.grind').animate({opacity:'0.5'}, 1000, loading);
	};
});
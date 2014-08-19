$(document).ready(function() {
	var deviceID    = "55ff6c065075555324421487";
	var accessToken = "6249ef747c68f32bde0e4deb2f1395705e59a84b";
	var brew = -1; // 1 = brewing, -1 = idle
	var command = ""; // sendData type
	var grindTime = 0; // how long to grind
	
	// initialize by checking if MyCafe is ON or actively brewing
	requestURL = "https://api.spark.io/v1/devices/" +deviceID + "/" + "brew" + "/";
    
    //Brew Function 
	//brew = $.get( requestURL, { access_token: accessToken });
	//alert(brew);
	// if brewing, adjust interface accordingly
	// if (brew == 1){
	// 	$('.brew').empty().html('STOP BREWING');
	// }
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
		sendData(command, grindTime);
		grinding(grindTime);
	});
	$('.medium-grind').on('click', function(){
		grindTime = 20000;
		command = "grind";
		sendData(command, grindTime);
		grinding(grindTime);
	});
	$('.coarse-grind').on('click', function(){
		grindTime = 10000;
		command = "grind";
		sendData(command, grindTime);
		grinding(grindTime);
	});
	// brew button logic
	$('.brew').on('click', function(){
		command = "brew";
    	if (brew === 1){
    		$('.brew').html('BREW');
    		brew = -1;
    	}
    	else if (brew === -1){
    		$('.brew').html('STOP BREWING');
    		brew = 1;
    	}
		sendData(command, brew); // send command: 'brew' and whether to start/stop brewing
		

	});
	var grinding = function(grindTime){
		$('.grind-options').fadeOut(250, function(){
		 	$('.grind').html('GRINDING').fadeIn(250, function(){
		 		$('.grind').delay(grindTime).queue(function(){
		 			$(this).html('GRIND');
		 			$(this).dequeue();
		 		});	
		 	});
		 });
	};

	var sendData = function(command, data){
		requestURL = "https://api.spark.io/v1/devices/" +deviceID + "/" + command;
        
		if (command == "grind"){
			$.post( requestURL, { params: data, access_token: accessToken }, function(){return 1;});
		}
		else if (command == "brew"){
			$.post( requestURL, { params: data, access_token: accessToken }, function(){return 1;});
		}
	};
});

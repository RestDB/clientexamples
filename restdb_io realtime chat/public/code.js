var hightlight = function(id) {
    $(id).addClass("highlight");
    setTimeout(function(){
            $(id).removeClass("highlight");
    }, 5000);
    
}

$( document ).ready(function() {
    var apikey = "570c0945f2eeca0bca106819";
    var db = null; 
    try {
        db = new restdb("570c0945f2eeca0bca106819", {realtime: true});
        $("#status").text("Ok, got the api").addClass("online");
        hightlight("#init_block");
    } catch (ex) {
        $("#status").text("Error loading jsapi");
    }
    
    $("#oneliner").keyup(function(e){
    	if(e.keyCode == 13 && $(this).val() !== '')
    	{
    	    hightlight("#input_block");
    		var payload = {"oneliner": $(this).val()};
    		$(this).val("");
    		var newline = new db.chat(payload);
    		newline.save();
    	}
    });
    
    db.chat.on('POST', function(err, mess) {
    	hightlight("#post_block");
    	var line = $("<div>").text(mess.data.oneliner);
    	line.hide();
    	$("#messages").prepend(line);
    	line.toggle("scale")
    });
    db.on("CONNECT", function() {
    	hightlight("#connect_block");
    	$("#status").addClass("online").removeClass("offline").text("online");
    	$("#messages").empty();
    	db.chat.find({}, {"$max": 100,"$orderby": {"_created": -1}}, function(err, lines){
    	    _.each(lines, function(aline){
    	        $("#messages").append($("<div>").text(aline.oneliner));        
    	    });
    	})
    	
    });
    db.on("DISCONNECT", function() {
    	hightlight("#disconnect_block");
    	$("#status").addClass("online").addClass("offline").text("off");
    });
    db.on("RECONNECT", function() {
    	hightlight("#reconnect_block");
    	$("#status").addClass("online").removeClass("offline").text("Back again");
    });
   
});
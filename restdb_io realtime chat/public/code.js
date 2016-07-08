var hightlight = function(id) {
    $(id).addClass("highlight");
    setTimeout(function(){
            $(id).removeClass("highlight");
    }, 5000);
}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

$( document ).ready(function() {
    var apikey = "577ed0a645c8ac6e5b035fbe";
    var myid = makeid();
    var db = null; 
    try {
        db = new restdb(apikey, {realtime: true});
        $("#status").text("Ok, got the api").addClass("online");
        hightlight("#init_block");
    } catch (ex) {
        $("#status").text("Error loading jsapi");
    }
    
    $("#oneliner").keyup(function(e){
        if(e.keyCode == 13 && $(this).val() !== '')
        {
            hightlight("#input_block");
            var payload = {"oneliner": $(this).val(), "userid": myid};
            $(this).val("");
            var newline = new db.chat(payload);
            newline.save();
        }
    });
    
    db.chat.on('POST', function(err, mess) {
        hightlight("#post_block");
        var text = $("<div>").text(mess.data.userid + ": " + mess.data.oneliner);
        text.attr("id", mess.data._id);
        text.hide();
        $("#messages").prepend(text);
        text.toggle("scale");
        text.dblclick(function() {
          var deleteme = new db.chat({_id: mess.data._id});
          deleteme.delete();
        });
    });
    
    db.chat.on('PUT', function(err, mess) {
        hightlight("#put_block");
        db.chat.find({"_id": mess.data}, {}, function(err, updatedline){
            $("#"+mess.data).text(updatedline[0].oneliner);
        });
    });
    
    // double click on text to delete
    db.chat.on('DELETE', function(err, mess) {
        hightlight("#delete_block");
        _.each(mess.data, function(oneid){
            $("#"+oneid).remove();    
        });
    });
    
    db.on("CONNECT", function() {
        hightlight("#connect_block");
        $("#status").addClass("online").removeClass("offline").text("online");
        $("#messages").empty();
        db.chat.find({}, {"$max": 100,"$orderby": {"_created": -1}}, function(err, lines){
            _.each(lines, function(aline){
                var text = $("<div>").text(aline.userid + ": " + aline.oneliner);
                text.attr("id", aline._id);
                $("#messages").append(text);
                text.dblclick(function() {
                  var deleteme = new db.chat({_id: aline._id});
                  deleteme.delete();
                });
            });
        })
        
    });
    db.on("DISCONNECT", function() {
        hightlight("#disconnect_block");
        $("#status").removeClass("online").addClass("offline").text("offline");
    });
    db.on("RECONNECT", function() {
        hightlight("#reconnect_block");
        $("#status").addClass("online").removeClass("offline").text("Back again");
    });
    
    
   
});
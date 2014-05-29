$(function() {
    $( "#accordion" ).accordion({
		collapsible: true,
		active:false
    });

	$(".open").click(function() {
        $("#newemail").html("<img src='./imgs/newemail.png' >");
        $("#newemail").dialog();
        $("#newemail").dialog("option", "width", 560);
        $("#newemail").dialog("option", "height", 350);
        $("#newemail").dialog("widget").position({
    		of: $(this).parent(),
    		my: "right top",
    		at: "left top"
  		});
    });
});

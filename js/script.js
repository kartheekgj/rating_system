/******************************************************************************
 
 * Description: The file is used to store the javascripts for rating system
 * Author: G Jayendra Kartheek
 * Date Created: 06/11/2014
 * Change Log:
 * Version      Author              Date of Modification        Comment
 * 1.0         G Jayendra Kartheek    06/11/2014                Page Created
 ******************************************************************************/
 
var $ = jQuery.noConflict();

var rating = {
	default_rating : {
		length : 10,
		value : 1,
		rating_value : 0,
		rating_id : 0
	},
	cRatingDiv : function(length,value){
		var html = [];
		length = (typeof length === 'undefined' || length > 10) ? rating.default_rating.length : length;
		value = (typeof value === 'undefined'   || value > 10)  ? rating.default_rating.value  : value;
		for(var divCounter = 1; divCounter <= length; divCounter++){
			html.push('<div class="rating glyphicon glyphicon-star-empty" data-value="'+ value +'" data-id="rating_'+ divCounter +'"></div>');	
		}
		$("#rating").html(html.join(""));
		$("#rating").children().hover(
			function(){
				$(this).prevAll().andSelf().removeClass('glyphicon-star-empty').addClass('glyphicon-star');
				$("#rating_form").slideDown();
				rating.default_rating.rating = $(this).attr('data-id');
				rating.default_rating.rating_value = $(this).attr('data-value');
			},
			function(){
				$(this).nextAll().removeClass('glyphicon-star').addClass('glyphicon-star-empty');
			}
		);
	},
	submit : function(){
		$('#message').html('');
		var regex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");
		var data = {
			name 	: $.trim($('#rating_form > input[data-type="name"]').val()),
			email 	: $.trim($('#rating_form > input[data-type="email"]').val()),
			comment : $.trim($('#rating_form > textarea[data-type="comment"]').val()),
			rating	: rating.default_rating.rating_id,
			value 	: rating.default_rating.rating_value,
			cmd		: 'POST_RATING'	
		}
		if(data.email.length !== 0 && ! regex.test(data.email)){
			$('#message').html('<p class="bg-warning">Please provide a valid E-mail Address</p>');
			$('#rating_form > input[data-type="email"]').focus();
			$("#Processing").hide();
			$("#submit").show();
			return false;
		}
		if(data.comment.length === 0){
			$('#message').html('<p class="bg-warning">Please provide valid comments</p>');
			$('#rating_form > input[data-type="comment"]').focus();
			$("#Processing").hide();
			$("#submit").show();
			return false;
		}
		$.ajax({
			url: 'rating.php',
			type: 'POST',
			data: data,
			dataType:'JSON',
			success: function(data) {
				rating.reset();
				$('#message').html('<p class="bg-success">Problem with submitting data please try again</p>');
			},
			error: function(e) {
				rating.reset();
				$('#message').html('<p class="bg-warning">Problem with submitting data please try again</p>');
				return false;
			}
		});
	},
	reset : function(){
		$("#rating_form").slideUp();
		$("#rating_form > input,textarea").val('');
		$("#rating").children().removeClass('glyphicon-star').addClass('glyphicon-star-empty');
		$("#Processing").hide();
		$("#submit").show();
		$('#message').html('');
	},
	getRatings : function(){
		$.ajax({
			url: 'rating.php',
			type: 'POST',
			dataType:'JSON',
			data: {cmd: 'GET_RATING'},
			success: function(data) {
				var data = $.parseJSON(data);
				if(data.error === 0 && data.final_rating > 0){
					var html = (data.final_rating > 1) ? '(' + data.final_rating + ' Ratings)' : '(' + data.final_rating + ' Rating)';
					$('#ratings').html(html);
				}
				if(data.error === 1){
					$('#message').html('<p class="bg-warning">'+ data.message +'</p>');
					rating.reset();
					return false;
				}
			},
			error: function(e) {
				rating.reset();
				$('#message').html('<p class="bg-warning">Problem with submitting data please try again</p>');
				return false;
			}
		});
	
	}
};

$(document).ready(function(){
	rating.cRatingDiv(5,1);
	rating.getRatings();
	(function(){
		$("#submit").click(function(){
			$(this).hide();
			$("#Processing").show();
			rating.submit();
		});
		$("#cancel").click(function(){
			rating.reset();
		});
	})();
});

 
 

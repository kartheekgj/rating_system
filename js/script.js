/******************************************************************************
 
 * Description: The file is used to store the javascripts for rating system
 * Author: G Jayendra Kartheek
 * Date Created: 06/11/2014
 * Change Log:
 * Version      Author              Date of Modification        Comment
 * 1.0         G Jayendra Kartheek    06/11/2014                Page Created
 ******************************************************************************/
 
 var cjq = jQuery.noConflict();
 
 var rating = {
	default_rating : {
		length : 10,
		value : 1
	},
	cRatingDiv : function(length,value){
		var html = [];
		length = (typeof length === 'undefined' || length >10) ? default_rating.length : length;
		value = (typeof value === 'undefined'   || value >10)  ? default_rating.value  : value;
		for(var divCounter = 0; divCounter < length; divCounter++){
			html.push('<div class="rating" data-value="'+ value +'" data-id="'+ divCounter +'">'+ divCounter +'</div>');	
		}
		cjq("#rating").html(html.join("")); 
	}
}
 
 
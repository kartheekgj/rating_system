<?php
/******************************************************************************
 
 * Description: The file is used to store the php end of rating system
 * Author: G Jayendra Kartheek
 * Date Created: 06/11/2014
 * Change Log:
 * Version      Author              Date of Modification        Comment
 * 1.0         G Jayendra Kartheek    06/11/2014                Page Created
 ******************************************************************************/
require_once('./config.php');
 
$cmd	=	trim(strtoupper($_POST['cmd']));
//$cmd	=	trim(strtoupper($_GET['cmd'])); //testing mode on


switch($cmd)
{
	case 'POST_RATING'	: fnPostRating();
							break;
	case 'GET_RATING'	: fnGetRating();
							break;
	default				: echo json_encode(array('error'=> 1,'message'=>'Invalid command'));
							break;
}


function _getConfig(){
	try{
		global $connUrl;
		return new PDO($connUrl, USERNAME, PASSWORD);
		
	}
	catch(Exception $e){
		return false;
	}
}

function fnGetRating(){
	$conn = _getConfig();
	$sql = 'SELECT * FROM ratings';
	$finalRating = 0;
	foreach ($conn->query($sql) as $row) {
        $finalRating += ($row['rating'] * $row['value']);
    }
	header('Content-type: application/json');
	echo json_encode(array('error'=> 0,'final_rating' => $finalRating));	
}



function fnPostRating(){
	$name = $_POST['name'];
	$email = $_POST['email'];
	$comment = strip_tags($_POST['comment']);
	$rating = ($_POST['rating'] <=0 || $_POST['rating'] > 10) ? 10 : $_POST['value'];
	$value = ($_POST['value'] <= 0) ? 1 : $_POST['value'];
	
	//validations
	if(! empty($email)  && filter_var($email,FILTER_VALIDATE_EMAIL)){
		echo json_encode(array('error'=> 1,'message'=>'Invalid Email address'));
		exit;
	}
	if(empty($comment)){
		echo json_encode(array('error'=> 1,'message'=>'Please send valid comments'));
		exit;
	}
	$conn = _getConfig();
	$sql = "INSERT INTO movies(name,email,comment,rating,value) VALUES (
								:name, :email, :comment, :rating, :value)";
                                          
	$stmt = $conn->prepare($sql);
	$stmt->bindParam(':name', $name, PDO::PARAM_STR);       
	$stmt->bindParam(':email', $email, PDO::PARAM_STR); 
	$stmt->bindParam(':comment', $filmImage, PDO::PARAM_STR);
	$stmt->bindParam(':rating', $filmPrice, PDO::PARAM_STR); 
	$stmt->bindParam(':value', $filmReview, PDO::PARAM_STR); 
	
	if($stmt->execute()){
		echo json_encode(array('error'=> 0,'message'=>'Successfully Inserted'));
		exit;
	}else{
		echo json_encode(array('error'=> 1,'message'=>'Unable to insert at this moment'));
		exit;
	}
}


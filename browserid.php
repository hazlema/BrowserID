<?php
	/**
	* Verifies the given BrowserID assertion
	*
	* @throws \UnexpectedValueException on error
	*
	* @param string $assertion Assertion provided by navigator.id.getVerifiedEmail()
	* @param string $audience Host Name, defaults to $_SERVER['HTTP_HOST']
	* @param string $verifyService URL of the verification webservice, defaults BrowserID's
	* @return object The decoded JSON returned by the verify service
	*/
	function browserid_verify_assertion($assertion, $audience = null, $verifyService = 'https://browserid.org/verify')
	{
	    if (null === $audience) {
	        $audience = $_SERVER['HTTP_HOST'];
	    }
	
	    $query = http_build_query(array(
	        'assertion' => $assertion,
	        'audience' => $audience
	    ));
	
	    $opts = array(
	        'http' => array(
	            'content' => $query,
	            'header' => 'Content-Type: application/x-www-form-urlencoded',
	            'method' => 'POST'
	        )
	    );
	
	    $ctx = stream_context_create($opts);
	    $contents = file_get_contents($verifyService, false, $ctx);
	
	    if (!$contents) {
	        throw new \UnexpectedValueException(sprintf(
	            "Verify Service %s did not return a response", $verifyService
	        ));
	    }
	
	    $data = json_decode($contents);
	
	    if (isset($data->status) and $data->status == 'failure') {
	        throw new \UnexpectedValueException(sprintf(
	            'The Verify Service returned an error: %s', $data->reason
	        ));
	    }
	
	    return $contents;
	}

	print browserid_verify_assertion($_POST["assertion"], $_POST["audience"]);
?>
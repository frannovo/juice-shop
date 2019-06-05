// The sendingRequest and responseReceived functions will be called for all requests/responses sent/received by ZAP, 
// including automated tools (e.g. active scanner, fuzzer, ...)

// Note that new HttpSender scripts will initially be disabled
// Right click the script in the Scripts tree and select "enable"  

// 'initiator' is the component the initiated the request:
// 		1	PROXY_INITIATOR
// 		2	ACTIVE_SCANNER_INITIATOR
// 		3	SPIDER_INITIATOR
// 		4	FUZZER_INITIATOR
// 		5	AUTHENTICATION_INITIATOR
// 		6	MANUAL_REQUEST_INITIATOR
// 		7	CHECK_FOR_UPDATES_INITIATOR
// 		8	BEAN_SHELL_INITIATOR
// 		9	ACCESS_CONTROL_SCANNER_INITIATOR
// 		10	AJAX_SPIDER_INITIATOR
// For the latest list of values see the HttpSender class:
// https://github.com/zaproxy/zaproxy/blob/master/src/org/parosproxy/paros/network/HttpSender.java
// 'helper' just has one method at the moment: helper.getHttpSender() which returns the HttpSender 
// instance used to send the request.
//
// New requests can be made like this:
// msg2 = msg.cloneAll() // msg2 can then be safely changed as required without affecting msg
// helper.getHttpSender().sendAndReceive(msg2, false);
// print('msg2 response=' + msg2.getResponseHeader().getStatusCode())

function sendingRequest(msg, initiator, helper) {
    var loginToken = String(org.zaproxy.zap.extension.script.ScriptVars.getGlobalVar("bearer"));
    
    if (loginToken == 'null') {
        //print('Attempting to login...')
	
        // Make sure any Java classes used explicitly are imported
        var HttpRequestHeader = Java.type("org.parosproxy.paros.network.HttpRequestHeader")
        var HttpHeader = Java.type("org.parosproxy.paros.network.HttpHeader")
        var URI = Java.type("org.apache.commons.httpclient.URI")
    
        // Prepare the login request details
        requestUri = new URI("http://juiceshop.com:3000/rest/user/login", false);
        requestMethod = HttpRequestHeader.POST;
        // Build the request body using the credentials values
        var requestBody = '{"email":"root@localhost","password":"halamadrid"}';
      
        // Build the actual message to be sent
        var request = msg.cloneAll();
        //var request=helper.prepareMessage();
        var header = new HttpRequestHeader(requestMethod, requestUri, HttpHeader.HTTP10);
        header.setHeader("Content-Type", "application/json");
        request.setRequestHeader(header);
        request.setRequestBody(requestBody);
    
        // Send the authentication message and return it
        helper.getHttpSender().sendAndReceive(request);
        //print("Received response status code: "+ request.getResponseHeader().getStatusCode());
        if (request.getResponseHeader().getStatusCode() == 200) {
            loginToken = JSON.parse(request.getResponseBody()).authentication.token;
		    print('Authenticated using bearer=' + loginToken);
		    org.zaproxy.zap.extension.script.ScriptVars.setGlobalVar("bearer", loginToken);
        }

    }
    if (!msg.getRequestHeader().getURI().toString().endsWith("login")){
        //set http header
        //print('Setting Bearer token: ' + loginToken);
        var httpRequestHeader = msg.getRequestHeader();
        httpRequestHeader.setHeader("Authorization","Bearer "+loginToken);
    }
}


function responseReceived(msg, initiator, helper) {

}
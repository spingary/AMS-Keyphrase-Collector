(function() {
    var proxied = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function() {
        //console.log( arguments );
        //Here is where you can add any code to process the request. 
        //If you want to pass the Ajax request object, pass the 'pointer' below
        var pointer = this
        var intervalId = window.setInterval(function(){
                if(pointer.readyState != 4){
                        return;
                }
                if (pointer.responseURL != 'https://ams.amazon.com/api/keyword-power') {
                    return;
                }                
                //console.log(pointer);
                var resptxt = JSON.parse(pointer.responseText);
                var resp = resptxt.keywordPowers;
                //console.log(resp);
                var str = '';
                for (var c in resp) {
                    str += '<tr><td>'+ resp[c].keyword + '</td><td>' + resp[c].matchType + '</td><td>' + resp[c].power + '</td></tr>';
                }
                jQuery('#capture_table').append(str);
                //console.log( pointer.responseText );
                //var csv = convertToCSV(resp.keywordPowers);
                //console.log( csv );
                //Here is where you can add any code to process the response.
                //If you want to pass the Ajax request object, pass the 'pointer' below
                clearInterval(intervalId);

        }, 1);//I found a delay of 1 to be sufficient, modify it as you need.
        return proxied.apply(this, [].slice.call(arguments));
    };
    function convertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }

            str += line + '\r\n';
        }
        return str;
    }
    var capture = '<div id="capture"><button id="capture_button" data-clipboard-target="#capture_table">Copy</button><table id="capture_table"><thead><tr><th>Keyword</th><th>Match</th><th>Traffic</th></tr><thead></table><style>';
        capture += '#capture { z-index:99990;position: fixed; top: 400px;left: calc(100% - 310px);width: 300px;height: 300px;overflow:scroll;border: 3px solid blue;background: white}';
        capture += '#capture_table {width: 100%;}';
        capture += '#capture_table thead {border-bottom: 1px solid blue;}';
        capture += '#capture_button {margin: 3px auto;padding: 3px;display: block;}';
        capture += '    </style></div>';
    jQuery('body').append(capture);
    new Clipboard('#capture_button');
})();
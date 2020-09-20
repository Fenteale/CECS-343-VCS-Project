<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
</head>
<body>
    <input type="text" placeholder="Enter input:" id="myInput">
    <button type="button" onclick="getInputValue();">Get Value</button>
    
    <script>
        function sepWords(){
            var inputVal = document.getElementById("myInput").value;
	    var words = inputVal.split(" ");
            console.log(words);
        }
    </script>
</body>
</html>

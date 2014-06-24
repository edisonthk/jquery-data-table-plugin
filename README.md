# jQuery data table plugin

Simple jQuery plugin to allow you to convert HTML table to jQuery object.

### Demo

Check it the demo out by following link.


### Getting started

This plugin required font-awesome 4.1.0, bootstrap and jQuery, import it first.

```
<link href="http://mytest.no-ip.net/admin/plugins/bootstrap/bootstrap.css" rel="stylesheet">
<link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
```

Then, import dataTable.js and dataTable.css

```
<script src="dataTable.js"></script>
<link href="dataTable.css" rel="stylesheet">
```

The setup is done, let's begin to coding. It is very simple just attach dataTable to the table. In this example, $("#myTable") is attached with dataTable and with myData.

```
$(function(){
	$("#myFIFATable").dataTable({
		data: [
				["Country"	,"GP"	,"Win"	,"Draw"	,"Lose"],
				["Brazil"	,"3"	,"2"	,1	,"0"],
				["Mexico"	,"3"	,"2"	,1	,"0"],
				["Croatia"	,"3"	,"1"	,0	,"2"],
				["Cameroon"	,"3"	,"0"	,0	,"3"]
			]
	});
});	
``` 

### Features
* Able to coding with bootstrap
* some simple tools such as edit, remove
* onDataChanged event, this event fired when cell value is change
* Easy to reset data

### Sample code

```
<!DOCTYPE html>
<html lang="jp">
<head>
	<link href="http://mytest.no-ip.net/admin/plugins/bootstrap/bootstrap.css" rel="stylesheet">
	<link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
	<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
	<script src="dataTable.js"></script>
	<link href="dataTable.css" rel="stylesheet">
	<script>

$(function(){
	$("#myFIFATable").dataTable({
		data: [
				["Country"	,"GP"	,"Win"	,"Draw"	,"Lose"],
				["Brazil"	,"3"	,"2"	,1	,"0"],
				["Mexico"	,"3"	,"2"	,1	,"0"],
				["Croatia"	,"3"	,"1"	,0	,"2"],
				["Cameroon"	,"3"	,"0"	,0	,"3"]
			]
	});
});	
</script>
</head>
<body>
	<div class="container">
		<div class="row">
			<div class="span8">
				<table id="myFIFATable" class="table table-bordered table-striped table-heading"></table>
			</div>
		</div>
	</div>
</body>
</html>
```
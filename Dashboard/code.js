<!doctype html>
<html>
	<head>
		<title>RestDB dashboard</title>
		<!-- Include Twitter Bootstrap, JQuery, Chartist, JustGage.js and lodash -->
		<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet" integrity="sha256-7s5uDGW3AHqw6xtJmNNtr+OBRJUlgkNJEo78P4b0yRw= sha512-nNo+yCHEyn0smMxSswnf/OnX6/KwJuZTlNZBjauKhTK0c+zT+q5JOCx0UFhXQ6rJR9jg6Es8gPuD2uZcYDLqSw==" crossorigin="anonymous">
		<link rel="stylesheet" href="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css">
		<script src="https://code.jquery.com/jquery-2.2.0.min.js"></script>
		<script src="/js/jquery.fullscreen.min.js"></script>
		<script src="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>
		<script src="//cdn.jsdelivr.net/raphael/2.1.2/raphael-min.js"></script>
		<script src="//cdn.jsdelivr.net/justgage/1.0.1/justgage.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.1.0/lodash.min.js" type="text/javascript"></script>
		
		<style>
			.ct-series-a .ct-line,
			.ct-series-a .ct-point .ct-bar {
			  stroke: #444;
			  
			}
			.ct-label{
			  font-size: 12px;  
			} 
		</style>
	</head>
	<body>
		
		<div class="col-sm-12">
			<div class="lead center-block">Dashboard with restdb.io</div>
		</div>
		<div class="col-sm-6">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3 class="panel-title">Job applications</h3>
				</div>
				 <div class="panel-body">
					<div class="ct-line ct-golden-section" id="traffic_chart"></div>
				</div>
			</div>
		</div>
		<div class="col-sm-6">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3 class="panel-title">Education</h3>
				</div>
				<div class="panel-body">
					<div class="ct-chart ct-golden-section" id="edu_chart"></div>
				</div>
			</div>
		</div>
		
		<div class="col-sm-6">
			<div class="panel panel-default">
				
				<div class="panel-body">
					<div class="center-block" id="interview_gauge" style="width:300px; height:200px"></div>
				</div>
			</div>
		</div>
		<div class="col-sm-6">
			<div class="panel panel-default">
				
				<div class="panel-body">
					<div class="center-block" id="hire_gauge" style="width:300px; height:200px"></div>
				</div>
			</div>
		</div>
		<div class="col-sm-12">
			<a href="#" class="btn btn-default btn-sm pull-right" id="fullscreen">full screen</a>
		</div>
		
		<script>
			/*
				Inject the API key for every call to the database.
			*/
			$.ajaxPrefilter(function( options ) {
				if ( !options.beforeSend) {
					options.beforeSend = function (xhr) { 
						xhr.setRequestHeader('x-apikey', '56c32999a73b2a43395f93e2');
					}
				}
			});
			
			/*
				Create a Line chart of Job Applications this year
			*/
			function trafficChart(data){
				var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'och', 'nov', 'dec'];
				var groups = _.groupBy(data, function(item){
					var then = new Date(item.received);
					return (months[then.getMonth()] + " " + then.getDate());
				});
				
				 var data = {
				  labels: _.map(groups, function(agroup, day){
					  return day;
				  }),
					series: [
					_.map(groups, function(agroup){
						return agroup.length;
					})
				  ]
				};
				console.log("Data", JSON.stringify(data, null,'  '));
				console.log("Groups", JSON.stringify(groups, null,'  '));
				
				var options = {
					axisX: {
						// On the y-axis start means left and end means right
						position: 'start'
					},
					chartPadding: {
						bottom: 20,
						top: 10
					},
					lineSmooth: false
				};
				new Chartist.Bar('#traffic_chart', data, options);
			}
			
			/*
				Create a Pie chart of education levels among job Applications
			*/
			function eduChart(data){
				var groups = _.groupBy(data, function(item){
					return _.trim(item.education);
				});
				var data = {
				  labels: _.map(groups, function(item, key){
					  return key;
				  }),
				  series: _.map(groups, function(item){
					  return item.length;
				  })
				};
				console.log("Data", JSON.stringify(data, null,'  '));
				console.log("Groups", JSON.stringify(groups, null,'  '));
				
				var options = {
					labelInterpolationFnc: function(value) {
						return value
					},
					labelOffset: 10,
					labelDirection: 'explode',
				};
				
				new Chartist.Pie('#edu_chart', data, options);
			}
			
			/*
				Create a Gauge with number of interviews
			*/
			function interviewGauge(data){
				$("#interview_gauge").empty();
				var g = new JustGage({
				id: "interview_gauge",
				value: _.filter(data, function(item){ 
						return (item.status.match(/.*Interview/gi))
					}).length,
				min: 0,
				max: data.length,
				title: "Interviews"
			  });
			}
			
			/*
				Create a Gauge with number of Hires we are doing
			*/
			function hireGauge(data){
				$("#hire_gauge").empty();
				var g = new JustGage({
				id: "hire_gauge",
				value: _.filter(data, function(item){ 
						return (item.status.match(/.*Hire/gi))
					}).length,
				min: 0,
				max: _.filter(data, function(item){ 
						return (item.status.match(/.*Interview/gi))
					}).length,
				title: "Hiring",
				gaugeColor: "#555"
			  });
			}
			/*
				GET Job Application records from Applications Collection.
				Newest first: sort=received&dir=-1
				Include metadata (_created etc): meatafields=true
			*/
			function createReport(){
				var now = new Date();
				var query = {"received":{"$gt":{"$date":now.getYear()+"-01-01"}}};
				var restURL = 'https://jobapplications-5c54.restdb.io/rest/applications?sort=received&dir=1&q='+JSON.stringify(query);
				
				// Call RestDB for some Application data
				$.getJSON(restURL, function(data){
					console.log(JSON.stringify(data, null, '  '))
					// call charts and gauges functions
					trafficChart(data);
					eduChart(data);
					interviewGauge(data);
					hireGauge(data);	
				});
			}
			// create Dashboard once
			createReport();
			
			// Refresh dashboard each 5 min
			setInterval(function(){
				createReport(); 
			}, 60 * 5 * 1000);
			
			$("#fullscreen").on("click", function(){
				$(this).hide();
				$("body").fullscreen();
			});
			
		</script>
	</body>
</html>

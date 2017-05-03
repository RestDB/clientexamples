/**
	Simple image + caption upload and CRUD using AngularJS and restdb.io

	by Federico Portoghese federico.portoghese@gmail.com
	
	Requirements:
	an accessible restdb.io database with one collection, two fields are rquired:
	
		1. A Text field called "Name"
		2. An Image field called "Image"
		
	An api key is also required.
	
	MIT License

	Copyright (c) [year] [fullname]

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

 */

"use strict";

var hImages = angular.module("hImages", []);

hImages.constant("config", {
    apiKey: 			/* Enter your API key here. Eg. "57483247g45b25478968j7d9fg" */,
	dbName: 			/* Enter your database name here. Eg. "images-8a0b" */,
	collectionName: 	/* Enter your collection name here. Eg. "images" */
});

hImages.controller("hImagesController", ["$scope", "hImages", function($scope, hImages) {
	$scope.get = function(){
		hImages.get().then(function(response) {
			$scope.hImages = response;
			console.log('Retrieving Success:', response);
		}, function(response){
			console.log('Retrieving Failure:', response);
		});
	}	
	$scope.new = function(){
		$scope.hImage = document.getElementById("hImage").files[0];
		if($scope.hImage && $scope.hImageName){
			hImages.new($scope.hImage, $scope.hImageName).then(function(response) {
				console.log('Creation Success:', response);
				$scope.get(true);
				$scope.hImage = null;
				document.getElementById('hImage').value = null;
				$scope.hImageName = null;
			}, function(response){
				console.log('Creation Failure:', response);
			});
		}
	}
	$scope.delete = function(hImage){
		hImages.delete(hImage).then(function(response) {
			console.log('Deletion Success:', response);
			$scope.get(true);
		}, function(response){
			console.log('Deletion Failure:', response);
		});
	}
	$scope.rename = function(hImageId, newName){
		hImages.rename(hImageId, newName).then(function(response) {
			console.log('Rename Success:', response);
			$scope.get(true);
		}, function(response){
			console.log('Rename Failure:', response);
		});
	}
	$scope.get(false);
}]);

hImages.factory("hImages", ["$http", "$q", "config", function($http, $q, config) {
	function hImages(){
		var self = this;		
		
		self.apiKey = config.apiKey;
		self.apiUrl = "https://" + config.dbName + ".restdb.io/rest/" + config.collectionName;
		self.mediaUrl = "https://" + config.dbName + ".restdb.io/media";

		self.hImages = null;
		
		self.get = function(update) {			
			var deferred = $q.defer();			
			if(self.hImages !== null && update === false) {
				deferred.resolve(self.hImages);				
			} else {	
				var api = {
					"url": self.apiUrl + "?sort=_createdby",
					"method": "GET",
					"headers": {
						"content-type": "application/json",
						"x-apikey": self.apiKey
					},
					"processData": false
				}	
				$http(api).then(function(response){
					
					for(var b = 0; b < response.data.length; b++){
						for(var i = 0; i < response.data[b].Image.length; i++){						
							var imageId = response.data[b].Image[i];
							response.data[b].Image[i] = {
								imageId: imageId,
								thumb: self.getImageUrl(imageId, 't'),
								web: self.getImageUrl(imageId, 'w'),
								full: self.getImageUrl(imageId, '')
							}
						}
					}
					self.hImages = response.data;
					deferred.resolve(self.hImages);
				}, function(response){
					deferred.reject(response);
				});
			}
			return deferred.promise;
		};
		
		self.new = function(hImage, hImageName){	
			var deferred = $q.defer();		
			var formData = new FormData();
			formData.append('Image', hImage, hImage.name);	
			
			var mediaApi = {
				"url": self.mediaUrl,
				"method": "POST",
				"headers": {
					"content-type": undefined,
					"x-apikey": self.apiKey			
				},
				"processData": false,
				"data": formData
			}
					
			$http(mediaApi).then(function(response){
				
				var api = {
					"url": self.apiUrl + "?sort=_createdby",
					"method": "POST",
					"headers": {
						"content-type": "application/json",
						"x-apikey": self.apiKey
					},
					"processData": false,
					"data": { 
						"Name": hImageName,
						"Image": [ response.data.ids[0] ]
					}
				}
				
				$http(api).then(function(response){
					deferred.resolve(response.data);
				}, function(response){
					deferred.reject(response);
				});
			}, function(response){
				deferred.reject(response);
			});
			
			return deferred.promise;
		}
		
		self.delete = function(beauty){	
			var deferred = $q.defer();
			
			var mediaApi = {
				"url": self.mediaUrl + "/" + beauty.Image[0].imageId,
				"method": "DELETE",
				"headers": {
					"content-type": "application/json",
					"x-apikey": self.apiKey			
				}
			}	
			$http(mediaApi).then(function(response){

				var api = {
					"url": self.apiUrl + "/" + beauty._id,
					"method": "DELETE",
					"headers": {
						"content-type": "application/json",
						"x-apikey": self.apiKey
					},
					"processData": false
				}
				$http(api).then(function(response){
					deferred.resolve(response);
				}, function(response){
					deferred.reject(response);
				});
			}, function(response){
				deferred.reject(response);
			});
			
			return deferred.promise;
		}
		
		self.rename = function(hImageId, newName){	
			var deferred = $q.defer();
			
			var api = {
				"url": self.apiUrl + "/" + hImageId,
				"method": "PUT",
				"headers": {
					"content-type": "application/json",
					"x-apikey": self.apiKey
				},
				"processData": false,
				"data": { 
					"Name": newName
				}
			}	
			$http(api).then(function(response){
				deferred.resolve(response);
			}, function(response){
				deferred.reject(response);
			});
			
			return deferred.promise;
		}
		
		self.getImageUrl = function(imageId, size){
			return self.mediaUrl + '/' + imageId + '?s=' + size;
		}
	}
    return new hImages();
}]);
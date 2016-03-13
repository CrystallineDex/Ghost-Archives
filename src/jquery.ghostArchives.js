;( function( $, window, document, undefined ) {

	"use strict";

		// Defaults
		var ghostArchives = "ghostArchives",
			defaults = {
			};

		// Ghost Archives constructor
		function Plugin ( element, options ) {
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = ghostArchives;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			init: function() {
                var _self = this;
                
                // The master archive object that will get returned
                var archive = {};                                   
                
                // Populate the archive object from the Ghost Public API
                $.get(ghost.url.api('posts'), function (data) {                    
                    for(var i=0;i < data.posts.length; i++) {                        
                        var post = data.posts[i];
                        
                        var pubDate = new Date(post.published_at);
                        
                        post.date = {
                            day:pubDate.getDate(),
                            weekday:_self.dayLookup[pubDate.getDay()],
                            month:_self.monthLookup[pubDate.getMonth()],
                            year: pubDate.getFullYear(),
                            time: pubDate.getTime()
                        };
                        
                        if(!archive.hasOwnProperty(post.date.year)){
                            archive[post.date.year] = {};
                        }                    
                        
                        if(!archive[post.date.year].hasOwnProperty(post.date.month)){
                            archive[post.date.year][post.date.month] = {};
                        }               
                        
                        if(!archive[post.date.year][post.date.month].hasOwnProperty(post.date.day)){
                            archive[post.date.year][post.date.month][post.date.day] = [];
                        }
                        
                        archive[post.date.year][post.date.month][post.date.day].push(post);
                    };
                    
                    console.log(archive);
                                        
                    // Create DOM structure
                    var $container = $('<div></div>'),
                        $list = $('<ul></ul>');
                    
                    for(var year in archive){
                        
                        var $yearElem = $('<li>' + year + '</li>');                        
                                                
                        var $monthList = $('<ul></ul>');                        
                        for(var month in archive[year]){
                            var $monthElem = $('<li>' + month + '</li>');
                            $monthList.prepend($monthElem);                                    
                                                    
                            var $postList = $('<ul></ul>');
                            for(var day in archive[year][month]){
                                for(var i=0;i<archive[year][month][day].length;i++){
                                    var $postElem = $('<li></li>');
                                    var $postLink = $('<a>' + archive[year][month][day][i].title + '</a>');
                                    $postLink.attr('href', archive[year][month][day][i].url);
                                    $postElem.append($postLink);
                                    
                                    $postList.prepend($postElem);    
                                }                                             
                            }
                            $monthElem.append($postList);           
                        }                                                       
                        $yearElem.append($monthList);
                        
                        // Prepend for the proper order
                        $list.prepend($yearElem);
                    }
                    
                    $container.append($list);                    
                    console.log($container.html());
                    $(_self.element).append($container);
                })
                .fail(function(){                    
                    console.log('Error connecting to Ghost Public API. Have you enabled it in the Labs section of your blog?');  
                    return;
                });
                
			},
            
            monthLookup: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            
            dayLookup: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                      
		} );

		$.fn[ ghostArchives ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + ghostArchives ) ) {
					$.data( this, "plugin_" +
						ghostArchives, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );

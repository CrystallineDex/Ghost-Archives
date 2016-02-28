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
                
				var data = this.getArchiveData();
			},
            
			getArchiveData: function() {
                
                $.get('/rss/', function (data) {
                    console.log(data);
                    $(data).find("item").each(function () {
                        
                        var post = {
                            title: $(this).find('title').text(),
                            pubDate: new Date($(this).find('pubDate').text()),
                            category: $(this).find('category').text(),
                            link: $(this).find('link').text(),
                            author: $(this).find('creator').text()
                        };
                    });
                })
                .fail(function(){                    
                    console.log('Error retrieving RSS feed.');  
                });
			}
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

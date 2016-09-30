/* http://cyberbit.github.io/bootlist */
;(function(defaults, $, window, document, undefined) {
	'use strict';

	$.extend({
		// Function to change the default properties of the plugin
		// Usage:
		// jQuery.pluginSetup({property:'Custom value'});
		bootlist: function(options) {
			return $.extend(defaults, options);
		}
	}).fn.extend({
		bootlist: function(options) {
			options = $.extend(true, {}, defaults, options);
			
			return $(this).each(function() {
				var $this = $(this);
				
				if (options.ajax) {
					var $ajax = $.ajax(options.ajax);
					
					$ajax.then(function(datum) {
						if (options.debug) console.debug("Bootlist :: Loaded Ajax data: %o", datum);
						
						//Process data
						var items = (options.ajax.items) ? datum[options.ajax.items] : datum;
						if (options.debug) console.debug("Bootlist :: Processing items: %o", items);
						options.processor($this, items);
					});
					
					$ajax.fail(function(xhr, status, error) {
						console.error("Bootlist :: Could not load Ajax data: %o", error);
					})
				}
				// Plugin logic
				// Calling the function:
				// jQuery(selector).pluginName(options);
			});
		}
	});
})({
	debug: false,
	processor: function($list, items) {
		var options = this;
		
		//Storage for items
		var itemQueue = [];
		
		$.each(items, function(i, v) {
			if (options.debug) console.debug("Bootlist :: Formatting item: %o", v);
			
			//Push item to queue
			itemQueue.push(options.formatter(v));
		});
		
		//Append items from queue
		$list.append(itemQueue);
	},
	formatter: function(item) {
		var options = this;
		
		//Set up item
		var $item = $(options.itemTemplate);
		$item.data("bootlist.item", item);
		$item.text(item);
		
		//Return item
		return $item;
	},
	events: {
		click: function(item) {
			if (options.debug) console.debug("Bootlist :: Item clicked: %o", item);
		}
	},
	itemTemplate: '<li class="list-group-item"></li>',
	labeledItemTemplate:
		'<a href="javascript:;" class="list-group-item list-group-item-labeled">' +
			'<div class="list-group-item-labels pull-left"><i class="fa fa-angle-right fa-fw fa-pinned"></i></div>' +
			'<div class="list-group-item-labels pull-right">' +
				'<span class="label label-default"><span class="date">xxx</span></span>' +
			'</div>' +
			'<div class="list-group-item-body">' +
				'<span class="msg">Message</span>' +
			'</div>' +
		'</a>'
}, jQuery, window, document);

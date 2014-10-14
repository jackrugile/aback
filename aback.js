function Aback( opt ) {
	var $ = this;

	$.on = function( elem, eventType, handler ) {
		if( elem.addEventListener ) {
			elem.addEventListener( eventType, handler );
		} else {
			elem.attachEvent( 'on' + eventType, handler );
		}
	};

	$.off = function( elem, eventType, handler ) {
		if( elem.removeEventListener ) {
			elem.removeEventListener( eventType, handler );
		} else {
			elem.detachEvent( 'on' + eventType, handler );
		}
	};

	$.isset = function( test ) {
		return test !== undefined;
	};

	$.log = function( data ) {
		if( typeof console == 'object' ) {
			console.log( data );
		}
	};

	$.css = {
		container: {
			top: '0',
			right: '0',
			bottom: '0',
			left: '0',
			position: 'fixed',
			overflow: 'hidden',
			zIndex: 0
		},
		source: {
			display: 'block',
			position: 'absolute',
			zIndex: 0
		}
	};

	$.init = function() {
		var k;
		$.source = opt.source;
		$.sourceWidth = $.source.width;
		$.sourceHeight = $.source.height;

		if( $.source.parentNode === document.body ) {
			$.container = document.createElement( 'div' );
			for( k in $.css.container ) {
				$.container.style[ k ] = $.css.container[ k ];
			}
			$.clone = $.source.cloneNode( true );
			$.container.appendChild( $.clone ); 
			$.source.parentNode.replaceChild( $.container, $.source );
			$.source = $.clone;
		} else {
			$.container = $.source.parentNode;
			$.container.style.overflow = 'hidden';
			// place in front to make sure stacking is natural
			$.clone = $.source.cloneNode( true );
			$.container.removeChild( $.source ); 
			$.container.insertBefore( $.clone, $.container.firstChild );
			$.source = $.clone;

			/*var pos = $.container.currentStyle;
			if( pos !== 'fixed' || pos !== 'absolute' || pos !== 'relative' ) {
				$.container.style.position = 'relative';
			}*/
		}

		for( k in $.css.source ) {
			$.source.style[ k ] = $.css.source[ k ];
		}

		$.setOptions({
			x: $.isset( opt.x ) ? opt.x : 0.5,
			y: $.isset( opt.y ) ? opt.y : 0.5,
			fit: $.isset( opt.fit ) ? opt.fit : false,
			resize: $.isset( opt.resize ) ? opt.resize : true
		});
	};

	$.setOptions = function( opt ) {
		if( $.isset( opt.x ) && opt.x !== $.x ) {
			$.x = opt.x;
		}

		if( $.isset( opt.y ) && opt.y !== $.y ) {
			$.y = opt.y;
		}

		if( $.isset( opt.fit ) && opt.fit !== $.fit ) {
			$.fit = opt.fit;
		}

		if( $.isset( opt.resize ) && opt.resize !== $.resize ) {
			if( opt.resize ) {
				$.resize = true;
				$.on( window, 'resize', $.update );
				$.on( window, 'orientationchange', $.update );
			} else {
				$.resize = false;
				$.off( window, 'resize', $.update );
				$.off( window, 'orientationchange', $.update );
			}
		}

		$.update();
	}
	
	$.update = function() {
		$.containerWidth = $.container.offsetWidth;
		$.containerHeight = $.container.offsetHeight;
		$.containerRatio = $.containerHeight / $.containerWidth;
		$.sourceRatio = $.sourceHeight / $.sourceWidth;

		if( $.fit ) {
			if( $.containerWidth > $.containerHeight / $.sourceRatio ) {
				$.newHeight = Math.ceil( $.containerHeight * 1 );
				$.source.style.height = $.newHeight + 'px';
				$.newWidth = Math.ceil( $.newHeight / $.sourceRatio );
				$.source.style.width = $.newWidth + 'px';
			} else {
				$.newWidth = Math.ceil( $.containerWidth * 1 );
				$.source.style.width = $.newWidth + 'px';
				$.newHeight = Math.ceil( $.newWidth * $.sourceRatio );
				$.source.style.height = $.newHeight + 'px';
			}
		} else {
			if( $.containerRatio > $.sourceRatio ) {
				$.newHeight = $.containerHeight;
				$.source.style.height = $.newHeight + 'px';
				$.newWidth = Math.ceil( $.newHeight / $.sourceRatio );
				$.source.style.width = $.newWidth + 'px';
			} else {
				$.newWidth = $.containerWidth;
				$.source.style.width = $.newWidth + 'px';
				$.newHeight = Math.ceil( $.newWidth * $.sourceRatio );
				$.source.style.height = $.newHeight + 'px';
			}
		}
		$.source.style.left = ( $.x * $.containerWidth ) + ( -$.newWidth * $.x ) + 'px';
		$.source.style.top = ( $.y * $.containerHeight ) + ( -$.newHeight * $.y ) + 'px';
	};

	$.destroy = function() {
		$.off( window, 'resize', $.update );
		$.off( window, 'orientationchange', $.update );
		if( $.container.parentNode === document.body ) {
			$.container.parentNode.removeChild( $.container );
		} else {
			$.source.parentNode.removeChild( $.source );
		}
	};

	if( $.isset( opt.source ) && opt.source !== null ) {
		//$.on( window, 'load', $.init );
		$.init();
	} else {
		$.log( 'Aback: A valid source element is required.' );
	}
}

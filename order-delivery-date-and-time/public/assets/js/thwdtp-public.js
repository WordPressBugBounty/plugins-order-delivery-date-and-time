var thwdtp_public_base = ( function ( $, window, document ) {
	'use strict';

	$.fn.getType = function () {
		try {
			return this[ 0 ].tagName == 'INPUT'
				? this[ 0 ].type.toLowerCase()
				: this[ 0 ].tagName.toLowerCase();
		} catch ( err ) {
			return 'E001';
		}
	};

	function padZero( s, len, c ) {
		s = '' + s;
		var c = c || '0';
		while ( s.length < len ) s = c + s;
		return s;
	}

	function isInt( value ) {
		return (
			! isNaN( value ) &&
			parseInt( Number( value ) ) == value &&
			! isNaN( parseInt( value, 10 ) )
		);
	}

	function isEmpty( val ) {
		return val === undefined || val == null || val.length <= 0
			? true
			: false;
	}

	function isInputField( field ) {
		if ( field && field.length > 0 ) {
			var tagName = field[ 0 ].tagName.toLowerCase();
			if (
				$.inArray( tagName, [ 'input', 'select', 'textarea' ] ) > -1
			) {
				return true;
			}
		}
		return false;
	}

	function isInputChoiceField( type, multiple ) {
		if (
			type === 'select' ||
			type === 'radio' ||
			( type === 'checkbox' && multiple )
		) {
			return true;
		}
		return false;
	}

	function getInputField( key ) {
		var field = null;
		if ( key ) {
			field = $( '#' + key );
			if ( ! isInputField( field ) ) {
				field = $( "input[name='" + key + "']" );
				if ( ! isInputField( field ) ) {
					field = $( "input[name='" + key + "[]']" );
					if ( ! isInputField( field ) ) {
						field = $( "input[name='" + key + "[0]']" );
					}
				}
			}
		}
		return field;
	}

	// function setup_enhanced_select(form, class_selector, data){
	// 	form.find('select.'+class_selector).each(function(){
	// 		var ms = $(this);
	// 		ms.selectWoo({
	// 			//minimumResultsForSearch: 10,
	// 			allowClear : true,
	// 			placeholder: ms.data('placeholder'),
	// 			maximumSelectionLength: ms.data('maxselections'),
	// 			language: data.language,
	// 			dropdownAutoWidth : true,
	// 		}).addClass('enhanced');
	// 	});
	// }

	function set_field_value_by_elm( elm, type, value ) {
		switch ( type ) {
			case 'radio':
				elm.val( [ value ] );
				break;
			case 'checkbox':
				if ( elm.data( 'multiple' ) == 1 ) {
					value = value ? value : [];
					elm.val( value );
				} else {
					elm.val( [ value ] );
				}
				break;
			case 'select':
				if ( elm.prop( 'multiple' ) ) {
					elm.val( value );
				} else {
					elm.val( [ value ] );
				}
				break;
			default:
				elm.val( value );
				break;
		}
	}

	function get_field_value( type, elm, name ) {
		var value = '';
		switch ( type ) {
			case 'radio':
				value = $(
					"input[type=radio][name='" + name + "']:checked"
				).val();
				break;
			case 'checkbox':
				if ( elm.data( 'multiple' ) == 1 ) {
					var valueArr = [];
					$(
						"input[type=checkbox][name='" + name + "[]']:checked"
					).each( function () {
						valueArr.push( $( this ).val() );
					} );
					value = valueArr; //.toString();
				} else {
					value = $(
						'input[type=checkbox][name=' + name + ']:checked'
					).val();
				}
				break;
			case 'select':
				value = elm.val();
				break;
			case 'multiselect':
				value = elm.val();
				break;
			default:
				value = elm.val();
				break;
		}
		return value;
	}

	return {
		//setup_enhanced_select : setup_enhanced_select,
		set_field_value_by_elm: set_field_value_by_elm,
		get_field_value: get_field_value,
		isInputField: isInputField,
		getInputField: getInputField,
	};
} )( window.jQuery, window, document );

var thwdtp_public = ( function ( $, window, document ) {
	'use strict';

	function initialize_thwdtp() {
		$( '#thwdtp_pickup_datepicker_field' ).css( 'display', 'none' );
		$( '#thwdtp_pickup_datepicker_field' ).removeClass(
			'validate-required'
		);
		$( '#thwdtp_pickup_datepicker_field' ).removeClass(
			'woocommerce-validated'
		);
		//$('#thwdtp_delivery_datepicker_field').css("display","none");
		$( '#thwdtp_delivery_time_field' ).css( 'display', 'none' );
		$( '#thwdtp_pickup_time_field' ).css( 'display', 'none' );

		if ( thwdtp_public_var.enable_delivery_date != false ) {
			$( '#thwdtp_delivery_datepicker_field' ).css( 'display', 'block' );
			setup_delivery_datepicker();
		} else if ( thwdtp_public_var.enable_delivery_time != false ) {
			set_time_picker_today( 'delivery_time' );
			$( '#thwdtp_delivery_time_field' ).css( 'display', 'block' );
		}

		var checkout_form = $( 'form[name="checkout"]' );
		if ( checkout_form ) {
			$( document ).on( 'updated_checkout', function () {
				var shipping_based = thwdtp_public_var.based_on_shipping;
				if ( shipping_based == 1 ) {
					setup_custom_fields_on_shipping_method();
				} else {
					$( '#thwdtp_pickup_datepicker_field' ).css(
						'display',
						'none'
					);
					$( '#thwdtp_pickup_datepicker_field' ).removeClass(
						'validate-required'
					);
					$( '#thwdtp_pickup_datepicker_field' ).removeClass(
						'woocommerce-validated'
					);
					//$('#thwdtp_delivery_datepicker_field').css("display","none");
					//$("#thwdtp_delivery_time_field").css("display","none");
					$( '#thwdtp_pickup_time_field' ).css( 'display', 'none' );
					setup_delivery_datepicker();
				}
			} );

			var class_selector = 'thwdtp-enhanced-select';
			checkout_form.find( 'select.' + class_selector ).each( function () {
				var ms = $( this );
				ms.selectWoo( {
					minimumResultsForSearch: 10,
					allowClear: true,
					placeholder: ms.data( 'placeholder' ),
					maximumSelectionLength: ms.data( 'maxselections' ),
				} ).addClass( 'enhanced' );
			} );
		}
	}

	function setup_delivery_datepicker() {
		var settings = thwdtp_public_var.delivery_date_props,
			current_date = thwdtp_public_var.current_date,
			current_time = thwdtp_public_var.current_time;

		var enable_delivery_date = settings.enable_delivery_date,
			min_time_preperation = settings.min_preperation_days_delivery,
			allowable_days = settings.allowable_days_delivery,
			allowable_days = allowable_days ? allowable_days : 365,
			autoselect_first_day = settings.auto_select_first_date,
			date_format = settings.delivery_date_format,
			off_days = settings.delivery_off_days,
			week_start_date = settings.week_start_date;

		var time_props = thwdtp_public_var.delivery_time_props,
			enable_time_picker = time_props.enable_delivery_time;

		var min_days_prep = min_time_preperation
				? get_valid_time_start(
						min_time_preperation,
						current_time,
						'days'
				  )
				: 0,
			max_date =
				parseInt( min_days_prep ) + parseInt( allowable_days ) - 1;
		var default_date =
			autoselect_first_day == 1
				? new Date( current_date ).fp_incr( min_days_prep )
				: '';

		var set_offdays = [];

		if ( $.isArray( off_days ) ) {
			$.each( off_days, function ( key, value ) {
				set_offdays.push( parseInt( value ) );
			} );
		}

		var holidays = thwdtp_public_var.holidays,
			spec_days = thwdtp_public_var.specific_dates,
			enable_specific_dates_only = thwdtp_public_var.enable_specific_dates_only;

		if ( enable_delivery_date ) {
			var args = {
				altInput: true,
				altFormat: date_format,
				dateFormat: 'Y-m-d',
				minDate: new Date( current_date ).fp_incr( min_days_prep ),
				maxDate: new Date( current_date ).fp_incr( max_date ),
				defaultDate: default_date,

				locale: {
					firstDayOfWeek: week_start_date,
				},

				disable: [
					function ( date ) {
						var test = false;
						if ( $.inArray( date.getDay(), set_offdays ) != -1 ) {
							test = true;
						}
						var c_yr = date.getFullYear(),
							c_month =
								date.getMonth() + 1 < 10
									? '0' + ( date.getMonth() + 1 )
									: date.getMonth() + 1,
							c_day =
								date.getDate() < 10
									? '0' + date.getDate()
									: date.getDate(),
							c_date = c_yr + '-' + c_month + '-' + c_day;

						if ( holidays ) {
							if ( $.inArray( c_date, holidays ) != -1 ) {
								test = true;
							}
						}
						if ( spec_days ) {
							if ( $.inArray( c_date, spec_days ) != -1 ) {
								test = false;
							}
						}
						if(spec_days && enable_specific_dates_only){
							if ( $.inArray( c_date, spec_days ) == -1 ) {
								test = true;
							}
						}
						return test;
					},
				],

				onChange: function ( selectedDates, dateStr, instance ) {
					set_time_picker(
						selectedDates,
						dateStr,
						instance,
						'delivery_time',
						enable_time_picker,
						min_time_preperation
					);
				},

				onReady: function ( selectedDates, dateStr, instance ) {
					if ( default_date && dateStr ) {
						set_time_picker(
							selectedDates,
							dateStr,
							instance,
							'delivery_time',
							enable_time_picker,
							min_time_preperation
						);
					}
				},
			};
			flatpickr( '#thwdtp_delivery_datepicker', args );

			$( document.body ).trigger( 'flatpickr-set' );
		}
	}

	function setup_pickup_datepicker() {
		var date_props = thwdtp_public_var.pickup_date_props,
			current_date = thwdtp_public_var.current_date,
			current_time = thwdtp_public_var.current_time,
			enable_delivery_date = date_props.enable_pickup_date,
			min_time_preperation = date_props.min_preperation_time_pickup,
			allowable_days = date_props.allowable_days_pickup,
			allowable_days = allowable_days ? allowable_days : 365,
			autoselect_first_day = date_props.auto_select_first_date_pickup,
			date_format = date_props.pickup_date_format,
			off_days = date_props.pickup_off_days,
			week_start_date = date_props.week_start_date_pickup,
			min_days_prep = min_time_preperation
				? get_valid_time_start(
						min_time_preperation,
						current_time,
						'days'
				  )
				: 0,
			max_date =
				parseInt( min_days_prep ) + parseInt( allowable_days ) - 1,
			default_date =
				autoselect_first_day == 1
					? new Date( current_date ).fp_incr( min_days_prep )
					: '';

		var time_props = thwdtp_public_var.pickup_time_props,
			enable_time_picker = time_props.enable_pickup_time;

		var set_offdays = [];
		if ( off_days && $.isArray( off_days ) ) {
			$.each( off_days, function ( key, value ) {
				set_offdays.push( parseInt( value ) );
			} );
		}

		var holidays = thwdtp_public_var.holidays,
			spec_days = thwdtp_public_var.specific_dates;

		if ( enable_delivery_date ) {
			var args = {
				altInput: true,
				altFormat: date_format,
				dateFormat: 'Y-m-d',
				minDate: new Date( current_date ).fp_incr( min_days_prep ),
				maxDate: new Date( current_date ).fp_incr( max_date ),
				// defaultDate : default_date,
				locale: {
					firstDayOfWeek: week_start_date,
				},
				disable: [
					function ( date ) {
						var test = false;
						if ( $.inArray( date.getDay(), set_offdays ) != -1 ) {
							test = true;
						}
						//var c_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
						var c_yr = date.getFullYear(),
							c_month =
								date.getMonth() + 1 < 10
									? '0' + ( date.getMonth() + 1 )
									: date.getMonth() + 1,
							c_day =
								date.getDate() < 10
									? '0' + date.getDate()
									: date.getDate(),
							c_date = c_yr + '-' + c_month + '-' + c_day;
						if ( holidays ) {
							if ( $.inArray( c_date, holidays ) != -1 ) {
								test = true;
							}
						}
						if ( spec_days ) {
							if ( $.inArray( c_date, spec_days ) != -1 ) {
								test = false;
							}
						}
						return test;
					},
				],
				defaultDate: default_date,

				onChange: function ( selectedDates, dateStr, instance ) {
					set_time_picker(
						selectedDates,
						dateStr,
						instance,
						'pickup_time',
						enable_time_picker,
						min_time_preperation
					);
				},

				onReady: function ( selectedDates, dateStr, instance ) {
					if ( default_date && dateStr ) {
						set_time_picker(
							selectedDates,
							dateStr,
							instance,
							'pickup_time',
							enable_time_picker,
							min_time_preperation
						);
					}
				},
			};
			flatpickr( '#thwdtp_pickup_datepicker', args );
			$( document.body ).trigger( 'flatpickr-set' );
		}
	}

	function setup_custom_fields_on_shipping_method() {
		var shipping_based = thwdtp_public_var.based_on_shipping;

		if ( shipping_based == 1 ) {
			$( '#thwdtp_pickup_datepicker_field' ).css( 'display', 'none' );
			$( '#thwdtp_delivery_datepicker_field' ).css( 'display', 'none' );
			$( '#thwdtp_delivery_time_field' ).css( 'display', 'none' );
			$( '#thwdtp_pickup_time_field' ).css( 'display', 'none' );

			var enable_delivery_date = thwdtp_public_var.enable_delivery_date,
				enable_delivery_time = thwdtp_public_var.enable_delivery_time,
				enable_pickup_date = thwdtp_public_var.enable_pickup_date,
				enable_pickup_time = thwdtp_public_var.enable_pickup_time;

			var field = $( "input[name='shipping_method[0]']" );
			if ( field && field.length > 0 ) {
				var ftype = field.getType(),
					value = thwdtp_public_base.get_field_value(
						ftype,
						field,
						'shipping_method[0]'
					),
					pickup = value.includes( 'local_pickup' );

				if ( pickup ) {
					if ( enable_pickup_date != false ) {
						$( '#thwdtp_pickup_datepicker_field' ).show();
						setup_pickup_datepicker();
						$( '#thwdtp_delivery_datepicker' ).change();
					} else if ( enable_pickup_time != false ) {
						set_time_picker_today( 'pickup_time' );
						$( '#thwdtp_pickup_time_field' ).css(
							'display',
							'block'
						);
					}
				} else {
					if ( enable_delivery_date != false ) {
						$( '#thwdtp_delivery_datepicker_field' ).css(
							'display',
							'block'
						);
						setup_delivery_datepicker();
					} else if ( enable_delivery_time != false ) {
						set_time_picker_today( 'delivery_time' );

						$( '#thwdtp_delivery_time_field' ).css(
							'display',
							'block'
						);
					}
				}
			}
		}
	}

	function set_time_picker(
		selectedDates,
		dateStr,
		instance,
		elm,
		enable_time,
		prep_time
	) {
		if ( enable_time != false ) {
			var time_slot_elm = $( '#thwdtp_' + elm ),
				all_time_slots =
					elm == 'delivery_time'
						? thwdtp_public_var.delivery_time_slots
						: thwdtp_public_var.pickup_time_slots,
				specific_dates = thwdtp_public_var.specific_dates,
				selected_day = new Date( selectedDates ).getDay(),
				selected_day = selected_day.toString(),
				current_time = thwdtp_public_var.current_time;

			var valid_date_time_strt = get_valid_time_start(
				prep_time,
				current_time,
				'min_time_start'
			);
			var valid_date = valid_date_time_strt[ 'start_date' ];
			var slot_disable = false,
				valid_time_strt = '';

			if ( valid_date.getTime() === selectedDates[ 0 ].getTime() ) {
				valid_time_strt = valid_date_time_strt[ 'start_time' ];
				slot_disable = true;
			}

			time_slot_elm.empty();
			time_slot_elm.append(
				'<option  value="">Select Time Slot</option>'
			);

			$( '#thwdtp_' + elm + '_field' ).css( 'display', 'block' );
			var specific = false;
			$.each( all_time_slots, function ( key, time_slots ) {
				var available_time_slots = time_slots.slots
						? time_slots.slots
						: '',
					option = '',
					slot_days = time_slots.days,
					append = false;

				if (
					specific_dates.includes( dateStr ) &&
					slot_days &&
					slot_days.includes( dateStr )
				) {
					append =
						slot_days && slot_days.includes( dateStr )
							? true
							: false;
					specific = true;
				} else {
					append =
						slot_days &&
						slot_days.includes( selected_day ) &&
						specific === false
							? true
							: false;
				}
				if ( append ) {
					if ( specific === true ) {
						time_slot_elm
							.find( 'option' )
							.remove()
							.end()
							.append(
								'<option value="">Select Time Slot</option>'
							);
					}
					if ( available_time_slots ) {
						for (
							var i = 0;
							i < available_time_slots.length;
							i++
						) {
							if ( slot_disable ) {
								var strt_slot =
										available_time_slots[ i ].split( '-' ),
									slot_strt_time = convertTime12to24(
										strt_slot[ 0 ]
									);

								if ( slot_strt_time >= valid_time_strt ) {
									option +=
										'<option value="' +
										available_time_slots[ i ] +
										'">' +
										available_time_slots[ i ] +
										'</option>';
								}
							} else {
								option +=
									'<option value="' +
									available_time_slots[ i ] +
									'">' +
									available_time_slots[ i ] +
									'</option>';
							}
						}
					}
					time_slot_elm.append( option );
				}
			} );
		}
	}

	function get_valid_time_start( min, time, type ) {
		var min_date_time = [];

		var current_date = thwdtp_public_var.current_date;

		var t = time.split( ':' ),
			t_h = Number( t[ 0 ] ),
			t_m = Number( t[ 1 ] );

		var m = min % 60;
		var hrs = Math.floor( min / 60 );
		var h = Math.floor( hrs % 24 );
		var d = Math.floor( min / 1440 );

		h = h + t_h;
		m = m + t_m;

		if ( h >= 24 ) {
			d++;
			h -= 24;
		}
		if ( m >= 60 ) {
			h++;
			m -= 60;
		}

		var start_time =
			( h + '' ).padStart( 2, '0' ) + ':' + ( m + '' ).padStart( 2, '0' );
		var start_date = new Date( current_date ).fp_incr( d );

		min_date_time[ 'start_date' ] = start_date;
		min_date_time[ 'start_time' ] = start_time;

		if ( type == 'days' ) {
			return d;
		} else {
			return min_date_time;
		}
	}

	function convert_ymd_str( date ) {
		var mnth = ( '0' + ( date.getMonth() + 1 ) ).slice( -2 ),
			day = ( '0' + date.getDate() ).slice( -2 );
		return [ date.getFullYear(), mnth, day ].join( '-' );
	}

	function set_time_picker_today( elm ) {
		var time_slot_elm = $( '#thwdtp_' + elm ),
			all_time_slots =
				elm == 'delivery_time'
					? thwdtp_public_var.delivery_time_slots
					: thwdtp_public_var.pickup_time_slots,
			specific_dates = thwdtp_public_var.specific_dates,
			current_date = thwdtp_public_var.current_date,
			selected_day = new Date( current_date ).getDay(),
			selected_day = selected_day.toString(),
			dateStr = new Date( current_date ).toISOString().slice( 0, 10 );

		if ( elm == 'delivery_time' ) {
			var time_props = thwdtp_public_var.delivery_time_props,
				prep_time = time_props.min_preperation_time_delivery
					? time_props.min_preperation_time_delivery
					: '';
		} else {
			var time_props = thwdtp_public_var.pickup_time_props,
				prep_time = time_props.min_preperation_time_pickup
					? time_props.min_preperation_time_pickup
					: '';
		}

		$( '#thwdtp_' + elm + '_field' ).css( 'display', 'block' );
		var specific = false;

		time_slot_elm.empty();
		time_slot_elm.append( '<option  value="">Select Time Slot</option>' );

		$.each( all_time_slots, function ( key, time_slots ) {
			var available_time_slots = time_slots.slots,
				option = '',
				slot_days = time_slots.days,
				append = false;

			if (
				specific_dates.includes( dateStr ) &&
				slot_days &&
				slot_days.includes( dateStr )
			) {
				append = true;
				specific = true;
			} else {
				append =
					slot_days &&
					slot_days.includes( selected_day ) &&
					specific === false
						? true
						: false;
			}
			if ( append === true ) {
				if ( specific === true ) {
					time_slot_elm
						.find( 'option' )
						.remove()
						.end()
						.append( '<option value="">Select Time Slot</option>' );
				}

				for ( var i = 0; i < available_time_slots.length; i++ ) {
					var strt_slot = available_time_slots[ i ].split( '-' );
					var slot_strt_time = convertTime12to24( strt_slot[ 0 ] );

					var valid_slot = check_valid_time_slot_today(
						slot_strt_time,
						prep_time
					);

					if ( valid_slot ) {
						option +=
							'<option value="' +
							available_time_slots[ i ] +
							'">' +
							available_time_slots[ i ] +
							'</option>';
					}
				}
				time_slot_elm.append( option );
			}
		} );
	}

	function check_valid_time_slot_today( slot_time, prep_time ) {
		var $valid = false;
		var time = thwdtp_public_var.current_time;
		var min = prep_time;
		var t = time.split( ':' ), // convert to array [hh, mm, ss]
			h = Number( t[ 0 ] ), // get hours
			m = Number( t[ 1 ] ); // get minutes
		m += min % 60; // increment minutes
		h += Math.floor( min / 60 ); // increment hours
		if ( m >= 60 ) {
			h++;
			m -= 60;
		}

		var start_time =
			( h + '' ).padStart( 2, '0' ) + ':' + ( m + '' ).padStart( 2, '0' );

		if ( slot_time > start_time ) {
			$valid = true;
		}
		return $valid;
	}

	function convertTime12to24( time12h ) {
		var time = time12h.split( ' ' );

		if ( time[ 1 ] ) {
			//let [hours, minutes] = time[0].split(":");
			var _timesplit = time[ 0 ].split( ':' );
			var hours = _timesplit[ 0 ];
			var minutes = _timesplit[ 1 ];

			hours = hours.length === 1 ? 0 + hours : hours;

			if ( hours === '12' ) {
				hours = '00';
			}

			if ( time[ 1 ] === 'PM' ) {
				hours = parseInt( hours, 10 ) + 12;
			}
			return hours + ':' + minutes;
		} else {
			return time12h;
		}
	}

	function addtime( time, hour ) {
		var times = time.split( ':' );
		//clear here more than 24 hours
		var min = min % ( 24 * 60 );
		times[ 0 ] = parseInt( times[ 0 ] ) + parseInt( min / 60 );
		times[ 1 ] = parseInt( times[ 1 ] ) + ( min % 60 );
		//here control if hour and minutes reach max
		if ( times[ 1 ] >= 60 ) {
			times[ 1 ] = 0;
			times[ 0 ]++;
		}
		times[ 0 ] >= 24 ? ( times[ 0 ] -= 24 ) : null;
		//here control if less than 10 then put 0 frond them
		times[ 0 ] < 10 ? ( times[ 0 ] = '0' + times[ 0 ] ) : null;
		times[ 1 ] < 10 ? ( times[ 1 ] = '0' + times[ 1 ] ) : null;

		return times.join( ':' );
	}

	initialize_thwdtp();

	return {
		initialize_thwdtp: initialize_thwdtp,
	};
} )( window.jQuery, window, document );

function init_thwdtp() {
	thwdtp_public.initialize_thwdtp();
}

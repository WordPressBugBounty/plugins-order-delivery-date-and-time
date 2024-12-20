var thwdtp_base = ( function ( $, window, document ) {
	'use strict';

	function form_wizard_open( popup ) {
		popup.css( 'display', 'block' );
	}

	function form_wizard_close( elm ) {
		var popup = get_popup( elm );
		popup.css( 'display', 'none' );
	}

	function get_popup( elm ) {
		return $( elm ).closest( '.thwdtpadmin-modal-mask' );
	}

	function decodeHtml( str ) {
		if ( str && typeof str === 'string' ) {
			var map = {
				'&amp;': '&',
				'&lt;': '<',
				'&gt;': '>',
				'&quot;': '"',
				'&#039;': "'",
			};
			return str.replace(
				/&amp;|&lt;|&gt;|&quot;|&#039;/g,
				function ( m ) {
					return map[ m ];
				}
			);
		}
		return str;
	}

	function get_property_field_value( form, type, name ) {
		var value = '';

		switch ( type ) {
			case 'select':
				value = form.find( 'select[name=i_' + name + ']' ).val();
				value = value == null ? '' : value;
				break;

			case 'checkbox':
				value = form
					.find( 'input[name=i_' + name + ']' )
					.prop( 'checked' );
				value = value ? 1 : 0;
				break;

			case 'textarea':
				value = form.find( 'textarea[name=i_' + name + ']' ).val();
				value = value == null ? '' : value;
				break;
			case 'multiselect':
				value = form.find( '#i_' + name + '' ).val();
				value = value == null ? '' : value;
				break;

			default:
				value = form.find( 'input[name=i_' + name + ']' ).val();
				value = value == null ? '' : value;
		}

		return value;
	}

	function set_property_field_value( form, type, name, value, multiple ) {
		switch ( type ) {
			case 'select':
				if ( multiple == 1 && typeof value === 'string' ) {
					value = value.split( ',' );
					name = name + '[]';
				}
				form.find( 'select[name="i_' + name + '"]' ).val( value );
				break;

			case 'checkbox':
				value = value == 1 ? 1 : 0;
				form.find( 'input[name=i_' + name + ']' ).prop(
					'checked',
					value
				);
				break;

			case 'textarea':
				value = value ? decodeHtml( value ) : value;
				form.find( 'textarea[name=i_' + name + ']' ).val( value );
				break;

			case 'multiselect':
				if ( multiple == 1 && typeof value === 'string' ) {
					value = value.split( ',' );
					//name = name+"[]";
				}
				form.find( 'select[id=i_' + name + ']' ).val( value );
				break;

			default:
				value = value ? decodeHtml( value ) : value;
				form.find( 'input[name=i_' + name + ']' ).val( value );
		}
	}

	return {
		decodeHtml: decodeHtml,
		form_wizard_open: form_wizard_open,
		form_wizard_close: form_wizard_close,
		get_property_field_value: get_property_field_value,
		set_property_field_value: set_property_field_value,
	};
} )( window.jQuery, window, document );

function thwdtpCloseModal( elm ) {
	thwdtp_base.form_wizard_close( elm );
}

var thwdtp_settings = ( function ( $, window, document ) {
	'use strict';
	var DELIVERY_DATE_PROPS = {
		enable_delivery_date: {
			name: 'enable_delivery_date',
			type: 'checkbox',
		},
		set_date_as_required_delivery: {
			name: 'set_date_as_required_delivery ',
			type: 'checkbox',
		},
		delivery_date_label: { name: 'delivery_date_label ', type: 'text' },
		min_preperation_days_delivery: {
			name: 'min_preperation_days_delivery ',
			type: 'number',
		},
		allowable_days_delivery: {
			name: 'allowable_days_delivery ',
			type: 'number',
		},
		max_delivery_per_day: { name: 'max_delivery_per_day', type: 'number' },
		week_start_date: { name: 'week_start_date', type: 'select' },
		delivery_date_format: { name: 'delivery_date_format', type: 'select' },
		auto_select_first_date: {
			name: 'auto_select_first_date',
			type: 'checkbox',
		},
		delivery_off_days: {
			name: 'delivery_off_days',
			type: 'multiselect',
			multiple: 1,
		},
	};

	var DELIVERY_TIME_SLOT_PROPS = {
		time_slot_add_method: {
			name: 'time_slot_add_method',
			type: 'select',
			change: 1,
		},
		time_slot_for: { name: 'time_slot_for', type: 'select', change: 1 },
		enable_delivery_time_slot: {
			name: 'enable_delivery_time_slot',
			type: 'checkbox',
		},
		order_deliveries_per_slot: {
			name: 'order_deliveries_per_slot',
			type: 'number',
		},
		time_slot_type_week_days: {
			name: 'time_slot_type_week_days',
			type: 'multiselect',
			multiple: 1,
		},
		time_slot_type_specific_date: {
			name: 'time_slot_type_specific_date',
			type: 'multiselect',
			multiple: 1,
		},
	};

	var DELIVERY_TIME_SLOT_BULK_PROPS = {
		order_slot_from_hrs: { name: 'order_slot_from_hrs', type: 'number' },
		order_slot_from_mins: { name: 'order_slot_from_mins', type: 'number' },
		order_slot_from_format: {
			name: 'order_slot_from_format',
			type: 'select',
		},
		order_slot_end_hrs: { name: 'order_slot_end_hrs', type: 'number' },
		order_slot_end_mins: { name: 'order_slot_end_mins', type: 'number' },
		order_slot_end_format: {
			name: 'order_slot_end_format',
			type: 'select',
		},
		order_slot_duration_hrs: {
			name: 'order_slot_duration_hrs',
			type: 'number',
		},
		order_slot_duration_mins: {
			name: 'order_slot_duration_mins',
			type: 'number',
		},
		order_slot_interval_hrs: {
			name: 'order_slot_interval_hrs',
			type: 'number',
		},
		order_slot_interval_mins: {
			name: 'order_slot_interval_mins',
			type: 'number',
		},
	};

	var DELIVERY_TIME_PROPS = {
		enable_delivery_time: {
			name: 'enable_delivery_time',
			type: 'checkbox',
		},
		mandatory_delivery_time: {
			name: 'mandatory_delivery_time',
			type: 'checkbox',
		},
		delivery_time_label: { name: 'delivery_time_label', type: 'text' },
		min_preperation_time_delivery: {
			name: 'min_preperation_time_delivery',
			type: 'number',
		},
	};

	var PICKUP_DATE_PROPS = {
		enable_pickup_date: { name: 'enable_pickup_date', type: 'checkbox' },
		set_date_as_required_pickup: {
			name: 'set_date_as_required_pickup',
			type: 'checkbox',
		},
		pickup_date_label: { name: 'pickup_date_label ', type: 'text' },
		min_preperation_time_pickup: {
			name: 'min_preperation_time_pickup',
			type: 'number',
		},
		allowable_days_pickup: {
			name: 'allowable_days_pickup',
			type: 'number',
		},
		//max_delivery_per_day        : {name : 'max_delivery_per_day', type : 'number'},
		week_start_date_pickup: { name: 'week_start_date', type: 'select' },
		pickup_date_format: { name: 'pickup_date_format', type: 'select' },
		auto_select_first_date_pickup: {
			name: 'auto_select_first_date_pickup',
			type: 'checkbox',
		},
		pickup_off_days: {
			name: 'pickup_off_days',
			type: 'multiselect',
			multiple: 1,
		},
	};

	var PICKUP_TIME_PROPS = {
		enable_pickup_time: { name: 'enable_pickup_time', type: 'checkbox' },
		mandatory_pickup_time: {
			name: 'mandatory_pickup_time',
			type: 'checkbox',
		},
		pickup_time_label: { name: 'pickup_time_label', type: 'text' },
		min_preperation_time_pickup: {
			name: 'min_preperation_time_pickup',
			type: 'number',
		},
	};

	var COMMON_FIELD_PROPS = {
		field_positions: { name: 'field_positions', type: 'select' },
		section_name: { name: 'section_name', type: 'text' },
		time_formats: { name: 'time_formats', type: 'select' },
		enable_on_shipping_method: {
			name: 'enable_on_shipping_method',
			type: 'checkbox',
		},
	};

	$( function () {
		var tabs_wrapper = $( '#thwdtpadmin_wrapper' );
		initialise_tab_switch( tabs_wrapper );

		$( '#thwdtp_specific_date_datepicker' ).flatpickr( {} );

		$( '#thwdtp_holiday_datepicker' ).flatpickr( {} );

		var timeslot_pp = $( '.thwdtp-wrap' );
		var class_selector = 'thpladmin-enhanced-multi-select';
		timeslot_pp.find( 'select.' + class_selector ).each( function () {
			var ms = $( this );
			ms.selectWoo( {
				minimumResultsForSearch: 10,
				allowClear: true,
				//placeholder: ms.data('placeholder'),
				placeholder: '',
				maximumSelectionLength: ms.data( 'maxselections' ),
			} ).addClass( 'enhanced' );
		} );

		var type = 'multiselect',
			name = 'delivery_off_days',
			form = $( '#thwdtp_delivery_date_settings' ),
			value = form.find( 'input[name="i_delivery_off_days"]' ).val();

		thwdtp_base.set_property_field_value( form, type, name, value, 1 );
		form.find( 'select[name="i_' + name + '"]' ).trigger( 'change' );

		var pick_date_form = $( '#thwdtp_pickup_date_settings' ),
			pickup_ofdays = pick_date_form
				.find( 'input[name="i_pickup_off_days"]' )
				.val(),
			pickup_of_name = 'pickup_off_days',
			type = 'multiselect';

		thwdtp_base.set_property_field_value(
			pick_date_form,
			type,
			pickup_of_name,
			pickup_ofdays,
			1
		);
		pick_date_form
			.find( 'select[name="i_' + pickup_of_name + '"]' )
			.trigger( 'change' );
	} );

	function initialise_tab_switch( tabs_wrapper ) {
		var tabs = tabs_wrapper.find( '#thwdtpadmin-tabs' );
		var tab_panels = tabs_wrapper.find( '#thwdtpadmin-tab-panels' );

		tabs.find( 'li.thwdtpadmin-tab a' ).on( 'click', function () {
			var tab_number = $( this ).data( 'tab' );
			switch_settings_tab( tab_number, $( this ), tabs, tab_panels );

			if ( tab_number === 2 ) {
				set_preperation_time_field_delivery();
			} else if ( tab_number === 3 ) {
				set_preperation_time_field_pickup();
			}
		} );

		var first_tab_li = tabs.find( 'li.thwdtpadmin-tab:first-child' );
		first_tab_li.find( 'a' ).trigger( 'click' );
	}

	function set_preperation_time_field_delivery() {
		var form = $( '#thwdtp_delivery_date_settings' ),
			del_enable = thwdtp_base.get_property_field_value(
				form,
				'checkbox',
				'enable_delivery_date'
			),
			prep_elm = $( '#thwdtp_delivery_time_settings' ).find(
				'#min_prep_time_tr'
			);

		if ( del_enable ) {
			prep_elm.hide();
		} else {
			prep_elm.show();
		}
	}

	function set_preperation_time_field_pickup() {
		var form = $( '#thwdtp_pickup_date_settings' ),
			pick_enable = thwdtp_base.get_property_field_value(
				form,
				'checkbox',
				'enable_pickup_date'
			),
			prep_elm = $( '#thwdtp_pickup_time_settings' ).find(
				'#min_prep_time_tr_pick'
			);

		if ( pick_enable ) {
			prep_elm.hide();
		} else {
			prep_elm.show();
		}
	}

	function switch_settings_tab( tab_number, tab, tabs, tab_panels ) {
		if ( ! tab ) {
			tab = tabs.find( '#tab-' + tab );
		}

		tabs.find( 'li a' ).removeClass( 'active' );
		var active_tab_panel = tab_panels.find(
			'#thwdtpadmin-tab-panel-' + tab_number
		);

		if ( ! tab.hasClass( 'active' ) ) {
			tab.addClass( 'active' );
		}

		tab_panels
			.find( 'div.thwdtpadmin-tab-panel' )
			.not( '#thwdtpadmin-tab-panel-' + tab_number )
			.hide();

		active_tab_panel.show();
	}

	function open_new_time_slot( o_type ) {
		open_time_slot( 'new', false, false, o_type );
	}

	function open_edit_time_slot( elm, rowId, $type ) {
		open_time_slot( 'edit', elm, rowId, $type );
	}

	function open_time_slot( type, elm, rowId, o_type ) {
		var popup = $( '#thwdtp_time_slot_pp_' + o_type ),
			form = $( '#thwdtp_time_slot_fields_' + o_type );

		populate_options_on_specific_date( popup, form, type, elm, rowId );

		popup
			.find( 'select[id=i_time_slot_add_method]' )
			.val( 'individual_time_slot' )
			.change();
		popup.find( 'select[id=i_time_slot_for]' ).val( 'week_days' ).change();
		thwdtp_base.form_wizard_open( popup );
	}

	function populate_time_slot_form( popup, form, action, elm, rowId ) {
		var title = action === 'edit' ? 'Edit Time Slot' : 'New Time Slot';
		popup.find( '.wizard-title' ).text( title );

		if ( action === 'new' ) {
			clear_time_slot_form( popup );
			popup.find( '.save-btn' ).removeAttr( 'data-settings-key' );
		} else {
			popup.find( '.save-btn' ).attr( 'data-settings-key', rowId );

			var row = $( elm ).closest( 'tr' ),
				settings_general_json = row.find( '.f_props' ).val(),
				settings_slots_json = row.find( '.f_props_slots' ).val(),
				settings_general = JSON.parse( settings_general_json ),
				settings_slots =
					settings_slots_json != ''
						? JSON.parse( settings_slots_json )
						: '';

			populate_time_slot_general( action, popup, settings_general );
			var method = settings_general.time_slot_add_method;
			if ( method == 'individual_time_slot' ) {
				populate_time_slot_ranges( popup, row, settings_slots );
			}
		}
	}

	function populate_options_on_specific_date(
		popup,
		form,
		type,
		elm,
		rowId
	) {
		var data = {
			action: 'thwdtp_get_specific_dates',
			security: wdtp_var.specific_dates_nonce,
		};
		$( '#loading-image ' ).css( 'display', 'block' );

		$.ajax( {
			type: 'POST',
			url: wdtp_var.ajax_url,
			data: data,
			success: function ( result ) {
				modify_specfic_date_options( result, popup );
				populate_time_slot_form( popup, form, type, elm, rowId );
				$( '#loading-image ' ).css( 'display', 'none' );
			},
		} );
	}

	function modify_specfic_date_options( options, popup ) {
		var elm = popup.find( '#i_time_slot_type_specific_date' );
		elm.empty();
		$.each( options, function ( key, date ) {
			elm.append( '<option value=' + date + '> ' + date + '</option>' );
		} );
	}

	function clear_time_slot_form( form ) {
		form.find( 'input[name="i_order_deliveries_per_slot"]' ).val( '' );
		form.find( 'select[id="i_time_slot_type_week_days"]' )
			.val( '' )
			.trigger( 'change' );
		form.find( 'select[name="i_time_slot_add_method"]' )
			.val( 'individual_time_slot' )
			.trigger( 'change' );
		//form.find("select[name=i_"+name+"]").val(value)
	}

	function populate_time_slot_general( action, form, settings_general ) {
		var method = settings_general.time_slot_add_method,
			enable_time_slot = settings_general.enable_delivery_time_slot,
			time_slot_for = settings_general.time_slot_for,
			slot_range_table = form.find( '#thwdtp_time_slot_add_methods' );

		populate_time_slot_general_on_popup(
			DELIVERY_TIME_SLOT_PROPS,
			form,
			settings_general
		);
		populate_time_slot_general_on_popup(
			DELIVERY_TIME_SLOT_BULK_PROPS,
			slot_range_table,
			settings_general
		);
	}

	function populate_time_slot_general_on_popup(
		slot_props,
		form,
		settings_general
	) {
		$.each( slot_props, function ( name, field ) {
			var type = field[ 'type' ],
				value =
					settings_general && settings_general[ name ]
						? settings_general[ name ]
						: '';

			thwdtp_base.set_property_field_value(
				form,
				type,
				name,
				value,
				field[ 'multiple' ]
			);

			if ( type == 'select' || type == 'multiselect' ) {
				if ( field[ 'multiple' ] == 1 || field[ 'change' ] == 1 ) {
					form.find( 'select[id="i_' + name + '"]' ).trigger(
						'change'
					);
				}
			} else if ( type == 'checkbox' ) {
				if ( field[ 'change' ] == 1 ) {
					form.find( 'input[id="i_' + name + '"]' ).trigger(
						'change'
					);
				}
			}
		} );
	}

	function populate_time_slot_ranges( form, row, settings_slots ) {
		var slotHtml = '';
		if ( settings_slots ) {
			//slotHtml += '<tr><td class="label" colspan="2"> Time From - To </td> </tr>';

			jQuery.each( settings_slots, function () {
				slotHtml += prepare_slot_range_row_html( this );
			} );
		}

		var slotTable = form.find(
			'#thwdtp_time_slot_add_methods .thwdtp-time-slot-list tbody'
		);

		if ( slotHtml ) {
			slotTable.html( slotHtml );
		} else {
			slotTable.html( slotHtml );
		}
	}

	function time_slot_method_change_listner( elm ) {
		var popup = $( '#thwdtp_time_slot_pp' ),
			form = $( elm ).closest( 'form' ),
			method = $( elm ).val();

		method = method == null ? 'individual_time_slot' : method;
		form.find( '#thwdtp_time_slot_add_methods' ).html(
			$( '#thwdtp_order_time_range_id_' + method ).html()
		);
	}

	function time_slot_type_change_listner( elm ) {
		var popup = $( '.thwdtp_time_slot_pp' ),
			form = $( elm ).closest( 'form' ),
			type = $( elm ).val(),
			week_days_field = form
				.find( '#i_time_slot_type_week_days' )
				.closest( 'tr' ),
			spec_days_field = form
				.find( '#i_time_slot_type_specific_date' )
				.closest( 'tr' );

		if ( type == 'specific_date' ) {
			spec_days_field.css( 'display', 'table-row' );
			week_days_field.css( 'display', 'none' );
		} else {
			week_days_field.css( 'display', 'table-row' );
			spec_days_field.css( 'display', 'none' );
		}
	}

	function prepare_slot_range_row_html( slots ) {
		var from_hrs = '';
		var from_mins = '';
		var from_format = '';
		var to_hrs = '';
		var to_mins = '';
		var to_format = '';

		var fromOp1Selected = '';
		var fromOp2Selected = '';

		var toOp1Selected = '';
		var toOp2Selected = '';

		if ( slots ) {
			from_hrs = slots.from_hrs ? slots.from_hrs : '';
			from_mins = slots.from_mins ? slots.from_mins : '';
			from_format = slots.from_format ? slots.from_format : '';
			to_hrs = slots.to_hrs ? slots.to_hrs : '';
			to_mins = slots.to_mins ? slots.to_mins : '';
			to_format = slots.to_format ? slots.to_format : '';

			if ( from_format == 'am' ) {
				fromOp1Selected = 'selected';
			} else {
				fromOp2Selected = 'selected';
			}

			if ( to_format == 'am' ) {
				toOp1Selected = 'selected';
			} else {
				toOp2Selected = 'selected';
			}
		}

		var html = '<tr>';

		html +=
			'<td ><input type="number" name="i_order_time_from_hrs[]" min="1" max="12" value="' +
			from_hrs +
			'" placeholder=00 class="time-slot"></td>';
		html += '<td><span> : </span> </td>';
		html +=
			'<td ><input type="number" name="i_order_time_from_mins[]" min="1" max="59" value="' +
			from_mins +
			'" placeholder=00 class="time-slot"></td>';

		html +=
			'<td class="slot-time-format"> <select name="i_order_time_from_format[]" value="' +
			from_format +
			'" style="width: 60px;" class="time-slot">';
		html += '<option value="am" ' + fromOp1Selected + '>AM</option>';
		html += '<option value="pm" ' + fromOp2Selected + '>PM</option>';
		html += '</select></td>';

		html += '<td> <span style="padding:10px;"> TO </span></td>';

		html +=
			'<td ><input type="number" name="i_order_time_to_hrs[]" min="1" max="12" value="' +
			to_hrs +
			'" placeholder=00 class="time-slot"></td>';
		html += '<td><span> : </span> </td>';
		html +=
			'<td ><input type="number" name="i_order_time_to_mins[]" min="1" max="59" value="' +
			to_mins +
			'" placeholder=00 class="time-slot"></td>';
		html +=
			'<td class="slot-time-format"> <select name="i_order_time_to_format[]" value="' +
			to_format +
			'" style="width: 60px;" class="time-slot">';
		html += '<option value="am" ' + toOp1Selected + '>AM</option>';
		html += '<option value="pm" ' + toOp2Selected + '>PM</option>';
		html += '</select></td>';
		html += '<td class="action-cell">';
		html +=
			'<a href="javascript:void(0)" onclick="thwdtpAddNewSlotRow(this)" class="btn btn-tiny btn-primary" title="Add new option">+</a>';
		html += '</td>';
		html += '<td class="action-cell">';
		html +=
			'<a href="javascript:void(0)" onclick="thwdtpRemoveNewSlotRow(this)" class="btn btn-tiny btn-danger" title="Remove option">x</a>';
		html += '</td>';
		html += '</tr>';

		return html;
	}

	function add_new_slot_row( elm ) {
		var ptable = $( elm ).closest( 'table' );
		var slotrangeSize = ptable.find( 'tbody tr' ).size();

		if ( slotrangeSize > 0 ) {
			ptable
				.find( 'tbody tr:last' )
				.after( prepare_slot_range_row_html( null ) );
		} else {
			ptable
				.find( 'tbody' )
				.append( prepare_slot_range_row_html( null ) );
		}
	}

	function remove_slot_row( elm ) {
		var ptable = $( elm ).closest( 'table' );
		$( elm ).closest( 'tr' ).remove();
		var rowsSize = ptable.find( 'tbody tr' ).size();
		if ( rowsSize == 0 ) {
			ptable
				.find( 'tbody' )
				.append( prepare_slot_range_row_html( null ) );
		}
	}

	function save_settings( settings, type, edit_key ) {
		if ( settings ) {
			var data = {
				action: 'thwdtp_save_settings',
				settings: JSON.stringify( settings ),
				section: type,
				key: edit_key,
				security: wdtp_var.save_settings,
			};

			$( '#loading-image ' ).css( 'display', 'block' );
			$( '.thwdtp-wrap' ).css( 'opacity', '0.3' );

			$.ajax( {
				type: 'POST',
				url: wdtp_var.ajax_url,
				data: data,
				success: function ( result ) {
					$( '#loading-image ' ).css( 'display', 'none' );
					$( '.thwdtp-wrap' ).css( 'opacity', '1' );
					show_success_message( result[ 'message' ] );
					if ( type === 'delivery_time' || type === 'pickup_time' ) {
						populate_time_slot_rows( result[ 'settings' ], type );
					}
					if (
						type === 'delivery_time_general' ||
						type === 'pickup_time_general'
					) {
						change_time_slot_table( result[ 'settings' ], type );
					}
				},
			} );
		}
	}

	function show_success_message( msg ) {
		if ( msg === 'success' ) {
			$( '.th-success-msg.success-msg' ).show();
			setTimeout( function () {
				$( '.th-success-msg.success-msg' ).fadeOut( 'fast' );
			}, 2000 );
		} else {
			$( '.th-success-msg.error-msg' ).show();
			setTimeout( function () {
				$( '.th-success-msg.error-msg' ).fadeOut( 'fast' );
			}, 2000 );
		}
	}

	function change_time_slot_table( $time_settings, type ) {
		type = type === 'pickup_time_general' ? 'pickup_time' : 'delivery_time';
		populate_time_slot_rows( $time_settings, type );
	}

	function get_settings_value( form, settings_field ) {
		var settings_value = {};
		$.each( settings_field, function ( name, field ) {
			var type = field[ 'type' ];
			settings_value[ name ] = thwdtp_base.get_property_field_value(
				form,
				type,
				name
			);
		} );
		return settings_value;
	}

	function save_delivery_date_settings( elm, event ) {
		event.preventDefault();
		var popup = $( '#thwdtpadmin-tab-panels' ),
			form = $( elm ).closest( 'form' );

		var settings = get_settings_value( form, DELIVERY_DATE_PROPS );
		save_settings( settings, 'delivery_date', null );
	}

	function save_pickup_date_settings( elm, event, type ) {
		event.preventDefault();
		var form = $( elm ).closest( 'form' );
		var settings = get_settings_value( form, PICKUP_DATE_PROPS );
		save_settings( settings, 'pickup_date', null );
	}

	function save_other_settings( elm, event, type ) {
		event.preventDefault();
		var form = $( elm ).closest( 'form' );
		var settings = get_settings_value( form, COMMON_FIELD_PROPS );
		save_settings( settings, 'common_fields', null );
	}

	function save_delivery_time_slot( elm, event, type, o_type ) {
		event.preventDefault();
		var popup = $( '#thwdtp_time_slot_pp_' + o_type ),
			settingsObj = {},
			slot_range_table = popup.find( '#thwdtp_time_slot_add_methods' ),
			time_slots_settings = get_time_slot_settings( slot_range_table ),
			general_settings = get_settings_value(
				popup,
				DELIVERY_TIME_SLOT_PROPS
			);

		var slot_table = popup.find( '#thwdtp_time_slot_add_methods' ),
			bulk_slot_settings = get_settings_value(
				slot_table,
				DELIVERY_TIME_SLOT_BULK_PROPS
			);
		$( '.thwdtp_time_slot_pp .timeslot-error' ).css( 'display', 'none' );
		if (
			time_slots_settings.length > 0 ||
			( bulk_slot_settings[ 'order_slot_from_hrs' ] &&
				bulk_slot_settings[ 'order_slot_end_hrs' ] )
		) {
			var all_settings = $.extend( general_settings, bulk_slot_settings );
			settingsObj[ 'time_slots_settings' ] = time_slots_settings;
			settingsObj[ 'general_settings' ] = all_settings;

			var edit_key = $( elm ).attr( 'data-settings-key' );
			edit_key = edit_key ? edit_key : null;

			save_settings( settingsObj, o_type + '_time', edit_key );
			thwdtp_base.form_wizard_close( elm );
		} else {
			$( '.thwdtp_time_slot_pp .timeslot-error' ).css(
				'display',
				'block'
			);
		}
	}

	function get_slots_settings_actions_value( form, action ) {
		var f_slots = {},
			r_slots = {};
		f_slots = form
			.find( '.f_slot_days' )
			.map( function () {
				return $( this ).val();
			} )
			.get();

		if ( action == 'delete' ) {
			var f_deleted = form
					.find( '.f_deleted' )
					.map( function () {
						return $( this ).val();
					} )
					.get(),
				slots_deleted = [];

			$.each( f_slots, function ( key, value ) {
				if ( f_deleted[ key ] && f_deleted[ key ] == 1 ) {
					slots_deleted.push( value );
				}
			} );

			r_slots = slots_deleted;
		} else {
			var f_enabled = form
					.find( '.f_enabled' )
					.map( function () {
						return $( this ).val();
					} )
					.get(),
				slots_enabled = {};

			$.each( f_slots, function ( key, value ) {
				slots_enabled[ value ] = f_enabled[ key ];
			} );

			r_slots = slots_enabled;
		}

		return r_slots;
	}

	function save_delivery_time_settings( elm, event, type ) {
		event.preventDefault();
		var panel = $( '#thwdtpadmin-tab-panels' ),
			form = $( '#thwdtp_delivery_time_settings' );

		var settingsObj = {};

		var settings = get_settings_value( form, DELIVERY_TIME_PROPS ),
			slots_delete_settings = get_slots_settings_actions_value(
				form,
				'delete'
			),
			slots_state_settings = get_slots_settings_actions_value(
				form,
				'state'
			);
		settingsObj[ 'settings' ] = settings;
		settingsObj[ 'deleted_keys' ] = slots_delete_settings;
		settingsObj[ 'enable_disable' ] = slots_state_settings;
		save_settings( settingsObj, 'delivery_time_general', null );
	}

	function save_pickup_time_settings( elm, event, type ) {
		event.preventDefault();
		var panel = $( '#thwdtpadmin-tab-panels' ),
			form = $( '#thwdtp_pickup_time_settings' );

		var settingsObj = {};
		var settings = get_settings_value( form, PICKUP_TIME_PROPS ),
			slots_delete_settings = get_slots_settings_actions_value(
				form,
				'delete'
			),
			slots_state_settings = get_slots_settings_actions_value(
				form,
				'state'
			);
		settingsObj[ 'settings' ] = settings;
		settingsObj[ 'deleted_keys' ] = slots_delete_settings;
		settingsObj[ 'enable_disable' ] = slots_state_settings;

		save_settings( settingsObj, 'pickup_time_general', null );
	}

	function specific_delivery_dates( elm, event, type ) {
		event.preventDefault();
		var form = $( '#thwdtp_specific_delivery_date_form' ),
			settingsObj = {};
		var settings = form
			.find( "input[name='thwdtp_specific_dates[]']" )
			.map( function () {
				return $( this ).val();
			} )
			.get();

		save_settings( settings, 'specific_dates', null );
	}

	function save_holidays( elm, event, type ) {
		event.preventDefault();
		var form = $( '#thwdtp_delivery_holidays_form' ),
			settingsObj = {};
		var settings = form
			.find( "input[name='thwdtp_holidays[]']" )
			.map( function () {
				return $( this ).val();
			} )
			.get();
		save_settings( settings, 'holidays', null );
	}

	function get_time_slot_settings( form ) {
		var from_hrs = form
				.find( "input[name='i_order_time_from_hrs[]']" )
				.map( function () {
					return $( this ).val();
				} )
				.get(),
			from_mins = form
				.find( "input[name='i_order_time_from_mins[]']" )
				.map( function () {
					return $( this ).val();
				} )
				.get(),
			from_format = form
				.find( "select[name='i_order_time_from_format[]']" )
				.map( function () {
					return $( this ).val();
				} )
				.get(),
			to_hrs = form
				.find( "input[name='i_order_time_to_hrs[]']" )
				.map( function () {
					return $( this ).val();
				} )
				.get(),
			to_mins = form
				.find( "input[name='i_order_time_to_mins[]']" )
				.map( function () {
					return $( this ).val();
				} )
				.get(),
			to_format = form
				.find( "select[name='i_order_time_to_format[]']" )
				.map( function () {
					return $( this ).val();
				} )
				.get(),
			slotsSize = from_hrs.length,
			slotsArr = [];

		for ( var i = 0; i < slotsSize; i++ ) {
			var slotDetails = {};
			if ( from_hrs[ i ] && to_hrs[ i ] ) {
				slotDetails[ 'from_hrs' ] = from_hrs[ i ];
				slotDetails[ 'from_mins' ] = from_mins[ i ];
				slotDetails[ 'from_format' ] = from_format[ i ];
				slotDetails[ 'to_hrs' ] = to_hrs[ i ];
				slotDetails[ 'to_mins' ] = to_mins[ i ];
				slotDetails[ 'to_format' ] = to_format[ i ];
				slotsArr.push( slotDetails );
			}
		}

		return slotsArr;
	}

	function populate_time_slot_rows( all_settings, type ) {
		var html = '';
		var o_type = type == 'delivery_time' ? "'delivery'" : "'pickup'";
		if ( ! $.isEmptyObject( all_settings ) ) {
			$.each( all_settings, function ( settings_key, settings ) {
				// settings = single_settings[settings_key],
				var settings_general = settings.settings_general,
					time_slot_ranges = settings.time_slot_range,
					props_json_general = settings.json_general,
					props_json_slot_single = settings.json_slot_single;

				var is_enabled = settings_general.enable_delivery_time_slot
						? settings_general.enable_delivery_time_slot
						: 0,
					row_class =
						is_enabled == 0
							? 'row_' + settings_key + ' thpladmin-disabled'
							: 'row_' + settings_key,
					time_slot_method = settings_general.time_slot_add_method,
					time_slot_type = settings_general.time_slot_for,
					time_slot_week_days =
						settings_general.time_slot_type_week_days,
					time_slot_specific_days =
						settings_general.time_slot_type_specific_date;

				time_slot_week_days = get_weekdays_map( time_slot_week_days );

				var week_days_values = Array.isArray( time_slot_week_days )
						? time_slot_week_days.join()
						: time_slot_week_days,
					specific_days_values = Array.isArray(
						time_slot_specific_days
					)
						? time_slot_specific_days.join()
						: time_slot_specific_days,
					order_per_slot_values =
						settings_general.order_deliveries_per_slot,
					checkbox_value = is_enabled != 0 ? 1 : 0;

				var days_values =
					time_slot_type == 'week_days'
						? week_days_values
						: specific_days_values;
				time_slot_method =
					time_slot_method === 'individual_time_slot'
						? 'Individual Time Slot'
						: 'Bulk Time Slot';

				html += '<tr class="' + row_class + '">';
				html += '<td>';
				html +=
					'<input type="hidden" name="f_time_slot[' +
					settings_key +
					']" class="f_slot_days" value="' +
					settings_key +
					'" />';
				html +=
					'<input type="hidden" name="f_deleted[' +
					settings_key +
					']" class="f_deleted" value="0" />';
				html +=
					'<input type="hidden" name="f_enabled[' +
					settings_key +
					']" class="f_enabled" value="' +
					is_enabled +
					'" />';
				html +=
					'<input type="hidden" name="f_props_general[' +
					settings_key +
					']" class="f_props" value="' +
					props_json_general +
					'" />';
				html +=
					'<input type="hidden" name="f_props_slots[' +
					settings_key +
					']" class="f_props_slots" value="' +
					props_json_slot_single +
					'"/>';
				html += '</td>';

				html +=
					'<td class="td_select"><input type="checkbox" name="select_slot"/></td>';
				html += '<td class="td_days/dates">';
				html += '<label> ' + days_values + ' </label>';
				html += '</td>';
				html += '<td class="td_time_slot_add_method">';
				html += '<label> ' + time_slot_method + ' </label>';
				html += '</td>';

				var statusHtml =
					checkbox_value == 1
						? '<span class="dashicons dashicons-yes tips" data-tip="Yes"></span>'
						: '-';

				html +=
					'<td class="td_enable_delivery_time_slot status"> ' +
					statusHtml +
					' </td>';
				html += '<td class="td_actions" align="center">';

				if ( is_enabled != 0 ) {
					html +=
						'<span class="f_edit_btn dashicons dashicons-edit tips" data-tip="Edit Field"  onclick="thwdtpOpenEditTimeSlot(this, ' +
						settings_key +
						', ' +
						o_type +
						')"></span>';
				} else {
					html +=
						'<span class="f_edit_btn dashicons dashicons-edit disabled"></span>';
				}

				html += '</td> </tr>';
			} );
		} else {
			html +=
				'<tr><td colspan="10" class="empty-msg-row"> No Time Slot Added </td></tr>';
		}
		type = type == 'delivery_time' ? 'delivery' : 'pickup';
		var ptable = $( '#thwdtp_time_slots_' + type );
		ptable.find( 'tbody' ).html( html );
	}

	function get_weekdays_map( days_key ) {
		var days = {
			0: 'Sunday',
			1: 'Monday',
			2: 'Tuesday',
			3: 'Wednesday',
			4: 'Thursday',
			5: 'Friday',
			6: 'Saturday',
		};
		var week_days = [];

		$.each( days_key, function ( key, value ) {
			week_days[ key ] = days[ value ];
		} );

		return week_days;
	}

	function remove_time_slots( type ) {
		$( '#thwdtp_time_slots_' + type + ' tbody tr' ).removeClass(
			'strikeout'
		);
		$(
			'#thwdtp_time_slots_' +
				type +
				' tbody input:checkbox[name=select_slot]:checked'
		).each( function () {
			var row = $( this ).closest( 'tr' );
			if ( ! row.hasClass( 'strikeout' ) ) {
				row.addClass( 'strikeout' );
			}
			row.find( '.f_deleted' ).val( 1 );
			row.find( '.f_edit_btn' ).prop( 'disabled', true );
		} );
	}

	function select_all_slots( elm, type ) {
		var checkAll = $( elm ).prop( 'checked' );
		$(
			'#thwdtp_time_slots_' +
				type +
				' tbody input:checkbox[name=select_slot]'
		).prop( 'checked', checkAll );
	}

	function enable_disabled_time_slots( type, enabled ) {
		$(
			'#thwdtp_time_slots_' +
				type +
				' tbody input:checkbox[name=select_slot]:checked'
		).each( function () {
			var row = $( this ).closest( 'tr' );
			if ( enabled == 0 ) {
				if ( ! row.hasClass( 'thpladmin-disabled' ) ) {
					row.addClass( 'thpladmin-disabled' );
				}
			} else {
				row.removeClass( 'thpladmin-disabled' );
			}

			row.find( '.f_edit_btn' ).prop(
				'disabled',
				enabled == 1 ? false : true
			);
			row.find( '.td_enabled' ).html(
				enabled == 1
					? '<span class="dashicons dashicons-yes tips" data-tip="Yes"></span>'
					: '-'
			);
			row.find( '.f_enabled' ).val( enabled );
		} );
	}

	function add_specific_date() {
		var sTable = $( '#thwdtp_specific_dates_table' ),
			sDate = $( '#thwdtp_specific_date_datepicker' ).val();
		if ( sDate ) {
			$( '#thwdtp_specific_delivery_date_form .err-specifictime' ).css(
				'display',
				'none'
			);
			var html = '<tr>';
			html += '<td> <span class="specific-dates"> ' + sDate + ' </span>';
			html +=
				'<input type="hidden" name="thwdtp_specific_dates[]" value ="' +
				sDate +
				'" />';
			html += '</td>';
			html +=
				'<td><button class="date-remove" onclick="thwdtpRemoveSpecificDeliveryDate(this)"><span class="dashicons dashicons-trash"></span></button></td>';
			html += '</tr>';

			var emty_row = sTable.find( 'tr.emty-row' );

			if ( emty_row.length > 0 ) {
				emty_row.remove();
			}

			var specific_days = sTable.find( 'tbody tr' ).size();

			if ( specific_days > 0 ) {
				sTable.find( 'tbody tr:last' ).after( html );
			} else {
				sTable.find( 'tbody' ).append( html );
			}

			$( '#thwdtp_specific_date_datepicker' ).val( '' );
		} else {
			$( '#thwdtp_specific_delivery_date_form .err-specifictime' ).css(
				'display',
				'block'
			);
		}
	}

	function remove_specific_delivery_date( elm ) {
		var row_html =
			'<tr class="emty-row"><td colspan="10" class="empty-msg-row">No Specific Dates Added</td></tr>';
		var ptable = $( elm ).closest( 'table' );
		$( elm ).closest( 'tr' ).remove();
		var rowsSize = ptable.find( 'tbody tr' ).size();

		if ( rowsSize == 0 ) {
			ptable.find( 'tbody' ).append( row_html );
		}
	}

	function remove_holiday( elm ) {
		var row_html =
			'<tr class="emty-row"><td colspan="10" class="empty-msg-row">No Holidays Added</td></tr>';
		var ptable = $( elm ).closest( 'table' );
		$( elm ).closest( 'tr' ).remove();

		var rowsSize = ptable.find( 'tbody tr' ).size();
		if ( rowsSize == 0 ) {
			ptable.find( 'tbody' ).append( row_html );
		}
	}

	function add_new_holiday() {
		var hTable = $( '#thwdtp_holidays_table' ),
			hDate = $( '#thwdtp_holiday_datepicker' ).val();
		if ( hDate ) {
			$( '#thwdtp_delivery_holidays_form .err-holidays' ).css(
				'display',
				'none'
			);
			var html = '<tr>';
			html += '<td> <span class="holidays"> ' + hDate + ' </span>';
			html +=
				'<input type="hidden" name="thwdtp_holidays[]" value ="' +
				hDate +
				'" />';
			html += '</td>';
			html +=
				'<td><button class="date-remove" onclick="thwdtpRemoveHoliday(this)"><span class="dashicons dashicons-trash"></span></button></td>';
			html += '</tr>';
			var emty_row = hTable.find( 'tr.emty-row' );

			if ( emty_row.length > 0 ) {
				emty_row.remove();
			}

			var holidays = hTable.find( 'tbody tr' ).size();
			if ( holidays > 0 ) {
				hTable.find( 'tbody tr:last' ).after( html );
			} else {
				hTable.find( 'tbody' ).append( html );
			}

			$( '#thwdtp_holiday_datepicker' ).val( '' );
		} else {
			$( '#thwdtp_delivery_holidays_form .err-holidays' ).css(
				'display',
				'block'
			);
		}
	}

	return {
		openNewTimeSlot: open_new_time_slot,
		timeSlotMethodChangeListner: time_slot_method_change_listner,
		timeSlotTypeChangeListner: time_slot_type_change_listner,
		addNewSlotRow: add_new_slot_row,
		removeSlotRow: remove_slot_row,
		saveDeliveryDateSettings: save_delivery_date_settings,
		SaveDeliveryTimeSlot: save_delivery_time_slot,
		openEditTimeSlot: open_edit_time_slot,
		removeSelectedTimeSlots: remove_time_slots,
		selectAllSlots: select_all_slots,
		enableDisabledTimeSlots: enable_disabled_time_slots,
		saveDeliveryTimeSettings: save_delivery_time_settings,
		addNewSpecificDate: add_specific_date,
		specificDeliveryDates: specific_delivery_dates,
		RemoveSpecificDeliveryDate: remove_specific_delivery_date,
		AddNewHoliday: add_new_holiday,
		SaveHolidays: save_holidays,
		removeHoliday: remove_holiday,
		SaveOtherSettings: save_other_settings,
		SavePickupDateSettings: save_pickup_date_settings,
		SavePickupTimeSettings: save_pickup_time_settings,
	};
} )( window.jQuery, window, document );

function thwdtpOpenNewTimeSlot( type ) {
	thwdtp_settings.openNewTimeSlot( type );
}

function thwdtpOpenEditTimeSlot( elm, rowId, $type ) {
	thwdtp_settings.openEditTimeSlot( elm, rowId, $type );
}

function thwdtpTimeSlotMethodChangeListner( elm ) {
	thwdtp_settings.timeSlotMethodChangeListner( elm );
}

function thwdtpTimeSlotTypeChangeListner( elm ) {
	thwdtp_settings.timeSlotTypeChangeListner( elm );
}

function thwdtpAddNewSlotRow( elm ) {
	thwdtp_settings.addNewSlotRow( elm );
}

function thwdtpRemoveNewSlotRow( elm ) {
	thwdtp_settings.removeSlotRow( elm );
}

function thwdtpSaveDeliveryDateSettings( elm, event ) {
	thwdtp_settings.saveDeliveryDateSettings( elm, event );
}

function thwdtpSaveDeliveryTimeSlot( elm, event, type, o_type ) {
	thwdtp_settings.SaveDeliveryTimeSlot( elm, event, type, o_type );
}

function thwdtpRemoveSelectedTimeSlots( type ) {
	thwdtp_settings.removeSelectedTimeSlots( type );
}

function thwdtpSelectAllTimeSlots( elm, type ) {
	thwdtp_settings.selectAllSlots( elm, type );
}

function thwdtpEnableSelectedTimeSlots( type ) {
	thwdtp_settings.enableDisabledTimeSlots( type, 1 );
}

function thwdtpDisableSelectedTimeSlots( type ) {
	thwdtp_settings.enableDisabledTimeSlots( type, 0 );
}

function thwdtpSaveDeliveryTimeSettings( elm, event, type ) {
	thwdtp_settings.saveDeliveryTimeSettings( elm, event, type );
}

function thwdtpAddNewSpecificDate() {
	thwdtp_settings.addNewSpecificDate();
}

function thwdtpSpecificDeliveryDates( elm, event, type ) {
	thwdtp_settings.specificDeliveryDates( elm, event, type );
}

function thwdtpRemoveSpecificDeliveryDate( elm ) {
	thwdtp_settings.RemoveSpecificDeliveryDate( elm );
}

function thwdtpAddNewHolidays() {
	thwdtp_settings.AddNewHoliday();
}

function thwdtpSaveHolidays( elm, event, type ) {
	thwdtp_settings.SaveHolidays( elm, event, type );
}

function thwdtpRemoveHoliday( elm ) {
	thwdtp_settings.removeHoliday( elm );
}

function thwdtpSaveOtherSettings( elm, event, type ) {
	thwdtp_settings.SaveOtherSettings( elm, event, type );
}

function thwdtpSavePickupDateSettings( elm, event, type ) {
	thwdtp_settings.SavePickupDateSettings( elm, event, type );
}

function thwdtpSavePickupTimeSettings( elm, event, type ) {
	thwdtp_settings.SavePickupTimeSettings( elm, event, type );
}

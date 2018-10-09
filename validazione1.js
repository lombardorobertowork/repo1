
// --------- UTILITA' CSS ----------
	
var valid_back_color = '#ffffff'; var error_back_color = '#ffb3b3';
function set_css_error( elem ){ $( elem ).css('background-color', error_back_color ); }
function set_css_valid( elem ){ $( elem ).css('background-color', valid_back_color ); }
	
// ---------- UTILITA VARIE	-----------------

function is_vuoto( str ){ return str.trim() === ""; }	
function is_num( numString ){ return /^\d+$/.test( numString ); }
function is_decimal( numString ){ return /^\d+(\,\d+)?$/.test( numString ); }

// ----------- UTILITA GET/SET UI ----------

function get_text( elem ){ return elem.val().trim(); }

// ---------- FUNZIONI DI VALIDAZIONE -------------

function validaCF( codFiscale )
{
   var cfu     = codFiscale.toUpperCase();
   var cfuReg  = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/;
   
   if (!cfuReg.test(cfu)) return false;
   
   var set1    = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   var set2    = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ";
   var setpari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   var setdisp = "BAKPLCQDREVOSFTGUHMINJWZYX";
   
   var s = 0;
   for( i = 1; i <= 13; i += 2 ) s += setpari.indexOf( set2.charAt( set1.indexOf( cfu.charAt(i) )));
   for( i = 0; i <= 14; i += 2 ) s += setdisp.indexOf( set2.charAt( set1.indexOf( cfu.charAt(i) )));
   
   if ( s%26 != cfu.charCodeAt(15)-'A'.charCodeAt(0) ) return false;
   
   return true;
};

function validaPIVA_EUROPEA( piva )
{
	return /^[a-z0-9]{8,12}$/.test( piva.trim().toLowerCase() );
}

function validaPIVA( piva )
{
	return /^[0-9]{11,11}$/.test( piva.trim() );
}

function validaCF_AZIENDA( cfaz )
{
	return validaPIVA( cfaz );
}

function validaCAP( str ){
	if( is_vuoto(str) ){ return true; }
	else if( is_num(str) && (str.length <= 5) ){ return true; }
	else{ return false; }
}

function validaQUOTA( str ){
	if( is_vuoto(str) ){ return true; }
	else if( is_decimal(str)  ){ return true; }
	else{ return false; }
}

// -------------------- UTILITA LOGICA UI

// MEGLIO NON USARE QUESTA VERSIONE ... usa addRadioButtonBehaviour2
function addRadioButtonBehaviour( uis )
{
	$.each( uis, function( i, ui )
	{
		$.each( uis, function( j, uij ){
			if( ui.attr("id") != uij.attr("id") )
			{
				ui.change( function(){ if( ui.is(":checked") ) { uij.prop('checked', false ); } } );
			}
		});
	});
};

function addRadioButtonBehaviour2( uis )
{
	$.each( uis, function( i, ui )
	{
		$.each( uis, function( j, uij ){
			if( ui.attr("id") != uij.attr("id") )
			{
				ui.change( function(){ if( ui.is(":checked") ) { 
					uij.prop('checked', false ); 
					uij.trigger( 'change' );
				} } );
			}
		});
	});
};

function disableUI( ui ){
	var lightGray = "#D3D3D3";
	ui.attr( "disabled", true ); $('label[for='+ui.attr('id')+']').css("color", lightGray );
	if( ui.is(':checkbox') ){ ui.prop('checked', false); }
	else if( ui.is(':text') || ui.is(':textarea') ){ ui.val(''); }
	// ui.trigger( "change" );
}

function enableUI( ui ){
	ui.removeAttr("disabled"); $('label[for='+ui.attr('id')+']').css("color", "black" );
	// ui.trigger( "change" );
}

function checkboxEnablesUis( controllerCheckbox, controlledUIS )
{
	var f1 = function() { 
		var isChecked = false;
		$.each( controllerCheckbox, function( i0, val0 ){ if( val0.is(":checked") ){ isChecked = true; } } );
		if( isChecked ){ 
			$.each( controlledUIS, function( i, val ){ enableUI( val ); } );	
			$.each( controlledUIS, function( i, val ){ val.trigger( "change" ); } );	
		} else { 
			$.each( controlledUIS, function( i, val ){ disableUI( val ); } );	 
			$.each( controlledUIS, function( i, val ){ val.trigger( "change" ); } );	
		}
	}; 
	$.each( controllerCheckbox, function( i2, val2 ){ val2.change( f1 );    } );
	f1();
}

// -------------- VALIDAZIONE UI ---------------

function validaUI_CF( ui ){ 
	var t = get_text( ui );
	if( validaCF(t) ) set_css_valid( $( ui ) );
	else if( is_vuoto(t) ){ set_css_valid( $( ui ) ); } 
	else{ set_css_error( $( ui ) ); };
};

function validaUI_CF_AZIENDA( ui ){ 
	var t = get_text( ui );
	if( validaCF_AZIENDA(t) ) set_css_valid( $( ui ) );
	else if( is_vuoto(t) ){ set_css_valid( $( ui ) ); } 
	else{ set_css_error( $( ui ) ); };
};

function validaUI_PIVA( ui ){ 
	var t = get_text( ui );
	if( validaPIVA( t )  || is_vuoto(t) ) set_css_valid( $( ui ) );
	else{ set_css_error( $( ui ) ); };
};

function validaUI_CAP( ui ){
	var t = get_text( ui );
	if( validaCAP(t) ) set_css_valid( $( ui ) );
	else{ set_css_error( $( ui ) ); };
}

function validaUI_QUOTA( ui ){
	var t = get_text( ui );
	if( validaQUOTA(t) ) set_css_valid( $( ui ) );
	else{ set_css_error( $( ui ) ); };
}

function validaUI_PERC_20( ui ){
	var t = get_text( ui );
	if( validaQUOTA(t) ){ 
		t = t.replace(",", ".");
		var num = parseFloat(t);
		if( t <= 20 ){ set_css_valid( $( ui ) ); }
		else{ set_css_error( $( ui ) ); };
	}
	else{ set_css_error( $( ui ) ); };
}

// Per comodità aggiungo queste funzioni:
function controllaCAP( ui ){     ui.on( 'input', function(){ validaUI_CAP(  ui ); }); validaUI_CAP( ui ); };
function controllaPIVA(  ui ){   ui.on( 'input', function(){ validaUI_PIVA(   ui ); }); validaUI_PIVA( ui ); };
function controllaCF_PERS( ui ){ ui.on( 'input', function(){ validaUI_CF(   ui ); }); validaUI_CF( ui ); };
function controllaCF_AZ( ui ){   ui.on( 'input', function(){ validaUI_CF_AZIENDA(   ui ); }); validaUI_CF_AZIENDA( ui ); };
function controllaQUOTA( ui ){   ui.on( 'input', function(){ validaUI_QUOTA(   ui ); }); validaUI_QUOTA( ui ); };

console.log("TEST ME 4i");


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

// ---------- FUNCZIONI DI VALIDAZIONE -------------

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

console.log("TEST ME");

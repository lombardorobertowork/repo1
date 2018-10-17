console.log("TEST ME 5u6");

// COMPATIBILITA CON FIREFOX ED IE 11
if (!String.prototype.includes) {
    String.prototype.includes = function() {
        'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}

// --------- UTILITA' CSS ----------- 
	
var valid_back_color = '#ffffff'; var error_back_color = '#ffb3b3';
function set_css_error( elem ){ $( elem ).css('background-color', error_back_color ); }
function set_css_valid( elem ){ $( elem ).css('background-color', valid_back_color ); }
	
// ---------- UTILITA VARIE -----------------

function is_vuoto( str ){ return str.trim() === ""; }	
function is_num( numString ){ return /^\d+$/.test( numString ); }
function is_decimal( numString ){ return /^\d+(\,\d+)?$/.test( numString ); }

// ----------- UTILITA GET/SET UI ----------

function get_text( elem ){ return elem.val().trim(); }

// --------- FORMATI NUMERICI ----------
	
	// Rileva formato numerico: CIFRA+ PUNTO CIFRA CIFRA
	function is_formato_punto( str ) { return /^\d+(\.\d{1,2})?$/.test( str.trim() ); }
	// RILEVA formato, ad es: 123.456,78
	function is_formato_punto_e_virgola( str ){ return /^\d{1,3}(\.\d\d\d)*\,\d{1,2}$/.test( str.trim() ); }
	// Rileva formato, ad es: 123,456
	function is_percent( str ) { return /^\-?\d+(\,\d{1,3})?$/.test( str.trim() ); }
	// Conversione fra formati numerici
	function convertFormatoPuntoToFormatoPuntoEVirgola( str )
	{
		var tokens = str.split(".");
		var integerPart = tokens[0]; 
		var numInPointVirgFormat = "";
		for ( var i = 0; i < integerPart.length; i++ ) 
		{
			if( i > 0 && ( ( (integerPart.length - i) % 3) === 0) ){ numInPointVirgFormat = numInPointVirgFormat + "." + integerPart.charAt( i ); }
			else{ numInPointVirgFormat = numInPointVirgFormat + integerPart.charAt( i ); }
		}
		var fractionalPart = tokens[1]; 
		
		if( tokens[1] != undefined )
		{
		  numInPointVirgFormat = numInPointVirgFormat + "," + fractionalPart;
		} 
		else
		{
		  numInPointVirgFormat = numInPointVirgFormat + ",00"; 
		};
		return numInPointVirgFormat;
	}
	function convertFormatoPuntoEVirgolaToFormatoPunto( str )
	{
		var res = "";
		for ( var i = 0; i < str.length; i++ ) 
		{
			var nextChar = ""; 
			var currChar = str.charAt( i );
			
			if( currChar === "." ){ nextChar = ""; }
			else if( currChar === "," ){ nextChar = "."; }
			else { nextChar = currChar;  }	
			res = res + nextChar;
		}
		return res;
	}

// --------- FORMULE ------------
	
	function formula_importo_offerta( base_asta, ribasso ){ return base_asta.times( new Big(100).minus( ribasso ) ).div(100); }
	
	function avvia_calcolo_importo_offerta(  )
	{
		var ba = getBaseAstaFromUI();
		var ro = getRibassoFromUI();
		if( (ba!==undefined) && (ro!==undefined) )
		{
			var io = formula_importo_offerta( ba, ro );	
			setOffertaUI( io );
		}		
	}

	function formula_ribasso( base_asta, importo_offerta ){ return new Big(100).minus( importo_offerta.times(100).div(base_asta) );  }
	
	function avvia_calcolo_ribasso(  )
	{
		var ba = getBaseAstaFromUI();
		var io = getOffertaFromUI();
		if( (ba!==undefined) && (io!==undefined) )
		{
			var rib = formula_ribasso( ba, io );	
			setRibassoUI( rib );
		}		
	}

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

function validaEMAIL( str )
{
	if( is_vuoto(str) ){ return true; }
	else if( /^\S+@\S+\.\S+$/.test( str ) ){ return true; }
	else{ return false; }
}

// Accetta numeri spazi e trattini (-)
function validaTEL( str ){
	if( is_vuoto(str) ){ return true; }
	else if( /^\d+([\d\s\-]+\d+)?$/.test( str ) ){ return true; }
	else{ return false; }
}

// -------------------- UTILITA LOGICA UI

// MEGLIO NON USARE QUESTA VERSIONE ... usa addRadioButtonsBehaviour
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

// MEGLIO NON USARE QUESTA VERSIONE ... usa addRadioButtonsBehaviour
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

// riceve un array: ogni elemento sarà a sua volta un array di checkbox 
// a cui si vuole aggiungere la logica di radio button.
function addRadioButtonsBehaviour( radioButtonList )
{

	function private____addRadioButtonBehaviour( uis )
	{
		// Nel nostro sistema: Inizializza il primo elemento del radio button a CHECKED e 
		// sottopone i dati al server
		$( '#add #' + uis[0].attr("id") ).prop( "checked", true );
		

		// Aggiunge la logica di gestione del radio button nella ui
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

	$.each( radioButtonList, function( i, uis ){
		private____addRadioButtonBehaviour( uis );
	} );

	//  Nel nostro sistema: Invia i dati di inizializzazione del radio button al server
	$( '#add :submit' ).click();
}

// Se riceve un campo "[day]" di una data disabilita anche gli altri due campi [month] e [year]
function disableUI( ui ){
	
	var lightGray = "#D3D3D3";
	var d = ui.attr('name');
	
	// ---- DISABILITARE MOUSE   -----
	// 2018 10 17 - PROBLEMA ART 80 undefined
	// ui.prop( "disabled", true ); 
	
	//if( d && !d.includes( "[day]" ) && !d.includes( "[month]" ) && !d.includes( "[year]" )  ){ 
	ui.css( 'pointer-events', 'none' );
	if( ui.is(':checkbox') ){ ui.click(function(){return false;}); }
	// }
	
	$('label[for='+ui.attr('id')+']').css("color", lightGray );
	if( ui.is(':checkbox') ){ ui.prop('checked', false); }
	else if( ui.is(':text') || ui.is('textarea') ){ ui.val(''); }
	else{
		// Gestione date
		
		// console.log( "ID " + d );
		if( d && ( d.includes( "[day]" ) || d.includes( "[month]" ) || d.includes( "[year]" ) ) ) { 
		   // 2018 10 17 - PROBLEMA ART 80 undefined
		   // ui.val('0'); 
		   ui.val(''); 
		   ui.css('background-color', lightGray ); 	
		}
		// Se il campo e' il giorno di una data --> disabilita anche gli altri campi della data
		if( d && d.includes( "[day]" ) ){ 
			var idm = d.substring( 0, d.length - 5 );  
			// console.log( "ID DATA: " + "#" + idm + "[month]" + "  OBJ " + $( "#" + idm + "[month]" ) );
			
			// 2018 10 17 - PROBLEMA ART 80 undefined
			disableUI( $( "[name='" + idm + "[month]']" ) ); 
			disableUI( $( "[name='" + idm + "[year]']" ) ); 
		}
	}
	// ui.trigger( "change" );
}

// // Se riceve un campo "[day]" di una data abilita anche gli altri due campi [month] e [year]
function enableUI( ui ){
	
	var lightGray = "#D3D3D3";
	var d = ui.attr('name');
	
	// ---- ABILITARE MOUSE   -----
	// 2018 10 17 - PROBLEMA ART 80 undefined
	// ui.prop( "disabled", false ); 
	if( ui.is(':checkbox') ){ ui.unbind("click"); }
	ui.css( 'pointer-events', '' );
	if( d && ( d.includes( "[day]" ) || d.includes( "[month]" ) || d.includes( "[year]" ) ) ) { 
		// se campo fa parte di una data: 
		ui.css('background-color', valid_back_color ); 	
	}
	// -----------------------------------------

	$('label[for='+ui.attr('id')+']').css("color", "black" );
		
	
	if( d && d.includes( "[day]" ) ){ 
		var idm = d.substring( 0, d.length - 5 );  
		enableUI( $( "[name='" + idm + "[month]']" ) ); 
		enableUI( $( "[name='" + idm + "[year]']" ) ); 
	}
	
}

// Per COMPATIBILITA CON FIREFOX ED IE 11 non uso argomento con valore di default enableWhenChecked=true
// Invece imposto enableWhenChecked a true di default nel corpo della funzione.
function checkboxEnablesUis( controllerCheckbox, controlledUIS, enableWhenChecked ) 
{
	
	if( enableWhenChecked === undefined ){ enableWhenChecked = true; }
	var f1 = function() { 
		var isChecked = false;
		$.each( controllerCheckbox, function( i0, val0 ){ if( val0.is(":checked") ){ isChecked = true; } } );
		if( isChecked ){ 
			$.each( controlledUIS, function( i, val ){ 
				if( enableWhenChecked ){ enableUI( val ); } else { disableUI( val );  } 
			} );	
			$.each( controlledUIS, function( i, val ){ val.trigger( "change" ); } );	
		} else { 
			$.each( controlledUIS, function( i, val ){ 
				if( enableWhenChecked ){ disableUI( val ); } else { enableUI( val );  } 
			} );	 
			$.each( controlledUIS, function( i, val ){ val.trigger( "change" ); } );	
		}
	}; 
	$.each( controllerCheckbox, function( i2, val2 ){ val2.change( f1 );    } );
	f1();
}

function applicaAData( uiID, callback ){
	
	var d1 = $( '[name="'+uiID+'[day]"]' );
	var d2 = $( '[name="'+uiID+'[month]"]' );
	var d3 = $( '[name="'+uiID+'[year]"]' );
		
	callback( d1 ); callback( d2 ); callback( d3 );
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

function validaUI_EMAIL( ui ){
		var t = get_text( ui );
		if( validaEMAIL(t) ) set_css_valid( $( ui ) );
		else{ set_css_error( $( ui ) ); };
}
	
function validaUI_TEL( ui ){
	var t = get_text( ui );
	if( validaTEL(t) ) set_css_valid( $( ui ) );
	else{ set_css_error( $( ui ) ); };
}

// Per comodità aggiungo queste funzioni:
function controllaCAP( ui ){     ui.on( 'input', function(){ validaUI_CAP(  ui ); }); validaUI_CAP( ui ); };
function controllaPIVA(  ui ){   ui.on( 'input', function(){ validaUI_PIVA(   ui ); }); validaUI_PIVA( ui ); };
function controllaCF_PERS( ui ){ ui.on( 'input', function(){ validaUI_CF(   ui ); }); validaUI_CF( ui ); };
function controllaCF_AZ( ui ){   ui.on( 'input', function(){ validaUI_CF_AZIENDA(   ui ); }); validaUI_CF_AZIENDA( ui ); };
function controllaQUOTA( ui ){   ui.on( 'input', function(){ validaUI_QUOTA(   ui ); }); validaUI_QUOTA( ui ); };
function controllaIMPORTO( ui )
{
	var f1 = function( converti )
	{ 
		var t = get_text( ui );
		if( is_formato_punto( t ) && converti ) 
		{
			var numInPointVirgFormat = convertFormatoPuntoToFormatoPuntoEVirgola( t );
			ui.val( numInPointVirgFormat );	
			set_css_valid( ui );
		} 
		else if( is_formato_punto_e_virgola(t) || is_vuoto(t) )
		{	
			set_css_valid( ui );  
		}
		else { set_css_error( ui ); }
	}

	ui.on( 'input', f1 ); f1( true );

};
function controllaEMAIL( ui ){ ui.on( 'input', function(){ validaUI_EMAIL(  ui ); }); validaUI_EMAIL( ui ); };
function controllaTEL( ui ){ ui.on( 'input', function(){ validaUI_TEL(  ui ); }); validaUI_TEL( ui ); };

// -------------------------- VALIDAZIONE AUTOMATICA -------------------------

// Cerca nella pagina le <label> che contengono all'interno del proprio HTML una delle stringhe  
// nell'array labels. Recupera l'elemento puntato dalla stringa (indicato nell'attributo 'for') 
// e lo passa come argomento alla funzione callback.
// NOTA: controlla label che hanno nel loro html: 
// - SOLO una stringa di labels
// - una stringa di labels seguito o preceduta da uno spazio
function validaTutti( labels, callback )
{
	// var set_di_id_da_non_validare = undefined;
	// if( array_di_id_da_non_validare !== undefined ){ set_di_id_da_non_validare = new Set( array_di_id_da_non_validare ); }
	
	// Per ogni oggetto html di tipo <label>
	$( 'label' ).each( function( i ){
		var id = null;
		var labelElem = $(this);			
		
		
		$.each( labels, function( i, val )
		{ 
			var s1 = labelElem.html().trim().toLowerCase();
			var s2 = val.trim().toLowerCase();
			
			if( ( s1 === s2 ) || ( s1.includes( " " + s2 ) ) || ( s1.includes( s2 + " " ) ) ){	
				id = labelElem.prop('for');	
			}
		});
		
		if( id && ( id.length > 0 ) ){	
			
			callback( $( '#' + id ) );	
			
		}		
		
	});
};

validaTutti( ["telefono", "fax", "cellulare"], controllaTEL );
validaTutti( ["email", "pec"], controllaEMAIL );
validaTutti( ["cap"], controllaCAP );
validaTutti( ["partita iva", "PIVA"], controllaPIVA );
validaTutti( ["quota"], controllaQUOTA );





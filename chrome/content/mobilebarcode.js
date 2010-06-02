var mobilebarcode = new Object();

mobilebarcode.prefs = null;
mobilebarcode.codetype = "";
mobilebarcode.codesize = "";
mobilebarcode.provider = "";

//mobilebarcode.prefixURL = "http://mobilecodes.nokia.com/qr?MODULE_SIZE=6&name=&MARGIN=10&ENCODING=BYTE&MODE=TEXT&a=view&DATA=";
//mobilebarcode.prefixURL = function(size="6", name="", margin="10", type="LINK")

mobilebarcode.prefixURL = function(name,type)
{
	switch (mobilebarcode.provider)
	{
		case "kaywa":
		break;
		case "google":
		break;
		case "nokia":
			return mobilebarcode.prefixURL_nokia(name,type);
		break;
		default:
			return mobilebarcode.prefixURL_nokia(name,type);
		break;
	}
}

mobilebarcode.prefixURL_google = function(name, type)
{
	switch(mobilebarcode.codesize)
	{
		case "S":
			sizenumber="200x200";
		break;
		case "M":
			sizenumber="300x300";
		break;
		case "L":
			sizenumber="400x400";
		break;
		case "XL":
			sizenumber="500x500";
		break;
		case "XXL":
			sizenumber="547x547";
		break;
		default:
			sizenumber="300x300";
		break;
	}
	/*
	 *	Type: cht = qr
	 *	Size: chs = <width>x<height>
	 *	Encoding: choe = [UTF-8|Shift_JIS|ISO-8859-1]
	 *	Error Correction: chld = <L|M|Q|H>|<margin>
	 *	Data: chl = <data>
	 */
	
	prefix = "http://chart.apis.google.com/chart?cht=qr&chld=M|4&choe=UTF-8&" +
		"chs=" + sizenumber + "&chl=";

	return prefix;
};

mobilebarcode.prefixURL_kaywa = function(name, type)
{
	// For text, maximum 250 characters
	// Would be good to show a 'too big' image if they select too much text
	
	switch(mobilebarcode.codesize)
	{
		case "S":
			sizenumber="5";
		break;
		case "M":
			sizenumber="6";
		break;
		case "L":
			sizenumber="7";
		break;
		case "XL":
			sizenumber="8";
		break;
		case "XXL":
			sizenumber="12";
		break;
		default:
			sizenumber="6";
		break;
	}

	switch(mobilebarcode.codetype)
	{
		case "DM":
			prefix = "http://datamatrix.kaywa.com/img.php?" +
				"s=" + sizenumber + "&d=";
		break;
		case "QR":
		default:
			prefix = "http://qrcode.kaywa.com/img.php?" +
				"s=" + sizenumber + "&d=";
		break;
	}

	return prefix;
};

mobilebarcode.prefixURL_nokia = function(name, type)
{
	switch(mobilebarcode.codetype)
	{
		case "DM":
			switch(mobilebarcode.codesize)
			{
				case "S":
					sizenumber="5";
				break;
				case "M":
					sizenumber="6";
				break;
				case "L":
					sizenumber="7";
				break;
				case "XL":
					sizenumber="8";
				break;
				case "XXL":
					sizenumber="12";
				break;
				default:
					sizenumber="6";
				break;
			}
			prefix = "http://datamatrix.kaywa.com/img.php?" +
				"s=" + sizenumber;
<!--
            if (name.length>0)
			{
				prefix = prefix + "&name=" + name;
			}
			if (type.length>0)
			{
				prefix = prefix + "&TYPE=" + type;
			}
-->
			prefix = prefix + "&d=";
		break;
		case "QR":
		default:
			switch(mobilebarcode.codesize)
			{
				case "S":
					sizenumber="120x120";
				break;
				case "M":
					sizenumber="175x175";
				break;
				case "L":
					sizenumber="230x230";
				break;
				case "XL":
					sizenumber="290x290";
				break;
				case "XXL":
					sizenumber="350x350";
				break;
				default:
					sizenumber="230x230";
				break;
			}
			prefix = "http://chart.apis.google.com/chart?cht=qr&" +
				"chs=" + sizenumber;
			prefix = prefix + "&chl=";
		break;
	}

	return prefix;
};

mobilebarcode.getBarcode = function()
{
	var theurl = getBrowser().contentWindow.location.href;
	var barcode = document.getElementById ( 'mobilebarcode-status-image' );
//	barcode.src = "http://www.sample.org.uk/mobilebarcoder/gen.php?data=" + 
//					mobilebarcode.URLEncode(theurl);
	barcode.src = mobilebarcode.prefixURL("","LINK") + URLEncode(theurl);
	return;
};

mobilebarcode.getBarcodeFromSelection = function()
{
	var sel_text = get_selected_text();
	openNewTabWith(mobilebarcode.prefixURL("","") + URLEncode(sel_text), null, null, false);
};
mobilebarcode.showBarcodeFromSelection = function()
{
	var sel_text = get_selected_text();
	image = document.getElementById("mobilebarcode-context-selection-image");
	image.src = mobilebarcode.prefixURL("","") + URLEncode(sel_text);
};

mobilebarcode.getBarcodeFromLink = function()
{
	if (gContextMenu)
	{
		if (typeof(gContextMenu.linkURL)=='string') {
			sel_text = gContextMenu.linkURL
		} else {
			sel_text = gContextMenu.linkURL()
		}
		//var sel_text = gContextMenu.linkURL;
		openNewTabWith(mobilebarcode.prefixURL("","") + URLEncode(sel_text), null, null, false);
	}
};
mobilebarcode.showBarcodeFromLink = function()
{
	if (gContextMenu)
	{
		if (typeof(gContextMenu.linkURL)=='string') {
			sel_text = gContextMenu.linkURL
		} else {
			sel_text = gContextMenu.linkURL()
		}
		image = document.getElementById("mobilebarcode-context-link-image");
		image.src = mobilebarcode.prefixURL("","") + URLEncode(sel_text);
	}
};

mobilebarcode.init = function()
{
	// Register to receive notifications of preference changes
	mobilebarcode.prefs = Components.classes["@mozilla.org/preferences-service;1"]
		.getService(Components.interfaces.nsIPrefService)
		.getBranch("mobilebarcode.");
	mobilebarcode.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
	mobilebarcode.prefs.addObserver("", this, false);
	
	mobilebarcode.codetype = mobilebarcode.prefs.getCharPref("type").toUpperCase();
	mobilebarcode.provider = mobilebarcode.prefs.getCharPref("provider").toUpperCase();
	
	menu = document.getElementById("contentAreaContextMenu");
//	if (menu)
//	{
		menu.addEventListener("popupshowing", mobilebarcode.draw, false);
//	}
	
	selection = document.getElementById("mobilebarcode-context-selection-popup");
	link = document.getElementById("mobilebarcode-context-link-popup");
	
	selection.addEventListener("popupshowing", mobilebarcode.showBarcodeFromSelection, false);
	link.addEventListener("popupshowing", mobilebarcode.showBarcodeFromLink, false);

    //hidden menuitems
    document.getElementById("mobilebarcode-context-selection").hidden = true;
    document.getElementById("mobilebarcode-context-link").hidden = true;
};

mobilebarcode.observe = function(subject, topic, data)
{
	if (topic != "nsPref:changed")
	{
		return;
	}
	
//	switch(data)
//	{
//		case "size":
			mobilebarcode.codesize = mobilebarcode.prefs.getCharPref("size").toUpperCase();
//		break;
//		case "type":
			mobilebarcode.codetype = mobilebarcode.prefs.getCharPref("type").toUpperCase();
			mobilebarcode.provider = mobilebarcode.prefs.getCharPref("provider").toUpperCase();
//		break;
//	}
};

mobilebarcode.uninit = function()
{
	menu = document.getElementById("contentAreaContextMenu");
	if (menu)
	{
		menu.removeEventListener("popupshowing", mobilebarcode.draw, false);
	}

    //hidden menuitems
    document.getElementById("mobilebarcode-context-selection").hidden = true;
    document.getElementById("mobilebarcode-context-link").hidden = true;

	mobilebarcode.prefs.removeObserver("", this)
};

mobilebarcode.draw = function()
{
	if (gContextMenu)
	{
		gContextMenu.showItem("mobilebarcode-context-selection", gContextMenu.isTextSelected);
		gContextMenu.showItem("mobilebarcode-context-link", gContextMenu.onLink);
	}
};

// ====================================================================
//       URLEncode and URLDecode functions
// http://www.albionresearch.com/misc/urlencode.php
//
// Copyright Albion Research Ltd. 2002
// http://www.albionresearch.com/
//
// You may copy these functions providing that 
// (a) you leave this copyright notice intact, and 
// (b) if you use these functions on a publicly accessible
//     web site you include a credit somewhere on the web site 
//     with a link back to http://www.albionresearch.com/
//
// If you find or fix any bugs, please let us know at albionresearch.com
// ====================================================================
function URLEncode(plaintext)
{
	// The Javascript escape and unescape functions do not correspond
	// with what browsers actually do...
	var SAFECHARS = "0123456789" +					// Numeric
					"ABCDEFGHIJKLMNOPQRSTUVWXYZ" +	// Alphabetic
					"abcdefghijklmnopqrstuvwxyz" +
					"-_.!~*'()";					// RFC2396 Mark characters
	var HEX = "0123456789ABCDEF";

	var encoded = "";
	for (var i = 0; i < plaintext.length; i++ ) {
		var ch = plaintext.charAt(i);
	    if (ch == " ") {
		    encoded += "+";				// x-www-urlencoded, rather than %20
		} else if (SAFECHARS.indexOf(ch) != -1) {
		    encoded += ch;
		} else {
		    var charCode = ch.charCodeAt(0);
			if (charCode > 255) {
//			    alert( "Unicode Character '" 
//                        + ch 
//                        + "' cannot be encoded using standard URL encoding.\n" +
//				          "(URL encoding only supports 8-bit characters.)\n" +
//						  "A space (+) will be substituted." );
				encoded += "+";
			} else {
				encoded += "%";
				encoded += HEX.charAt((charCode >> 4) & 0xF);
				encoded += HEX.charAt(charCode & 0xF);
			}
		}
	} // for

	return encoded;
};

// This function is from Right-Click-Link
function get_selected_text()
{
	var focused_window = document.commandDispatcher.focusedWindow;
	var sel_text = focused_window.getSelection();
	return sel_text.toString();
}

window.addEventListener("load", function(e) { mobilebarcode.init(); }, false);
// The unload event causes the extension to stop functioning on all already loaded pages when one page is closed.
//window.addEventListener("unload", mobilebarcode.uninit, false);

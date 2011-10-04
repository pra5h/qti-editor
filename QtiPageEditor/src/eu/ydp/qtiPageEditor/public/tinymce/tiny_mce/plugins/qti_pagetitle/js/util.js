function stringEncode(text) {
	return $('<div/>').text(text).html().replace(/"/g, "&quot;");
}
function stringDecode(text) {
	return $('<div/>').html(text).text();
}
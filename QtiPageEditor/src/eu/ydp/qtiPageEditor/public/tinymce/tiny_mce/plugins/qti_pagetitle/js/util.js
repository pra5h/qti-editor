function stringEncode(text) {
	return $('<div/>').text(text).html();
}
function stringDecode(text) {
	return $('<div/>').html(text).text();
}
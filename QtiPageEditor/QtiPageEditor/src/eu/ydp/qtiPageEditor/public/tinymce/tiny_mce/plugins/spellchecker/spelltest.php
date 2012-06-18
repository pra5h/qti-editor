<?php
if (function_exists('pspell_new')) {
	$pspell_link = pspell_new("en");
	if (!pspell_check($pspell_link, "testt")) {
		$suggestions = pspell_suggest($pspell_link, "testt");
		foreach ($suggestions as $suggestion) {
			echo "Possible spelling: $suggestion<br />";
		}
	}
} else {
	echo "pspell is not installed";
}
?>

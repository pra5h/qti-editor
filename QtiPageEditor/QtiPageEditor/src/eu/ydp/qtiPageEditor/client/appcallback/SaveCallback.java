package eu.ydp.qtiPageEditor.client.appcallback;

import com.google.gwt.core.client.JavaScriptObject;

public interface SaveCallback {
	public void onSaveComplete();
	public void onSaveError(JavaScriptObject error);
}

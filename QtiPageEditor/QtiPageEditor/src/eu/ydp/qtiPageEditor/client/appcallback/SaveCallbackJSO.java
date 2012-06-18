package eu.ydp.qtiPageEditor.client.appcallback;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * 
 * @author thanczewski
 * 
 * Callback to portal application for page save event.
 * Opaque class for native Java Script object, can not be created directly. 
 * The callback object is passed to editor from portal
 *
 */
public class SaveCallbackJSO extends JavaScriptObject implements SaveCallback {
	
	protected SaveCallbackJSO(){
		
	}
	/**
	 * Page saved successful event wrapper.
	 * Calls onSaveComplete method on given native JavaScript object
	 */
	public final native void onSaveComplete()/*-{
		this.onSaveComplete()
	}-*/;

	/**
	 * Page save error event wrapper.
	 * Calls onSaveError method on given JavaScript object
	 * @param error object with error details. Compatible with IApiError interface
	 * @see eu.ydp.webapistorage.client.storage.apierror.IApiError
	 */
	public final native void onSaveError(JavaScriptObject error)/*-{
		this.onSaveError(error)
	}-*/;

}

package eu.ydp.qtiPageEditor.client.appcallback;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * 
 * @author thanczewski
 * 
 *  Callback for TinyMCE editor created event.
 *  An opaque to a native JavaScript object passed from portal. 
 *  Can not be created directly. When TinyMce editor is ready to work
 *  onTinyMceCreated method is called.
 */
public class TinyMceCreatedCallback extends JavaScriptObject {
	
	protected TinyMceCreatedCallback(){		
	}
	
	/**
	 * Wrapper for TinyMce created event.
	 * When TimyMCE editor is created onTinyMceCreated method is called
	 */
	public final native void onTinyMceCreated()/*-{
		this.onTinyMceCreated()
	}-*/;
	
	

}

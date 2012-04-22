package eu.ydp.qtiPageEditor.client.serviceregistry.services.impl.assetbrowser;

import com.google.gwt.core.client.JavaScriptObject;

public class AssetBrowserCallback extends JavaScriptObject {
	
	protected AssetBrowserCallback(){};
	
	public final native boolean onBrowseComplete(String filePath, String title)/*-{
		return this.onBrowseComplete(filePath, title);
	}-*/;
	
	public final native void onBrowseError(Object error)/*-{
		this.onBrowseError(error);
	}-*/;

		
	

}

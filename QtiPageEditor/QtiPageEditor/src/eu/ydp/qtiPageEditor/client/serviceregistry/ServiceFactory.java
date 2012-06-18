package eu.ydp.qtiPageEditor.client.serviceregistry;

import eu.ydp.qtiPageEditor.client.serviceregistry.services.IAssetBrowser;
import eu.ydp.qtiPageEditor.client.serviceregistry.services.IEditorService;
import eu.ydp.qtiPageEditor.client.serviceregistry.services.ISimpleService;
import eu.ydp.qtiPageEditor.client.serviceregistry.services.impl.SimpleService;
import eu.ydp.qtiPageEditor.client.serviceregistry.services.impl.assetbrowser.AssetBrowser;

public class ServiceFactory {
	
	public IEditorService getService(String name){
		
		IEditorService service = null;
		
		if(name.equals(ISimpleService.class.getName()))
			service = new SimpleService();
		else if(name.equals(IAssetBrowser.class.getName()))
			service = new AssetBrowser();
		
		return service;
		
	}

}

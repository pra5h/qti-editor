package eu.ydp.qtiPageEditor.client.serviceregistry;

import eu.ydp.qtiPageEditor.client.env.IEditorEnvirnoment;
import eu.ydp.qtiPageEditor.client.serviceregistry.services.IEditorService;

public class ServicesRegistry {
	
	private ServiceFactory _factory;
	private IEditorEnvirnoment _env;
	
	public ServicesRegistry(ServiceFactory factory){		
		
		_factory = factory;
		publish();		
	}
	
	public void setEnv(IEditorEnvirnoment env)
	{		
		_env = env;
	}
	
	public Object getService(String name)
	{
		IEditorService service = _factory.getService(name);
		
		if(service != null)
			service.setEnvironment(_env);		
		
		return service;
	}
	
	
	
	private native void publish()/*-{
		
		var doc = this;
		
		if(typeof($wnd.qti_page_editor.ServicesRegistry) != "object")
		{
			$wnd.qti_page_editor.ServicesRegistry = function () {    		
	    		this.SIMPLE_SERVICE = "simpleService";
	    		this.ASSET_BROWSER = "assetBrowser";	    		
	    		this.getService = function(type)
	    		{
	    			var service;    			
	    			if(type == this.SIMPLE_SERVICE)
	    			{
	    				service = doc.@eu.ydp.qtiPageEditor.client.serviceregistry.ServicesRegistry::getService(Ljava/lang/String;)("eu.ydp.qtiPageEditor.client.serviceregistry.services.ISimpleService");	    			
	    				return  service.@eu.ydp.qtiPageEditor.client.serviceregistry.services.impl.SimpleService::getJSO()();
	    			}
	    			else if(type == this.ASSET_BROWSER)
	    			{
	    				service = doc.@eu.ydp.qtiPageEditor.client.serviceregistry.ServicesRegistry::getService(Ljava/lang/String;)("eu.ydp.qtiPageEditor.client.serviceregistry.services.IAssetBrowser");
	    				return service.@eu.ydp.qtiPageEditor.client.serviceregistry.services.impl.assetbrowser.AssetBrowser::getJSO()();
	    			}
	    		}		
			}
		}		
	}-*/;
	

}

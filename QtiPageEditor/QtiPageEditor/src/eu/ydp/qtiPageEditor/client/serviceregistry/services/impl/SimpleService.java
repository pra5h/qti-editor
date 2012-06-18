package eu.ydp.qtiPageEditor.client.serviceregistry.services.impl;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.user.client.Window;

import eu.ydp.qtiPageEditor.client.serviceregistry.services.impl.base.BaseEditorService;

public class SimpleService extends BaseEditorService
{
	public SimpleService()
	{		
		
	}
	
	public void runMe()
	{		
		Window.alert("hello from service: \n" + _env.getBasePath() );		
	}
	
	public  native JavaScriptObject getJSO()/*-{
		
		var doc = this;		
		SimpleService = function(){									
			this.runMe = function(){
				 doc.@eu.ydp.qtiPageEditor.client.serviceregistry.services.impl.SimpleService::runMe()();
			}    				
		}
		
		return new SimpleService();	
	
	}-*/;
	
	
}

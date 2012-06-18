package eu.ydp.qtiPageEditor.client.serviceregistry.services.impl.base;

import com.google.gwt.core.client.JavaScriptObject;

import eu.ydp.qtiPageEditor.client.env.IEditorEnvirnoment;
import eu.ydp.qtiPageEditor.client.serviceregistry.services.IEditorService;

public abstract class BaseEditorService implements IEditorService {

	protected IEditorEnvirnoment _env;
	
	public void setEnvironment(IEditorEnvirnoment env) {
		_env = env;		

	}
	
	abstract public JavaScriptObject getJSO();
		
	

}

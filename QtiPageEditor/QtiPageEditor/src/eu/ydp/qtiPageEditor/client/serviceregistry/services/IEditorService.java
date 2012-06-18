package eu.ydp.qtiPageEditor.client.serviceregistry.services;

import com.google.gwt.core.client.JavaScriptObject;

import eu.ydp.qtiPageEditor.client.env.IEditorEnvirnoment;

public interface IEditorService {
	
	void setEnvironment(IEditorEnvirnoment env);
	
	public JavaScriptObject getJSO();
}

package eu.ydp.qtiPageEditor.client.env.impl;

import eu.ydp.qtiPageEditor.client.env.IEditorEnvirnoment;
import eu.ydp.qtiPageEditor.client.serviceregistry.ServicesRegistry;
import eu.ydp.webapistorage.client.storage.IStorage;

/**
 * 
 * @author thanczewski
 * Environment for editor, implementation of eu.ydp.qtiPageEditor.client.env.IEditorEnvirnoment interface
 * @see eu.ydp.qtiPageEditor.client.env.IEditorEnvirnoment
 *
 */
public class EditorEnvirnoment implements IEditorEnvirnoment {

	String _basePath;
	IStorage _storage;
	ServicesRegistry _servicesRegistry;
	String _mediaDirectory;
	
	public EditorEnvirnoment(String basePath, String mediaDirectory, IStorage storage, ServicesRegistry reg)
	{		
		_basePath = basePath;
		_storage = storage;
		_servicesRegistry = reg;
		_mediaDirectory = mediaDirectory;
		
		reg.setEnv(this);
	}
	
	@Override
	public void setBasePath(String path) {		
		_basePath = path;
	}
	
	
	@Override
	public String getBasePath() {		
		return _basePath;
	}

	@Override
	public Object getService(String type){
		return _servicesRegistry.getService(type);
	}

	@Override
	public IStorage getStorage() {
		
		return _storage; 
	}
	
	@Override
	public String getMediaDirectory(){
		return _mediaDirectory;
	}

}

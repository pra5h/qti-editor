package eu.ydp.qtiPageEditor.client.env;


import eu.ydp.webapistorage.client.storage.IStorage;

/**
 * 
 * @author thanczewski
 * Interface that defines envirnoment for editor
 *
 */
public interface IEditorEnvirnoment {
	
	/**
	 * Return currnet test or base page path passed from portal
	 * @return test or page base path
	 */
	String getBasePath();
	
	/**
	 * Sets current test or page base path
	 * @param path new test or page path	  
	 */
	void setBasePath(String path);
	
	/**
	 * Gets media base directory
	 * @return media directory base path
	 */
	String getMediaDirectory();
	
	
	/**
	 * Gets storage for operations on file system
	 * @return storage for file system operations
	 * @see eu.ydp.webapistorage.client.storage.IStorage
	 */
	IStorage getStorage();
	
	/**
	 * Gets service for current type
	 * @param type interface name of requested service
	 * @return instance of service that implements an interface given by the type parameter
	 */
	Object getService(String type);
}

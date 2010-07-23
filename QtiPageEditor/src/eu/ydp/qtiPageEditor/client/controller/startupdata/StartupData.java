package eu.ydp.qtiPageEditor.client.controller.startupdata;

import eu.ydp.qtiPageEditor.client.appcallback.TinyMceCreatedCallback;
import eu.ydp.qtiPageEditor.client.env.IEditorEnvirnoment;

/**
 * 
 * @author thanczewski
 * Provides start data for display application views.
 */
public class StartupData {

	/**
	 * Editor environment
	 * @see eu.ydp.qtiPageEditor.client.env.IEditorEnvirnoment
	 */
	private IEditorEnvirnoment _env;
	
	/**
	 * Cell identifier of html page where editor will be displayed
	 */
	private String _cellId;
	
	/**
	 * Callback to portal when tinyMCE control is ready
	 * @see eu.ydp.qtiPageEditor.client.appcallback.TinyMceCreatedCallback
	 */
	private TinyMceCreatedCallback _tinyCreatedCallback;
	
	
	/**
	 * Constructor
	 * @param env editor environment
	 * @param cellId cell identifier in html page where editor will be displayed.
	 * @param tinyCreatedCallback callback to portal when tinyMCE is ready.
	 */
	public StartupData(IEditorEnvirnoment env, String cellId, TinyMceCreatedCallback tinyCreatedCallback){
		_env = env;
		_cellId = cellId;
		_tinyCreatedCallback = tinyCreatedCallback;
		
	}
	
	public String getCellId(){
		return _cellId;
	}
	
	public IEditorEnvirnoment getEnv(){
		return _env;
	}
	
	public TinyMceCreatedCallback getTinyMceCreatedCallback(){
		return _tinyCreatedCallback;
	}
	
}

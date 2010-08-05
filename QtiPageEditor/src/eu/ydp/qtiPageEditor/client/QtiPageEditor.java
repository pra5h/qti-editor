package eu.ydp.qtiPageEditor.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;

import eu.ydp.qtiPageEditor.client.appcallback.SaveCallback;
import eu.ydp.qtiPageEditor.client.constants.Notifications;
import eu.ydp.qtiPageEditor.client.controller.startupdata.StartupData;
import eu.ydp.qtiPageEditor.client.env.IEditorEnvirnoment;
import eu.ydp.qtiPageEditor.client.env.impl.EditorEnvirnoment;
import eu.ydp.qtiPageEditor.client.events.SessionSustainerErrorEvent;
import eu.ydp.qtiPageEditor.client.events.handler.SessionSustainerErrorHandler;
import eu.ydp.qtiPageEditor.client.model.jso.ModuleConfig;
import eu.ydp.qtiPageEditor.client.serviceregistry.ServiceFactory;
import eu.ydp.qtiPageEditor.client.serviceregistry.ServicesRegistry;
import eu.ydp.qtiPageEditor.client.session.SessionSustainer;
import eu.ydp.qtiPageEditor.client.view.component.AlertWindow;
import eu.ydp.webapistorage.client.storage.IStorage;
import eu.ydp.webapistorage.client.storage.apierror.IApiError;
import eu.ydp.webapistorage.client.storage.impl.Storage;
import eu.ydp.webapistorage.client.storage.rpc.impl.RPCStorage;


/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class QtiPageEditor implements EntryPoint {
		
	private IEditorEnvirnoment _env;
	
	public void onModuleLoad() 
	{		
		
		publish();		
	}		
	/**
	 * Provides methods for portal - editor communication
	 * Registers qti_page_editor namespace on window object
	 */
	private native void publish()/*-{	
		
		var me = this	
				
		if(typeof($wnd.qti_page_editor) == "object")
		{
			if(typeof($wnd.qti_page_editor.register) != "function"){
				
				$wnd.qti_page_editor.register = function(config){					
					me.@eu.ydp.qtiPageEditor.client.QtiPageEditor::register(Leu/ydp/qtiPageEditor/client/model/jso/ModuleConfig;)(config);
				}
				
				$wnd.qti_page_editor.setPath = function(path){					
					me.@eu.ydp.qtiPageEditor.client.QtiPageEditor::setPath(Ljava/lang/String;)(path);
				}
				
				$wnd.qti_page_editor.loadPage = function(){					
					me.@eu.ydp.qtiPageEditor.client.QtiPageEditor::loadPage()();
				}
				
				$wnd.qti_page_editor.setSaveCallback = function(callback){					
					me.@eu.ydp.qtiPageEditor.client.QtiPageEditor::setJsSaveCallback(Leu/ydp/qtiPageEditor/client/appcallback/SaveCallback;)(callback);	
				}
				
				$wnd.qti_page_editor.setTinyMCECellWidth = function(width){
					me.@eu.ydp.qtiPageEditor.client.QtiPageEditor::onSetTinyMceWidth(Ljava/lang/String;)(width);
				}
				
				$wnd.qti_page_editor.setTinyMCECellHeight = function(height){
					me.@eu.ydp.qtiPageEditor.client.QtiPageEditor::onSetTinyMceHeight(Ljava/lang/String;)(height);
				}				
			}
			
			if(typeof($wnd.qti_page_editor.onModuleLoaded) == "function")
				$wnd.qti_page_editor.onModuleLoaded();		
		}
		
	}-*/;
	
	/**
	 * Builds application facade and runs editor.
	 * This method is called from portal and configuration is passes 
	 * @param conf module editor configuration i.e path to page, cell id where editor will be drawn
	 * @see eu.ydp.qtiPageEditor.client.model.jso.ModuleConfig
	 */
	private void register(ModuleConfig conf )
	{		
		ServicesRegistry sr = new ServicesRegistry(new ServiceFactory());

		// when in hosted mode use RPCStorage
		Boolean isHostedMode = GWT.getPermutationStrongName().equals( GWT.HOSTED_MODE_PERMUTATION_STRONG_NAME);
		IStorage storage = isHostedMode? RPCStorage.getInstance() : Storage.getInstance();
		// hardcoded path to edited resources - put files in war folder to run app in hosted mode 
		String resourcesPath = "/resources/64/script_00001/page_14.utp";
		String pageURL = isHostedMode? resourcesPath : conf.getPageURL();

		_env = new EditorEnvirnoment(pageURL,"media", storage, sr);		
		SessionSustainer sessionSustainer = new SessionSustainer(_env.getBasePath(), _env.getStorage());
		
		sessionSustainer.addErrorHandler(new SessionSustainerErrorHandler() {			
			@Override
			public void onSessionSustainerError(SessionSustainerErrorEvent event) {
				onSessionPingError(event.getError());				
			}
		});
		
		if(conf.getPing() > -1)
			sessionSustainer.start(conf.getPing());
		else
			sessionSustainer.start();
		
		StartupData startupData = new StartupData(_env, conf.getCellId(), conf.getTinyMceCreatedCallback());
		ApplicationFacade.getInstance(ApplicationFacade.KEY).startup(startupData);			
	}
	
	/**
	 * Error handler for session sustainer.
	 * Called when "ping" request fails.
	 * @param error error details
	 * @see eu.ydp.webapistorage.client.storage.apierror.IApiError
	 * @see eu.ydp.qtiPageEditor.client.session.SessionSustainer
	 */
	private void onSessionPingError(IApiError error){
		AlertWindow alert = new AlertWindow();
		alert.showErrorMessage(error.getType(), error.getDetails(), error.getErrorCode());
		alert.center();
		
	}
	
	/**
	 * Sets new page path for editor. It allows to change path passed in ModuleConfig object
	 * Called from portal application
	 * @param path base path of new page
	 */
	private void setPath(String path){		
		ApplicationFacade facade = ApplicationFacade.getInstance(ApplicationFacade.KEY);
		_env.setBasePath(path);
		if(facade != null){
			facade.sendNotification(Notifications.SET_PAGE_PATH, path);
		}
	}
	/**
	 * Reloads page. Called from portal application usually after setPath method 
	 */
	private void loadPage(){
		ApplicationFacade facade = ApplicationFacade.getInstance(ApplicationFacade.KEY);
		if(facade != null){
			facade.sendNotification(Notifications.RELOAD_PAGE,0);
		}
	}
	
	/**
	 * Sets callback to portal application for save page event
	 * @param callback callback to portal for save event
	 * @see eu.ydp.qtiPageEditor.client.appcallback.SaveCallback
	 */
	private void setJsSaveCallback(SaveCallback callback){
		ApplicationFacade facade = ApplicationFacade.getInstance(ApplicationFacade.KEY);
		if(facade != null){
			facade.sendNotification(Notifications.SET_JS_SAVE_CALLBACK, callback);
		}	
	}
	
	/**
	 * Sets tinyMce width. Called from portal
	 * @param width new tinyMCE width
	 */
	private void onSetTinyMceWidth(String width){
		
		ApplicationFacade facade = ApplicationFacade.getInstance(ApplicationFacade.KEY);
		if(facade != null)
			facade.sendNotification(Notifications.SET_TINY_CELL_SIZE, width, "width");
		
	}
	
	
	/**
	 * Sets tinyMCE height
	 * @param height new tinyMCE height
	 */
	private void onSetTinyMceHeight(String height){
		ApplicationFacade facade = ApplicationFacade.getInstance(ApplicationFacade.KEY);
		if(facade != null)
			facade.sendNotification(Notifications.SET_TINY_CELL_SIZE, height, "height");
	}
}

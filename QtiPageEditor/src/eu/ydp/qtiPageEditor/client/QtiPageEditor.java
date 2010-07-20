package eu.ydp.qtiPageEditor.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;

import eu.ydp.qtiPageEditor.client.appcallback.SaveCallback;
import eu.ydp.qtiPageEditor.client.constance.Constances;
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
		ApplicationFasade.getInstance(ApplicationFasade.KEY).startup(startupData);			
	}
	
	private void onSessionPingError(IApiError error){
		AlertWindow alert = new AlertWindow();
		alert.showErrorMessage(error.getType(), error.getDetails(), error.getErrorCode());
		alert.center();
		
	}
	
	private void setPath(String path){		
		ApplicationFasade facade = ApplicationFasade.getInstance(ApplicationFasade.KEY);
		_env.setBasePath(path);
		if(facade != null){
			facade.sendNotification(Constances.SET_PAGE_PATH, path);
		}
	}
	
	private void loadPage(){
		ApplicationFasade facade = ApplicationFasade.getInstance(ApplicationFasade.KEY);
		if(facade != null){
			facade.sendNotification(Constances.RELOAD_PAGE,0);
		}
	}
	
	private void setJsSaveCallback(SaveCallback callback){
		ApplicationFasade facade = ApplicationFasade.getInstance(ApplicationFasade.KEY);
		if(facade != null){
			facade.sendNotification(Constances.SET_JS_SAVE_CALLBACK, callback);
		}	
	}
	
	private void onSetTinyMceWidth(String width){
		
		ApplicationFasade facade = ApplicationFasade.getInstance(ApplicationFasade.KEY);
		if(facade != null)
			facade.sendNotification(Constances.SET_TINY_CELL_SIZE, width, "width");
		
	}
	
	private void onSetTinyMceHeight(String height){
		ApplicationFasade facade = ApplicationFasade.getInstance(ApplicationFasade.KEY);
		if(facade != null)
			facade.sendNotification(Constances.SET_TINY_CELL_SIZE, height, "height");
	}
}

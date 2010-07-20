package eu.ydp.qtitesteditor.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;

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
public class QtiTestEditor implements EntryPoint {
	
	/**
	 * This is the entry point method.
	 */
	public void onModuleLoad() {
		publish();
		
	}
	
	private native void publish()/*-{
		var me = this;
		
		if(typeof($wnd.qti_test_editor) == "object")
		{
			if(typeof($wnd.qti_test_editor.register) != "function"){
				
				$wnd.qti_test_editor.register = function(config){					
					me.@eu.ydp.qtitesteditor.client.QtiTestEditor::register(Leu/ydp/qtiPageEditor/client/model/jso/ModuleConfig;)(config);
				}
				
				$wnd.qti_test_editor.setTinyMCECellWidth = function(width){
					me.@eu.ydp.qtitesteditor.client.QtiTestEditor::onSetTinyMceWidth(Ljava/lang/String;)(width)
				}
				
				$wnd.qti_test_editor.setTinyMCECellHeight = function(height){
					me.@eu.ydp.qtitesteditor.client.QtiTestEditor::onSetTinyMceHeight(Ljava/lang/String;)(height)
				}
			}
			
			if(typeof($wnd.qti_test_editor.onModuleLoaded) == "function")
				$wnd.qti_test_editor.onModuleLoaded();		
		}
		
	}-*/;
	
	private void register(ModuleConfig conf)
	{
		ServicesRegistry reg = new ServicesRegistry(new ServiceFactory());
		
		Boolean isHostedMode = GWT.getPermutationStrongName().equals( GWT.HOSTED_MODE_PERMUTATION_STRONG_NAME);
		IStorage storage = isHostedMode? RPCStorage.getInstance() : Storage.getInstance();
		// hardcoded path to edited resources - put files in war folder to run app in hosted mode 
		String resourcesPath = "/resources/66/script_00001.utt";
		String pageURL = isHostedMode? resourcesPath : conf.getPageURL();

		IEditorEnvirnoment env = new EditorEnvirnoment(pageURL, "script_00001/media/", storage, reg);		
		
		SessionSustainer sessionSustainer = new SessionSustainer(env.getBasePath(), env.getStorage());
		
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
		
		
		StartupData startupData = new StartupData(env, conf.getCellId(), conf.getTinyMceCreatedCallback());
		QtiTestEditorFasade.getInstance(QtiTestEditorFasade.KEY).startup(startupData);
	}
	
	private void onSetTinyMceWidth(String width){
		
		QtiTestEditorFasade facade = QtiTestEditorFasade.getInstance(QtiTestEditorFasade.KEY);
		if(facade != null)
			facade.sendNotification(Constances.SET_TINY_CELL_SIZE, width, "width");
		
	}
	
	private void onSetTinyMceHeight(String height){
		QtiTestEditorFasade facade = QtiTestEditorFasade.getInstance(QtiTestEditorFasade.KEY);
		if(facade != null)
			facade.sendNotification(Constances.SET_TINY_CELL_SIZE, height, "height");
	}
	
	
	private void onSessionPingError(IApiError error){
		AlertWindow alert = new AlertWindow();
		alert.showErrorMessage(error.getType(), error.getDetails(), error.getErrorCode());
		alert.center();
		
	}

}

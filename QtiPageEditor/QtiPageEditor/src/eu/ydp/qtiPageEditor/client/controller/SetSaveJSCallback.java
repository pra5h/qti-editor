package eu.ydp.qtiPageEditor.client.controller;

import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.command.SimpleCommand;

import eu.ydp.qtiPageEditor.client.appcallback.SaveCallbackJSO;
import eu.ydp.qtiPageEditor.client.model.QTIPageModelProxy;

public class SetSaveJSCallback extends SimpleCommand {
	
	public void execute(INotification notification){
		
		QTIPageModelProxy proxy = (QTIPageModelProxy)getFacade().retrieveProxy(QTIPageModelProxy.NAME);
		SaveCallbackJSO callback = (SaveCallbackJSO)notification.getBody();
		
		proxy.setSaveCallback(callback);
		
	}

}

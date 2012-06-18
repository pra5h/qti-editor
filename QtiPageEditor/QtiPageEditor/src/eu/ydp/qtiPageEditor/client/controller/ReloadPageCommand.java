package eu.ydp.qtiPageEditor.client.controller;

import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.command.SimpleCommand;

import eu.ydp.qtiPageEditor.client.model.QTIPageModelProxy;

public class ReloadPageCommand extends SimpleCommand {
	
	public void execute(INotification notification){
		int ix = (Integer)notification.getBody();
		QTIPageModelProxy proxy = (QTIPageModelProxy)getFacade().retrieveProxy(QTIPageModelProxy.NAME);
		
		proxy.reload(ix);
		
	}

}

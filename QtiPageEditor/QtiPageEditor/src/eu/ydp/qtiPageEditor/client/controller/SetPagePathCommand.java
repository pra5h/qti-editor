package eu.ydp.qtiPageEditor.client.controller;

import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.command.SimpleCommand;

import eu.ydp.qtiPageEditor.client.model.QTIPageModelProxy;

public class SetPagePathCommand extends SimpleCommand {
	
	@Override
	public void execute(INotification notification){
		String path = (String)notification.getBody();
		QTIPageModelProxy proxy = (QTIPageModelProxy)getFacade().retrieveProxy(QTIPageModelProxy.NAME);
		
		proxy.setPagePath(path);
	}

}

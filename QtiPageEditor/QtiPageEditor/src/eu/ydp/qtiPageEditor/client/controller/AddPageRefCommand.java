package eu.ydp.qtiPageEditor.client.controller;

import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.command.SimpleCommand;

import eu.ydp.qtiPageEditor.client.model.QTITestModelProxy;

public class AddPageRefCommand extends SimpleCommand {
	
	public void execute(INotification notifiction){
		
		String path = null;
		if(notifiction.getBody() != null)
			path = (String)notifiction.getBody(); 
		
		QTITestModelProxy proxy = (QTITestModelProxy)getFacade().retrieveProxy(QTITestModelProxy.NAME);
		
		if(path == null)
			proxy.addPage();
		else
			proxy.addPage(path);	
	}

}

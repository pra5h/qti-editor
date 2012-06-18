package eu.ydp.qtiPageEditor.client.controller;

import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.command.SimpleCommand;

import eu.ydp.qtiPageEditor.client.model.QTIPageModelProxy;

public class SavePageCommand extends SimpleCommand {
	
	public void execute(INotification notification)  
	{  
		QTIPageModelProxy proxy = (QTIPageModelProxy)getFacade().retrieveProxy(QTIPageModelProxy.NAME);
		int ix = proxy.getSelectedIndex();
		if(ix > -1)
			proxy.save(ix);		  
	}  

}

package eu.ydp.qtiPageEditor.client.controller;

import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.command.SimpleCommand;
import org.puremvc.java.multicore.patterns.facade.Facade;

import eu.ydp.qtiPageEditor.client.env.IEditorEnvirnoment;
import eu.ydp.qtiPageEditor.client.model.QTIPageModelProxy;
import eu.ydp.qtiPageEditor.client.model.QTITestModelProxy;


public class ConfigureProxyCommand extends SimpleCommand {
	
	public void execute(INotification notification)  
	{  
		Facade facade = getFacade();
		IEditorEnvirnoment env = (IEditorEnvirnoment)notification.getBody();
		QTIPageModelProxy proxy = (QTIPageModelProxy)facade.retrieveProxy(QTIPageModelProxy.NAME);
		QTITestModelProxy testProxy=(QTITestModelProxy)facade.retrieveProxy(QTITestModelProxy.NAME);
		
		proxy.init(env);
		testProxy.init(env);
		
		  
	}  

}

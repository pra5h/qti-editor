package eu.ydp.qtiPageEditor.client.controller;

import org.puremvc.java.multicore.interfaces.ICommand;
import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.command.SimpleCommand;
import org.puremvc.java.multicore.patterns.facade.Facade;

import eu.ydp.qtiPageEditor.client.controller.startupdata.StartupData;
import eu.ydp.qtiPageEditor.client.model.QTIPageModelProxy;
import eu.ydp.qtiPageEditor.client.model.QTITestModelProxy;
import eu.ydp.qtiPageEditor.client.view.MainScreenMediator;

public class StartupCommand extends SimpleCommand implements ICommand {
	
	public void execute(INotification notification)  
	{  
		StartupData data = (StartupData)notification.getBody();
		
		Facade facade = getFacade();		
		facade.registerProxy(new QTITestModelProxy());
		facade.registerProxy(new QTIPageModelProxy());		
		facade.registerMediator(new MainScreenMediator(data));
		
	}  
}

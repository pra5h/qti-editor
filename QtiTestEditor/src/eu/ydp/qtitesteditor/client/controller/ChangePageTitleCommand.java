package eu.ydp.qtitesteditor.client.controller;

import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.command.SimpleCommand;
import eu.ydp.qtiPageEditor.client.model.QTIPageModelProxy;

public class ChangePageTitleCommand extends SimpleCommand {
	
	@Override
	public void execute(INotification notification) {
		String newTitle = (String)notification.getBody();
		if(notification.getType() != "noSave"){
			QTIPageModelProxy pmp = (QTIPageModelProxy)getFacade().retrieveProxy(QTIPageModelProxy.NAME);
			int pageIndex = pmp.getSelectedIndex();		
			
			pmp.getPage(pageIndex).setTitle(newTitle);
			pmp.save(pageIndex);
		}	
	}

}

package eu.ydp.qtiPageEditor.client.controller;

import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.command.SimpleCommand;

import eu.ydp.qtiPageEditor.client.constants.Notifications;
import eu.ydp.qtiPageEditor.client.model.QTIPageModelProxy;

public class UpdatePageCommand extends SimpleCommand {
	
	public void execute(INotification notification){
		
		QTIPageModelProxy proxy = (QTIPageModelProxy)getFacade().retrieveProxy(QTIPageModelProxy.NAME);		
		String content = (String)notification.getBody();		
		int ix = proxy.getSelectedIndex();
		String oldTitle;
		String newTitle;
		
		if(ix > -1)
		{	oldTitle = proxy.getPage(ix).getTitle();
			proxy.updatePageState(ix, content);
			newTitle = proxy.getPage(ix).getTitle();
			sendNotification(Notifications.SAVE_PAGE, ix);
			if(oldTitle.equals(newTitle) == false){
				sendNotification(Notifications.CHANGE_PAGE_TITLE, newTitle,"noSave");
			}
		}	
		
	}

}

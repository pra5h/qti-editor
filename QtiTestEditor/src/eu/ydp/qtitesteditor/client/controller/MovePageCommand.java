package eu.ydp.qtitesteditor.client.controller;

import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.command.SimpleCommand;

import eu.ydp.qtiPageEditor.client.constants.Notifications;
import eu.ydp.qtiPageEditor.client.model.QTIPageModelProxy;
import eu.ydp.qtiPageEditor.client.model.QTITestModelProxy;
import eu.ydp.qtitesteditor.client.view.PageListMediator;

public class MovePageCommand extends SimpleCommand {

	public void execute(INotification notification){
		
		QTITestModelProxy testProxy = (QTITestModelProxy)getFacade().retrieveProxy(QTITestModelProxy.NAME);
		QTIPageModelProxy pagesProxy = (QTIPageModelProxy)getFacade().retrieveProxy(QTIPageModelProxy.NAME);
		PageListMediator mediator = (PageListMediator)getFacade().retrieveMediator(PageListMediator.NAME);		
		int ix = mediator.getSelectedIndex();		
		int direction = (Integer)notification.getBody(); // 0 - down, 1 - up
		
		if(ix > -1 && mediator.getItemCount() > 1){
			if(direction == 1)
			{
				testProxy.moveUp(ix);
				pagesProxy.moveUp(ix);			
				sendNotification(Notifications.MOVE_PAGE_UP_LIST, ix);
			}
			else
			{
				testProxy.moveDown(ix);
				pagesProxy.moveDown(ix);			
				sendNotification(Notifications.MOVE_PAGE_DOWN_LIST, ix);
			}
			
			sendNotification(Notifications.SAVE_TEST);
		}
		
		
	}
}

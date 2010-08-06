package eu.ydp.qtitesteditor.client.controller;

import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.command.SimpleCommand;

import eu.ydp.qtiPageEditor.client.constants.Notifications;
import eu.ydp.qtiPageEditor.client.model.QTIPageModelProxy;
import eu.ydp.qtiPageEditor.client.model.QTITestModelProxy;

public class AddNewPageCommand extends SimpleCommand {
	
	public void execute(INotification notification){
		
		QTITestModelProxy testProxy = (QTITestModelProxy)getFacade().retrieveProxy(QTITestModelProxy.NAME);
		QTIPageModelProxy pagesProxy = (QTIPageModelProxy)getFacade().retrieveProxy(QTIPageModelProxy.NAME);		
		String[] hrefs;		
		
		testProxy.addPage();
		hrefs = testProxy.getItemsHrefs();
		pagesProxy.addPage(hrefs[hrefs.length-1]);
		
		String title = pagesProxy.getPage(pagesProxy.getPageCount()-1).getTitle();
		sendNotification(Notifications.ADD_PAGE_TO_LIST, title);
		sendNotification(Notifications.SAVE_TEST);
		sendNotification(Notifications.SAVE_PAGE,hrefs.length-1);
	}

}

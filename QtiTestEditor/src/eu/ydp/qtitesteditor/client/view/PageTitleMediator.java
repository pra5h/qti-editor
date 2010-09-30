package eu.ydp.qtitesteditor.client.view;

import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.mediator.Mediator;

import eu.ydp.qtiPageEditor.client.constants.Notifications;
import eu.ydp.qtiPageEditor.client.model.QTIPageModelProxy;
import eu.ydp.qtitesteditor.client.events.SetPageTitleEvent;
import eu.ydp.qtitesteditor.client.events.handler.PageTitleEnteredHandler;
import eu.ydp.qtitesteditor.client.view.component.pagetitle.PageTitleView;

public class PageTitleMediator extends Mediator {
	
	
	public static final String NAME = "pageTitleMediator";
	
	
	public PageTitleMediator() {
		super(NAME, new PageTitleView() );
	}
	
	@Override
	public String[] listNotificationInterests() {
		return new String[]{Notifications.SHOW_TITLE_DIALOG};	 
	}
	
	@Override
	public void handleNotification(INotification notification) {
		String nName = notification.getName();
		
		if(nName == Notifications.SHOW_TITLE_DIALOG){
			showTitleDialog((Integer)notification.getBody());
		}
	}
	
	private void showTitleDialog(int pageIndex){
		
		PageTitleView view = (PageTitleView)getViewComponent();		
		QTIPageModelProxy pages = (QTIPageModelProxy)getFacade().retrieveProxy(QTIPageModelProxy.NAME);
		String pageTitle;
		
		view.center();
		
		pageTitle = pages.getPage(pageIndex).getTitle();
		view.setPageTitle(pageTitle);
		
		view.addTitleEnteredListener(new PageTitleEnteredHandler() {
			
			@Override
			public void onTitleEntered(SetPageTitleEvent event) {
				sendNotification(Notifications.CHANGE_PAGE_TITLE, event.getTitle());				
			}
		});
		
		
		
	}
	
	
}

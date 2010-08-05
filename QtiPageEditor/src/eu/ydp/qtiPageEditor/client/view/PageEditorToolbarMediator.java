package eu.ydp.qtiPageEditor.client.view;

import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.mediator.Mediator;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.CellPanel;

import eu.ydp.qtiPageEditor.client.constants.Notifications;
import eu.ydp.qtiPageEditor.client.view.component.PageEditorToolbarView;
import eu.ydp.webapistorage.client.storage.apierror.IApiError;

public class PageEditorToolbarMediator extends Mediator {
	
	public static final String NAME = "pageEditorToolbarMediator";	
	
	
	public PageEditorToolbarMediator() {
		super(NAME, new PageEditorToolbarView());		
	}
	
	public void onRegister()  
	 { 		
		PageEditorToolbarView toolbar = (PageEditorToolbarView)getViewComponent();
		toolbar = new PageEditorToolbarView();
		((CellPanel)getViewComponent()).add(toolbar);
		
		toolbar.getSaveButton().addClickHandler(new ClickHandler() {
			
			@Override
			public void onClick(ClickEvent event) {
				onSaveClick(event);
				
			}
		});
	 }
	
	private void onSaveClick(ClickEvent event)
	{
		sendNotification(PageEditorToolbarView.SAVE_PRESSED);
	}
	
	@Override
	public void handleNotification(INotification notification) {
		String not = notification.getName();
		if(not == Notifications.SAVE_PAGE_ERROR)
		{
			IApiError error = (IApiError)notification.getBody();
			Window.alert(error.getType() + "\n error code" +error.getErrorCode() + "\n" +error.getDetails()  );
		}
	}
	
	@Override
	public String[] listNotificationInterests() {
		return new String[]{Notifications.SAVE_PAGE_ERROR}; 
				 
	}

}

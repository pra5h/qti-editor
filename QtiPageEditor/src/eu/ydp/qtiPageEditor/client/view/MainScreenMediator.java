package eu.ydp.qtiPageEditor.client.view;

import org.puremvc.java.multicore.interfaces.IMediator;
import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.mediator.Mediator;

import com.google.gwt.user.client.ui.RootPanel;

import eu.ydp.qtiPageEditor.client.constants.Notifications;
import eu.ydp.qtiPageEditor.client.controller.startupdata.StartupData;
import eu.ydp.qtiPageEditor.client.view.component.AlertWindow;
import eu.ydp.qtiPageEditor.client.view.component.MainScreenView;
import eu.ydp.qtiPageEditor.client.view.component.PageEditorView;
import eu.ydp.webapistorage.client.storage.apierror.IApiError;

public class MainScreenMediator extends Mediator implements IMediator {
	
	 public static final String NAME = "ApplicationMediator";
	 	  
	 
	 private StartupData _startupData;
	 
	 public MainScreenMediator(StartupData startup)
	 {		 
		 super(NAME, new MainScreenView());
		 _startupData = startup;
		
	 }
	 
	 public void onRegister()  
	 {		
		MainScreenView ms = (MainScreenView)getViewComponent();		
		RootPanel.get(_startupData.getCellId()).add(ms);			
		
		getFacade().registerMediator( new PageEditorViewMediator(_startupData));
		PageEditorView editor = (PageEditorView)getFacade().retrieveMediator(PageEditorViewMediator.NAME).getViewComponent();
		
		getFacade().registerMediator(new PreviewMediator());
		
		ms.add(editor);
		
	 }
	 @Override
	public void handleNotification(INotification notification) {
		
		String n = notification.getName();
		
		if(n == Notifications.PAGES_LOADED)
		{
			sendNotification(Notifications.SHOW_PAGE, 0);
		}
		else if(n == Notifications.LOAD_PAGE_ERROR || n == Notifications.SAVE_PAGE_ERROR)
		{
			IApiError error = (IApiError)notification.getBody();
			AlertWindow pop = new AlertWindow();
			pop.showErrorMessage(error.getType(), error.getDetails(), error.getErrorCode());
			pop.center();
			pop.show();
			
		}
				
	}
	 
	 @Override
	public String[] listNotificationInterests() {
		
		 return new String[]{Notifications.PAGES_LOADED, 
				 Notifications.LOAD_PAGE_ERROR,
				 Notifications.SAVE_PAGE_ERROR};
	}

}

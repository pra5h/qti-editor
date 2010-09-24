package eu.ydp.qtitesteditor.client.view;

import org.puremvc.java.multicore.interfaces.IMediator;
import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.mediator.Mediator;

import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.RootPanel;

import eu.ydp.qtiPageEditor.client.constants.Notifications;
import eu.ydp.qtiPageEditor.client.controller.startupdata.StartupData;
import eu.ydp.qtiPageEditor.client.view.PageEditorViewMediator;
import eu.ydp.qtiPageEditor.client.view.PreviewMediator;
import eu.ydp.qtiPageEditor.client.view.component.AlertWindow;
import eu.ydp.qtiPageEditor.client.view.component.PageEditorView;
import eu.ydp.qtitesteditor.client.view.component.MainView;
import eu.ydp.qtitesteditor.client.view.component.PageListBarView;
import eu.ydp.qtitesteditor.client.view.component.PageListView;
import eu.ydp.webapistorage.client.storage.apierror.IApiError;

public class MainViewMediator extends Mediator implements IMediator {
	
	public static final String NAME = "MainViewMediator";
	
	private StartupData _startupData;
	
	public MainViewMediator(StartupData startupData){
		super(NAME, new MainView());
		_startupData = startupData;
		
		
	}
	
	public void onRegister()
	{
		MainView mv = (MainView)getViewComponent();		
		RootPanel.get(_startupData.getCellId()).add(mv);
		
		mv.setSize("100%", "100%");
		
		getFacade().registerMediator(new PageListBarMediator());
		getFacade().registerMediator(new PageListMediator());
		getFacade().registerMediator(new PageEditorViewMediator(_startupData));
		getFacade().registerMediator(new PreviewMediator());
		
		addView( retrieveView(PageEditorViewMediator.NAME));
		addView( retrieveView(PageListBarMediator.NAME));
		addView( retrieveView(PageListMediator.NAME));
		
				
	}
	
	private void addView(Composite view)
	{
		MainView mv = (MainView)getViewComponent();
		if(view instanceof PageListBarView)
			mv.addPageListBar((PageListBarView)view);
		else if(view instanceof PageListView)
			mv.addPageList((PageListView)view);
		else if(view instanceof PageEditorView)
			mv.addTinyEditor((PageEditorView)view);
			
	}
	
	private Composite retrieveView(String mediatorName){
		return (Composite)getFacade().retrieveMediator(mediatorName).getViewComponent(); 
	}
	
	private void showErrorPopup(IApiError error){
		AlertWindow alert = new AlertWindow();
		alert.showErrorMessage(error.getType(), error.getDetails(), error.getErrorCode());
		alert.center();
	}
	
	private void onXMLMalformed(String msg){		
		AlertWindow pop = new AlertWindow();
		pop.setHtml(false);
		pop.showErrorMessage("Page data is malformed and content will be lost.", msg );		
		pop.showPopup();
	}
	
	@Override
	public String[] listNotificationInterests() {
		return new String[]{Notifications.LOAD_TEST_ERROR, 
				Notifications.LOAD_PAGE_ERROR, 
				Notifications.SAVE_TEST_ERROR,
				Notifications.SAVE_PAGE_ERROR,
				Notifications.PAGE_XML_MALFORMED};
	}
	
	@Override
	public void handleNotification(INotification notification) {
		String n = notification.getName();
		
		if(n == Notifications.LOAD_TEST_ERROR ||
				n == Notifications.LOAD_PAGE_ERROR ||
				n == Notifications.SAVE_PAGE_ERROR ||
				n == Notifications.SAVE_TEST_ERROR)
			showErrorPopup((IApiError)notification.getBody());
		else if(n == Notifications.PAGE_XML_MALFORMED)
			onXMLMalformed((String)notification.getBody());

	}
}

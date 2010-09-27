package eu.ydp.qtitesteditor.client.view;

import org.puremvc.java.multicore.interfaces.IMediator;
import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.mediator.Mediator;

import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import eu.ydp.qtiPageEditor.client.constants.Notifications;
import eu.ydp.qtiPageEditor.client.events.TinyMceResizeEvent;
import eu.ydp.qtiPageEditor.client.model.QTIPageModelProxy;
import eu.ydp.qtiPageEditor.client.view.PageEditorViewMediator;
import eu.ydp.qtiPageEditor.client.view.component.PageEditorView;
import eu.ydp.qtitesteditor.client.view.component.PageListBarView;
import eu.ydp.qtitesteditor.client.view.component.PageListView;

public class PageListMediator extends Mediator implements IMediator, ChangeHandler {
	
	public static final String NAME = "pageListMediator";
	
	public PageListMediator(){		
		super(NAME, new PageListView() );		
	}
	
	public void onRegister() {	
		
		PageListView view = (PageListView)getViewComponent();		
		view.getListBox().addChangeHandler(this);		
			
	}
	
	public int getSelectedIndex(){
		return ((PageListView)getViewComponent()).getSelectedIndex();
	}
	
	public int getItemCount(){
		return ((PageListView)getViewComponent()).getItemCount();
	}	
	
	public void onChange(ChangeEvent event) {		
		PageListView view = (PageListView)getViewComponent();
		QTIPageModelProxy pagesProxy = (QTIPageModelProxy)getFacade().retrieveProxy(QTIPageModelProxy.NAME);
		int oldIx = pagesProxy.getSelectedIndex();		
		int ix = view.getSelectedIndex();
		view.setSelectedIndex(ix);
		PageEditorView pev = (PageEditorView)getFacade().retrieveMediator(PageEditorViewMediator.NAME).getViewComponent();
		String newState = pev.getText();		
		String oldState = pagesProxy.getPageContent(oldIx);
		
		if(newState != oldState)
			sendNotification(Notifications.UPDATE_PAGE_STATE,newState);
		
		sendNotification(Notifications.SET_MODEL_SELECTED_INDEX, ix); 
		sendNotification(Notifications.SHOW_PAGE, ix);
		
	}
	
	@Override
	public void handleNotification(INotification notification) {		
		String n = notification.getName();
		
		if(n == Notifications.PAGES_LOADED)
			showPages((String[])notification.getBody());
		else if(n == Notifications.ADD_PAGE_TO_LIST)
			addPage((String)notification.getBody());
		else if(n == Notifications.REMOVE_PAGE_FROM_LIST)
			removePage((Integer)notification.getBody());
		else if(n == Notifications.MOVE_PAGE_UP_LIST)
			moveUpPage((Integer)notification.getBody());
		else if(n == Notifications.MOVE_PAGE_DOWN_LIST)
			moveDownPage((Integer)notification.getBody());
		else if(n == Notifications.TINY_RESIZE)
			onTinyResize((TinyMceResizeEvent)notification.getBody());
				
		
	}
	
	@Override
	public String[] listNotificationInterests() {		
		return new String[]{Notifications.PAGES_LOADED,
				Notifications.ADD_PAGE_TO_LIST,
				Notifications.REMOVE_PAGE_FROM_LIST,
				Notifications.MOVE_PAGE_UP_LIST,
				Notifications.MOVE_PAGE_DOWN_LIST,
				Notifications.TINY_RESIZE};				 
	}
	
	
	//-----------------------------------------------------
	
	private void showPages(String[] titles){
		PageListView view = (PageListView)getViewComponent();
		view.showPages(titles);
		view.setSelectedIndex(0);
		sendNotification(Notifications.SHOW_PAGE, 0);
	}
	
	private void addPage(String title){
		PageListView view = (PageListView)getViewComponent();
		if(view.getItemCount() == 0)
			sendNotification(Notifications.BLOCK_EDITOR, false);
		
		view.addPage(title);
		view.setSelectedIndex(view.getItemCount()-1);
		sendNotification(Notifications.SET_MODEL_SELECTED_INDEX,view.getItemCount()-1 );		
		sendNotification(Notifications.SHOW_PAGE, view.getSelectedIndex());
		
	}
	
	private void removePage(int ix){		
		PageListView view = (PageListView)getViewComponent();
		view.removePage(ix);
		if(view.getItemCount() > 0)		{			
			view.setSelectedIndex(ix > 0 ? ix-1 : 0);			
			sendNotification(Notifications.SHOW_PAGE, view.getSelectedIndex());
		}
		else{
			sendNotification(Notifications.CLEAR_EDITOR);
			sendNotification(Notifications.BLOCK_EDITOR, true);
		}
			
		sendNotification(Notifications.SET_MODEL_SELECTED_INDEX, view.getSelectedIndex() );
	}
	
	private void moveUpPage(int ix){
		PageListView view = (PageListView)getViewComponent();
		view.moveUpPage(ix);
		if(ix > 0)
			view.setSelectedIndex(ix-1);
		else
			view.setSelectedIndex(view.getItemCount() - 1);
		
		sendNotification(Notifications.SET_MODEL_SELECTED_INDEX,view.getSelectedIndex() );
	}
	
	private void moveDownPage(int ix){
		PageListView view = (PageListView)getViewComponent();
		view.moveDownPage(ix);
		if(ix+1 < view.getItemCount())
			view.setSelectedIndex(ix+1);
		else
			view.setSelectedIndex(0);
		
		sendNotification(Notifications.SET_MODEL_SELECTED_INDEX,view.getSelectedIndex()); 
		
	}
	
	private void onTinyResize(TinyMceResizeEvent event){
		PageListView view = (PageListView)getViewComponent();
		PageListBarView plb = (PageListBarView)getFacade().retrieveMediator(PageListBarMediator.NAME).getViewComponent();		
		view.setHeight((event.getTinyMceHeight() - plb.getOffsetHeight()) +"px" );
		
	}
}

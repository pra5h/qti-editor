package eu.ydp.qtiPageEditor.client.view;

import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.mediator.Mediator;

import eu.ydp.qtiPageEditor.client.constants.Notifications;
import eu.ydp.qtiPageEditor.client.controller.startupdata.StartupData;
import eu.ydp.qtiPageEditor.client.events.TinyMceCreatedEvent;
import eu.ydp.qtiPageEditor.client.events.TinyMcePreviewEvent;
import eu.ydp.qtiPageEditor.client.events.TinyMceResizeEvent;
import eu.ydp.qtiPageEditor.client.events.TinyMceSaveEvent;
import eu.ydp.qtiPageEditor.client.events.handler.TinyMceCreatedHandler;
import eu.ydp.qtiPageEditor.client.events.handler.TinyMcePreviewHandler;
import eu.ydp.qtiPageEditor.client.events.handler.TinyMceResizeHandler;
import eu.ydp.qtiPageEditor.client.events.handler.TinyMceSaveEventHandler;
import eu.ydp.qtiPageEditor.client.model.QTIPageModelProxy;
import eu.ydp.qtiPageEditor.client.view.component.PageEditorView;

public class PageEditorViewMediator extends Mediator implements TinyMceSaveEventHandler, TinyMcePreviewHandler, TinyMceResizeHandler, TinyMceCreatedHandler {
	
	public static final String NAME = "pageEditorViewMediator";
		
	public PageEditorViewMediator(StartupData startupData)
	{		
		super(NAME, new PageEditorView(startupData.getEnv(), startupData.getTinyMceCreatedCallback()));		
		
	}	
	
	
	public void onRegister(){
		PageEditorView view = (PageEditorView)getViewComponent();		
		view.addTinyMceSaveHandler(this);
		view.addTinyMcePreviewHandler(this);
		view.addTinyMceResizeHandler(this);
		view.addTinyMceCreatedHandler(this);
	}
	
	private void showPage(int ix){
		QTIPageModelProxy pageProxy = (QTIPageModelProxy) getFacade().retrieveProxy(QTIPageModelProxy.NAME);
		String page = pageProxy.getPage(ix).getContent();		
		String pageBasePath = pageProxy.getPage(ix).getPath();
		
		((PageEditorView)getViewComponent()).setText(page);		
		((PageEditorView)getViewComponent()).setPageBasePath(pageBasePath);
	}
	
	
	private void setTinySize(String size, String type){
		PageEditorView view = (PageEditorView)getViewComponent();		
		if(type == "width")
			view.setTinyWidth(size);
		else if(type == "height")
			view.setTinyHeight(size);
	}
	
	private void configView(String pageBasePath){		
		((PageEditorView)getViewComponent()).setPageBasePath(pageBasePath);
	}
	
	private void blockEditor(Boolean bool){
		((PageEditorView)getViewComponent()).setBlock(bool);
	}
	
	private void clearEditorContent(){
		((PageEditorView)getViewComponent()).clearEditorContent();
	}
	
	@Override
	public String[] listNotificationInterests() {
		return new String[]{Notifications.SHOW_PAGE, 
				Notifications.SET_TINY_CELL_SIZE,
				Notifications.CONFIGURE_PAGE_EDITOR_VIEW,
				Notifications.BLOCK_EDITOR,
				Notifications.CLEAR_EDITOR};				 
	}
	
	@Override
	public void handleNotification(INotification notification) {
		String n = notification.getName();		
		if(n == Notifications.SHOW_PAGE)
			showPage((Integer)notification.getBody());
		else if(n == Notifications.SET_TINY_CELL_SIZE)
			setTinySize((String)notification.getBody(), notification.getType());
		else if(n == Notifications.CONFIGURE_PAGE_EDITOR_VIEW)
			configView((String)notification.getBody());
		else if(n == Notifications.BLOCK_EDITOR)
			blockEditor((Boolean)notification.getBody());
		else if(n == Notifications.CLEAR_EDITOR)
			clearEditorContent();
			
	}
	
	//-------- TinyMceSaveEventHandler impl--------------------
	
	public void onPageSave(TinyMceSaveEvent event){
		PageEditorView view = (PageEditorView)getViewComponent();
		String content = view.getText();
		
		sendNotification(Notifications.UPDATE_PAGE_STATE, content);
	} 
	
	//---------------------------------------------------------
	
	public void onShowPreview(TinyMcePreviewEvent event){		
		PageEditorView view = (PageEditorView)getViewComponent();
		String content = view.getText();
		sendNotification(Notifications.SHOW_PREVIEW,content);
	}
	
	//--------------------------------------------------------------
	
	public void onTinyResize(TinyMceResizeEvent event){
		sendNotification(Notifications.TINY_RESIZE, event);
	}
	
	//---------------------------------------------------------------
	
	public void onTinyMceCreated(TinyMceCreatedEvent event){
		sendNotification(Notifications.TINY_CREATED);
	}
}

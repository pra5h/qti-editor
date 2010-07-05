package eu.ydp.qtiPageEditor.client.view;

import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.mediator.Mediator;

import eu.ydp.qtiPageEditor.client.constance.Constances;
import eu.ydp.qtiPageEditor.client.controller.startupdata.StartupData;
import eu.ydp.qtiPageEditor.client.events.TinyMceSaveEvent;
import eu.ydp.qtiPageEditor.client.events.handler.TinyMceSaveEventHandler;
import eu.ydp.qtiPageEditor.client.model.QTIPageModelProxy;
import eu.ydp.qtiPageEditor.client.view.component.PageEditorView;

public class PageEditorViewMediator extends Mediator implements TinyMceSaveEventHandler {
	
	public static final String NAME = "pageEditorViewMediator";
		
	public PageEditorViewMediator(StartupData startupData)
	{		
		super(NAME, new PageEditorView(startupData.getEnv(), startupData.getTinyMceCreatedCallback()));		
		
	}	
	
	
	public void onRegister(){
		PageEditorView view = (PageEditorView)getViewComponent();		
		view.addTinyMceSaveHandler(this);		
	}
	
	private void showPage(int ix){
		QTIPageModelProxy pageProxy = (QTIPageModelProxy) getFacade().retrieveProxy(QTIPageModelProxy.NAME);
		String page = pageProxy.getDataVO().get(ix).getContent();		
		String pageBasePath = pageProxy.getDataVO().get(ix).getPath();
		
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
	
	
	@Override
	public String[] listNotificationInterests() {
		return new String[]{Constances.SHOW_PAGE, 
				Constances.SET_TINY_CELL_SIZE,
				Constances.CONFIGURE_PAGE_EDITOR_VIEW};				 
	}
	
	@Override
	public void handleNotification(INotification notification) {
		String n = notification.getName();		
		if(n == Constances.SHOW_PAGE)
			showPage((Integer)notification.getBody());
		else if(n == Constances.SET_TINY_CELL_SIZE)
			setTinySize((String)notification.getBody(), notification.getType());
		else if(n == Constances.CONFIGURE_PAGE_EDITOR_VIEW)
			configView((String)notification.getBody());
	}
	
	//-------- TinyMceSaveEventHandler impl--------------------
	public void onPageSave(TinyMceSaveEvent event){
		PageEditorView view = (PageEditorView)getViewComponent();
		String content = view.getText();
		
		sendNotification(Constances.UPDATE_PAGE_STATE, content);
	} 
	
	//---------------------------------------------------------
}
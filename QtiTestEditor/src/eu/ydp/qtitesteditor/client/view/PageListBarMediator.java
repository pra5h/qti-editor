package eu.ydp.qtitesteditor.client.view;

import org.puremvc.java.multicore.patterns.mediator.Mediator;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;

import eu.ydp.qtiPageEditor.client.constants.Notifications;
import eu.ydp.qtiPageEditor.client.events.DialogYesNoEvent;
import eu.ydp.qtiPageEditor.client.events.handler.DialogYesNoHandler;
import eu.ydp.qtiPageEditor.client.model.QTIPageModelProxy;
import eu.ydp.qtiPageEditor.client.view.PageEditorViewMediator;
import eu.ydp.qtiPageEditor.client.view.component.PageEditorView;
import eu.ydp.qtiPageEditor.client.view.component.yesno.YesNoDialog;
import eu.ydp.qtitesteditor.client.view.component.PageListBarView;
import eu.ydp.qtitesteditor.client.view.component.PageListView;

public class PageListBarMediator extends Mediator implements ClickHandler {
	
	public static final String NAME = "pageListBarMediator";
	
	public PageListBarMediator(){		
		super(NAME, new PageListBarView());
		
	}
	
	 public void onRegister()  
	 {		 
		 PageListBarView view = (PageListBarView)getViewComponent();
		 
		 view.getAddPageButton().addClickHandler(this);
		 view.getRemovePageButton().addClickHandler(this);
		 view.getMoveUpButton().addClickHandler(this);
		 view.getMoveDownButton().addClickHandler(this);		 
	 }
	 
	 public void onClick(ClickEvent event) {
		 PageListBarView view = (PageListBarView)getViewComponent();
		 Object b = event.getSource();
		 
		 if(b.equals(view.getAddPageButton()))
		 	 onAddPage();
		 else if(b.equals(view.getRemovePageButton()))
			 onRemovePage();			 
		 else if(b.equals(view.getMoveUpButton()))
			 sendNotification(Notifications.MOVE_PAGE_MODEL,1);
		 else if(b.equals(view.getMoveDownButton()))
			 sendNotification(Notifications.MOVE_PAGE_MODEL,0);
		 
	 }
	 
	 private void onRemovePage(){		 
		 int ix = ((PageListMediator)getFacade().retrieveMediator(PageListMediator.NAME)).getSelectedIndex();		 
		 
		 if(ix > -1)
		 {
			 String message = "Do you really want to delete selected page?";			 
			 YesNoDialog dialog = new YesNoDialog();
			 dialog.addDialogYesNoHandler(new DialogYesNoHandler() {
				
				@Override
				public void onYesNoClick(DialogYesNoEvent event) {
					if(event.getResult() == DialogYesNoEvent.DIALOG_YES)
						sendNotification(Notifications.REMOVE_PAGE_FROM_MODEL);				
				}
			});
			 
			 dialog.showDialog("Warning", message);
		 }
	 }
	 
	 private void onAddPage(){		
		 int ix = ((PageListView)getFacade().retrieveMediator(PageListMediator.NAME).getViewComponent()).getSelectedIndex();
		 String content = ((PageEditorView)getFacade().retrieveMediator(PageEditorViewMediator.NAME).getViewComponent()).getText();
		 String oldContent = null;
		 QTIPageModelProxy proxy = (QTIPageModelProxy)getFacade().retrieveProxy(QTIPageModelProxy.NAME);		 
		 
		 if(proxy.getPageCount() > 0)
			 oldContent = proxy.getPageContent(ix);
			 
		 if(oldContent != content)
			 sendNotification(Notifications.UPDATE_PAGE_STATE, content);
		 
		 sendNotification(Notifications.ADD_NEW_PAGE_TO_MODEL);
		
	 }
	 
	 

}

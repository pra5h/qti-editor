package eu.ydp.qtitesteditor.client;

import org.puremvc.java.multicore.patterns.facade.Facade;

import eu.ydp.qtiPageEditor.client.constants.Notifications;
import eu.ydp.qtiPageEditor.client.controller.LoadPagesCommand;
import eu.ydp.qtiPageEditor.client.controller.SavePageCommand;
import eu.ydp.qtiPageEditor.client.controller.UpdatePageCommand;
import eu.ydp.qtiPageEditor.client.controller.startupdata.StartupData;
import eu.ydp.qtitesteditor.client.controller.AddNewPageCommand;
import eu.ydp.qtitesteditor.client.controller.ChangePageTitleCommand;
import eu.ydp.qtitesteditor.client.controller.ConfigureProxyCommand;
import eu.ydp.qtitesteditor.client.controller.LoadTestCommand;
import eu.ydp.qtitesteditor.client.controller.MovePageCommand;
import eu.ydp.qtitesteditor.client.controller.RemovePageCommand;
import eu.ydp.qtitesteditor.client.controller.SaveTestCommand;
import eu.ydp.qtitesteditor.client.controller.SetSelectedIndexCommand;
import eu.ydp.qtitesteditor.client.controller.StartupCommand;

public class QtiTestEditorFacade extends Facade {
	
	public static final String  KEY = "QtiTestEditorFacadeKey";	
	public static final String  NAME = "QtiTestEditorFacade";	
	public static final String STARTUP= NAME + "StartUp";	
	
	protected QtiTestEditorFacade(String key) {
		super(key);		
	}
	
	public void startup(StartupData startupData)
	{
		sendNotification(STARTUP,startupData);
		sendNotification(Notifications.CONFIGURE_PROXY, startupData.getEnv());
		sendNotification(Notifications.LOAD_TEST);
	}
	
	
	protected void initializeController()
	{ 	            
		super.initializeController();
		registerCommand(STARTUP, new StartupCommand());
		registerCommand(Notifications.CONFIGURE_PROXY, new ConfigureProxyCommand());
		registerCommand(Notifications.LOAD_TEST, new LoadTestCommand());
		registerCommand(Notifications.LOAD_PAGES, new LoadPagesCommand());
		registerCommand(Notifications.ADD_NEW_PAGE_TO_MODEL,new AddNewPageCommand());
		registerCommand(Notifications.SAVE_PAGE, new SavePageCommand());		
		registerCommand(Notifications.SAVE_TEST, new SaveTestCommand());
		registerCommand(Notifications.REMOVE_PAGE_FROM_MODEL, new RemovePageCommand());
		registerCommand(Notifications.MOVE_PAGE_MODEL, new MovePageCommand());
		registerCommand(Notifications.UPDATE_PAGE_STATE, new UpdatePageCommand());
		registerCommand(Notifications.SET_MODEL_SELECTED_INDEX, new SetSelectedIndexCommand());
		registerCommand(Notifications.CHANGE_PAGE_TITLE, new ChangePageTitleCommand());
		
	}
	
	public synchronized static QtiTestEditorFacade getInstance(String key )
	{
		if (instanceMap.get(key) == null) {
			try {
				 new QtiTestEditorFacade(key); 
			} 
				catch (Exception e) {
			}
		}
		return (QtiTestEditorFacade)instanceMap.get(key);
	}

}

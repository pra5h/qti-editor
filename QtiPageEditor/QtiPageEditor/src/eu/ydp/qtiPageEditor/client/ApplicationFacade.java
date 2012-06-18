package eu.ydp.qtiPageEditor.client;

import org.puremvc.java.multicore.interfaces.IFacade;
import org.puremvc.java.multicore.patterns.facade.Facade;

import eu.ydp.qtiPageEditor.client.constants.Notifications;
import eu.ydp.qtiPageEditor.client.controller.AddPageRefCommand;
import eu.ydp.qtiPageEditor.client.controller.ConfigureProxyCommand;
import eu.ydp.qtiPageEditor.client.controller.InitEmptyPageCommand;
import eu.ydp.qtiPageEditor.client.controller.LoadPagesCommand;
import eu.ydp.qtiPageEditor.client.controller.ReloadPageCommand;
import eu.ydp.qtiPageEditor.client.controller.SavePageCommand;
import eu.ydp.qtiPageEditor.client.controller.SetPagePathCommand;
import eu.ydp.qtiPageEditor.client.controller.SetSaveJSCallback;
import eu.ydp.qtiPageEditor.client.controller.StartupCommand;
import eu.ydp.qtiPageEditor.client.controller.UpdatePageCommand;
import eu.ydp.qtiPageEditor.client.controller.startupdata.StartupData;

public class ApplicationFacade extends Facade implements IFacade {

	public static final String KEY = "ApplicationFacadeKey";
	public static final String NAME = "ApplicationFacade";	
	public static final String STARTUP = NAME + "StartUp";
	public static final String CONFIGURE_PROXY = NAME + "ConfigureProxy";
	
	
	protected ApplicationFacade(String key) {
		super(key);
	}	
	
	public void startup(StartupData startupData)
	{		
		String[] hrefs = new String[1];
		String base = startupData.getEnv().getBasePath();
		hrefs[0] = base.substring(base.lastIndexOf("/")+1);		
		
		sendNotification( STARTUP, startupData);		
		sendNotification(CONFIGURE_PROXY, startupData.getEnv());
		if(base != null && !base.equals("")){
			sendNotification(Notifications.LOAD_PAGES, hrefs);
			sendNotification(Notifications.CONFIGURE_PAGE_EDITOR_VIEW, base );
			sendNotification(Notifications.ADD_PAGE_REF, hrefs[0]);
		}			
		else{
			sendNotification(Notifications.INIT_EMPTY_PAGE);
			sendNotification(Notifications.SHOW_PAGE,0);
			sendNotification(Notifications.ADD_PAGE_REF);
		}
			
	}
	
	
	protected void initializeController()
	{ 	            
		super.initializeController();		
		
		registerCommand(STARTUP, new StartupCommand() );
		registerCommand(CONFIGURE_PROXY, new ConfigureProxyCommand());
		registerCommand(Notifications.LOAD_PAGES, new LoadPagesCommand());
		registerCommand(Notifications.UPDATE_PAGE_STATE, new UpdatePageCommand());
		registerCommand(Notifications.SAVE_PAGE, new SavePageCommand());
		registerCommand(Notifications.INIT_EMPTY_PAGE, new InitEmptyPageCommand());
		registerCommand(Notifications.SET_PAGE_PATH, new SetPagePathCommand());
		registerCommand(Notifications.RELOAD_PAGE, new ReloadPageCommand());
		registerCommand(Notifications.SET_JS_SAVE_CALLBACK, new SetSaveJSCallback());
		registerCommand(Notifications.ADD_PAGE_REF, new AddPageRefCommand());
		
	}
	
	public synchronized static ApplicationFacade getInstance(String key )
	{
		if (instanceMap.get(key) == null) {
			try {
				 new ApplicationFacade(key); 
			} catch (Exception e) {
			}
		}
		return (ApplicationFacade)instanceMap.get(key);
	}

}

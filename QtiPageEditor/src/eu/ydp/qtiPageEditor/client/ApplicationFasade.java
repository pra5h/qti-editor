package eu.ydp.qtiPageEditor.client;

import org.puremvc.java.multicore.interfaces.IFacade;
import org.puremvc.java.multicore.patterns.facade.Facade;

import eu.ydp.qtiPageEditor.client.constance.Constances;
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

public class ApplicationFasade extends Facade implements IFacade {

	public static final String  KEY = "ApplicationFacadeKey";
	public static final String  NAME = "ApplicationFacade";	
	public static final String STARTUP= NAME + "StartUp";
	public static final String CONFIGURE_PROXY = NAME + "ConfigureProxy";
	
	
	protected ApplicationFasade(String key) {
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
			sendNotification(Constances.LOAD_PAGES, hrefs);
			sendNotification(Constances.CONFIGURE_PAGE_EDITOR_VIEW, base );
			sendNotification(Constances.ADD_PAGE_REF, hrefs[0]);
		}			
		else{
			sendNotification(Constances.INIT_EMPTY_PAGE);
			sendNotification(Constances.SHOW_PAGE,0);
			sendNotification(Constances.ADD_PAGE_REF);
		}
			
	}
	
	
	protected void initializeController()
	{ 	            
		super.initializeController();		
		
		registerCommand(STARTUP, new StartupCommand() );
		registerCommand(CONFIGURE_PROXY, new ConfigureProxyCommand());
		registerCommand(Constances.LOAD_PAGES, new LoadPagesCommand());
		registerCommand(Constances.UPDATE_PAGE_STATE, new UpdatePageCommand());
		registerCommand(Constances.SAVE_PAGE, new SavePageCommand());
		registerCommand(Constances.INIT_EMPTY_PAGE, new InitEmptyPageCommand());
		registerCommand(Constances.SET_PAGE_PATH, new SetPagePathCommand());
		registerCommand(Constances.RELOAD_PAGE, new ReloadPageCommand());
		registerCommand(Constances.SET_JS_SAVE_CALLBACK, new SetSaveJSCallback());
		registerCommand(Constances.ADD_PAGE_REF, new AddPageRefCommand());
		
	}
	
	public synchronized static ApplicationFasade getInstance(String key )
	{
		if (instanceMap.get(key) == null) {
			try {
				 new ApplicationFasade(key); 
			} catch (Exception e) {
			}
		}
		return (ApplicationFasade)instanceMap.get(key);
	}

}

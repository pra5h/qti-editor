package eu.ydp.qtiPageEditor.client.session;

import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.user.client.Timer;

import eu.ydp.qtiPageEditor.client.events.SessionSustainerErrorEvent;
import eu.ydp.qtiPageEditor.client.events.handler.SessionSustainerErrorHandler;
import eu.ydp.webapistorage.client.storage.IResource;
import eu.ydp.webapistorage.client.storage.IStorage;
import eu.ydp.webapistorage.client.storage.apierror.IApiError;
import eu.ydp.webapistorage.client.storage.callback.IResourceCallback;

public class SessionSustainer {
	
	final private HandlerManager _handlerManager = new HandlerManager(this);
	private String _path;
	private IStorage _storage;
	private Timer _timer;
	
	
	public SessionSustainer(String path, IStorage storage ){
		_path = path;
		_storage = storage;
		
		_timer = new Timer() {
			
			@Override
			public void run() {				
				onTimerTick();
			}
		};
		
	}
	
	public void start(int miliseconds){		
		_timer.cancel();
		_timer.scheduleRepeating(miliseconds);
	}
	
	public void start(){
		start(60*1000*5);
	}
	
	public void stop(){
		_timer.cancel();
	}
	
	public void addErrorHandler(SessionSustainerErrorHandler handler){
		_handlerManager.addHandler(SessionSustainerErrorEvent.TYPE, handler);
	}
	
	
	private void onTimerTick(){
		
		IResource resource = _storage.getResource(_path);
		resource.ping(new IResourceCallback() {
			
			@Override
			public void onRequestError(IResource resource, String command, IApiError error) {
				onPingError(error);				
			}
			
			@Override
			public void onRequestComplete(IResource resource, String command) {
				onPingComplete();				
			}
		});
		
	}
	
	private void onPingComplete(){
		
	}
	
	private void onPingError(IApiError error){
		SessionSustainerErrorEvent event = new SessionSustainerErrorEvent(error);
		_handlerManager.fireEvent(event);
	}
	
	

}
package eu.ydp.qtiPageEditor.client.events;

import com.google.gwt.event.shared.GwtEvent;

import eu.ydp.qtiPageEditor.client.events.handler.SessionSustainerErrorHandler;
import eu.ydp.webapistorage.client.storage.apierror.IApiError;

/**
 *  @author thanczewski
 *  Dispatched when sessions sustainer "ping" request fails.
 */
public class SessionSustainerErrorEvent extends GwtEvent<SessionSustainerErrorHandler> {
	
	public static final Type<SessionSustainerErrorHandler> TYPE = new Type<SessionSustainerErrorHandler>();
	private IApiError _error;
	
	public SessionSustainerErrorEvent(IApiError error){
		_error = error;
	}
	
	@Override
	protected void dispatch(SessionSustainerErrorHandler handler) {
		handler.onSessionSustainerError(this);
		
	}
	
	@Override
	public Type<SessionSustainerErrorHandler> getAssociatedType() {
		return TYPE;
	}
	
	public IApiError getError(){
		return _error;
	}

}

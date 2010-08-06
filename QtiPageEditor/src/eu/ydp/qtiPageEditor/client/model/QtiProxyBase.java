package eu.ydp.qtiPageEditor.client.model;

import java.util.ArrayList;
import java.util.List;

import org.puremvc.java.multicore.patterns.proxy.Proxy;

import com.google.gwt.core.client.Scheduler;
import com.google.gwt.user.client.Command;

import eu.ydp.qtiPageEditor.client.env.IEditorEnvirnoment;
import eu.ydp.webapistorage.client.storage.IStorage;

public class QtiProxyBase extends Proxy {
	
	protected String _testPath;
	protected IStorage _storage;
	/**
	 * Proxy queues save requests to allow http server to release lock on saved files.
	 * @see http://bugtrack/show_bug.cgi?id=33887    
	 */
	protected List<Command> saveQueue = new ArrayList<Command>();
	/**
	 * Save request from saveQueue are executed with defined timeout 
	 */
	protected int saveTimeout = 250;
	
	public QtiProxyBase(String name, Object data) {
		super(name, data);
	}
	
	public void init(IEditorEnvirnoment env){
		_testPath = env.getBasePath();
		_storage = env.getStorage();
	}
	
	protected void scheduleSave() {
		if (saveQueue.size()==0) {
			Scheduler.get().scheduleFixedDelay(new Scheduler.RepeatingCommand() {
				@Override
				public boolean execute() {
					Command c = saveQueue.remove( 0 );
					c.execute();
					return saveQueue.size()>0;
				}
			}, saveTimeout);
		}
	}
}

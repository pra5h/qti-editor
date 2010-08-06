package eu.ydp.qtiPageEditor.client.model;

import com.google.gwt.user.client.Command;

import eu.ydp.webapistorage.client.storage.IResource;
import eu.ydp.webapistorage.client.storage.callback.IResourceCallback;

public class SaveResourceCommand implements Command {

	private IResource resource;
	private String content;
	private IResourceCallback callback;
	
	public SaveResourceCommand(IResource res, String data, IResourceCallback c) {
		resource = res;
		content = data;
		callback = c;
	}

	@Override
	public void execute() {
		resource.save(content, callback);
	}
}

package eu.ydp.qtiPageEditor.client.model;

import com.google.gwt.xml.client.Document;

import eu.ydp.qtiPageEditor.client.constants.Notifications;
import eu.ydp.qtiPageEditor.client.model.QtiProxyBase;
import eu.ydp.qtiPageEditor.client.model.vo.QtiTestModel;
import eu.ydp.webapistorage.client.storage.IResource;
import eu.ydp.webapistorage.client.storage.apierror.IApiError;
import eu.ydp.webapistorage.client.storage.callback.IResourceCallback;
import eu.ydp.webapistorage.client.storage.callback.IResourceTextCallback;

public class QTITestModelProxy extends QtiProxyBase {
	
	public static final String NAME = "qtiTestModelProxy";	
	public QTITestModelProxy(){
		super(NAME, new QtiTestModel());		
	}	
	
	public void load(){
		IResource resource = _storage.getResource(_testPath);
		resource.load(new IResourceTextCallback() {
			
			@Override
			public void onRequestError(IResource resource, String command,
					IApiError error) {
				sendNotification(Notifications.LOAD_TEST_ERROR, error);
				
			}
			
			@Override
			public void onRequestComplete(IResource resource, String command,
					String content) {
				getVO().setContent(content);
				
				String[] hrefs = getVO().getItemsHrefs();
				
				if(hrefs.length > 0)
				{
					String base = _testPath.substring(0, _testPath.lastIndexOf("/")+1);
					String pagePath = base + hrefs[0];
					sendNotification(Notifications.CONFIGURE_PAGE_EDITOR_VIEW, pagePath);
					sendNotification(Notifications.LOAD_PAGES, hrefs);
					
				}
				else				
					sendNotification(Notifications.ADD_NEW_PAGE_TO_MODEL);				
				
			}
		});
	}	
	
	public void addPage(){
		getVO().addNewPage();
	}
	
	public void addPage(String path){
		getVO().addNewPage(path);
	}
	
	public void removePage(int ix){
		getVO().removePage(ix);
	}
	
	public void swapItems(int from, int to){
		getVO().swapItems(from, to);
		
	}
	
	public void moveDown(int ix){
		getVO().moveDown(ix);
	}
	
	public void moveUp(int ix){
		getVO().moveUp(ix);
	}
	
	public String getContent(){
		return getVO().getContent();
	}
	
	public Document getDocument(){
		return getVO().getDocument();		
	}
	
	public Document getAssessmentForPage(int ix){
		return getVO().getAssessmentForPage(ix);
	}
	
	public QtiTestModel getVO(){
		return (QtiTestModel)getData();
		
	}
	
	public String getHref(){
		return _testPath;
	}
	
	
	
	public void save(){
		
		IResource resource = _storage.getResource(_testPath);
		resource.save( getVO().getContent(), new IResourceCallback() {
			
			@Override
			public void onRequestError(IResource resource, String command,
					IApiError error) {
				sendNotification(Notifications.SAVE_TEST_ERROR, error);
				
			}
			
			@Override
			public void onRequestComplete(IResource resource, String command) {
				// TODO Auto-generated method stub
				
			}
		});		
	}
	

}

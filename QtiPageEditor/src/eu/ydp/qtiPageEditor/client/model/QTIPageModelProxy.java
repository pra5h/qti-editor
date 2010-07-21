package eu.ydp.qtiPageEditor.client.model;

import java.util.ArrayList;
import java.util.Collections;

import com.google.gwt.user.client.Window;

import eu.ydp.qtiPageEditor.client.appcallback.SaveCallback;
import eu.ydp.qtiPageEditor.client.constance.Constances;
import eu.ydp.qtiPageEditor.client.model.vo.ModelPageList;
import eu.ydp.qtiPageEditor.client.model.vo.QTIPageModel;
import eu.ydp.webapistorage.client.storage.IResource;
import eu.ydp.webapistorage.client.storage.apierror.IApiError;
import eu.ydp.webapistorage.client.storage.callback.IResourceCallback;
import eu.ydp.webapistorage.client.storage.callback.IResourceTextCallback;
import eu.ydp.webapistorage.client.util.ApiErrorToJs;

public class QTIPageModelProxy extends QtiProxyBase{
	
	public static final String NAME = "qtiPagesDataModelProxy";
	
	private int _selectedIndex;
	
	private SaveCallback _jsSaveCallback;
	
	public QTIPageModelProxy() {
		super(NAME, new ModelPageList());
		_selectedIndex = -1;
	}
	
	public void setSaveCallback(SaveCallback jsSaveCallback){
		_jsSaveCallback = jsSaveCallback;
	}
	
	public void load(String[] hrefs){		
		if(hrefs.length > 0){		
			//String path = _testPath.substring(0, _testPath.lastIndexOf("/")+1);
			//String pagePath = path + hrefs[0];			
			loadPages(hrefs);		
		}
		
	}
	
	private void loadPages(final String[] hrefs){
		
		final ModelPageList pages = getDataVO();		
		String path = _testPath.substring(0, _testPath.lastIndexOf("/")+1);
		String pagePath = path + hrefs[pages.getPageCount()];
		IResource resource = _storage.getResource(pagePath);
		resource.load(new IResourceTextCallback() {
			
			@Override
			public void onRequestError(IResource resource, String command,
					IApiError error) {
				sendNotification(Constances.LOAD_PAGE_ERROR, error);
				
			}
			
			
			@Override
			public void onRequestComplete(IResource resource, String command,String content) {
								
				QTIPageModel page = new QTIPageModel();
				page.setContent(content);
				page.setPath(resource.getPath());
				
				pages.addPage(page);			
				
				if(pages.getPageCount() < hrefs.length){
					loadPages(hrefs);
				}
				else
				{					
					String[] titles = new String[pages.getPageCount()];
					int i;
					for(i = 0;i < pages.getPageCount(); i++)
						titles[i] = pages.getPage(i).getTitle();
					
					_selectedIndex = 0;		
					sendNotification(Constances.PAGES_LOADED, titles);
				}
							
			}
			
		});
	}	
	
	public void reload(int ix){
		final ModelPageList pages = getDataVO();
		final QTIPageModel page = pages.getPage(ix);
		String path = page.getPath();		
		IResource resource = _storage.getResource(path);
		resource.load(new IResourceTextCallback() {
			
			@Override
			public void onRequestError(IResource resource, String command, IApiError error) {				
				sendNotification(Constances.LOAD_PAGE_ERROR, error);
			}
			
			@Override
			public void onRequestComplete(IResource resource, String command, String content) {				
				page.setContent(content);
				
				String[] titles = new String[pages.getPageCount()];
				int i;
				for(i = 0;i < pages.getPageCount(); i++)
					titles[i] = pages.getPage(i).getTitle();
				
				sendNotification(Constances.PAGES_LOADED, titles);
			}
		});

		
	}
	
	public void setSelectedIndex(int ix){
		_selectedIndex = ix;
	}
	
	public int getSelectedIndex(){
		return _selectedIndex;
	}
	
	public void setPagePath(String path){
		setPagePath(path,-1);
	}
	
	public void setPagePath(String path, int ix){
		_testPath = path;
		ModelPageList pages = getDataVO();
		int n = (ix > -1) ? ix : 0;
		
		pages.getPage(n).setPath(path);
		
	}
	
	public void addPage(String href){		
		ModelPageList pages = getDataVO();
		
		QTIPageModel page = new QTIPageModel();
		String basePath = _testPath.substring(0, _testPath.lastIndexOf("/")+1);
		page.setPath(basePath + href);
		page.setTitle(href.substring(href.lastIndexOf("/")+1));
		
		pages.addPage(page);		
		
	}
	
	public void addPage(){		
		ModelPageList pages = getDataVO();
		
		QTIPageModel page = new QTIPageModel();		
		pages.addPage(page);		
	}	
	
	public void removePage(int ix){		
		getDataVO().removePage(ix);
	}
	
	
	public void swapItems(int from, int to){
		getDataVO().swapItems(from, to);		
	}	

	public void moveDown(int ix){
		getDataVO().moveDown(ix);
	
	}
	
	public void moveUp(int ix){		
		getDataVO().moveUp(ix);
	}
	
	
	public ModelPageList getDataVO(){
		return (ModelPageList)getData();
	}
	
	public void updatePageState(int ix, String content){
		getDataVO().getPage(ix).setContent(content);
	}	
	
	public String getPageContent(int ix){
		return getDataVO().getPage(ix).getContent();
	}
	
	public QTIPageModel getPage(int ix){
		return getDataVO().getPage(ix);
	}
	
	public QTIPageModel getCurrentPage(){		
		return getDataVO().getPage(_selectedIndex);
	}
	
	
	public void save(int ix){
		
		String path;
		ModelPageList pages = getDataVO();
		QTIPageModel page = pages.getPage(ix);
			
		path = page.getPath();		
		IResource resource = _storage.getResource(path);		
		
		resource.save(page.getContent(), new IResourceCallback() {
			
			@Override
			public void onRequestError(IResource resource, String command,IApiError error) {
				sendNotification(Constances.SAVE_PAGE_ERROR, error);
				if(_jsSaveCallback != null)
					_jsSaveCallback.onSaveError(ApiErrorToJs.toJs(error));
				
			}
				
			@Override
			public void onRequestComplete(IResource resource, String command) {
				// TODO Auto-generated method stub
				if(_jsSaveCallback != null)
					_jsSaveCallback.onSaveComplete();
									
			}
		});						
	}
	
	
}
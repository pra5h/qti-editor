package eu.ydp.qtiPageEditor.client.model;

public class PagesLoadMonitor {
	
	private int _pagesCount;
	private int _pagesLoaded;
	
	public PagesLoadMonitor(int maxPages){
		_pagesCount = maxPages;
		_pagesLoaded = 0;
	}
	
	public void onPageRequest(){
		_pagesLoaded++;		
	}
	
	public Boolean getComplete(){
		return (_pagesLoaded >= _pagesCount) ? true: false;
	}
}

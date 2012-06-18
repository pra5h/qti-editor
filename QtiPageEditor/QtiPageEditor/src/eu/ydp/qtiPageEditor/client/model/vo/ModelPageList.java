package eu.ydp.qtiPageEditor.client.model.vo;

import java.util.ArrayList;
import java.util.Collections;

public class ModelPageList {
	
	private ArrayList<QTIPageModel> _pageList;
	
	public ModelPageList() {
		_pageList = new ArrayList<QTIPageModel>();
	}
	
	public int getPageCount(){
		return _pageList.size();
	}
	
	public void addPage(QTIPageModel page){
		_pageList.add(page);
	}
	
	public void removePage(int ix){
		_pageList.remove(ix);
	}
	
	public void swapItems(int from, int to){
		Collections.swap(_pageList, from, to);
	}
	
	public QTIPageModel getPage(int ix){
		return _pageList.get(ix);
	}
	
	public void moveDown(int ix){
		
		if(ix+1 <_pageList.size())
			swapItems(ix, ix+1);
		else
		{
			QTIPageModel page = _pageList.get(getPageCount()-1);
			_pageList.remove(getPageCount()-1);
			_pageList.add(0, page);			
		}
		
	}
	
	public void moveUp(int ix){
		if(ix > 0)
			swapItems(ix, ix-1);
		else{
			QTIPageModel page = _pageList.get(0);
			_pageList.remove(0);
			_pageList.add(page);				
			
		}
		
	}

}

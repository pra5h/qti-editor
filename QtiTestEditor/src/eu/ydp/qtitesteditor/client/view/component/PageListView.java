package eu.ydp.qtitesteditor.client.view.component;

import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.ListBox;
public class PageListView extends Composite {
		
	private ListBox _listBox;	
	
	public PageListView(){		
		_listBox = new ListBox(true);
		_listBox.setSize("100%", "100%");		
		initWidget(_listBox);		
	}	
	
	public ListBox  getListBox(){
		return _listBox;
	}
	
	public void showPages(String[] titles){
		int i;
		for(i = 0; i < titles.length; i++)		
			_listBox.addItem(titles[i]);
		
	}
	
	public void addPage(String title){
		_listBox.addItem(title);		
	}
	
	public void removePage(int ix){
		_listBox.removeItem(ix);
	}
	
	public int getSelectedIndex(){
		return _listBox.getSelectedIndex();
	}
	
	public void setSelectedIndex(int ix){
		_listBox.setSelectedIndex(ix);
	}
	
	public int getItemCount(){
		return _listBox.getItemCount();
	}
	
	public void moveUpPage(int ix){
		if(ix > 0)
			swapItems(ix, ix-1);
		else{
			String item = _listBox.getItemText(0);
			_listBox.removeItem(0);
			_listBox.addItem(item);
		}
			
	}
	
	public void moveDownPage(int ix){
		if(ix + 1 < getItemCount())
			swapItems(ix, ix+1);
		else{
			String item = _listBox.getItemText(ix);
			_listBox.removeItem(ix);
			_listBox.insertItem(item, 0);
		}	
	}
	
	public int getLastSelectedIndex(){
		int i;
		int lastIndex = -1;
		for(i = 0; i < _listBox.getItemCount() ; i++){
			if(_listBox.isItemSelected(i) == true)
				lastIndex = i;
			
		}
		
		return lastIndex;
	}
	
	private void swapItems(int n0, int n1){
		String item0 = _listBox.getItemText(n0);
		String item1 = _listBox.getItemText(n1);
		String temp = item0;
		item0 = item1;
		item1 = temp;
		
		_listBox.setItemText(n0, item0);
		_listBox.setItemText(n1, item1);
	}
	
	public void setFocus(Boolean bool){
		_listBox.setFocus(bool);
	}
	
	
	
	
	

}

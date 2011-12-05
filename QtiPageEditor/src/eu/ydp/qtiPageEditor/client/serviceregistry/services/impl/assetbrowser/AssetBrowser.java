package eu.ydp.qtiPageEditor.client.serviceregistry.services.impl.assetbrowser;

import java.util.Iterator;
import java.util.List;
import java.lang.String;

import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArrayString;
import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.resources.client.ImageResource;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.FormPanel;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Image;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.ListBox;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Widget;

import eu.ydp.qtiPageEditor.client.env.IEditorEnvirnoment;
import eu.ydp.qtiPageEditor.client.serviceregistry.services.IAssetBrowser;
import eu.ydp.qtiPageEditor.client.serviceregistry.services.IEditorService;
import eu.ydp.webapistorage.client.storage.IResource;
import eu.ydp.webapistorage.client.storage.apierror.IApiError;
import eu.ydp.webapistorage.client.storage.callback.IResourceListDirCallback;
import eu.ydp.webapistorage.client.storage.callback.IResourceUploadCallback;
import eu.ydp.webapistorage.client.storage.resource.listdir.IListDirItemDescriptor;


public class AssetBrowser extends DialogBox  implements IAssetBrowser, IResourceUploadCallback, IEditorService {
	
	interface AssetBrowserBinder extends UiBinder<Widget, AssetBrowser> {}
	
	private static AssetBrowserBinder uiBinder = GWT.create(AssetBrowserBinder.class);	
	
	@UiField VerticalPanel _contentPane;
	@UiField HorizontalPanel _hFormUploadPanel;
	@UiField  ListBox _listBox;
	@UiField  Image _image;
	@UiField  Button _okButton;
	@UiField Button _cancelButton;
	@UiField HorizontalPanel _hListPanel;
	@UiField HorizontalPanel _hButtonPanel;			
	@UiField TextBox _txtTitle;		
	@UiField Label _labelSize;		
	@UiField Label _labelDate;		
	
	
	
	private String _selectedFilePath;
	private String _mediaPath;	
	private IEditorEnvirnoment _env;
	private FormPanel _uploadPanel;	
	private String[] _fileFilter;
	private AssetBrowserCallback _jsCallback;	
	
	public AssetBrowser(){		
		super(false, true);		
		setText("Upload / insert media for qti");
		setGlassEnabled(true);		
		setWidget(uiBinder.createAndBindUi(this));	
		
	}
	
	@UiHandler("_listBox")
	protected void onChange(ChangeEvent event){
		String path = getPathFromItemString(_listBox.getValue(_listBox.getSelectedIndex()));
		_selectedFilePath = path;
		setTitle("");
		setSize(getSizeFromItemString(_listBox.getValue(_listBox.getSelectedIndex())));
		setDate(getDateFromItemString(_listBox.getValue(_listBox.getSelectedIndex())));
		showPreview(path);		
	}
	
	@UiHandler("_okButton")
	protected void onClickOk(ClickEvent event){
		if(_listBox.getSelectedIndex() > -1){
			String filePath = getPathFromItemString(_listBox.getValue(_listBox.getSelectedIndex()));
			_jsCallback.onBrowseComplete(filePath+"?"+String.valueOf(System.currentTimeMillis()), getTitle());
		}				
		hide();		
	}
	
	@UiHandler("_cancelButton")
	protected void onClickCancel(ClickEvent event){
		hide();
	}
	
	private String createItemString(IListDirItemDescriptor item)
	{
		String value = item.getAbsolutePath()+"##"
		+(item.getSize()/1024)+"KB"+"##"
		+item.getCreationDate();
		return value;
	}
	
	private String getPathFromItemString(String value)
	{
		String[] tab = value.split("##");
		return tab[0];
	}
	
	private String getSizeFromItemString(String value)
	{
		String[] tab = value.split("##");
		return tab[1];
	}
	
	private String getDateFromItemString(String value)
	{
		String[] tab = value.split("##");
		return tab[2];
	}
	
	private void showPreview(String path){
		ImageResource res = IconProvider.getIcon(path);		
		
		if(res != null)
			_image.setResource(res);
		else 
			_image.setUrl(path+"?"+String.valueOf(System.currentTimeMillis()));	
		
		_image.setPixelSize(220, 180);
	}
	
	
	private void showSelectedFilePath(){		
		if(_listBox.getItemCount() > 0){
			int i;
			for(i = 0; i < _listBox.getItemCount(); i++ ){
				if(getPathFromItemString(_listBox.getValue(i)).toLowerCase() == _selectedFilePath.toLowerCase()){
					_listBox.setSelectedIndex(i);
					showPreview(getPathFromItemString(_listBox.getValue(i)));
					//_image.setUrl(_listBox.getValue(i));
				}
			}			
		}
		
	}
	
	@Override
	public void setEnvironment(IEditorEnvirnoment env){
		_env = env;
		String basePath = _env.getBasePath();
		_mediaPath = basePath.substring(0,basePath.lastIndexOf("/")+1) + _env.getMediaDirectory();		
	}	
	
	@Override
	public void browse(AssetBrowserCallback browseCallback) {
		browse(browseCallback, null);
	}
	
	private void browseJSFilter(AssetBrowserCallback browseCallback, JsArrayString fileFilter ){
		String[] ff = new String[fileFilter.length()];
		int i;
		for(i = 0; i < ff.length; i++)
			ff[i] = fileFilter.get(i);
		
		browse(browseCallback, ff);
	}

	@Override
	public void browse(AssetBrowserCallback browseCallback, String[] fileFilter) {		
		
		IResource uploadResource = _env.getStorage().getResource(_mediaPath);
		if(fileFilter == null)
			_uploadPanel = uploadResource.startPutDialog(this);
		else
			_uploadPanel = uploadResource.startPutDialog(this, fileFilter);
		
		_hFormUploadPanel.add(_uploadPanel);		
		
		_jsCallback = browseCallback;
		
		this.center();
		
		if(fileFilter != null)
			_fileFilter = fileFilter;		
		
		listDir();
	}


	@Override
	public String getSelectedAssetPath() {
		return _selectedFilePath;
	}

	@Override
	public void setSelectedAssetPath(String filePath) {
		_selectedFilePath = filePath;
		showSelectedFilePath();		

	}
	@Override
	public void setSelectedFile(String fileName){		
		_selectedFilePath = _mediaPath + "/" + fileName;
		showSelectedFilePath();
	}
	@Override
	public void setTitle(String title){
		_txtTitle.setText(title);			
	}
	
	public void setSize(String size){
		_labelSize.setText("Size: "+size);	
	}
	
	public void setDate(String date){
		_labelDate.setText("Uploaded on: "+date);			
	}
	
	@Override
	public String getTitle(){
		return _txtTitle.getText();
	}
	
	//--------------------- IResourceCallback-------------------------
	@Override
	public void onUploadError(IResource resource,IApiError error) {
		Window.alert(error.getDetails() +"\n" + "Error code:" + error.getErrorCode());		
		
	}
	
	@Override
	public void onUploadComplete(IResource resource, String fileName) {
		String path = _mediaPath +"/"+ fileName;
		_selectedFilePath = path;
		listDir();		
	}
	//----------------------------Click handler---------------------------------
	
	private void onButtonClick(ClickEvent event) {
		if(event.getSource().equals(_cancelButton))
			this.hide();
			
	}
	
	//------------------ IResourceListDirCallBack------------------------------
	
	
	private void onListDirErrorListener(IResource resource, IApiError error) {
		Window.alert(error.getDetails() +"\n" + "Error code:" + error.getErrorCode());		
	}
	
	
	private void onListDirCompleteListener(IResource resource, List<IListDirItemDescriptor> dirList) {
		Iterator<IListDirItemDescriptor> iterator = dirList.iterator();
		IListDirItemDescriptor item;
		int i;
		String fileName;
		
		_listBox.clear();
		_image.setUrl("");
		while(iterator.hasNext()){			
			item =iterator.next();			
			if(_fileFilter != null){
				for(i = 0; i < _fileFilter.length; i++){
					fileName = item.getFileName().toLowerCase();
					if(fileName.indexOf(_fileFilter[i].toLowerCase()) == fileName.length() - _fileFilter[i].length())
					{
						_listBox.addItem(item.getFileName(), createItemString(item));
					}
				}
			}
			else{
				_listBox.addItem(item.getFileName(), createItemString(item));
			}
			
		}
		
		if(_selectedFilePath != null){
			showSelectedFilePath();
		}
		
	}
	
	private void listDir(){
		IResource listDirResource = _env.getStorage().getResource(_mediaPath);
		listDirResource.listDir(new IResourceListDirCallback() {			
			@Override
			public void onListDirError(IResource resource, IApiError error) {
				onListDirErrorListener(resource, error);
				
			}
			
			@Override
			public void onListDirComplete(IResource resource, List<IListDirItemDescriptor> dirList) {
				onListDirCompleteListener(resource, dirList);
				
			}
		});
	}
	
	//----------------------------------------------------------------------
	
	public  native JavaScriptObject getJSO()/*-{
	
		var doc = this;		
		AssetBrowser = function(){									
			this.browse = function(browseCallback, fileFilter){				
				if(fileFilter != null)
					doc.@eu.ydp.qtiPageEditor.client.serviceregistry.services.impl.assetbrowser.AssetBrowser::browseJSFilter(Leu/ydp/qtiPageEditor/client/serviceregistry/services/impl/assetbrowser/AssetBrowserCallback;Lcom/google/gwt/core/client/JsArrayString;)(browseCallback,fileFilter )
				else
					doc.@eu.ydp.qtiPageEditor.client.serviceregistry.services.impl.assetbrowser.AssetBrowser::browse(Leu/ydp/qtiPageEditor/client/serviceregistry/services/impl/assetbrowser/AssetBrowserCallback;)(browseCallback);
			}
			
			this.setSelectedAssetPath = function(path){
				doc.@eu.ydp.qtiPageEditor.client.serviceregistry.services.impl.assetbrowser.AssetBrowser::setSelectedAssetPath(Ljava/lang/String;)(path);
			}
			
			this.getSelectedAssetPath = function(){
				return doc.@eu.ydp.qtiPageEditor.client.serviceregistry.services.impl.assetbrowser.AssetBrowser::getSelectedAssetPath()();
			}
			
			this.setSelectedFile = function(fileName){
				doc.@eu.ydp.qtiPageEditor.client.serviceregistry.services.impl.assetbrowser.AssetBrowser::setSelectedFile(Ljava/lang/String;)(fileName);
			}
			
			this.setTitle = function(title){
				doc.@eu.ydp.qtiPageEditor.client.serviceregistry.services.impl.assetbrowser.AssetBrowser::setTitle(Ljava/lang/String;)(title)
			}
			
			this.getTitle = function(){
				return doc.@eu.ydp.qtiPageEditor.client.serviceregistry.services.impl.assetbrowser.AssetBrowser::getTitle()();
			}
			    				
		}
		
		return new AssetBrowser();	

	}-*/;
	
	//------------------------------------------------------------
}

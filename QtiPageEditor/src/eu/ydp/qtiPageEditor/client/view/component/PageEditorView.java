package eu.ydp.qtiPageEditor.client.view.component;


import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.user.client.Command;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.DeferredCommand;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.FormPanel;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.TextArea;

import eu.ydp.qtiPageEditor.client.appcallback.TinyMceCreatedCallback;
import eu.ydp.qtiPageEditor.client.env.IEditorEnvirnoment;
import eu.ydp.qtiPageEditor.client.events.TinyMceCreatedEvent;
import eu.ydp.qtiPageEditor.client.events.TinyMcePreviewEvent;
import eu.ydp.qtiPageEditor.client.events.TinyMceResizeEvent;
import eu.ydp.qtiPageEditor.client.events.TinyMceSaveEvent;
import eu.ydp.qtiPageEditor.client.events.handler.TinyMceCreatedHandler;
import eu.ydp.qtiPageEditor.client.events.handler.TinyMcePreviewHandler;
import eu.ydp.qtiPageEditor.client.events.handler.TinyMceResizeHandler;
import eu.ydp.qtiPageEditor.client.events.handler.TinyMceSaveEventHandler;
import eu.ydp.qtiPageEditor.client.serviceregistry.services.IAssetBrowser;
import eu.ydp.qtiPageEditor.client.serviceregistry.services.IEditorService;

public class PageEditorView extends Composite {	
	
	 final private HandlerManager _handlerManager = new HandlerManager(this);
	 private TextArea _textArea;
	 private String _id;
	 private IEditorEnvirnoment _env;
	 private String _pageBasePath;
	 private TinyMceCreatedCallback _tinyMceCreatedCallback;

	
	public PageEditorView(IEditorEnvirnoment env, TinyMceCreatedCallback tinyMceCreatedCallback)
	{
		super();			
		_env = env;
		
		if(tinyMceCreatedCallback != null)
			_tinyMceCreatedCallback = tinyMceCreatedCallback;	
		
		
		FormPanel panel = new FormPanel();
        panel.setWidth("100%");        

        _id = HTMLPanel.createUniqueId();
        _textArea = new TextArea();      
        DOM.setElementAttribute(_textArea.getElement(), "id", _id);
        DOM.setStyleAttribute(_textArea.getElement(), "width", "100%");        
        panel.add(_textArea);        
        
        initWidget(panel);        
        publish();
	}	
	
	public void setPageBasePath(String path){
		_pageBasePath = path;
	}
	
	
	/**
     * getID() -
     *
     * @return the MCE element's ID
     */
    public String getID() {
        return _id;
    }

    /**
     * setText() -
     *
     * NOTE:
     * @param text
     */
    public void setText(String text) {        
    	_textArea.setText(text);    	
    	setEditorContents(getID(), text);
    	focusMCE(getID());
    }

    public String getText() {        
    	return getEditorContents(getID());
    }
    
    public native void setTinyWidth(String width)/*-{    	
    	var id = this.@eu.ydp.qtiPageEditor.client.view.component.PageEditorView::getID()();
   
    	$wnd.document.getElementById(id+'_tbl').style.width = width;
        $wnd.document.getElementById(id+'_ifr').style.width = width;
        
    }-*/;
    
    public native void setTinyHeight(String height)/*-{    	
    	
    	var id = this.@eu.ydp.qtiPageEditor.client.view.component.PageEditorView::getID()();
    	
    	$wnd.document.getElementById(id+'_tbl').style.height = height;
        $wnd.document.getElementById(id+'_ifr').style.height = height;
        
    }-*/;

    /**
     * @see com.google.gwt.user.client.ui.Widget#onLoad()
     */
    protected void onLoad() {
        super.onLoad();

        DeferredCommand.addCommand(new Command() {			
            public void execute() {                
            	setWidth("100%");               
                setTextAreaToTinyMCE(_id);               
                initResizeListener();                           
                if(_tinyMceCreatedCallback != null)
                	_tinyMceCreatedCallback.onTinyMceCreated();
                
                focusMCE(_id);  
                
                TinyMceCreatedEvent event = new TinyMceCreatedEvent();
            	_handlerManager.fireEvent(event);
            }
        });
    }
    
   
    @Override
    protected void onUnload() {    	
    	super.onUnload();    	
    	DeferredCommand.addCommand(new Command() {			
            public void execute() {
              unload();
            }
        });    	
    }
    
    
    
    public native void setBlock(Boolean bool)/*-{
    	
    	var id = this.@eu.ydp.qtiPageEditor.client.view.component.PageEditorView::getID()();
    	var Event = $wnd.tinymce.dom.Event;	    
    	var ro = (bool == true || bool == "true") ? true : false
    	    	
    	function block(ed, e)
	    {
			return Event.cancel(e);
		}   	
      	
    	$wnd.tinyMCE.get(id).makeReadOnly(ro);
    	
    	var ed = $wnd.tinyMCE.activeEditor
	    	$wnd.tinymce.each(ed.controlManager.controls, function(c) {				
					c.setDisabled(ro);
				});    	    			  	
    	
    }-*/;  
    
    public void clearEditorContent() {
    	setText("<p> </p><div class=\"exercise\"><p> </p></div><p> </p>");  	
    }
    
   
    /**
     * focusMCE() -
     *
     * Use this to set the focus to the MCE area
     * @param id - the element's ID
     */
    protected native void focusMCE(String id) /*-{
        $wnd.tinyMCE.execCommand('mceFocus', true, id);
        $wnd.tinyMCE.activeEditor.focus();
        
    }-*/;

    /**
     * resetMCE() -
     *
     * Use this if reusing the same MCE element, but losing focus
     */
    protected native void resetMCE() /*-{
        $wnd.tinyMCE.execCommand('mceResetDesignMode', true);
    }-*/;

    /**
     * unload() -
     *
     * Unload this MCE editor instance from active memory.
     * I use this in the onHide function of the containing widget. This helps
     * to avoid problems, especially when using tabs.
     */
    public void unload() {
        unloadMCE(_id);
    }

    /**
     * unloadMCE() -
     *
     * @param id - The element's ID
     * JSNI method to implement unloading the MCE editor instance from memory
     */
    protected native void unloadMCE(String id) /*-{
        $wnd.tinyMCE.execCommand('mceRemoveControl', false, id);
    }-*/;
    

    /**
     * encodeURIComponent() -
     *
     * Wrapper for the native URL encoding methods
     * @param text - the text to encode
     * @return the encoded text
     */
    protected native String encodeURIComponent(String text) /*-{
        return encodeURIComponent(text);
    }-*/;

    /**
     * setTextAreaToTinyMCE() -
     *
     * Change a text area to a tiny MCE editing field
     * @param id - the text area's ID
     */
    protected native void setTextAreaToTinyMCE(String id) /*-{
        $wnd.tinyMCE.execCommand('mceAddControl', true, id);
    }-*/;

    /**
     * removeMCE() -
     *
     * Remove a tiny MCE editing field from a text area
     * @param id - the text area's ID
     */
    protected native void removeMCE(String id) /*-{
        $wnd.tinyMCE.execCommand('mceRemoveControl', true, id);
    }-*/;
    
    protected static native String getEditorContents(String elementId) /*-{
    	return $wnd.tinyMCE.get(elementId).getContent();
    }-*/;

    protected static native void setEditorContents(String elementId, String html) /*-{
       $wnd.tinyMCE.execInstanceCommand(elementId, 'mceSetContent', false, html, false);
    }-*/;
    
    protected native void initResizeListener() /*-{    	
		var inst = $wnd.tinyMCE.activeEditor;
		var ctx = this;
		$wnd.tinymce.dom.Event.add(inst.getWin(), 'resize', function(e) {
			ctx.@eu.ydp.qtiPageEditor.client.view.component.PageEditorView::onTinyResize()();
    	});
    	
    }-*/;
    
    protected void onTinyResize(){    	
    	TinyMceResizeEvent event = new TinyMceResizeEvent(getOffsetWidth(), getOffsetHeight());
    	_handlerManager.fireEvent(event);
    }
    
    protected void onSavePage(){
    	TinyMceSaveEvent event = new TinyMceSaveEvent();
    	_handlerManager.fireEvent(event);    	
    }
    
    protected JavaScriptObject getAssetBrowser(){
    	IEditorService service = (IEditorService)_env.getService(IAssetBrowser.class.getName());
    	return service.getJSO();
    }
    
    public void addTinyMceSaveHandler(TinyMceSaveEventHandler handler){
    	
    	_handlerManager.addHandler(TinyMceSaveEvent.TYPE, handler); 	
    }
    
    public void addTinyMcePreviewHandler(TinyMcePreviewHandler handler){
    	_handlerManager.addHandler(TinyMcePreviewEvent.TYPE, handler);
    }
    
    public void addTinyMceResizeHandler(TinyMceResizeHandler handler){
    	_handlerManager.addHandler(TinyMceResizeEvent.TYPE, handler);
    }
    
    public void addTinyMceCreatedHandler(TinyMceCreatedHandler handler){
    	_handlerManager.addHandler(TinyMceCreatedEvent.TYPE, handler);
    }
    
    protected void onShowPreview(){    	
    	TinyMcePreviewEvent event = new TinyMcePreviewEvent();
    	_handlerManager.fireEvent(event);
    }
    
    protected native void publish() /*-{
    	    var ctx = this;
    	    var proxy = new Object();
    	    proxy.savePage = function(){
    	    	ctx.@eu.ydp.qtiPageEditor.client.view.component.PageEditorView::onSavePage()();
    	    }
    	    
    	    proxy.getAssetBrowser = function(){
    	    	return ctx.@eu.ydp.qtiPageEditor.client.view.component.PageEditorView::getAssetBrowser()()
    	    }
    	    
    	    proxy.getPageBasePath = function(){
    	    	return ctx.@eu.ydp.qtiPageEditor.client.view.component.PageEditorView::_pageBasePath;
    	    } 
    	    
    	    proxy.showPreview = function(){
    	    	ctx.@eu.ydp.qtiPageEditor.client.view.component.PageEditorView::onShowPreview()();
    	    }  	 
    	       
    	        	    
    	    if(typeof($wnd.tinyMCE.gwtProxy) != "object")
    	    	$wnd.tinyMCE.gwtProxy = proxy;
   	}-*/;



}

package eu.ydp.qtiPageEditor.client.model.vo;

import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.XMLParser;
import com.google.gwt.xml.client.impl.DOMParseException;

public class QTIPageModel {
	
	private String _basePath;
	
	private String _content;
	
	public QTIPageModel(){
		
		Document doc = XMLParser.createDocument();
		Element item = doc.createElement("assessmentItem");

		item.setAttribute("xmlns", "http://www.imsglobal.org/xsd/imsqti_v2p1");
		item.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");		
		item.setAttribute("xsi:schemaLocation", "http://www.imsglobal.org/xsd/imsqti_v2p1 imsqti_v2p1.xsd");
		item.setAttribute("xmlns:qy", "http://www.ydp.eu/qti/qti_ydp/");
		item.setAttribute("identifier", "");
		item.setAttribute("adaptive", "false");
		item.setAttribute("timeDependent", "false");		
		
		doc.appendChild(item);		
		
		Element body = doc.createElement("itemBody");		
		item.appendChild(body);
		
		Element tag = doc.createElement("qy:tag");
		tag.setAttribute("name", "text");
		body.appendChild(tag);
		
		Element paragraph = doc.createElement("p");
		tag.appendChild(paragraph);
		
		Node text = doc.createTextNode(" ");
		
		paragraph.appendChild(text);
		
		Element div = doc.createElement("div");
		div.setAttribute("class", "exercise");
		tag.appendChild(div);
				
		div.appendChild(paragraph.cloneNode(true));
		
		tag.appendChild(paragraph.cloneNode(true));
		
		_content = doc.toString();
		/*
		<?xml version="1.0" encoding="UTF-8"?>
		<assessmentItem xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p1 imsqti_v2p1.xsd"
		xmlns:qy="http://www.ydp.eu/qti/qti_ydp/" identifier="" adaptive="false"
		timeDependent="false" title="page_3.xml">

		<itemBody>
		<tag name="text">
		<p>&#160;</p><div class="exercise"><p>&#160;</p></div><p>&#160;</p>
		</tag>
		</itemBody>
		</assessmentItem>
		*/


		
	}
	
	public String getTitle(){		
		Document doc = XMLParser.parse(_content);
		String title;
		
		if(doc.getDocumentElement().getAttribute("title") != null)
			title = doc.getDocumentElement().getAttribute("title");
		else
			title = "Unknown title";		
		
		return title;
	}
	
	public void setTitle(String title){
		Document doc = XMLParser.parse(_content);
		doc.getDocumentElement().setAttribute("title", title);	
		
		_content = doc.toString();
	}
	
	
	public void setPath(String path){
		_basePath = path;
	}
	
	public String getPath(){
		return _basePath;
	}
	
	public void setContent(String s) throws DOMParseException
	{
		try{
			XMLParser.parse(s);
			_content = s;
		}
		catch(DOMParseException e){
			throw e;
		}
		
					
	}
	
	public String getContent()
	{
		return _content;
	}
	
	public Document getDocument(){
		return XMLParser.parse(_content);
	}
	
	

}

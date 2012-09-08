templateFactory = {
		textSection :"<group class=\"text\">"
					+"<section name=\"text\">"
					+"<simpleText></simpleText>"
					+"</section>"
					+"</group>",
					
		mediaSection :"<group class=\"media\">"
					+"<section name=\"text\">"
					+"<simpleText></simpleText>"
					+"</section>"
					+"</group>",
					
		exerciseSection :"<group class=\"exercise\">"
					+"<section name=\"text\">"
					+"<simpleText></simpleText>"
					+"</section>"
					+"</group>",
					
		getTemplate: function(type) {

			switch (type) {
			
				case "exercise":
					return this.getExerciseTemplate();
					break;
				
				case "text":
					return this.getTextTemplate();
					break;
				
				case "text_exercise":
					return this.getTextExerciseTemplate();
					break;
				
				case "media_exercise":
					return this.getMediaExerciseTemplate();
					break;
				
				case "text_media_exercise":
					return this.getTextMediaExerciseTemplate();
					break;
			}
			return '';
		},
		
		getExerciseTemplate: function() {
			return this.exerciseSection;
		},
		
		getTextTemplate: function() {
			return this.textSection;
		},
		
		getTextExerciseTemplate: function() {
			return this.textSection+"\n"+this.exerciseSection;
		},
		
		getMediaExerciseTemplate: function() {
			return this.mediaSection+"\n"+this.exerciseSection;
		},
		
		getTextMediaExerciseTemplate: function() {
			return this.textSection+"\n"+this.mediaSection+"\n"+this.exerciseSection;
		}
}
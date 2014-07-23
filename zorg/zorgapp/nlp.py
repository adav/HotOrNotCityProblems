import nltk
from textblob import TextBlob

def tokenizeWorry(userSubmittedString):

	nltk.download('stopwords')
	nltk.download('maxent_treebank_pos_tagger')
 
	string = userSubmittedString #lazy lols
 
	word_list = nltk.word_tokenize(string)
 
	from nltk.corpus import stopwords
	stopset = set(stopwords.words('english'))
 
	filtered_words = [w for w in word_list if not w.lower() in stopset]
	filtered_words = [w for w in filtered_words if TextBlob(w).sentiment.polarity > -0.1]

	result_words = []

	for pair in nltk.pos_tag(filtered_words):
		if "VB" in pair[1] or "NN" in pair[1] or "J" in pair[1]: 
			result_words.append(pair[0].title())

	return ' '.join(result_words)



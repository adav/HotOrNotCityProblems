import flickrapi
from django.templatetags.static import static

API_KEY = '67ca01ba7755d96e826acb7c61207be2'
URL_FORMAT = "https://farm{}.staticflickr.com/{}/{}_{}_z.jpg"

def get_flickr_url(photo):
    return URL_FORMAT.format(photo.get('farm'), photo.get('server'), photo.get('id'), photo.get('secret'))

def get_url(text):
    flickr = flickrapi.FlickrAPI(API_KEY)
    photos = flickr.walk(text=text,per_page='1',license='1,2,3,4,5,6,7,8',sort='relevance')
    
    
    try:
        photo = photos.__iter__().next()
        return get_flickr_url(photo)
    except StopIteration:
        pass

    return static('zorgapp/default-image.png')
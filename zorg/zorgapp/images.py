import flickrapi

API_KEY = '67ca01ba7755d96e826acb7c61207be2'
URL_FORMAT = "https://farm{farm_id}.staticflickr.com/{server}/{id}_{secret}_z.jpg"

def _get_flickr_url(photo):
    return URL_FORMAT.format(**photo)

def get_url(text):
    flickr = flickrapi.FlickrAPI(API_KEY)
    photos = flickr.photos_search(text=text,per_page='1',license='1,2,3,4,5,6,7,8')
    return _get_flickr_url(photos[0])

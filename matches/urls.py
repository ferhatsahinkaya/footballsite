from django.conf.urls import url

from . import views

urlpatterns = [
    #url(r'^competitions$', views.get_competitions, name='get_competitions'),
    url(r'^competitions$', views.get_competitions, name='find_competitions'),
    url(r'^$', views.index, name='index'),
]

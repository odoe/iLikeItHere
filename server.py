import json
import bottle
from utils.geo_to_esri import geo_to_esri
from utils.esri_to_geo import esri_to_geo
from bottle import route, run, request, abort, static_file, view
from pymongo import Connection

connection = Connection('localhost', 27017)
db = connection.mydatabase

# Could not get 'get_url' to
# import from bottle
@route('/')
@view('home')
def get_index():
  return {'title': 'Demo'}

# I'm thinking I'll store the data
# in mongodb as spatial features
# The default path will save
# geojson input to db
@route('/documents', method='PUT')
def put_document():
  data = request.body.readline()
  if not data:
    abort(400, 'No data received')
  entity = json.loads(data)
  if not entity.has_key('_id'):
    abort(400, 'No _id specified')

  try:
    db['documents'].save(entity)
  except ValidationError as ve:
    abort(400, str(ve))
  return entity

# This path will take an EsriJSON
# and convert it to GeoJSON to save
# to the db
@route('/documents/esrijs', method='PUT')
def put_documentesri():
  data = request.body.readline()
  if not data:
    abort(400, 'No data received')
  entity = json.loads(data)
  if not entity.has_key('_id'):
    abort(400, 'No _id specified')

  geojs = esri_to_geo(entity)
  geojs["_id"] = entity["_id"]

  try:
    db['documents'].save(geojs)
  except ValidationError as ve:
    abort(400, str(ve))
  return geojs

# Default request parameters will retrieve
# data in GeoJSON format
# ?type=esri will return results
# in EsriJSON format
@route('/documents/:id', method='GET')
def get_document(id):
  r = request.GET.get("type")
  entity = db['documents'].find_one({'_id':id})
  if not entity:
    abort(404, 'No documents with id %s' % id)
  if (r and r.lower() == 'esri'):
    response = geo_to_esri(entity)
  else:
    response = entity
  return response

# handle static files
@route('/static/:path#.+#', name='static')
def static(path):
  return static_file(path, root='static')

run(host='localhost', port=8080)

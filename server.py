import json
import bottle
from utils.geo_to_esri import geo_to_esri
from utils.esri_to_geo import esri_to_geo
from bottle import route, run, request, abort, static_file, view
from pymongo import Connection
from pymongo.son import SON

connection = Connection('localhost', 27017)
db = connection.mydatabase

# Could not get 'get_url' to
# import from bottle
@route('/')
@view('home')
def get_index():
  return {'title': 'I like it here!'}

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

# THIS IS NOT BEING USED
# BECAUSE I ASSIGN ID's IN MY CLIENT APP
# LEFT IT IN AS A TEMPLATE FOR FUTURE METHODS
@route('/documents/esrijs', method='POST')
def put_documentesri():
  data = request.body.readline()
  print data
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
  result = geo_to_esri(geojs["features"])

  return result

# This will save geojson directly to Mongo
@route('/documents/geojson', method='POST')
def post_documentgeojson():
  data = request.body.readline()
  print data
  if not data:
    abort(400, 'No data received')
  
  entity = json.loads(data)
  if not entity.has_key('_id'):
    abort(400, 'No _id specified')

  # remember, in this case
  # entity is just geojson
  try:
    db['documents'].save(entity)
  except ValidationError as ve:
    abort(400, str(ve))
  result = geo_to_esri(entity["features"])

  return result

# This service will convert geojson to esrijson
@route('/convert/geojson2esri', method='POST')
def convert_geojson2esri():
  data = request.body.readline()
  print data
  if not data:
    abort(400, 'No data received')

  entity = json.loads(data)

  # remember, in this case
  # entity is just geojson
  result = geo_to_esri(entity)

  return result

# There are some serious hoops to
# jumo thtough to manage between
# sending updates as esrijson,
# saving as geojson and making sure
# results work clientside
@route('/documents/esrijs/:id', method='PUT')
def put_documentesribyid(id):
  data = request.body.readline()
  result = json.loads(data)
  print data
  entity = db['documents'].find_one({'_id':id})
  if not entity:
    entity = result
    tmp = {}
    tmp["features"] = [entity]
    tmp["geometryType"] = entity["geometryType"]
    geojs = esri_to_geo(tmp)
    geojs["_id"] = entity["_id"]

    near_dict = {"$near": geojs["geometry"]["coordinates"]}
    max_dict = max_dict = {"$maxDistance": 0.001}
    q = SON(near_dict)
    q.update(max_dict)
    gq = {"geometry.coordinates": q}
    check = db["documents"].find(gq)
    print check
    if check:
      abort(400, {"success": False, "error": "Already exist"})
  else:
    geojs = entity
    geojs["properties"]["votes"] = result["attributes"]["votes"]

  try:
    db['documents'].save(geojs)
  except ValidationError as ve:
    abort(400, str(ve))
  return result

# Default request parameters will retrieve
# data in GeoJSON format
# ?f=esri will return results
# in EsriJSON format
@route('/documents/:id', method='GET')
def get_document(id):
  r = request.GET.get("f")
  entity = db['documents'].find_one({'_id':id})
  if not entity:
    abort(404, 'No documents with id %s' % id)
  if (r and r.lower() == 'esri'):
    response = geo_to_esri(entity)
  else:
    response = entity
  return response

@route('/documents', method='GET')
def get_document():
  r = request.GET.get("f")
  entity = db['documents'].find()

  # this returns a list of individual features
  # devs responsibility to build wrap in a
  # FeatureCollection
  # Sending ESRI JSON to be used in
  # Backbone kind of blows
  # Format doesn't play nice with Backbone Collection/Model
  features = map(lambda x: x, entity)
  featurecoll = {}
  featurecoll["features"] = features
  featurecoll["type"] = "FeatureCollection"
  if not entity:
    abort(404, 'No documents with id %s' % id)
  if (r and r.lower() == 'esri'):
    response = geo_to_esri(featurecoll)
    for feat in response["features"]:
      feat["_id"] = feat["attributes"]["_id"]

    response = json.dumps(response["features"])
  else:
    response = featurecoll
  return response

# handle static files
@route('/static/:path#.+#', name='static')
def static(path):
  return static_file(path, root='static')

@route('/src/:path#.+#', name='static')
def static_src(path):
  return static_file(path, root='static/src')

@route('/stylesheets/:path#.+#', name='static')
def static_styles(path):
  return static_file(path, root='static/stylesheets')

@route('/templates/:path#.+#', name='static')
def static_templates(path):
  return static_file(path, root='static/templates')

@route('/img/:path#.+#', name='static')
def static_img(path):
  return static_file(path, root='static/img')

run(host='localhost', port=8080)

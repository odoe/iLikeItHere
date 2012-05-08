import json
import bottle
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

@route('/documents/:id', method='GET')
def get_document(id):
  entity = db['documents'].find_one({'_id':id})
  if not entity:
    abort(404, 'No documents with id %s' % id)
  return entity

# handle static files
@route('/src/:path#.+#', name='src')
def static(path):
  return static_file(path, root='src')

run(host='localhost', port=8080)

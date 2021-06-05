
POST /products/_bulk
{ "update": { "_id": 201 } }
{ "doc": { "price": 199 } }
{ "delete": { "_id": 200 } }

POST /_analyze
{
  "text": "2 guys walk into   a bar, but the third... DUCKS! :-)",
  "analyzer": "standard"
}

# there is no such thing as an array
# this will be merged as text with a space in between
POST /_analyze
{
  "text": ["Strings are simply", "merged togeter", "you see?"],
  "analyzer": "standard"
}

PUT /reviews
{
  "mappings": {
    "properties": {
      "rating": { "type": "float" },
      "content": { "type": "text" },
      "product_id": { "type": "integer" },
      "author": { 
        "properties": {
          "first_name": { "type": "text" },
           "last_name": { "type": "text" },
           "email": { "type": "keyword" }        
        }
      }
    }
  }
}

POST /reviews/_doc
{
  "rating": 5.0,
  "content": "Very nice!",
  "product_id": 123,
  "author": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "johndoe@example.com"
  }
}

# this won't work because author is not an object
POST /reviews/_doc
{
  "rating": 5.0,
  "content": "Very nice!",
  "product_id": 123,
  "author": 1223
}

GET /reviews/_search

# Getting the mapping of an author
GET /reviews/_mapping/field/author.email


# using dot notation
PUT /reviews_with_dot_notation
{
  "mappings": {
    "properties": {
      "rating": { "type": "float" },
      "content": { "type": "text" },
      "product_id": { "type": "integer" },
      "author.email": { "type": "text" },
      "author.first_name": { "type": "text" },
      "author.last_name": { "type": "text" } 
    }
  }
}

GET /reviews_with_dot_notation/_mapping


### Dates

# update
PUT /reviews/_doc/3
{
  "created_at": "2020-03-25T23:39:31Z",
  "author": {
    "first_name": "Spencer",
    "last_name": "Pearson"
  }
}

# with timezone
PUT /reviews/_doc/4
{
  "created_at": "2020-03-24T23:39:31+08:00",
  "author": {
    "first_name": "Conor",
    "last_name": "McGregor"
  }
}

# EPOCH
PUT /reviews/_doc/4
{
  "created_at": 1622643878713143,
  "author": {
    "first_name": "Adam",
    "last_name": "McKay"
  }
}


### NULL keyowrd 

PUT my-index-with-null
{
  "mappings": {
    "properties": {
      "status_code": {
        "type":       "keyword",
        "null_value": "NULL" 
      }
    }
  }
}

PUT my-index-with-null/_doc/1
{
  "status_code": null
}

PUT my-index-with-null/_doc/2
{
  "status_code": []
}

PUT my-index-with-null/_doc/3
{
  "status_code": 200
}

GET my-index-with-null/_search
{
  "query": {
    "term": {
      "status_code": "NULL"
    }
  }
}

### Updating mapping
GET /reviews/_mapping

PUT /reviews/_mapping
{
  "properies": {
    "author": {
      "properties": {
        "product_id": {
          "type": "keyword"
        }
      }
    }
  }
}
# this will throw an error


# reindex api
POST /_reindex
{
  "source": {
    "index": "reviews"
  },
  "dest": {
    "index": "reviews_v2"
  }
}


### Adding Field aliases

GET /reviews/_mapping

# create a field called comment with type alias
PUT /reviews/_mapping 
{
  "properties": {
    "comment": {
      "type": "alias",
      "path": "content"
    }
  }
}

# add some docs
PUT /reviews/_doc/1
{
  "product_id": 1,
  "rating": 4.0,
  "content": "outstanding"
}

# search with both fields
GET /reviews/_search
{
  "query": {
    "match": {
      "content": "outstanding"
    }
  }
}

GET /reviews/_search
{
  "query": {
    "match": {
      "comment": "outstanding"
    }
  }
}

### Multi Field Test
PUT /muti_field_test
{
  "mappings": {
    "properties": {
      "description": {
        "type": "text"
      },
      "ingredients": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      }
    }
  }
}

GET /muti_field_test/_mapping

POST /muti_field_test/_doc
{
  "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "ingredients": ["Orange", "Noodles", "Eggs"]
}

GET /muti_field_test/_search
{
  "query": {
    "match_all": {}
  }
}

# Each text field becomes an inverted index
# Now because that "ingredients" has an additional "keyword" mapping, there is another "unmodified tokens"

# match all, check ingredients part
GET /muti_field_test/_search
{
  "query": {
    "match_all": {}
  }
}

# match all, check ingredients part
GET /muti_field_test/_search
{
  "query": {
    "match_all": {}
  }
}

GET /muti_field_test/_search
{
  "query": {
    "match": {
      "ingredients": "Eggs"
    }
  }
}

# "term" query requires an exact match on the text field
GET /muti_field_test/_search
{
  "query": {
    "term": {
      "ingredients.keyword": "Eggs"
    }
  }
}

# this won't work
GET /muti_field_test/_search
{
  "query": {
    "term": {
      "ingredients.keyword": "eggs"
    }
  }
}

POST /muti_field_test/_delete_by_query
{
  "query": {
    "match_all": {}
  }
}


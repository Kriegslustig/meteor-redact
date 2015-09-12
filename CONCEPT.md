# Conecept
Redact is sort of a CMS but not really. It's more of a opinionated editor. Redact has a fixed, but extendable database schema. It uses on MongoDB. Here's the basic structure of a Redact document:

```JSON
{
  "_id": 'x',
  "title": 'My Post',
  "content": [
    {
      "type": "paragraph",
      "public": {
        "text": "Lorem ipsum",
        "html": "<p>Lorem ipsum</p>"
      },
      "draft": {
        "text": "Lorem Hipsum",
        "html": "<p>Lorem Hipsum</p>"
      },
    },
    {
      "type": "image",
      "draft": {
        "alt": "Tree",
        "src": "/tree.jpeg",
        "link": "https://reddit.com",
        "html": "<a href=\"https://reddit.com\"><img alt=\"Tree\" src=\"/tree.jpeg\"></a>"
      }
    }
  ]
}
```

A document must have a `title`, and `content`. `content` an array of object which must can have three attributes. Each must have a `type`. It defines the schema for `draft` and `public`. If an object has no `public`, It isn't published.

## TODO
* Problem reaordering content in the draft stage

# Concept
Redact is sort of a CMS but not really. It's more of a opinionated editor. Redact has a fixed, but extendable database schema. It uses on MongoDB. Here's the basic structure of a Redact document:

```JSON
{
  "_id": "dabdb977-3ed1-4c43-b459-c9af0eb7b1b4",
  "title": "My Post",
  "createdAt": "0",
  "lastPublishedAt": "1",
  "createdBy": "6cb0a8ae-ab49-46a1-acb8-7ef4c0aba894",
  "public": [
    {
      "_id": "823abf44-c68c-4f27-8ed3-4ceabf596f65",
      "_type": "paragraph",
      "_html": "<p>Lorem ipsum</p>"
    }
  ],
  "draft": [
    {
      "_id": "823abf44-c68c-4f27-8ed3-4ceabf596f65",
      "_type": "paragraph",
      "_html": "<p>Lorem Hipsum</p>"
    },
    {
      "_id": "ccc14c7c-ba19-4459-a15a-aa921c85fdcd",
      "_locked": "6cb0a8ae-ab49-46a1-acb8-7ef4c0aba894",
      "_type": "image",
      "_html": "<a href=\"https://reddit.com\"><img alt=\"Tree\" src=\"/tree.jpeg\"></a>",
      "alt": "Tree",
      "src": "/tree.jpeg",
      "link": "https://reddit.com"
    }
  ]
}
```

A document must have `title`, `draft`, `createdAt`, `createdBy` and `las tPublishedAt` attributes. When the document doesn't have a `public` attribute, it won't be displayed in the front-end. Extensions may extend this schema. `draft` and `public` are arrays of objects, called _elements_, which can have any number of attributes. Each must have `_type`, `_html` and `_id` attributes. They can also have a `_locked` attribute, which must be and id of a user. It is set when a user edits an _element_. The `_type` attribute is the name of a _module_ defined by an extension. The Redact core does not include any modules. The `_html` attribute is displayed to the editor/user. Other attributes are defined by _modules_.

## Structure
```
|
- client
 |
 - lib
- server
 |
 - lib
```

## Licensing

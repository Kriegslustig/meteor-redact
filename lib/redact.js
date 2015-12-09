/**
 * A mongo collection that to wich the Redact schema has bee attached to.
 * @typedef {Object} Redact.Collection
 */

/**
 * A schema created using SimpleSchema
 * @typedef {Object} SimpleSchema
 */

/**
 * An obeject that can be used to create a `SimpleSchema`
 * @typedef {Object} SimpleSchemaObject
 */

/**
 * A descriptor of an element within a `Redact.Collection`.
 * Ex.
 * ```js
 * {
 *   document: 'svKoFf4fsdcaW3Dj',
 *   id: 'dabdb977-3ed1-4c43-b459-c9af0eb7b1b4',
 *   index: 1,
 *   container: '_draft',
 *   value: { _type: 'Paragraph' }
 * }
 * ```
 * @typedef {Object} Redact.Element
 * @prop {Mongo.id} document The ID of the document the element lives in.
 * @prop {Meteor.uuid} id The ID of the element.
 * @prop {String} container The property of the document containing the element.
 * @prop {Number} index The index of the element within it's container.
 * @prop {Object} value An Object that should be set as the element's value (only required when calling `Redact.addElement`)
 */

Redact = Redact || {}

/**
 * Creates a new `Mongo.Collection` and attaches a Redact schema to it.
 * @arg {String} name The name of the new collection.
 * @arg {SimpleSchemaObject} simpleschema The schema to extend the `Redact.schemata.document` schema.
 * @returns {Redact.Collection} The collection the schema is attached to.
 */
Redact.Collection = function RedactCollection (name, simpleschema) {
  let newCollection = new Mongo.Collection(name)
  newCollection.attachSchema(
    simpleschema
      ? new SimpleSchema(Redact.schemata.document, simpleschema)
      : Redact.schemata.document
  )
  return newCollection
}

/**
 * Creates the Mongo field identifier of an object from a `Redact.Element`.
 * @arg {Redact.Element} element The element to extract the identifier from.
 * @returns {String} The identifier of the pased object.
 */
Redact.extractKey = function RedactExtractKey (element) {
  return Redact.mongoKey(element.container, element.index)
}

/**
 * Gets a container as an array from a document
 * @arg {Mongo.Collection} collection a Mongo collection.
 * @arg {Redact.Element} element An element with the properties `document` and `container`.
 * @returns {Array} An array of elements.
 */
Redact.getContainer = function RedactGetContainer (collection, element) {
  return collection.findOne(element.document)[element.container]
}

/**
 * Searches an array of object for one where the `_id` property matches the passed `elementId`.
 * @arg {Array} elementArray The Array to be searched
 * @arg {String} elementId The id to search for
 * @returns {Number} index
 */
Redact.getElementIndex = function RedactGetElementIndex (elementArray, elementId) {
  return Redact.findByAttr('_id', elementId, elementArray)
}

/**
 * Normalizes a Redact.Element. It fills in any gaps in an object.
 * @arg {Mongo.Collection} collection The collection the element is in.
 * @arg {Object} element The element to be normalized.
 * @return {Redact.Element} The normalized element.
 */
Redact.normalizeElement = function RedactNormalizeElement (collection, element) {
  var normalElement = {}
  if(!element.document) throw Redact.error('Redact.ElementMissingKey', 'document', element)
  normalElement.document = element.document
  normalElement.container = element.container || '_draft'
  normalElement.value = element.value
  if(element.id) {
    normalElement.id = element.id
    if(!element.index) {
      normalElement.index = Redact.getElementIndex(
        Redact.getContainer(collection, element),
        element.id
      )
    }
  } else if(element.index !== undefined) {
    normalElement.index = element.index
    normalElement.id = (Redact.getContainer(collection, element)[element.index] || {})._id
  } else {
    throw Redact.error('Redact.ElementMissingKey', 'id or index', element)
  }

  return normalElement
}

/**
 * Generates Mongo queries for elements
 * @arg {Redact.Element} element The element that should prefix the key.
 * @arg {String} key The key that should be appended to the element's key.
 * @arg {Void} value The value that should be behind the key.
 * @return {Object} An Object that may be used in a Mongo query.
 */
Redact.elementQuery = function RedactElementQuery (element, key, value) {
  return {
    [Redact.mongoKey(Redact.extractKey(element), key)]: value
  }
}

/**
 * Locks an element inside the specified document.
 * @arg {Redact.Collection} collection
 * @arg {Redact.Element} element The `Redact.Element` identifier for the element. It doesn't need to have an id property.
 * @returns {Promise} A Promise that fulfills when the change was made.
 */
Redact.lockElement = function RedactLockElement (collection, element) {
  return new Promise((resolve, reject) => {
    collection.update(
      element.document,
      {
        $set: Redact.elementQuery(
          element,
          '_lock',
          {
            _time: Redact.getUnixTime(),
            _user: Redact.getUserId()
          }
        )
      },
      (err, data) => {
        err || data !== 1
          ? reject(err || Redact.error('updateFailed'))
          : resolve(data)
      }
    )
  })
}

/**
 * This unlocks an element in a document
 * @arg {Redact.Collection} collection The Collection that should be manipulated
 * @arg {String} documentId The ID of the document that should be manipulated.
 * @arg {Redact.Element} field the field inside the document where the element is. It doesn't need to have an id property.
 * @returns {Promise} A Promise that fulfills when the unlock is done
 */
Redact.unlockElement = function RedactUnlockElement (collection, element) {
  return new Promise((resolve, reject) => {
    collection.update(
      element.document,
      {
        $unset: {
          [`${element.container}.${element.index}._lock`]: ''
        }
      },
      (err, data) => {
        err
          ? reject(err)
          : resolve(data)
      }
    )
  })
}

/* TODO: Implement this */
Redact.unlockAllElements = function RedactUnlockAllElements (document, userId) {}

/**
 * Updates the value of a field inside an element
 * @arg {Mongo.Collection} collection The collection to be manipulated.
 * @arg {Redact.Element} element The element to be updated. It doesn't need to have an id property.
 * @arg {String} key The key of the value to be changed.
 * @arg {Void} value The value that should be set as the key.
 * @returns {Promise} A Promise that fulfills once the the element is updated.
 */
Redact.updateFieldValue = function RedactUpdateFieldValue (collection, element, key, value) {
  let elementKey = Redact.extractKey(element)
  return new Promise((resolve, reject) => {
    collection.update(
      element.document,
      {
        $set: {
          [Redact.mongoKey(elementKey, key)]: value,
          [Redact.mongoKey(elementKey, '_lock', '_time')]: Redact.getUnixTime()
        }
      },
      (err, data) => {
        err
          ? reject(err)
          : resolve(data)
      }
    )
  })
}

/**
 * Updates an element and unlocks it.
 * @arg {Mongo.Collection} collection The collection to be manipulated.
 * @arg {Redact.Element} element The element to be updated. The element doesn't need an ID.
 * @arg {String} key The key inside the element that should be changed.
 * @arg {Void} value The value the key should be set to.
 * @returns {Promise} A Promise that fulfills once the element has been updated and unlocked.
 */
Redact.updateAndUnlockElement = function RedactUpdateAndUnlockElement (collection, element, key, value) {
  return Redact.updateFieldValue
    .apply(null, arguments)
    .then(Redact.unlockElement.bind(null, ...arguments))
    .catch((err, data) => (err || data !== 1) && Redact.error('updateFailed', err))
}

/**
 * Adds an element to a document
 * @arg {Mongo.Collection} collection The collection the Element should be added to.
 * @arg {Redact.Element} element The element to be added. It shouldn't have an ID attribute.
 * @returns {Promise} A Promise that fulfills when the addition is done.
 */
Redact.addElement = function RedactAddElement (collection, element) {
  return new Promise((resolve, reject) => {
    collection.update(
      element.document,
      {
        $push: {
          [element.container]: {
            $each: [element.value],
            $position: element.index
          }
        }
      },
      (err, data) => {
        err || data !== 1
          ? reject(err || Redact.error('updateFailed'))
          : resolve(data)
      }
    )
  })
}

/**
 * Removes an element from a document. The element is removed by ID. The index is ignored.
 * @arg {Mongo.Collection} collection The collection to update the document in.
 * @arg {Redact.Element} element The element that should be removed
 * @returns {Promise} A Promise that fulfills when the element was removed.
 */
Redact.removeElement = function RedactRemoveElement (collection, element) {
  return new Promise((resolve, reject) => {
    collection.update(
      document,
      {
        $pull: {
          [element.container]: { _id: element.id }
        }
      },
      (err, data) => {
        err
          ? reject(err)
          : resolve(data)
      }
    )
  })
}

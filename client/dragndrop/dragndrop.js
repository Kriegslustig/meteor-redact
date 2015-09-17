Redact = Redact || {}

Redact.dragndrop = {
  creator: function (options) {
    return _.extend(Object.create(Redact.dragndrop), { callbacks: options }).start()
  },

  follow: _.throttle(function (e) {
    this.node.style.transform = [
      'translate(',
      e.clientX - this.halfNodeWidth,
      'px,',
      e.clientY - this.halfNodeHeight,
      'px)'
    ].join('')
  }),

  start: function () {
    var self = this
    return function (e) {
      self.node = $(e.currentTarget).clone(1)[0]
      self.halfNodeHeight = e.currentTarget.clientHeight / 2
      self.halfNodeWidth = e.currentTarget.clientWidth / 2
      self.follower = self.follow.bind(self)
      self.stop = self.stopper()
      self.abord = self.aborder()

      self.node.className += ' redactDragging'
      document.body.appendChild(self.node)
      self.follower(e)
      if(self.callbacks.onDrag) self.callbacks.onDrag.call(self, e)
      window.addEventListener('mousemove', self.follower)
      window.addEventListener('mouseup', self.stop)
      window.addEventListener('keydown', self.abord)
      return false
    }
  },

  stopper: function () {
    var self = this
    return function (e) {
      if(self.callbacks.onDrop) self.callbacks.onDrop.call(self, e)
      self.cleanUp(e)
      return false
    }
  },

  aborder: function () {
    var self = this
    return function (e) {
      if(e.key != 'Escape') return
      if(self.callbacks.onAbord) self.callbacks.onAbord(e)
      self.cleanUp()
      return false
    }
  },

  cleanUp: function (e) {
    document.body.removeChild(this.node)
    window.removeEventListener('mouseup', this.stop)
    window.removeEventListener('keydown', this.abord)
  }
}
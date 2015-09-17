Redact = Redact || {}

Redact.dragndrop = {
  creator: function (options) {
    return _.extend(Object.create(Redact.dragndrop), { callbacks: options }).start()
  },

  follow: _.throttle(function (e) {
    this.node.style.transform = ['translate(', e.clientX, 'px, ', e.clientY, 'px)'].join('')
  }),

  start: function () {
    var self = this
    return function (e) {
      self.node = $(e.currentTarget).clone(1)[0]
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
    }
  },

  stopper: function () {
    var self = this
    return function (e) {
      if(self.callbacks.onDrop) self.callbacks.onDrop.call(self, e)
      self.cleanUp(e)
    }
  },

  aborder: function () {
    var self = this
    return function (e) {
      if(e.key != 'Escape') return
      if(self.callbacks.onAbord) self.callbacks.onAbord(e)
      self.cleanUp()
    }
  },

  cleanUp: function (e) {
    document.body.removeChild(this.node)
    window.removeEventListener('mouseup', this.stop)
    window.removeEventListener('keydown', self.abord)
  }
}
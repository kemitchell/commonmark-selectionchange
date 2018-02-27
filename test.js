var JSDOM = require('jsdom').JSDOM
var commonmark = require('commonmark')
var compute = require('./')
var tape = require('tape')

test(
  'basic',
  '# This\nis a test',
  function (window) {
    var nodes = window.document.body.children
    return {
      isCollapsed: false,
      anchorNode: nodes[0],
      anchorOffset: 0,
      focusNode: nodes[1],
      focusOffset: 2
    }
  },
  {
    anchor: {
      line: 0,
      character: 0
    },
    focus: {
      line: 1,
      character: 2
    }
  }
)

function test (name, input, makeEvent, expected) {
  tape(name, function (test) {
    var markup = renderCommonMark(input)
    var dom = new JSDOM(markup)
    var window = dom.window
    window.getSelection = function () {
      return makeEvent(window)
    }
    test.deepEqual(compute(window, markup), expected)
    test.end()
  })
}

function renderCommonMark (input) {
  var parser = new commonmark.Parser()
  var renderer = new commonmark.HtmlRenderer({
    sourcepos: true
  })
  return renderer.render(parser.parse(input))
}

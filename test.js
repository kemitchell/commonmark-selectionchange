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

test(
  'multiline',
  '# This\nis a test\nof the emergency',
  function (window) {
    var nodes = window.document.body.children
    return {
      isCollapsed: false,
      anchorNode: nodes[0],
      anchorOffset: 0,
      focusNode: nodes[1],
      focusOffset: 10
    }
  },
  {
    anchor: {
      line: 0,
      character: 0
    },
    focus: {
      line: 2,
      character: 1
    }
  }
)

function test (name, source, makeEvent, expected) {
  tape(name, function (test) {
    var markup = renderCommonMark(source)
    var dom = new JSDOM(markup)
    var window = dom.window
    window.getSelection = function () {
      return makeEvent(window)
    }
    test.deepEqual(compute(window, source), expected)
    test.end()
  })
}

function renderCommonMark (source) {
  var parser = new commonmark.Parser()
  var renderer = new commonmark.HtmlRenderer({
    sourcepos: true
  })
  return renderer.render(parser.parse(source))
}

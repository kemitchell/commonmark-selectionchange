module.exports = function (window, markup) {
  var selection = window.getSelection()
  if (selection.isCollapsed) return

  var anchor = selection.anchorNode
  var anchorOffset = selection.anchorOffset
  var focus = selection.focusNode
  var focusOffset = selection.focusOffset

  var bothCommonMark = (
    isCommonMark(anchor) &&
    isCommonMark(focus)
  )
  if (!bothCommonMark) return false

  // TODO: Check that in same rendered parent.

  var anchorPosition = parseSourcePosition(anchor)
  var focusPosition = parseSourcePosition(focus)

  var lines = markup.split('\n')
  var lineLengths = lines.map(function (line) {
    return line.length
  })

  return {
    anchor: withOffset(anchorPosition, anchorOffset, lineLengths),
    focus: withOffset(focusPosition, focusOffset, lineLengths)
  }
}

function withOffset (position, offset, lineLengths) {
  var returned = {}
  var onOneLine = position.start.line === position.end.line
  if (onOneLine) {
    return {
      line: position.start.line - 1,
      character: position.start.character + offset - 1
    }
  }
  return returned
}

function isCommonMark (node) {
  return Boolean(positionOf(node))
}

function positionOf (node) {
  return node.dataset.sourcepos
}

var RE = /^(\d+):(\d+)-(\d+):(\d+)$/

function parseSourcePosition (node) {
  var match = RE.exec(positionOf(node))
  return {
    start: {
      line: parseInt(match[1]),
      character: parseInt(match[2])
    },
    end: {
      line: parseInt(match[3]),
      character: parseInt(match[4])
    }
  }
}

module.exports = function (window, source) {
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

  var lineLengths = source
    .split('\n')
    .map(function (line) {
      return line.length
    })

  return {
    anchor: withOffset(anchorPosition, anchorOffset, lineLengths),
    focus: withOffset(focusPosition, focusOffset, lineLengths)
  }
}

function withOffset (position, offset, lineLengths) {
  var onOneLine = position.start.line === position.end.line
  if (onOneLine) {
    return {
      line: position.start.line,
      character: position.start.character + offset
    }
  } else {
    var character = offset
    var line = position.start.line
    while (true) {
      var lineLength = lineLengths[line]
      if (lineLength >= character) break
      character -= lineLength
      line++
    }
    return {line, character}
  }
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
      line: parseInt(match[1]) - 1,
      character: parseInt(match[2]) - 1
    },
    end: {
      line: parseInt(match[3]) - 1,
      character: parseInt(match[4]) - 1
    }
  }
}

import './index.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

/**
 * 高亮划词组件
 *
 *   
    <HighlightWords
      words={['奇迹', '人民']}
      index={[
        { start: 1, end: 2 },
        { start: 4, end: 8 },
        { start: 6, end: 8 },
        { start: 14, end: 25 }
      ]}
      text="奇迹是什么？歌德说，奇迹是信仰最宠爱的孩子。70年来，一代代共产党人坚守信仰、不忘初心，始终胸怀“人民梦想”，求解“人"
    />
 * @export
 * @class HighlightWords
 * @extends {Component}
 */
export default class HighlightWords extends Component {
  static propTypes = {
    className: PropTypes.string,
    text: PropTypes.string.isRequired,
    // 可传需高亮单词，查找所有符合词 | 当前版本暂不实现
    words: PropTypes.arrayOf(PropTypes.string),
    index: PropTypes.arrayOf(
      PropTypes.shape({
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired
      })
    )
  }

  /** 切割词组
   *
   *
   * @static
   * @param {*} text
   * @param {*} index
   * @returns
   * @memberof HighlightWords
   */
  static getSplitedTextByIndex(text, index) {
    if (!text) return []

    let i = 0
    let currentText = ''
    let endIndexMap = {}
    let activeCount = 0
    let startIndexMap = {}
    const splitedText = []

    index.forEach(a => {
      endIndexMap[a.end] = endIndexMap[a.end] ? endIndexMap[a.end] + 1 : 1
      startIndexMap[a.start] = startIndexMap[a.start]
        ? startIndexMap[a.start] + 1
        : 1
    })

    let highLight = false
    while (i <= text.length - 1) {
      // 命中一个开始
      if (startIndexMap[i] !== undefined) {
        if (activeCount === 0) {
          splitedText.push({ text: currentText, highLight })
          currentText = ''
          highLight = true
        }
        activeCount += startIndexMap[i]
      }
      currentText += text[i]
      // 命中一个结束
      if (endIndexMap[i] !== undefined) {
        activeCount -= endIndexMap[i]
        if (activeCount === 0) {
          splitedText.push({ text: currentText, highLight })
          currentText = ''
          highLight = false
        }
      }
      i++
    }
    if (currentText) {
      splitedText.push({ text: currentText, highLight })
    }
    return splitedText
  }

  constructor(props) {
    super(props)
    this.state = {
      text: props.text,
      splitedText: HighlightWords.getSplitedTextByIndex(props.text, props.index)
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (state.text !== props.text) {
      return {
        text: props.text,
        splitedText: HighlightWords.getSplitedTextByIndex(
          props.text,
          props.index
        )
      }
    }
    return null
  }

  render() {
    const { className } = this.props
    const { splitedText } = this.state
    return (
      <span className={classnames({ [className]: !!className })}>
        {splitedText.map((t, ti) => {
          return (
            <span
              key={`st${ti}`}
              className={classnames({ 'highlighted-words': t.highLight })}
            >
              {t.text}
            </span>
          )
        })}
      </span>
    )
  }
}

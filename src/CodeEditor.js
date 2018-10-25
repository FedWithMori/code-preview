import React from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'codemirror';
import trim from 'lodash/trim';
import ClassNames from 'classnames';

class CodeEditor extends React.Component {
  static propTypes = {
    readOnly: PropTypes.bool,
    code: PropTypes.string,
    theme: PropTypes.string,
    matchBrackets: PropTypes.bool,
    lineNumbers: PropTypes.bool,
    lineWrapping: PropTypes.bool,
    tabSize: PropTypes.number,
    onChange: PropTypes.func,
    buttonClassName: PropTypes.string,
    showCodeIcon: PropTypes.node,
    classPrefix: PropTypes.string,
    $key: PropTypes.string
  };

  static defaultProps = {
    matchBrackets: true,
    tabSize: 2,
    theme: 'default'
  };
  constructor() {
    super();
    this.state = {
      isShow: false
    };
  }

  componentDidMount() {
    const { lineNumbers, lineWrapping, matchBrackets, tabSize, readOnly, theme } = this.props;

    if (CodeMirror === undefined) {
      return;
    }

    this.editor = CodeMirror.fromTextArea(this.textarea, {
      mode: 'jsx',
      lineNumbers,
      lineWrapping,
      matchBrackets,
      tabSize,
      readOnly,
      theme
    });

    this.editor.on('change', this.handleChange);
  }

  handleChange = () => {
    const { readOnly, onChange, $key } = this.props;
    if (!readOnly && onChange) {
      onChange(this.editor.getValue(), $key);
    }
  };

  addPrefix = name => {
    const { classPrefix } = this.props;
    if (classPrefix) {
      return `${classPrefix}-${name}`;
    }
    return name;
  };

  handleShowCode = () => {
    const { isShow } = this.state;
    this.setState({
      isShow: !isShow
    });
  }

  render() {
    const { style, code, buttonClassName, showCodeIcon } = this.props;
    const { isShow } = this.state;
    const icon = (
      <span className="icon-code">
        {isShow ? '</>' : '< >'}
      </span>
    );
    const codeViewClass = `doc-code ${isShow ? 'show' : ''}`;
    return (
      <div className="code-view-wrap">
        <div className="code-view-toolbar">
          <div
            className={ClassNames(
              this.addPrefix('btn-code'),
              buttonClassName
            )}
            onClick={this.handleShowCode}
          >
            {typeof showCodeIcon !== 'undefined' ? showCodeIcon : icon}
          </div>
        </div>
        <div style={style} className={codeViewClass}>
          <textarea
            ref={ref => {
              this.textarea = ref;
            }}
            defaultValue={trim(code)}
          />
        </div>
      </div>
    );
  }
}

export default CodeEditor;

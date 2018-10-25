import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/addon/runmode/runmode';

import CodeEditor from './CodeEditor';
import parseHTML from './parseHTML';
import Preview from './Preview';

const React = require('react');
const PropTypes = require('prop-types');
const ReactDOM = require('react-dom');
const { Markdown } = require('react-markdown-reader');

class CodeView extends React.Component {
  static propTypes = {
    classPrefix: PropTypes.string,
    delay: PropTypes.number,
    showCode: PropTypes.bool,
    source: PropTypes.string,
    children: PropTypes.string,
    dependencies: PropTypes.object,
    babelTransformOptions: PropTypes.object,
    buttonClassName: PropTypes.string,
    showCodeIcon: PropTypes.node
  };

  static defaultProps = {
    delay: 0,
    babelTransformOptions: {
      presets: ['stage-0', 'react', 'es2015']
    },
    readOnly: true
  };
  constructor(props) {
    super(props);

    const { code, beforeHTML, afterHTML } = parseHTML(props.children || props.source);
    this.state = {
      beforeHTML,
      afterHTML,
      code,
      showCode: props.showCode,
      hasError: false,
      errorMessage: null,
      exampleList: []
    };
    this.executeCode = this.executeCode.bind(this);

    setTimeout(() => {
      this.executeCode();
    }, props.delay);
  }

  executeCode() {
    const { babelTransformOptions, dependencies } = this.props;
    const { code } = this.state;
    const originalRender = ReactDOM.render;
    let hasError = false;
    let { exampleList } = this.state;
    Object.keys(code).forEach(item => {
      ReactDOM.render = element => {
        exampleList.push({
          [item]: element
        });
        this.setState({
          exampleList
        });
      };
      try {
        let transformCode = window.Babel.transform(code[item], babelTransformOptions).code;
        let statement = '';

        if (dependencies) {
          Object.keys(dependencies).forEach(key => {
            statement += `var ${key}= dependencies.${key};\n `;
          });
        }

        /* eslint-disable */
        eval(`${statement} ${transformCode}`);
        /* eslint-enable */
      } catch (err) {
        hasError = true;
        console.error(err);
      } finally {
        ReactDOM.render = originalRender;
        if (!hasError) {
          this.forceUpdate();
        }
      }
    });
  }

  handleCodeChange = (val, key) => {
    const { code } = this.state;
    code[key] = val;
    this.setState({
      hasError: false,
      errorMessage: null,
      code,
      exampleList: []
    }, () => {
      this.executeCode();
    });
  };

  handleShowCode = () => {
    const showCode = !this.state.showCode;
    this.setState({ showCode });
  };

  handleError = error => {
    this.setState({
      hasError: true,
      errorMessage: error.message
    });
  };
  renderExample(example) {
    const { hasError, errorMessage } = this.state;
    return (
      <Preview hasError={hasError} errorMessage={errorMessage} onError={this.handleError}>
        <div>{ example || <div>Loading...</div> }</div>
      </Preview>
    );
  }
  renderExampleAll = () => {
    const { showCodeIcon, buttonClassName, classPrefix, readOnly } = this.props;
    const { code } = this.state;
    const { exampleList } = this.state;

    const exampleListDom = exampleList && exampleList.map((item) => {
      const key = Object.keys(item).join();
      return (
        <div className="code-view-wrapper" key={key}>
          {this.renderExample(item[key])}
          <CodeEditor
            lineNumbers
            $key={key}
            onChange={this.handleCodeChange}
            theme="base16-light"
            code={code[key]}
            buttonClassName={buttonClassName}
            showCodeIcon={showCodeIcon}
            classPrefix={classPrefix}
            readOnly={readOnly}
          />
        </div>);
    })
    return exampleListDom;
  }


  render() {
    const { className, style } = this.props;
    const { beforeHTML, afterHTML } = this.state;

    return (
      <div className={className} style={style}>
        <Markdown>{beforeHTML}</Markdown>
        {this.renderExampleAll()}
        <Markdown>{afterHTML}</Markdown>
      </div>
    );
  }
}

export default CodeView;

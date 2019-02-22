// From installed libraries
import React from 'react';
import dwv from 'dwv';


// Custom libraries
import './DwvComponent.css';
// import TagsTable from './TagsTable';

// decode query
dwv.utils.decodeQuery = dwv.utils.base.decodeQuery;
// progress
dwv.gui.displayProgress = function () { };
// get element
dwv.gui.getElement = dwv.gui.base.getElement;
// refresh element
dwv.gui.refreshElement = dwv.gui.base.refreshElement;

dwv.gui.Undo = dwv.gui.base.Undo;

// dwv.gui.FileLoad = dwv.gui.base.FileLoad;

// Image decoders (for web workers)
dwv.image.decoderScripts = {
  "jpeg2000": "assets/dwv/decoders/pdfjs/decode-jpeg2000.js",
  "jpeg-lossless": "assets/dwv/decoders/rii-mango/decode-jpegloss.js",
  "jpeg-baseline": "assets/dwv/decoders/pdfjs/decode-jpegbaseline.js"
};

class DwvComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tools: ['Scroll', 'ZoomAndPan', 'WindowLevel', 'Draw'],
      loadProgress: 0,
      dataLoaded: false,
      dwvApp: null,
      tags: [],
      url: '',
      selectedTool: 'ZoomAndPan',
      selectedShape: 'Ruler',
      showDicomTags: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.handleRedo = this.handleRedo.bind(this);
    this.onStateSave = this.onStateSave.bind(this);
    this.onChangeTool = this.onChangeTool.bind(this);
    this.onChangeShape = this.onChangeShape.bind(this);
  }
  handleChange(event) {
    this.setState({
      tools: this.state.tools,
      loadProgress: this.state.loadProgress,
      dataLoaded: this.state.dataLoaded,
      dwvApp: this.state.dwvApp,
      tags: this.state.tags,
      url: event.target.value,
      selectedTool: this.state.selectedTool,
      selectedShape: this.state.selectedShape,
      showDicomTags: this.state.showDicomTags
    })
  }
  render() {

    // const dummy = this.state.tools.map((item) => <input type="radio" value={item} name="tool" checked={this.state.selectedTool === item}>{item}</input>)
      return (
          <div id="dwv" className="uk-grid">
            <div className="uk-width-2-5">
            <from>
              <div className="uk-container uk-section-primary">
                <div className="uk-margin">                 
                  <input className="uk-input" value={this.state.url} onChange={this.handleChange}/>
                  <button className="uk-button uk-button-secondary" onClick={this.loadFromURL}>LoadImage</button>
                </div>
                <div className="uk-margin">                 
                  <button className="uk-button uk-button-secondary" disabled={!this.state.dataLoaded} onClick={this.onReset}>Reset</button>
                  <button className="uk-button uk-button-secondary" disabled={!this.state.dataLoaded} onClick={this.handleTagsDialogOpen}>Tags</button>
                </div>
              </div>
              <div hidden={!this.state.dataLoaded} className="uk-continer uk-section uk-section-secondary">
                <label htmlFor="ZoomAndPan"  className="uk-label"  >ZoomAndPan</label>
                <input className="uk-radio" type="radio" onChange={this.onChangeTool} value="ZoomAndPan" name="tool" checked={this.state.selectedTool  ===  'ZoomAndPan'} />
                <label htmlFor="Scroll"  className="uk-label"  >Scroll</label>
                <input className="uk-radio" type="radio" onChange={this.onChangeTool} value="Scroll" name="tool" checked={this.state.selectedTool  ===  'Scroll'} />
                <label htmlFor="WindowLevel"  className="uk-label"  >WindowLevel</label>
                <input className="uk-radio" type="radio" onChange={this.onChangeTool} value="WindowLevel" name="tool" checked={this.state.selectedTool  ===  'WindowLevel'} />
                <label htmlFor="Draw"  className="uk-label"  >Draw</label>
                <input className="uk-radio" type="radio" onChange={this.onChangeTool} value="Draw" name="tool" checked={this.state.selectedTool  ===  'Draw'} />
              </div>
              <div hidden={this.state.selectedTool !==  "Draw"}>
                <label>Select a shape:</label>
                <br/>
                <label htmlFor="Ruler"  className="uk-label"  >Ruler</label>
                <input className="uk-radio" onChange={this.onChangeShape} type="radio" value="Ruler" name="shape" checked={this.state.selectedShape  ===  'Ruler'} />
                <label htmlFor="FreeHand"  className="uk-label"  >FreeHand</label>
                <input className="uk-radio" onChange={this.onChangeShape} type="radio" value="FreeHand" name="shape" checked={this.state.selectedShape  ===  'FreeHand'} />
                <label htmlFor="Protractor"  className="uk-label"  >Protractor</label>
                <input className="uk-radio" onChange={this.onChangeShape} type="radio" value="Protractor" name="shape" checked={this.state.selectedShape  ===  'Protractor'} />
                <label htmlFor="Rectangle"  className="uk-label"  >Rectangle</label>
                <input className="uk-radio" onChange={this.onChangeShape} type="radio" value="Rectangle" name="shape" checked={this.state.selectedShape  ===  'Rectangle'} />
                <label htmlFor="Roi"  className="uk-label"  >Roi</label>
                <input className="uk-radio" onChange={this.onChangeShape} type="radio" value="Roi" name="shape" checked={this.state.selectedShape  ===  'Roi'} />
                <label htmlFor="Ellipse"  className="uk-label"  >Ellipse</label>
                <input className="uk-radio" onChange={this.onChangeShape} type="radio" value="Ellipse" name="shape" checked={this.state.selectedShape  ===  'Ellipse'} />
                <label htmlFor="Arrow"  className="uk-label"  >Arrow</label>
                <input className="uk-radio" onChange={this.onChangeShape} type="radio" value="Arrow" name="shape" checked={this.state.selectedShape  ===  'Arrow'} />
              </div>
              {this.state.dataLoaded &&
                <button className="uk-button uk-button-primary download-state"
                  onClick={this.onStateSave}>Save</button>
              }
              {this.state.selectedTool === "Draw" &&
                <div>
                  <button onClick={this.handleUndo}>Undo</button>
                  <button onClick={this.handleRedo}>Redo</button>
                </div>
              }
              </from>
            </div>
            <div className="uk-width-3-5 uk-padding-remove">
            {/* The canvas container for viewing the DICOM File */}
              <div className="layerContainer">
                  <div className="dropBox">Drag and drop data here.</div>
                  <canvas className="imageLayer" >Only for HTML5 compatible browsers...</canvas>
                  <div className="drawDiv" ></div>
              </div>
            </div>
            <div className="history" hidden></div>
          </div>
      );
  }
    
  componentDidMount() {
    var dcmApp = new dwv.App()
    dcmApp.init({
      "containerDivId": "dwv",
      "tools": this.state.tools,
      "gui": ["undo"],
      "shapes": ["Ruler", "FreeHand", "Protractor", "Rectangle", "Roi", "Ellipse", "Arrow"],
      "isMobile": true
    })
    var self = this;
    // dcmApp.addEventListener("load-progress", function (event) {
    //     self.setState({loadProgress: event.loaded});
    //   });
    dcmApp.addEventListener("load-end", function (event) {
      // set data loaded flag
      self.setState({ dataLoaded: true });
      // set dicom tags
      self.setState({ tags: dcmApp.getTags() });
      // set the selected tool
      // if (dcmApp.isMonoSliceData() && dcmApp.getImage().getNumberOfFrames()  === = 1) {
      //   self.setState({selectedTool: 'ZoomAndPan'});
      // } else {
      //   self.setState({selectedTool: 'Scroll'});
      // }
    });
    // store
    this.setState({ dwvApp: dcmApp });
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  onStateSave = () => {
    if (this.state.dwvApp) {
      console.log("called")
      this.state.dwvApp.onStateSave();
      let fname = this.state.tags.filter(i => i.name  === 'PatientName');
      this.state.dwvApp.getElement("download-state").download = fname[0].value + ".json"
    }
  }

  handleUndo = () => {
    console.log("called");
    if (this.state.dwvApp) {
      this.state.dwvApp.onUndo();
    }
  }

  handleRedo = () => {
    if (this.state.dwvApp) {
      this.state.dwvApp.onRedo();
    }
  }

  handleKeyDown = event => {
    if (event.shiftKey && event.which  ===  90) {
      if (this.state.dwvApp) {
        this.setState({ selectedTool: "ZoomAndPan" });
        this.state.dwvApp.onChangeTool({ currentTarget: { value: "ZoomAndPan" } });
      }
    } else if (event.shiftKey && event.which  ===  68) {
      if (this.state.dwvApp) {
        this.setState({ selectedTool: "Draw" });
        this.state.dwvApp.onChangeTool({ currentTarget: { value: "Draw" } });
      }
    }
  }

  onChangeTool = event => {
    if (this.state.dwvApp) {
      this.setState({ selectedTool: event.target.value });
      this.state.dwvApp.onChangeTool({ currentTarget: { value: event.target.value } });
    }
  }

  onChangeShape = event => {
    if (this.state.dwvApp) {
      this.setState({ selectedShape: event.target.value });
      this.state.dwvApp.onChangeShape({ currentTarget: { value: event.target.value } });
    }
  }

  onReset = tool => {
    if (this.state.dwvApp) {
      this.state.dwvApp.onDisplayReset();
    }
  }

  handleTagsDialogOpen = () => {
    this.setState({ showDicomTags: true });
  }

  handleTagsDialogClose = () => {
    this.setState({ showDicomTags: false });
  }

  loadFromURL = (e, urlsArray = null) => {
    let array = this.state.url.split(",");
    this.state.dwvApp.loadURLs(urlsArray ? urlsArray : array);
    // this.state.dwvApp.loadURLs(urlsArray ? urlsArray : [this.state.url]);
    // this.state.dwvApp.loadURLs(urlsArray ? urlsArray : [
    // 'https://raw.githubusercontent.com/ivmartel/dwv/master/tests/data/bbmri-53323851.dcm']);
  }
};



export default DwvComponent;
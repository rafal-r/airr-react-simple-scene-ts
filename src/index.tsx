import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import {
  Scene,
  View,
  Sidepanel,
  ViewProps,
  SceneProps,
  TSValidateViewsConfig,
} from "airr-react";
import "airr-react/dist/airr-react.css";
import "./styles.css";

const BlueViewName = "blue-view";
const RedViewName = "red-view";

interface BlueViewProps extends ViewProps {
  goToRedView(): void;
  openSidepanel(): void;
  openMayer(): void;
}
interface RedViewProps extends ViewProps {
  goToBlueView: () => void;
}
class BlueView extends View<BlueViewProps> {
  content() {
    return (
      <div className={BlueViewName}>
        BlueView
        <br />
        <br />
        <button onClick={this.props.goToRedView}>go to red</button>
        <br />
        <br />
        <button onClick={this.props.openSidepanel}>open sidepanel</button>
        <br />
        <br />
        <button onClick={this.props.openMayer}>open modal</button>
      </div>
    );
  }
}
class RedView extends View<RedViewProps> {
  content() {
    return (
      <div className={RedViewName}>
        RedView
        <br />
        <br />
        <button onClick={this.props.goToBlueView}>go to blue</button>
      </div>
    );
  }
}

class Viewport extends Scene {
  viewsConfig = TSValidateViewsConfig({
    [BlueViewName]: {
      type: BlueView,
      props: {
        name: BlueViewName,
        goToRedView: () => this.changeView(RedViewName),
        openSidepanel: this.openSidepanel,
        openMayer: () =>
          this.openMayer({
            name: "foo-mayer",
            content: (
              <div>
                Hello! I'm modal layer!
                <br />
                <br />
                <button onClick={() => this.closeMayer("foo-mayer")}>
                  close me
                </button>
              </div>
            ),
          }),
      },
    },
    [RedViewName]: {
      type: RedView,
      props: {
        name: RedViewName,
        goToBlueView: () => this.changeView(BlueViewName),
      },
    },
  });

  constructor(props: SceneProps) {
    super(props);

    this.state = {
      ...this.state,
      activeViewName: BlueViewName,
      sidepanel: {
        type: Sidepanel,
        props: {
          enabled: true,
          children: "Hello! I'm sidepanel!",
        },
      },
      views: [
        this.getFreshViewConfig(BlueViewName),
        this.getFreshViewConfig(RedViewName),
      ],
    };
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Viewport />, rootElement);

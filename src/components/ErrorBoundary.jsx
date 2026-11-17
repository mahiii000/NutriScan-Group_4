import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("Caught by boundary:", error.message);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="boundary-fallback">
          <h2>This section could not be displayed.</h2>
          <p>Please reload the page and try again.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
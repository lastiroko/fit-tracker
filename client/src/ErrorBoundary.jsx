import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 16,
            fontFamily: 'monospace',
            fontSize: 12,
            lineHeight: 1.5,
            background: '#FFC9BC',
            color: '#1a1a1a',
            minHeight: '100vh',
          }}
        >
          <h2 style={{ fontFamily: 'sans-serif', marginBottom: 12 }}>
            💥 Crash caught
          </h2>
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
            {String(this.state.error?.message || this.state.error)}
          </div>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              background: 'rgba(0,0,0,0.08)',
              padding: 10,
              borderRadius: 8,
              marginTop: 12,
              fontSize: 11,
            }}
          >
            {this.state.error?.stack}
          </pre>
          {this.state.info?.componentStack && (
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                background: 'rgba(0,0,0,0.08)',
                padding: 10,
                borderRadius: 8,
                marginTop: 12,
                fontSize: 11,
              }}
            >
              {this.state.info.componentStack}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 16,
              padding: '10px 18px',
              background: '#1a1a1a',
              color: '#fbe89a',
              border: 0,
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

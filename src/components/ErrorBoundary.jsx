import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Tampilkan di console untuk debugging; tidak dikirim ke mana pun.
    console.error('ErrorBoundary:', error, info);
    if (this.props.silent && typeof this.props.onError === 'function') {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.error) {
      // Untuk preloader: jangan tampilkan apa-apa, cukup beri tahu parent.
      if (this.props.silent) {
        return null;
      }
      return (
        <div className="grid min-h-[70svh] place-items-center px-5 pt-28 md:pt-32">
          <div className="max-w-lg text-center">
            <p className="font-display text-6xl font-extrabold text-accent">!</p>
            <h1 className="mt-4 font-display text-2xl font-extrabold">
              Terjadi kesalahan saat memuat halaman
            </h1>
            <p className="mt-2 text-[15px] text-muted">
              Coba muat ulang halaman. Jika masih terjadi, kembali ke Beranda.
            </p>
            <pre className="mt-4 max-h-32 overflow-auto rounded-xl2 border border-line bg-white p-3 text-left text-[12px] text-muted">
              {String(this.state.error?.message || this.state.error)}
            </pre>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-pill bg-accent px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[#e63f16]"
              >
                Muat ulang
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ error: null })}
                className="rounded-pill border border-line px-5 py-2.5 text-[14px] font-semibold text-ink hover:border-accent hover:text-accent"
              >
                Ke Beranda
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

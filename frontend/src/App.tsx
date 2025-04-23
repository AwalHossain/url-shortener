import AnalyticsSection from './components/AnalyticsSection';
import Footer from './components/Footer';
import Header from './components/Header';
import UrlShortenerForm from './components/UrlShortenerForm';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-16 md:pt-20">
        {/* Main content area */}
        <UrlShortenerForm />
        <AnalyticsSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;

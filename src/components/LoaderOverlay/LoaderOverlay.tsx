import "./style.css";

function LoaderOverlay() {
  return (
    <div className="overlay">
      <div className="overlay__content">
        <span className="spinner"></span>
      </div>
    </div>
  );
}

export default LoaderOverlay;
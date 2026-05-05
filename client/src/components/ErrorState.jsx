function ErrorState({ message }) {
  if (!message) return null;

  return (
    <div className="alert alert-danger" role="alert">
      {message}
    </div>
  );
}

export default ErrorState;

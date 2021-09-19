export const Toast = ({ display, setDisplay }) => {
  setTimeout(() => {
    setDisplay("none");
  }, 2000);
  return (
    <div style={{ display: display }} className="toast">
      Please login to continue
    </div>
  );
};

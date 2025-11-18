import { useState } from "react";

const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = (val) => setValue((prev) => (prev === val ? null : val));
  const close = () => setValue(null);

  return [value, toggle, close];
};

export default useToggle;
